import React, { useState, useEffect, useRef, useContext } from "react";
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
import { useRouter } from "expo-router";
import { LanguageContext } from "../../components/LanguageContext";

export default function CreateTeacher() {
  const router = useRouter();
  const { language } = useContext(LanguageContext);

  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState("");
  const [subjectsSelected, setSubjectsSelected] = useState([]);

  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [showUsers, setShowUsers] = useState(false);

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const pressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem("userToken");
      setToken(savedToken);
    };
    loadToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchUsers(token);
      fetchSubjects(token);
    }
  }, [token]);

  const fetchUsers = async (token) => {
    try {
      const response = await axios.get(EndPoint + "/teacher-users/", {
        headers: { Authorization: `Token ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSubjects = async (token) => {
    try {
      const response = await axios.get(EndPoint + "/subjects/", {
        headers: { Authorization: `Token ${token}` }
      });
      setSubjects(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSubject = (id) => {
    if (subjectsSelected.includes(id)) {
      setSubjectsSelected(subjectsSelected.filter((item) => item !== id));
    } else {
      setSubjectsSelected([...subjectsSelected, id]);
    }
  };

  const createTeacher = async () => {
    if (!user || !phone || subjectsSelected.length === 0) {
      Toast.show({
        type: "error",
        text1: language === "sw" ? "Taarifa hazijakamilika" : "Missing Fields",
        text2: language === "sw" ? "Jaza sehemu zote zinazohitajika" : "Fill all required fields"
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        EndPoint + "/create-teacher/",
        {
          user: user,
          phone: phone,
          subject: subjectsSelected
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
        text1: language === "sw" ? "Mwalimu Ameundwa" : "Teacher Created"
      });
      router.back();
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: language === "sw" ? "Imeshindikana" : "Failed"
      });
    }
  };

  return (
    <LinearGradient colors={["#020617", "#0f172a", "#111827", "#1e293b"]} style={styles.container}>
      <Image
        source={{ uri: "https://images.unsplash.com/photo-1577896851231-70ef18881754" }}
        style={[styles.bg, { opacity: 0.18 }]}
      />
      <View style={{ position: "absolute", top: -120, right: -90, width: 220, height: 220, borderRadius: 200, backgroundColor: "rgba(59,130,246,0.18)" }} />
      <View style={{ position: "absolute", bottom: -120, left: -80, width: 220, height: 220, borderRadius: 200, backgroundColor: "rgba(14,165,233,0.12)" }} />

      <Header 
        title={language === "sw" ? "Dashibodi ya Shule" : "School Dashboard"} 
        subtitle={language === "sw" ? "Mfumo wa Usimamizi" : "Management System"} 
      />

      <Animated.ScrollView
        contentContainerStyle={{ padding: 14, paddingBottom: 500 }}
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      >
        <BlurView
          intensity={60}
          tint="dark"
          style={[
            styles.blur,
            {
              borderRadius: 28,
              overflow: "hidden",
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
              backgroundColor: "rgba(15,23,42,0.75)"
            }
          ]}
        >
          <Text style={{ color: "#fff", fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 25 }}>
            {language === "sw" ? "Sajili Mwalimu" : "Register Teacher"}
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>{language === "sw" ? "Chagua Mtumiaji" : "Select User"}</Text>
            <TouchableOpacity
              onPress={() => setShowUsers(!showUsers)}
              style={{
                backgroundColor: "rgba(15,23,42,0.9)",
                padding: 14,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: "rgba(148,163,184,0.2)",
                marginBottom: 12
              }}
            >
              <Text style={{ color: "#fff" }}>
                {user ? users.find((u) => u.id === user)?.username : (language === "sw" ? "Bofya kuchagua mtumiaji" : "Click to select user")}
              </Text>
            </TouchableOpacity>

            {showUsers && (
              <LinearGradient
                colors={["#1e293b", "#020617"]}
                style={{ borderRadius: 14, padding: 10, marginBottom: 15, borderWidth: 1, borderColor: "rgba(148,163,184,0.15)" }}
              >
                {users.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      setUser(item.id);
                      setShowUsers(false);
                    }}
                    style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: "#1e293b" }}
                  >
                    <Text style={{ color: "#fff" }}>{item.username}</Text>
                  </TouchableOpacity>
                ))}
              </LinearGradient>
            )}

            <Text style={styles.label}>{language === "sw" ? "Namba ya Simu" : "Phone"}</Text>
            <TextInput
              style={{
                backgroundColor: "rgba(15,23,42,0.9)",
                borderWidth: 1,
                borderColor: "rgba(148,163,184,0.2)",
                borderRadius: 14,
                padding: 12,
                color: "#fff",
                marginBottom: 15
              }}
              value={phone}
              onChangeText={setPhone}
              placeholder={language === "sw" ? "Namba ya simu" : "Phone"}
              placeholderTextColor="#94a3b8"
            />

            <Text style={styles.label}>{language === "sw" ? "Chagua Masomo" : "Select Subjects"}</Text>
            {subjects.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => toggleSubject(item.id)}
                style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
              >
                <Text style={{ color: "#fff", fontSize: 18 }}>
                  {subjectsSelected.includes(item.id) ? "☑" : "☐"}
                </Text>
                <Text style={{ color: "#e2e8f0", marginLeft: 10 }}>
                  {language === "sw" ? (item.name_SW || item.name) : item.name}
                </Text>
              </TouchableOpacity>
            ))}

            <Animated.View style={{ transform: [{ scale: scaleAnim }], marginTop: 20 }}>
              <TouchableOpacity onPressIn={pressIn} onPressOut={pressOut} onPress={createTeacher} activeOpacity={0.9}>
                <LinearGradient
                  colors={["#2563eb", "#38bdf8", "#0ea5e9"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ height: 55, borderRadius: 18, justifyContent: "center", alignItems: "center" }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                    {language === "sw" ? "Sajili Mwalimu" : "Create Teacher"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </BlurView>
      </Animated.ScrollView>

      {loading && (
        <View style={styles.loader}>
          <View style={[styles.loaderCard, { borderRadius: 20 }]}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={{ color: "#fff", marginTop: 10, fontWeight: "600" }}>
              {language === "sw" ? "Inasajili mwalimu..." : "Creating teacher..."}
            </Text>
          </View>
        </View>
      )}

      <Toast />
    </LinearGradient>
  );
}