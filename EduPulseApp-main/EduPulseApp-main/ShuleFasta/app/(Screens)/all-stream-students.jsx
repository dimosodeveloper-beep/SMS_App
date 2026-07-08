import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
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

import {
  useRouter,
  useLocalSearchParams,
  useFocusEffect
} from "expo-router";

import {
  Ionicons,
  MaterialIcons,
  FontAwesome5
} from "@expo/vector-icons";

export default function AllStudents() {

  const router = useRouter();
  const { language } = useContext(LanguageContext);

  const {
    streamId,
    streamName,
    className,
    classId,
    year
  } = useLocalSearchParams();

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  /* =========================
  ANIMATION
  ========================= */
  const pressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true
    }).start();
  }

  const pressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true
    }).start();
  }

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
  FETCH STUDENTS
  ========================= */
  const fetchStudents = async (tokenParam) => {
    setLoading(true);
    try {
      const cleanYear = parseInt(year);
      const url = EndPoint + "/students/stream/" + classId + "/" + streamId + "/" + cleanYear + "/";

      const response = await axios.get(
        url,
        {
          headers: {
            Authorization: `Token ${tokenParam}`,
            "Content-Type": "application/json"
          }
        }
      );

      setStudents(response.data.results || []);
      setFilteredStudents(response.data.results || []);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: language === "sw" ? "Hitilafu kupata wanafunzi" : "Error fetching students",
        text2: JSON.stringify(error.response?.data)
      });
    }
  };

  /* =========================
  INITIAL LOAD
  ========================= */
  useEffect(() => {
    if (token && classId && streamId && year) {
      fetchStudents(token);
    }
  }, [token, classId, streamId, year]);

  /* =========================
  ON FOCUS REFRESH
  ========================= */
  useFocusEffect(
    useCallback(() => {
      if (token && classId && streamId && year) {
        fetchStudents(token);
      }
    }, [token, classId, streamId, year])
  );

  /* =========================
  SEARCH
  ========================= */
  const handleSearch = (text) => {
    setSearch(text);
    if (text === "") {
      setFilteredStudents(students);
      return;
    }
    const filtered = students.filter((item) =>
      (`${item.first_name} ${item.last_name}`)
        .toLowerCase()
        .includes(text.toLowerCase()) ||
      item.admission_number?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredStudents(filtered);
  }

  /* =========================
  UI
  ========================= */
  return (
    <LinearGradient
      colors={["#020617", "#0f172a", "#111827", "#1e293b"]}
      style={styles.container}
    >
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1588072432836-e10032774350"
        }}
        style={styles.bg}
      />

      <Header
        title={language === "sw" ? "Wanafunzi" : "Students"}
        subtitle={language === "sw" ? "Usimamizi wa Wanafunzi" : "Students Management"}
      />

      <ScrollView
        contentContainerStyle={{
          padding: 12,
          paddingBottom: 250
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* TOP CARD */}
        <BlurView
          intensity={50}
          tint="dark"
          style={{
            padding: 20,
            borderRadius: 26,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
            backgroundColor: "rgba(15,23,42,0.60)"
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <View style={{
                width: 62,
                height: 62,
                borderRadius: 100,
                backgroundColor: "rgba(37,99,235,0.18)",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(59,130,246,0.3)",
                marginRight: 14
              }}>
                <Ionicons name="school-outline" size={30} color="#38bdf8" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#ffffff", fontSize: 21, fontWeight: "700" }} numberOfLines={1}>
                  {className || (language === "sw" ? "Wanafunzi" : "Students")}
                </Text>
                <Text style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }} numberOfLines={1}>
                  {streamName || (language === "sw" ? "Wanafunzi katika mkondo huu" : "Students In This Stream")}
                </Text>
              </View>
            </View>

            <View style={{
              backgroundColor: "rgba(59,130,246,0.12)",
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "rgba(59,130,246,0.25)"
            }}>
              <Text style={{ color: "#38bdf8", fontWeight: "700", fontSize: 13 }}>
                {filteredStudents.length} {language === "sw" ? "Wanafunzi" : "Students"}
              </Text>
            </View>
          </View>

          {/* SEARCH */}
          <View style={{ marginTop: 22 }}>
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(15,23,42,0.95)",
              borderRadius: 18,
              paddingHorizontal: 15,
              borderWidth: 1,
              borderColor: "#334155"
            }}>
              <Ionicons name="search" size={20} color="#94a3b8" />
              <TextInput
                value={search}
                onChangeText={handleSearch}
                placeholder={language === "sw" ? "Tafuta mwanafunzi au namba..." : "Search student or admission number..."}
                placeholderTextColor="#94a3b8"
                style={{ flex: 1, paddingVertical: 15, paddingHorizontal: 10, color: "#fff", fontSize: 15 }}
              />
            </View>
          </View>
        </BlurView>

        {/* EMPTY */}
        {filteredStudents.length === 0 && !loading && (
          <View style={{
            marginTop: 25,
            padding: 28,
            borderRadius: 24,
            backgroundColor: "rgba(15,23,42,0.80)",
            borderWidth: 1,
            borderColor: "#334155",
            alignItems: "center"
          }}>
            <Ionicons name="people-outline" size={58} color="#64748b" />
            <Text style={{ color: "#e2e8f0", fontSize: 18, fontWeight: "700", marginTop: 15 }}>
              {language === "sw" ? "Hakuna Wanafunzi Waliopatikana" : "No Students Found"}
            </Text>
            <Text style={{ color: "#94a3b8", marginTop: 8, textAlign: "center", lineHeight: 22 }}>
              {language === "sw" ? "Hakuna mwanafunzi aliyeendana na utafutaji wako" : "No students matched your current search"}
            </Text>
          </View>
        )}

        {/* STUDENTS LIST */}
        <View style={{ marginTop: 20 }}>
          {filteredStudents.map((item, index) => (
            <Animated.View key={item.id} style={{ transform: [{ scale: scaleAnim }], marginBottom: 18 }}>
              <TouchableOpacity onPressIn={pressIn} onPressOut={pressOut} activeOpacity={0.92}>
                <LinearGradient
                  colors={["rgba(17,24,39,0.98)", "rgba(15,23,42,0.98)", "rgba(2,6,23,0.98)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ padding: 18, borderRadius: 26, borderWidth: 1, borderColor: "rgba(148,163,184,0.12)" }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{
                      width: 65,
                      height: 65,
                      borderRadius: 100,
                      backgroundColor: "rgba(37,99,235,0.15)",
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "rgba(59,130,246,0.25)"
                    }}>
                      <FontAwesome5 name="user-graduate" size={24} color="#38bdf8" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 15 }}>
                      <Text style={{ color: "#ffffff", fontSize: 17, fontWeight: "700" }} numberOfLines={1}>
                        {item.first_name} {item.last_name}
                      </Text>
                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 7 }}>
                        <MaterialIcons name="badge" size={17} color="#94a3b8" />
                        <Text style={{ color: "#94a3b8", fontSize: 13, marginLeft: 6 }}>
                          {language === "sw" ? "Namba ya Kujiunga" : "Admission No"}: {item.admission_number}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                        <Ionicons name="male-female-outline" size={16} color="#94a3b8" />
                        <Text style={{ color: "#94a3b8", fontSize: 13, marginLeft: 6, textTransform: "capitalize" }}>
                          {item.gender}
                        </Text>
                      </View>
                    </View>
                    <View style={{
                      backgroundColor: "rgba(37,99,235,0.14)",
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: "rgba(59,130,246,0.2)"
                    }}>
                      <Text style={{ color: "#38bdf8", fontWeight: "700", fontSize: 12 }}>ID {item.id}</Text>
                    </View>
                  </View>

                  <View style={{ height: 1, backgroundColor: "rgba(148,163,184,0.10)", marginVertical: 18 }} />

                  <View style={{ flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap" }}>
                    <View style={{ width: "48%", backgroundColor: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 16, marginBottom: 12 }}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="school-outline" size={16} color="#38bdf8" />
                        <Text style={{ color: "#94a3b8", fontSize: 12, marginLeft: 6 }}>{language === "sw" ? "Darasa" : "Class"}</Text>
                      </View>
                      <Text style={{ color: "#ffffff", marginTop: 7, fontWeight: "700", fontSize: 14 }}>{item.classroom}</Text>
                    </View>
                    <View style={{ width: "48%", backgroundColor: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 16, marginBottom: 12 }}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="layers-outline" size={16} color="#4ade80" />
                        <Text style={{ color: "#94a3b8", fontSize: 12, marginLeft: 6 }}>{language === "sw" ? "Mkondo" : "Stream"}</Text>
                      </View>
                      <Text style={{ color: "#ffffff", marginTop: 7, fontWeight: "700", fontSize: 14 }}>{item.stream}</Text>
                    </View>
                    <View style={{ width: "48%", backgroundColor: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 16 }}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="calendar-outline" size={16} color="#f59e0b" />
                        <Text style={{ color: "#94a3b8", fontSize: 12, marginLeft: 6 }}>{language === "sw" ? "Mwaka wa Masomo" : "Academic Year"}</Text>
                      </View>
                      <Text style={{ color: "#ffffff", marginTop: 7, fontWeight: "700", fontSize: 14 }}>{item.year}</Text>
                    </View>
                    <View style={{ width: "48%", backgroundColor: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 16 }}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="people-outline" size={16} color="#c084fc" />
                        <Text style={{ color: "#94a3b8", fontSize: 12, marginLeft: 6 }}>{language === "sw" ? "Hali" : "Status"}</Text>
                      </View>
                      <Text style={{ color: "#22c55e", marginTop: 7, fontWeight: "700", fontSize: 14 }}>
                        {language === "sw" ? "Mwanafunzi Hai" : "Active Student"}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* LOADER */}
      {loading && (
        <View style={styles.loader}>
          <View style={{ backgroundColor: "#0f172a", padding: 30, borderRadius: 24, alignItems: "center", borderWidth: 1, borderColor: "#334155" }}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={{ color: "#fff", marginTop: 15, fontSize: 15, fontWeight: "600" }}>
              {language === "sw" ? "Inapakia wanafunzi..." : "Fetching students..."}
            </Text>
          </View>
        </View>
      )}

      <Toast />
    </LinearGradient>
  )
}