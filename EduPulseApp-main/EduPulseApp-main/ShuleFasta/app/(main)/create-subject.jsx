import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  ScrollView
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";

import styles from "../../components/LoginStyles";
import { EndPoint } from "../../components/links";
import Header from "../../components/Header";
import { LanguageContext } from "../../components/LanguageContext";

export default function CreateSubject() {
  const { language } = useContext(LanguageContext);

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  const scaleAnim = new Animated.Value(1);

  const pressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true
    }).start();
  };

  /* =========================
  LOAD TOKEN
  ========================= */
  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem("userToken");
      setToken(savedToken);
    };
    loadToken();
  }, []);

  /* =========================
  CREATE SUBJECT
  ========================= */
  const createSubject = async () => {
    if (!name) {
      Toast.show({
        type: "error",
        text1: language === "sw" ? "Uwanja haujajazwa" : "Missing Field",
        text2: language === "sw" ? "Ingiza jina la somo" : "Enter subject name"
      });
      return;
    }

    if (!token) {
      Toast.show({
        type: "error",
        text1: language === "sw" ? "Hitilafu ya uthibitishaji" : "Authentication Error",
        text2: language === "sw" ? "Ingia tena" : "Login again"
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        EndPoint + "/create-subject/",
        {
          name: name
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setLoading(false);

      Toast.show({
        type: "success",
        text1: language === "sw" ? "Somo Limeundwa" : "Subject Created",
        text2: language === "sw" ? "Somo limeongezwa kwa mafanikio" : "Subject added successfully"
      });

      setName("");
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: language === "sw" ? "Hitilafu" : "Error",
        text2: JSON.stringify(error.response?.data)
      });
    }
  };

  return (
    <LinearGradient
      colors={["#020617", "#0f172a", "#1e293b"]}
      style={styles.container}
    >
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1577896851231-70ef18881754"
        }}
        style={[styles.bg, { opacity: 0.25 }]}
      />

      <Header
        title={language === "sw" ? "Dashibodi ya Shule" : "School Dashboard"}
        subtitle={language === "sw" ? "Mfumo wa Usimamizi" : "Management System"}
      />

      <ScrollView
        contentContainerStyle={{
          padding: 10,
          paddingBottom: 500
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <BlurView intensity={40} tint="dark" style={styles.blur}>
          <Text style={styles.title}>
            {language === "sw" ? "Unda Somo" : "Create Subject"}
          </Text>
          <Text style={styles.subtitle}>
            {language === "sw" ? "Mfumo wa usimamizi wa shule" : "School Management System"}
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>
              {language === "sw" ? "Jina la Somo" : "Subject Name"}
            </Text>

            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={language === "sw" ? "Mfano: Kiingereza" : "Example: English"}
              placeholderTextColor="#94a3b8"
            />

            <Animated.View style={{ transform: [{ scale: scaleAnim }], marginTop: 20 }}>
              <TouchableOpacity
                onPressIn={pressIn}
                onPressOut={pressOut}
                onPress={createSubject}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={["#1e293b", "#0f172a"]}
                  style={{
                    padding: 16,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: "#334155",
                    alignItems: "center"
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                    {language === "sw" ? "Unda Somo" : "Create Subject"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </BlurView>
      </ScrollView>

      {loading && (
        <View style={styles.loader}>
          <View style={styles.loaderCard}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>
              {language === "sw" ? "Inaunda somo..." : "Creating subject..."}
            </Text>
          </View>
        </View>
      )}

      <Toast />
    </LinearGradient>
  );
}