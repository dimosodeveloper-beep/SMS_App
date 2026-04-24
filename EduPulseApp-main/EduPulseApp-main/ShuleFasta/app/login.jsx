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
import { LanguageContext } from "../components/LanguageContext"; // 🔥 ADDED

export default function Login() {
  const router = useRouter();

  const { language, changeLanguage } = useContext(LanguageContext); // 🔥 GLOBAL LANGUAGE

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [langModalVisible, setLangModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 3000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 3000, useNativeDriver: true })
      ])
    ).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start();
  }, []);

  const floatInterpolate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10]
  });

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };

  // ================= LOGIN =================
  const loginUser = async () => {
    if (!username || !password) {
      shake();
      Toast.show({
        type: "error",
        text1: i18n.t("missing_fields"),
        text2: i18n.t("fill_all_fields")
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(EndPoint + "/Account/login_user/", {
        username,
        password
      });

      const token = response.data.token;
      await AsyncStorage.setItem("userToken", token);

      const userResponse = await axios.get(EndPoint + "/Account/user_data/", {
        headers: { Authorization: `Token ${token}` }
      });

      const userData = userResponse.data;
      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      EventRegister.emit("updateUserToken", token);

      Toast.show({
        type: "success",
        text1: i18n.t("login_success")
      });

      if (userData.role === "parent") {
        router.replace("/(Parents)/parent_home");
      } else {
        router.replace("/(main)/home");
      }

    } catch (error) {
      shake();
      Toast.show({
        type: "error",
        text1: i18n.t("login_failed"),
        text2: i18n.t("invalid_credentials")
      });
    } finally {
      setLoading(false);
    }
  };

  // ================= BIOMETRIC =================
  const biometricLogin = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: i18n.t("biometric_login")
    });

    if (result.success) {
      const userData = await AsyncStorage.getItem("userData");

      if (userData) {
        const parsed = JSON.parse(userData);

        if (parsed.role === "parent") {
          router.replace("/(Parents)/parent_home");
        } else {
          router.replace("/(main)/home");
        }
      }
    }
  };

  // ================= LANGUAGE =================
  const openLanguageModal = (lang) => {
    setSelectedLang(lang);
    setLangModalVisible(true);
  };

  const confirmLanguage = async () => {
    await changeLanguage(selectedLang); // 🔥 SAME AS DRAWER
    setLangModalVisible(false);

    Toast.show({
      type: "success",
      text1:
        selectedLang === "en"
          ? i18n.t("lang_changed_en")
          : i18n.t("lang_changed_sw")
    });
  };

  return (
    <LinearGradient colors={["#020617", "#0f172a", "#1e3a8a"]} style={{ flex: 1, justifyContent: "center" }}>

      {/* LANGUAGE BUTTON */}
      <View style={{ position: "absolute", top: 50, right: 20, flexDirection: "row", gap: 10, zIndex: 10 }}>
        <TouchableOpacity onPress={() => openLanguageModal("en")}>
          <Text style={{ fontSize: 22 }}>🇬🇧</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openLanguageModal("sw")}>
          <Text style={{ fontSize: 22 }}>🇹🇿</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={{ uri: "https://images.unsplash.com/photo-1588072432836-e10032774350" }}
        style={{ position: "absolute", width: "100%", height: "100%" }}
        blurRadius={3}
      />

      <View style={{ position: "absolute", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.65)" }} />

      <Animated.View style={{ margin: 20, transform: [{ translateY: floatInterpolate }, { translateX: shakeAnim }], opacity: fadeAnim }}>

        <BlurView intensity={60} tint="dark" style={{ borderRadius: 25, padding: 25 }}>

          <Text style={{ fontSize: 30, color: "#fff", textAlign: "center", fontWeight: "bold" }}>
            SHULE FASTA
          </Text>

          <Text style={{ textAlign: "center", color: "#cbd5f5", marginBottom: 20 }}>
            {i18n.t("smart_system")}
          </Text>

          <TextInput
            placeholder={i18n.t("username")}
            placeholderTextColor="#94a3b8"
            value={username}
            onChangeText={setUsername}
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              padding: 15,
              borderRadius: 12,
              color: "#fff",
              marginBottom: 15
            }}
          />

          <TextInput
            placeholder={i18n.t("password")}
            placeholderTextColor="#94a3b8"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              padding: 15,
              borderRadius: 12,
              color: "#fff",
              marginBottom: 15
            }}
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={{ color: "#38bdf8", marginTop: 5 }}>
              {showPassword ? i18n.t("hide_password") : i18n.t("show_password")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={loginUser} style={{ marginTop: 20 }}>
            <LinearGradient colors={["#2563eb", "#38bdf8"]} style={{ padding: 15, borderRadius: 15, alignItems: "center" }}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                {i18n.t("login")}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={biometricLogin} style={{ marginTop: 20, alignItems: "center" }}>
            <Ionicons name="finger-print" size={30} color="#38bdf8" />
          </TouchableOpacity>

        </BlurView>
      </Animated.View>

      {/* MODAL */}
      <Modal transparent visible={langModalVisible} animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" }}>

          <View style={{ backgroundColor: "#0f172a", padding: 25, borderRadius: 20, width: "80%" }}>

            <Text style={{ color: "#fff", fontSize: 18, marginBottom: 20, textAlign: "center" }}>
              {selectedLang === "en"
                ? i18n.t("change_lang_en")
                : i18n.t("change_lang_sw")}
            </Text>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity onPress={() => setLangModalVisible(false)}>
                <Text style={{ color: "#ef4444" }}>{i18n.t("cancel")}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={confirmLanguage}>
                <Text style={{ color: "#22c55e" }}>{i18n.t("confirm")}</Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>
      </Modal>

      <Toast />
    </LinearGradient>
  );
}