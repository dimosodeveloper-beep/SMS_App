import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
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

import { useRouter } from "expo-router";
import { LanguageContext } from "../../components/LanguageContext";

export default function AboutApp() {

  const router = useRouter();
  const { language } = useContext(LanguageContext);

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  const scaleAnim = new Animated.Value(1);

  // Animation
  const pressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true
    }).start();
  }

  const pressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true
    }).start();
  }

  // Load token (for consistency with other pages)
  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem("userToken");
      setToken(savedToken);
    };
    loadToken();
  }, []);

  return (
    <LinearGradient
      colors={["#020617", "#0f172a", "#1e293b"]}
      style={styles.container}
    >

      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1588072432836-e10032774350"
        }}
        style={styles.bg}
      />

      <Header
        title="ShuleFasta"
        subtitle={language === "sw" ? "Kuhusu Programu" : "About Application"}
      />

      <ScrollView
        contentContainerStyle={{
          padding: 10,
          paddingBottom: 300
        }}
        showsVerticalScrollIndicator={false}
      >

        <BlurView intensity={40} tint="dark" style={styles.blur}>

          <Text style={styles.title}>
            {language === "sw" ? "Kuhusu ShuleFasta" : "About ShuleFasta"}
          </Text>

          <Text style={styles.subtitle}>
            {language === "sw" ? "Mfumo wa Kisasa wa Usimamizi wa Shule" : "Modern School Management System"}
          </Text>

          <View style={{ marginTop: 20 }}>

            {/* INTRO */}
            <Animated.View style={{ transform: [{ scale: scaleAnim }], marginBottom: 15 }}>
              <TouchableOpacity onPressIn={pressIn} onPressOut={pressOut} activeOpacity={0.9}>
                <LinearGradient colors={["#1e293b", "#0f172a"]} style={{ padding: 18, borderRadius: 14, borderWidth: 1, borderColor: "#334155" }}>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                    📌 {language === "sw" ? "Utangulizi" : "Introduction"}
                  </Text>
                  <Text style={{ color: "#94a3b8", marginTop: 8 }}>
                    {language === "sw" 
                      ? "ShuleFasta ni jukwaa la kisasa la kidijitali lililoundwa kurahisisha na kuendesha shughuli za shule kiotomatiki. Inasaidia shule kusimamia wanafunzi, walimu, mitihani, mahudhurio, na ada kwa ufanisi."
                      : "ShuleFasta is a modern digital platform designed to simplify and automate school operations. It helps schools manage students, teachers, exams, attendance, and fees efficiently."}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* FEATURES */}
            <Animated.View style={{ transform: [{ scale: scaleAnim }], marginBottom: 15 }}>
              <TouchableOpacity onPressIn={pressIn} onPressOut={pressOut}>
                <LinearGradient colors={["#1e293b", "#0f172a"]} style={{ padding: 18, borderRadius: 14 }}>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                    ⚙️ {language === "sw" ? "Sifa Muhimu" : "Key Features"}
                  </Text>

                  <Text style={{ color: "#94a3b8", marginTop: 8 }}>
                    {language === "sw" 
                      ? "• Usimamizi wa Wanafunzi \n• Usimamizi wa Walimu \n• Mfumo wa Mitihani na Matokeo \n• Uorodheshaji na Ripoti za Wanafunzi \n• Ufuatiliaji wa Mahudhurio \n• Tovuti ya Wazazi \n• Usimamizi wa Ada \n• Mfumo wa Ratiba \n• Taarifa za SMS \n• Msaada kwa Shule Nyingi"
                      : "• Student Management \n• Teacher Management \n• Exams & Results System \n• Ranking & Report Cards \n• Attendance Tracking \n• Parent Portal \n• Fee Management \n• Timetable System \n• SMS Notifications \n• Multi-School Support"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* HOW IT WORKS */}
            <Animated.View style={{ transform: [{ scale: scaleAnim }], marginBottom: 15 }}>
              <TouchableOpacity onPressIn={pressIn} onPressOut={pressOut}>
                <LinearGradient colors={["#1e293b", "#0f172a"]} style={{ padding: 18, borderRadius: 14 }}>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                    🚀 {language === "sw" ? "Jinsi Inavyofanya Kazi" : "How It Works"}
                  </Text>

                  <Text style={{ color: "#94a3b8", marginTop: 8 }}>
                    {language === "sw"
                      ? "1. Sajili shule na watumiaji \n2. Tengeneza madarasa na mikondo \n3. Ongeza wanafunzi na walimu \n4. Tengeneza masomo na mitihani \n5. Ingiza matokeo ya wanafunzi \n6. Mfumo huhesabu wastani na uorodheshaji \n7. Tengeneza ripoti za wanafunzi kiotomatiki \n8. Fuatilia mahudhurio na ada kwa wakati halisi"
                      : "1. Register school and users \n2. Create classes and streams \n3. Add students and teachers \n4. Create subjects and exams \n5. Enter student results \n6. System calculates averages & ranking \n7. Generate report cards automatically \n8. Track attendance & fees in real-time"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* SYSTEM BENEFITS */}
            <Animated.View style={{ transform: [{ scale: scaleAnim }], marginBottom: 15 }}>
              <TouchableOpacity onPressIn={pressIn} onPressOut={pressOut}>
                <LinearGradient colors={["#1e293b", "#0f172a"]} style={{ padding: 18, borderRadius: 14 }}>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                    📊 {language === "sw" ? "Faida" : "Benefits"}
                  </Text>

                  <Text style={{ color: "#94a3b8", marginTop: 8 }}>
                    {language === "sw"
                      ? "• Hupunguza makaratasi \n• Huboresha usahihi wa data \n• Ripoti za wakati halisi \n• Upatikanaji rahisi kwa wazazi na walimu \n• Mfumo salama na wenye uwezo wa kukua"
                      : "• Reduces paperwork \n• Improves data accuracy \n• Real-time reporting \n• Easy access for parents and teachers \n• Secure and scalable system"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* CONCLUSION */}
            <Animated.View style={{ transform: [{ scale: scaleAnim }], marginBottom: 15 }}>
              <TouchableOpacity onPressIn={pressIn} onPressOut={pressOut}>
                <LinearGradient colors={["#1e293b", "#0f172a"]} style={{ padding: 18, borderRadius: 14 }}>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                    ✅ {language === "sw" ? "Hitimisho" : "Conclusion"}
                  </Text>

                  <Text style={{ color: "#94a3b8", marginTop: 8 }}>
                    {language === "sw"
                      ? "ShuleFasta ni mfumo madhubuti wa ERP wa shule unaoimarisha ufanisi, uwazi, na utendaji katika taasisi za elimu."
                      : "ShuleFasta is a powerful all-in-one school ERP system that enhances efficiency, transparency, and performance in educational institutions."}
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
              {language === "sw" ? "Inapakia..." : "Loading..."}
            </Text>
          </View>
        </View>
      )}

      <Toast />

    </LinearGradient>
  )
}