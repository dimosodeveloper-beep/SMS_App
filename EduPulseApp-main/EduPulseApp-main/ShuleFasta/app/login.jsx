import React, { useState, useEffect, useRef } from "react";
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

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 🌍 LANGUAGE STATE
  const [language, setLanguage] = useState("EN");

  // MODAL CONTROL
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;
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
        text1: language === "EN" ? "Missing Fields" : "Taarifa hazijakamilika",
        text2: language === "EN" ? "Fill all fields" : "Jaza taarifa zote"
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
        text1: "Login Successfully"
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
        text1: "Login Failed",
        text2: "Invalid credentials"
      });
    } finally {
      setLoading(false);
    }
  };

  // ================= BIOMETRIC =================
  const biometricLogin = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login with Biometrics"
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

  // ================= LANGUAGE SELECT =================
  const openLanguageModal = (lang) => {
    setSelectedLang(lang);
    setLangModalVisible(true);
  };

  const confirmLanguage = () => {
    if (selectedLang === "EN") setLanguage("EN");
    if (selectedLang === "SW") setLanguage("SW");

    setLangModalVisible(false);

    Toast.show({
      type: "success",
      text1:
        selectedLang === "EN"
          ? "Language changed to English"
          : "Lugha imebadilishwa kwenda Kiswahili"
    });
  };

  return (
    <LinearGradient colors={["#020617", "#0f172a", "#1e3a8a"]} style={{ flex: 1, justifyContent: "center" }}>

      {/* LANGUAGE BUTTON */}
      <View style={{ position: "absolute", top: 50, right: 20, flexDirection: "row", gap: 10, zIndex: 10 }}>
        
        <TouchableOpacity onPress={() => openLanguageModal("EN")}>
          <Text style={{ fontSize: 22 }}>🇬🇧</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openLanguageModal("SW")}>
          <Text style={{ fontSize: 22 }}>🇹🇿</Text>
        </TouchableOpacity>

      </View>

      {/* BACKGROUND */}
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
            Smart School System
          </Text>

          <TextInput
            placeholder="Username"
            placeholderTextColor="#94a3b8"
            value={username}
            onChangeText={setUsername}
            style={inputStyle}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#94a3b8"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={inputStyle}
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={{ color: "#38bdf8", marginTop: 5 }}>
              {showPassword ? "Hide Password" : "Show Password"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={loginUser} style={{ marginTop: 20 }}>
            <LinearGradient colors={["#2563eb", "#38bdf8"]} style={btnStyle}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={biometricLogin} style={{ marginTop: 20, alignItems: "center" }}>
            <Ionicons name="finger-print" size={30} color="#38bdf8" />
          </TouchableOpacity>

        </BlurView>
      </Animated.View>

      {/* LOADER */}
      {loading && (
        <View style={loaderStyle}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* LANGUAGE MODAL */}
      <Modal transparent visible={langModalVisible} animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" }}>
          
          <View style={{ backgroundColor: "#0f172a", padding: 25, borderRadius: 20, width: "80%" }}>

            <Text style={{ color: "#fff", fontSize: 18, marginBottom: 20, textAlign: "center" }}>
              {selectedLang === "EN"
                ? "Change language to English?"
                : "Badilisha lugha kwenda Kiswahili?"}
            </Text>
            {selectedLang === "EN" ? (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
             
              <TouchableOpacity onPress={() => setLangModalVisible(false)}>
                <Text style={{ color: "#ef4444", fontWeight: "bold" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={confirmLanguage}>
                <Text style={{ color: "#22c55e", fontWeight: "bold" }}>Confirm</Text>
              </TouchableOpacity>

            </View>):(

                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
             
              <TouchableOpacity onPress={() => setLangModalVisible(false)}>
                <Text style={{ color: "#ef4444", fontWeight: "bold" }}>Hapana</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={confirmLanguage}>
                <Text style={{ color: "#22c55e", fontWeight: "bold" }}>Kubali</Text>
              </TouchableOpacity>

            </View>
            )}

          </View>

        </View>
      </Modal>

      <Toast />
    </LinearGradient>
  );
}

const inputStyle = {
  backgroundColor: "rgba(255,255,255,0.08)",
  padding: 15,
  borderRadius: 12,
  color: "#fff",
  marginBottom: 15
};

const btnStyle = {
  padding: 15,
  borderRadius: 15,
  alignItems: "center"
};

const loaderStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.6)"
};