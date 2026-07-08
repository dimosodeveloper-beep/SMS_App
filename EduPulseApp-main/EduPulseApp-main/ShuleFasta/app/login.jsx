import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { EventRegister } from "react-native-event-listeners";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Toast from "react-native-toast-message";

import * as LocalAuthentication from "expo-local-authentication";
import * as Haptics from "expo-haptics";

import { Ionicons } from "@expo/vector-icons";
import styles from "../components/LoginStyles";
import { EndPoint } from "../components/links";

import i18n from "../components/translations";
import { LanguageContext } from "../components/LanguageContext";

export default function Login() {
  const router = useRouter();
  const { changeLanguage } = useContext(LanguageContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  // Animation kwa ajili ya kidole cha lugha
  const langIconAnim = useRef(new Animated.Value(0)).current;

  /* =========================
  ANIMATIONS
  ========================= */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 3000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 3000, useNativeDriver: true }),
      ])
    ).start();

    Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1500, useNativeDriver: false }),
      ])
    ).start();

    // Animation ya kidole cha lugha
    Animated.loop(
      Animated.sequence([
        Animated.timing(langIconAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(langIconAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const floatInterpolate = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  /* =========================
  BUTTON ANIMATION
  ========================= */
  const pressIn = () => { Animated.spring(buttonScale, { toValue: 0.96, useNativeDriver: true }).start(); };
  const pressOut = () => { Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start(); };

  /* =========================
  SHAKE
  ========================= */
  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  /* =========================
  LOGIN
  ========================= */
  const loginUser = async () => {
    if (!username || !password) {
      shake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.show({ type: "error", text1: i18n.t("missing_fields"), text2: i18n.t("fill_all_fields") });
      return;
    }
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const response = await axios.post(EndPoint + "/Account/login_user/", { username, password });
      const token = response.data.token;
      await AsyncStorage.setItem("userToken", token);
      const userResponse = await axios.get(EndPoint + "/Account/user_data/", { headers: { Authorization: `Token ${token}` } });
      const userData = userResponse.data;
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      EventRegister.emit("updateUserToken", token);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({ type: "success", text1: i18n.t("login_success") });
      if (userData.role === "parent") { router.replace("/(Parents)/parent_home"); } else { router.replace("/(main)/home"); }
    } catch (error) {
      shake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.show({ type: "error", text1: i18n.t("login_failed"), text2: i18n.t("invalid_credentials") });
    } finally {
      setLoading(false);
    }
  };

  const confirmLanguage = async () => {
    await changeLanguage(selectedLang);
    setLangModalVisible(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <LinearGradient colors={["#020617", "#0f172a", "#1e3a8a"]} style={{ flex: 1 }}>
        <Image source={{ uri: "https://images.unsplash.com/photo-1588072432836-e10032774350" }} style={{ position: "absolute", width: "100%", height: "100%" }} blurRadius={4} />
        <View style={{ position: "absolute", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.68)" }} />

        {/* LANGUAGE BUTTONS */}
        <Animated.View style={{ position: "absolute", top: 55, right: 20, zIndex: 10, flexDirection: "row", alignItems: "center", gap: 10 }}>
           <Animated.View style={{ transform: [{ translateY: langIconAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) }] }}>
              <Ionicons name="hand-right-outline" size={24} color="#38bdf8" />
           </Animated.View>
           <View style={{ flexDirection: "row", gap: 12 }}>
             <TouchableOpacity onPress={() => { setSelectedLang("en"); setLangModalVisible(true); }} style={{ backgroundColor: "rgba(255,255,255,0.08)", padding: 10, borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
               <Text style={{ fontSize: 22 }}>🇬🇧</Text>
             </TouchableOpacity>
             <TouchableOpacity onPress={() => { setSelectedLang("sw"); setLangModalVisible(true); }} style={{ backgroundColor: "rgba(255,255,255,0.08)", padding: 10, borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
               <Text style={{ fontSize: 22 }}>🇹🇿</Text>
             </TouchableOpacity>
           </View>
        </Animated.View>

        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }} keyboardShouldPersistTaps="handled">
          <Animated.View style={{ transform: [{ translateY: floatInterpolate }, { translateX: shakeAnim }], opacity: fadeAnim, width: "90%" }}>
            <BlurView intensity={70} tint="dark" style={{ borderRadius: 30, padding: 26, borderWidth: 1, borderColor: "rgba(56,189,248,0.25)", backgroundColor: "rgba(15,23,42,0.45)", overflow: "hidden" }}>
              <View style={{ alignItems: "center", marginBottom: 18 }}>
                <View style={{ width: 85, height: 85, borderRadius: 100, backgroundColor: "rgba(37,99,235,0.18)", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(56,189,248,0.3)" }}>
                  <Ionicons name="school-outline" size={42} color="#38bdf8" />
                </View>
              </View>

              <Animated.Text style={{ fontSize: 33, textAlign: "center", fontWeight: "bold", color: glowAnim.interpolate({ inputRange: [0, 1], outputRange: ["#38bdf8", "#60a5fa"] }), marginBottom: 8, textShadowColor: "#38bdf8", textShadowRadius: 18, letterSpacing: 1 }}>
                SHULE FASTA
              </Animated.Text>
              <Text style={{ textAlign: "center", color: "#cbd5f5", marginBottom: 28, fontSize: 14, lineHeight: 22 }}>{i18n.t("smart_system")}</Text>

              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 16, paddingHorizontal: 15, marginBottom: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" }}>
                <Ionicons name="person-outline" size={20} color="#94a3b8" />
                <TextInput placeholder={i18n.t("username")} placeholderTextColor="#94a3b8" value={username} onChangeText={setUsername} editable={!loading} style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 12, color: "#fff", fontSize: 15 }} />
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 16, paddingHorizontal: 15, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" }}>
                <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
                <TextInput placeholder={i18n.t("password")} placeholderTextColor="#94a3b8" secureTextEntry={!showPassword} value={password} editable={!loading} onChangeText={setPassword} style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 12, color: "#fff", fontSize: 15 }} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={loading}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#38bdf8" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={loading} style={{ marginTop: 12, alignSelf: "flex-end" }}>
                <Text style={{ color: "#38bdf8", fontSize: 13, fontWeight: "600" }}>{showPassword ? i18n.t("hide_password") : i18n.t("show_password")}</Text>
              </TouchableOpacity>

              <Animated.View style={{ transform: [{ scale: buttonScale }], marginTop: 24 }}>
                <TouchableOpacity onPressIn={pressIn} onPressOut={pressOut} onPress={loginUser} disabled={loading} activeOpacity={0.9}>
                  <LinearGradient colors={loading ? ["#1e293b", "#334155"] : ["#2563eb", "#38bdf8"]} style={{ paddingVertical: 16, borderRadius: 18, alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                    {loading ? (
                      <>
                        <ActivityIndicator size="small" color="#fff" />
                        <Text style={{ color: "#fff", fontWeight: "700", marginLeft: 10, fontSize: 15 }}>Authenticating...</Text>
                      </>
                    ) : (
                      <>
                        <Ionicons name="log-in-outline" size={20} color="#fff" />
                        <Text style={{ color: "#fff", fontWeight: "700", marginLeft: 10, fontSize: 15 }}>{i18n.t("login")}</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              <TouchableOpacity onPress={() => router.push("/(Account)/forgot-password")} style={{ marginTop: 20, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="key-outline" size={18} color="#38bdf8" />
                <Text style={{ color: "#38bdf8", marginLeft: 6, fontSize: 13, fontWeight: "600" }}>Forgot Password?</Text>
              </TouchableOpacity>
            </BlurView>
          </Animated.View>
        </ScrollView>
      </LinearGradient>

      {loading && (
        <View style={{ position: "absolute", width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.45)" }}>
          <BlurView intensity={60} tint="dark" style={{ padding: 28, borderRadius: 24, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(15,23,42,0.8)" }}>
            <ActivityIndicator size="large" color="#38bdf8" />
            <Text style={{ color: "#fff", marginTop: 15, fontSize: 15, fontWeight: "700" }}>Authenticating User...</Text>
            <Text style={{ color: "#94a3b8", marginTop: 6, fontSize: 13 }}>Please wait a moment</Text>
          </BlurView>
        </View>
      )}

      <Modal transparent visible={langModalVisible} animationType="fade">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" }}>
          <BlurView intensity={80} tint="dark" style={{ padding: 28, borderRadius: 24, width: "82%", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(15,23,42,0.92)" }}>
            <View style={{ alignItems: "center" }}>
              <View style={{ width: 70, height: 70, borderRadius: 100, backgroundColor: "rgba(37,99,235,0.18)", justifyContent: "center", alignItems: "center" }}>
                <Ionicons name="language-outline" size={35} color="#38bdf8" />
              </View>
            </View>
            <Text style={{ color: "#fff", textAlign: "center", fontSize: 18, fontWeight: "700", marginTop: 20 }}>Confirm Language Change</Text>
            <Text style={{ color: "#94a3b8", textAlign: "center", marginTop: 10, lineHeight: 22 }}>Are you sure you want to switch application language?</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 28 }}>
              <TouchableOpacity onPress={() => setLangModalVisible(false)} style={{ flex: 1, backgroundColor: "rgba(239,68,68,0.12)", paddingVertical: 14, borderRadius: 16, marginRight: 10, alignItems: "center", borderWidth: 1, borderColor: "rgba(239,68,68,0.2)" }}>
                <Text style={{ color: "#ef4444", fontWeight: "700" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmLanguage} style={{ flex: 1, backgroundColor: "rgba(34,197,94,0.12)", paddingVertical: 14, borderRadius: 16, marginLeft: 10, alignItems: "center", borderWidth: 1, borderColor: "rgba(34,197,94,0.2)" }}>
                <Text style={{ color: "#22c55e", fontWeight: "700" }}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </Modal>
      <Toast />
    </KeyboardAvoidingView>
  );
}