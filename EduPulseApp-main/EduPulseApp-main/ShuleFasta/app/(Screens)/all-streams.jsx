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
import { useLocalSearchParams, useRouter } from "expo-router";
import { LanguageContext } from "../../components/LanguageContext";

import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5
} from "@expo/vector-icons";

export default function Streams() {
  const router = useRouter();
  const { language } = useContext(LanguageContext);
  const { classId, className } = useLocalSearchParams();

  const [streams, setStreams] = useState([]);
  const [filteredStreams, setFilteredStreams] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;

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

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem("userToken");
      setToken(savedToken);
    };
    loadToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchStreams(token);
    }
  }, [token]);

  const fetchStreams = async (token) => {
    setLoading(true);
    try {
      const response = await axios.get(
        EndPoint + "/streams/" + classId + "/",
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setStreams(response.data);
      setFilteredStreams(response.data);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: language === "sw" ? "Hitilafu kupata mikondo" : "Error fetching streams",
        text2: JSON.stringify(error.response?.data)
      });
    }
  }

  const handleSearch = (text) => {
    setSearch(text);
    if (text === "") {
      setFilteredStreams(streams);
      return;
    }
    const filtered = streams.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredStreams(filtered);
  }

  const openStudents = (item) => {
    router.push({
      pathname: "/(Screens)/students-choose-year",
      params: {
        streamId: item.id,
        streamName: item.name,
        classId: classId,
        className: className
      }
    });
  }

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
        title={language === "sw" ? "Mikondo" : "Streams"}
        subtitle={language === "sw" ? "Usimamizi wa Mikondo ya Darasa" : "Class Streams Management"}
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
            borderRadius: 24,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
            backgroundColor: "rgba(15,23,42,0.55)"
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <View style={{
                width: 58,
                height: 58,
                borderRadius: 100,
                backgroundColor: "#2563eb",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 14
              }}>
                <MaterialCommunityIcons name="google-classroom" size={28} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "700" }} numberOfLines={1}>
                  {className || (language === "sw" ? "Mikondo" : "Streams")}
                </Text>
                <Text style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }} numberOfLines={1}>
                  {language === "sw" ? "Mikondo inayopatikana kwa darasa hili" : "Available streams for this classroom"}
                </Text>
              </View>
            </View>

            <View style={{
              backgroundColor: "rgba(37,99,235,0.15)",
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "rgba(59,130,246,0.25)"
            }}>
              <Text style={{ color: "#38bdf8", fontWeight: "700", fontSize: 13 }}>
                {filteredStreams.length} {language === "sw" ? "Mikondo" : "Streams"}
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
                placeholder={language === "sw" ? "Tafuta mkondo..." : "Search stream..."}
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
        {filteredStreams.length === 0 && !loading && (
          <View style={{
            marginTop: 25,
            padding: 25,
            borderRadius: 22,
            backgroundColor: "rgba(15,23,42,0.75)",
            borderWidth: 1,
            borderColor: "#334155",
            alignItems: "center"
          }}>
            <Ionicons name="layers-outline" size={55} color="#64748b" />
            <Text style={{ color: "#e2e8f0", fontSize: 17, fontWeight: "700", marginTop: 15 }}>
              {language === "sw" ? "Hakuna Mikondo Iliyopatikana" : "No Streams Found"}
            </Text>
            <Text style={{ color: "#94a3b8", marginTop: 8, textAlign: "center", lineHeight: 22 }}>
              {language === "sw" ? "Hakuna mikondo iliyoendana na utafutaji wako" : "No streams matched your current search"}
            </Text>
          </View>
        )}

        {/* STREAMS LIST */}
        <View style={{ marginTop: 20 }}>
          {filteredStreams.map((item, index) => (
            <Animated.View
              key={item.id}
              style={{ transform: [{ scale: scaleAnim }], marginBottom: 18 }}
            >
              <TouchableOpacity
                onPressIn={pressIn}
                onPressOut={pressOut}
                onPress={() => openStudents(item)}
                activeOpacity={0.92}
              >
                <LinearGradient
                  colors={["rgba(30,41,59,0.97)", "rgba(15,23,42,0.97)"]}
                  style={{ padding: 18, borderRadius: 24, borderWidth: 1, borderColor: "rgba(148,163,184,0.12)" }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{
                      width: 62,
                      height: 62,
                      borderRadius: 100,
                      backgroundColor: "rgba(37,99,235,0.18)",
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "rgba(59,130,246,0.3)"
                    }}>
                      <FontAwesome5 name="layer-group" size={22} color="#38bdf8" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 15 }}>
                      <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "700" }} numberOfLines={1}>
                        {language === "sw" ? "Mkondo" : "Stream"} {item.name}
                      </Text>
                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 7 }}>
                        <Ionicons name="school-outline" size={17} color="#94a3b8" />
                        <Text style={{ color: "#94a3b8", fontSize: 13, marginLeft: 6 }}>
                          {language === "sw" ? "Darasa" : "Class"}: {className}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                        <MaterialCommunityIcons name="account-group-outline" size={16} color="#94a3b8" />
                        <Text style={{ color: "#94a3b8", fontSize: 13, marginLeft: 6 }}>
                          {language === "sw" ? "Sehemu ya Wanafunzi" : "Students Stream Section"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ height: 1, backgroundColor: "rgba(148,163,184,0.12)", marginVertical: 18 }} />

                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View style={{
                        width: 38,
                        height: 38,
                        borderRadius: 100,
                        backgroundColor: "rgba(59,130,246,0.15)",
                        justifyContent: "center",
                        alignItems: "center"
                      }}>
                        <Ionicons name="people-outline" size={20} color="#38bdf8" />
                      </View>
                      <View style={{ marginLeft: 10 }}>
                        <Text style={{ color: "#ffffff", fontWeight: "700", fontSize: 14 }}>
                          {language === "sw" ? "Fungua Wanafunzi" : "Open Students"}
                        </Text>
                        <Text style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>
                          {language === "sw" ? "Tazama wanafunzi wote" : "View all students in this stream"}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity onPress={() => openStudents(item)} activeOpacity={0.85}>
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
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.loader}>
          <View style={{
            backgroundColor: "#0f172a",
            padding: 30,
            borderRadius: 22,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#334155"
          }}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={{ color: "#fff", marginTop: 15, fontSize: 15, fontWeight: "600" }}>
              {language === "sw" ? "Inapakia mikondo..." : "Fetching streams..."}
            </Text>
          </View>
        </View>
      )}

      <Toast />
    </LinearGradient>
  )
}