import React, { useState, useEffect, useRef, useContext } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { EndPoint } from "../../components/links";

// 🔥 ADDED USER CONTEXT (for logout after password change)
import { UserContext } from "../../components/UserContext";

export default function ChangePasswordScreen() {

  const router = useRouter();

  // 🔥 CONTEXT
  const { setUserData, setUserToken } = useContext(UserContext);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  const [error, setError] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true
      })
    ]).start();

    const loadToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("userToken");
        setToken(savedToken);
      } catch (e) {
        console.log("Token load error:", e);
      }
    };

    loadToken();

  }, []);

  const validate = () => {

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return false;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    setError("");
    return true;
  };

  const changePassword = async () => {

    Keyboard.dismiss();

    if (loading) return;

    if (!validate()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: error
      });
      return;
    }

    if (!token) {
      Toast.show({
        type: "error",
        text1: "Auth Error",
        text2: "Please login again"
      });
      return;
    }

    setLoading(true);

    try {

      const response = await axios.post(
        EndPoint + "/change-password/",
        {
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword
        },
        {
          headers: {
            Authorization: `Token ${token}`
          }
        }
      );

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: response.data.message
      });

      // clear inputs
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // 🔥 IMPORTANT: LOGOUT AFTER SUCCESS
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");

      // context reset (same behavior as logout)
      setUserToken(null);
      setUserData(null);

      router.replace("/login");

    } catch (error) {

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      Toast.show({
        type: "error",
        text1: "Error",
        text2: JSON.stringify(error.response?.data)
      });

    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, value, setValue, show, setShow, placeholder) => (
    <View style={{ marginBottom: 15 }}>
      <Text style={{ color: "#94a3b8", marginBottom: 8 }}>{label}</Text>

      <View style={inputBox}>

        <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />

        <TextInput
          value={value}
          onChangeText={setValue}
          secureTextEntry={!show}
          style={inputStyle}
          placeholder={placeholder}
          placeholderTextColor="#64748b"
        />

        <TouchableOpacity onPress={() => setShow(!show)}>
          <Ionicons
            name={show ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#38bdf8"
          />
        </TouchableOpacity>

      </View>
    </View>
  );

  return (

    <LinearGradient colors={["#020617", "#0f172a", "#1e293b"]} style={{ flex: 1 }}>

      {loading && (
        <View style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999
        }}>
          <BlurView intensity={70} tint="dark" style={{
            padding: 25,
            borderRadius: 20,
            alignItems: "center"
          }}>
            <ActivityIndicator size="large" color="#38bdf8" />
            <Text style={{ color: "#fff", marginTop: 10 }}>
              Please wait...
            </Text>
          </BlurView>
        </View>
      )}

      <TouchableOpacity
        onPress={() => Keyboard.dismiss()}
        style={{
          position: "absolute",
          top: 50,
          left: 20,
          zIndex: 10,
          backgroundColor: "rgba(255,255,255,0.08)",
          padding: 10,
          borderRadius: 14
        }}
      >
        <Ionicons name="arrow-back" size={22} color="#38bdf8" />
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              padding: 20,
              paddingBottom: 140
            }}
          >

            <Animated.View style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}>

              <BlurView
                intensity={60}
                tint="dark"
                style={{
                  borderRadius: 30,
                  padding: 25,
                  backgroundColor: "rgba(15,23,42,0.55)",
                  borderWidth: 1,
                  borderColor: "rgba(56,189,248,0.25)"
                }}
              >

                <View style={{ alignItems: "center", marginBottom: 20 }}>
                  <Ionicons name="shield-checkmark-outline" size={45} color="#38bdf8" />
                  <Text style={{ color: "#fff", marginTop: 10, fontSize: 18, fontWeight: "700" }}>
                    Security Settings
                  </Text>
                </View>

                {error ? (
                  <View style={{
                    backgroundColor: "rgba(239,68,68,0.12)",
                    padding: 10,
                    borderRadius: 12,
                    marginBottom: 15
                  }}>
                    <Text style={{ color: "#f87171", textAlign: "center" }}>
                      {error}
                    </Text>
                  </View>
                ) : null}

                {renderInput("Old Password", oldPassword, setOldPassword, showOld, setShowOld, "Old password")}
                {renderInput("New Password", newPassword, setNewPassword, showNew, setShowNew, "New password")}
                {renderInput("Confirm Password", confirmPassword, setConfirmPassword, showConfirm, setShowConfirm, "Confirm password")}

                <TouchableOpacity onPress={changePassword} activeOpacity={0.8} disabled={loading}>

                  <LinearGradient
                    colors={["#2563eb", "#38bdf8"]}
                    style={{
                      padding: 16,
                      borderRadius: 18,
                      alignItems: "center"
                    }}
                  >

                    <Text style={{ color: "#fff", fontWeight: "700" }}>
                      Change Password
                    </Text>

                  </LinearGradient>

                </TouchableOpacity>

              </BlurView>

            </Animated.View>

          </ScrollView>

        </TouchableWithoutFeedback>

      </KeyboardAvoidingView>

      <Toast />

    </LinearGradient>

  );
}

const inputBox = {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "rgba(255,255,255,0.08)",
  borderRadius: 14,
  paddingHorizontal: 12,
  justifyContent: "space-between"
};

const inputStyle = {
  flex: 1,
  paddingVertical: 14,
  paddingHorizontal: 10,
  color: "#fff"
};