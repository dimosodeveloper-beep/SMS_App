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

import { useRouter, useLocalSearchParams } from "expo-router";

import {
  Ionicons,
  MaterialIcons,
  FontAwesome5
} from "@expo/vector-icons";

import { LanguageContext } from "../../components/LanguageContext";

export default function ChooseYear() {

  const router = useRouter();
  const { language } = useContext(LanguageContext);

  const {
    streamId,
    streamName,
    className,
    classId
  } = useLocalSearchParams();

  const [years, setYears] = useState([]);
  const [filteredYears, setFilteredYears] = useState([]);
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
  FETCH YEARS
  ========================= */

  useEffect(() => {
    if (token) {
      fetchYears(token);
    }
  }, [token]);

  const fetchYears = async (token) => {
    setLoading(true);
    try {
      const response = await axios.get(
        EndPoint + `/academic-years/`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setYears(response.data);
      setFilteredYears(response.data);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: language === "sw" ? "Hitilafu kupata miaka" : "Error fetching years",
        text2: JSON.stringify(error.response?.data)
      });
    }
  };

  /* =========================
  SEARCH
  ========================= */

  const handleSearch = (text) => {
    setSearch(text);
    if (text === "") {
      setFilteredYears(years);
      return;
    }
    const filtered = years.filter((item) =>
      String(item.year).includes(text)
    );
    setFilteredYears(filtered);
  };

  /* =========================
  NAVIGATE
  ========================= */

  const goToResults = (item) => {
    router.push({
      pathname: "/(Screens)/all-stream-students",
      params: {
        streamId: streamId,
        streamName: streamName,
        year: item.year,
        classId: classId,
        className: className
      }
    });
  };

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
        title={language === "sw" ? "Chagua Mwaka" : "Choose Year"}
        subtitle={language === "sw" ? "Miaka ya Masomo" : "Academic Years"}
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

          <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}>

            <View style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1
            }}>

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
                <Ionicons name="calendar-outline" size={30} color="#38bdf8" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{
                  color: "#ffffff",
                  fontSize: 21,
                  fontWeight: "700"
                }}
                  numberOfLines={1}
                >
                  {language === "sw" ? "Chagua Mwaka wa Masomo" : "Select Academic Year"}
                </Text>
                <Text style={{
                  color: "#94a3b8",
                  fontSize: 13,
                  marginTop: 4
                }}
                  numberOfLines={1}
                >
                  {className} {streamName}
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
              <Text style={{
                color: "#38bdf8",
                fontWeight: "700",
                fontSize: 13
              }}>
                {filteredYears.length} {language === "sw" ? "Miaka" : "Years"}
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
                placeholder={language === "sw" ? "Tafuta mwaka wa masomo..." : "Search academic year..."}
                placeholderTextColor="#94a3b8"
                style={{
                  flex: 1,
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                  color: "#fff",
                  fontSize: 15
                }}
              />
            </View>
          </View>
        </BlurView>

        {/* EMPTY */}
        {filteredYears.length === 0 && !loading && (
          <View style={{
            marginTop: 25,
            padding: 28,
            borderRadius: 24,
            backgroundColor: "rgba(15,23,42,0.80)",
            borderWidth: 1,
            borderColor: "#334155",
            alignItems: "center"
          }}>
            <Ionicons name="calendar-clear-outline" size={58} color="#64748b" />
            <Text style={{
              color: "#e2e8f0",
              fontSize: 18,
              fontWeight: "700",
              marginTop: 15
            }}>
              {language === "sw" ? "Hakuna Miaka Iliyopatikana" : "No Years Found"}
            </Text>
            <Text style={{
              color: "#94a3b8",
              marginTop: 8,
              textAlign: "center",
              lineHeight: 22
            }}>
              {language === "sw" ? "Hakuna mwaka wa masomo uliolingana na utafutaji wako" : "No academic years matched your search"}
            </Text>
          </View>
        )}

        {/* YEARS LIST */}
        <View style={{ marginTop: 20 }}>
          {filteredYears.map((item, index) => (
            <Animated.View
              key={item.id}
              style={{
                transform: [{ scale: scaleAnim }],
                marginBottom: 18
              }}
            >
              <TouchableOpacity
                onPressIn={pressIn}
                onPressOut={pressOut}
                onPress={() => goToResults(item)}
                activeOpacity={0.92}
              >
                <LinearGradient
                  colors={[
                    "rgba(17,24,39,0.98)",
                    "rgba(15,23,42,0.98)",
                    "rgba(2,6,23,0.98)"
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    padding: 18,
                    borderRadius: 26,
                    borderWidth: 1,
                    borderColor: "rgba(148,163,184,0.12)"
                  }}
                >
                  {/* TOP SECTION */}
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
                      <FontAwesome5 name="calendar-alt" size={24} color="#38bdf8" />
                    </View>

                    <View style={{ flex: 1, marginLeft: 15 }}>
                      <Text style={{
                        color: "#ffffff",
                        fontSize: 18,
                        fontWeight: "700"
                      }}>
                        {item.year}
                      </Text>
                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 7 }}>
                        <MaterialIcons name="date-range" size={17} color="#94a3b8" />
                        <Text style={{
                          color: "#94a3b8",
                          fontSize: 13,
                          marginLeft: 6
                        }}>
                          {language === "sw" ? "Mwaka wa Masomo" : "Academic Year"}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                        <Ionicons name="school-outline" size={16} color="#94a3b8" />
                        <Text style={{
                          color: "#94a3b8",
                          fontSize: 13,
                          marginLeft: 6
                        }}>
                          {className} {streamName}
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
                      <Text style={{
                        color: "#38bdf8",
                        fontWeight: "700",
                        fontSize: 12
                      }}>
                        {language === "sw" ? "MWAKA" : "YEAR"}
                      </Text>
                    </View>
                  </View>

                  {/* DIVIDER */}
                  <View style={{
                    height: 1,
                    backgroundColor: "rgba(148,163,184,0.10)",
                    marginVertical: 18
                  }} />

                  {/* BOTTOM SECTION */}
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 100,
                        backgroundColor: "rgba(59,130,246,0.15)",
                        justifyContent: "center",
                        alignItems: "center"
                      }}>
                        <Ionicons name="arrow-forward-outline" size={20} color="#38bdf8" />
                      </View>
                      <View style={{ marginLeft: 10 }}>
                        <Text style={{ color: "#ffffff", fontWeight: "700", fontSize: 14 }}>
                          {language === "sw" ? "Fungua Wanafunzi" : "Open Students"}
                        </Text>
                        <Text style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>
                          {language === "sw" ? "Ona wanafunzi wote wa mwaka huu" : "View all students for this year"}
                        </Text>
                      </View>
                    </View>

                    <LinearGradient
                      colors={["#2563eb", "#38bdf8"]}
                      style={{
                        paddingHorizontal: 18,
                        paddingVertical: 12,
                        borderRadius: 14,
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "700", marginRight: 8, fontSize: 13 }}>
                        {language === "sw" ? "Fungua" : "Open"}
                      </Text>
                      <Ionicons name="arrow-forward" size={18} color="#fff" />
                    </LinearGradient>
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
          <View style={{
            backgroundColor: "#0f172a",
            padding: 30,
            borderRadius: 24,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#334155"
          }}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={{ color: "#fff", marginTop: 15, fontSize: 15, fontWeight: "600" }}>
              {language === "sw" ? "Inapakia miaka..." : "Fetching years..."}
            </Text>
          </View>
        </View>
      )}

      <Toast />

    </LinearGradient>
  );
}