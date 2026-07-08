import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  ScrollView,
  Modal
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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { LanguageContext } from "../../components/LanguageContext";
import { UserContext } from "../../components/UserContext";

export default function AllSubjects() {

  const router = useRouter();

  const { language } = useContext(LanguageContext);
  const { userData } = useContext(UserContext);

  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  // States za Delete Modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const isAdmin = userData?.role === "admin";
  const scaleAnim = new Animated.Value(1);

  // Animation
  const pressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true
    }).start();
  }

  const pressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true
    }).start();
  }

  // Load Token
  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem("userToken");
      setToken(savedToken);
    };
    loadToken();
  }, []);

  // Fetch Subjects
  useEffect(() => {
    if (token) {
      fetchSubjects(token);
    }
  }, [token]);

  const fetchSubjects = async (currentToken) => {
    const useToken = currentToken || token;
    if (!useToken) return;

    setLoading(true);

    try {
      const response = await axios.get(
        EndPoint + "/subjects/",
        {
          headers: {
            Authorization: `Token ${useToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      setSubjects(response.data);
      setFilteredSubjects(response.data);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setLoading(false);

    } catch (error) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: language === "sw" ? "Hitilafu kupata masomo" : "Error fetching subjects"
      });
    }
  }

  const handleSearch = (text) => {
    setSearch(text);

    if (text === "") {
      setFilteredSubjects(subjects);
      return;
    }

    const filtered = subjects.filter((item) => {
      const subjectName = language === "sw" ? (item.name_SW || item.name) : item.name;
      return subjectName.toLowerCase().includes(text.toLowerCase());
    });

    setFilteredSubjects(filtered);
  }

  const openSubject = (item) => {
    console.log("Selected Subject => ", item);
  }

  /* FUNCTIONS ZA EDIT NA DELETE */
  const confirmDelete = (id) => {
    setSelectedId(id);
    setDeleteModal(true);
  };

  const deleteSubject = async () => {
    setLoading(true);
    try {
      await axios.delete(
        EndPoint + `/subjects/${selectedId}/`,
        {
          headers: { Authorization: `Token ${token}` }
        }
      );

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({
        type: "success",
        text1: language === "sw" ? "Imefutwa kikamilifu" : "Successfully Deleted"
      });

      setDeleteModal(false);
      fetchSubjects(token);
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: language === "sw" ? "Imeshindikana kufuta" : "Delete failed"
      });
    }
  };

  const goToEdit = (item) => {
    router.push({
      pathname: "/(Screens)/edit-subject",
      params: item
    });
  };

  return (
    <LinearGradient
      colors={["#020617", "#0f172a", "#111827", "#1e293b"]}
      style={styles.container}
    >
      <Image
        source={{ uri: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f" }}
        style={[styles.bg, { opacity: 0.18 }]}
        blurRadius={2}
      />

      <Header
        title={language === "sw" ? "Dashibodi ya Shule" : "School Dashboard"}
        subtitle={language === "sw" ? "Mfumo wa Usimamizi" : "Management System"}
      />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 10, paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <BlurView intensity={60} tint="dark" style={[styles.blur, { overflow: "hidden", borderRadius: 30, padding: 0, backgroundColor: "rgba(15,23,42,0.55)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }]}>
          <LinearGradient colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]} style={{ padding: 22, borderRadius: 30 }}>
            {/* Header Content ... */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={{ color: "#ffffff", fontSize: 30, fontWeight: "900" }}>{language === "sw" ? "Masomo Yote" : "All Subjects"}</Text>
              </View>
              <LinearGradient colors={["#2563eb", "#38bdf8"]} style={{ width: 65, height: 65, borderRadius: 22, justifyContent: "center", alignItems: "center" }}>
                <MaterialCommunityIcons name="book-education" size={30} color="#fff" />
              </LinearGradient>
            </View>

            {/* Stats, Search, etc... */}
            <View style={{ marginTop: 25 }}>
              {filteredSubjects.map((item) => (
                <Animated.View key={item.id} style={{ transform: [{ scale: scaleAnim }], marginBottom: 18 }}>
                  <TouchableOpacity onPressIn={pressIn} onPressOut={pressOut} onPress={() => openSubject(item)} activeOpacity={0.9}>
                    <LinearGradient colors={["rgba(30,41,59,0.95)", "rgba(15,23,42,0.95)"]} style={{ borderRadius: 26, padding: 18, borderWidth: 1, borderColor: "rgba(148,163,184,0.12)" }}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <LinearGradient colors={["#2563eb", "#38bdf8"]} style={{ width: 70, height: 70, borderRadius: 22, justifyContent: "center", alignItems: "center", marginRight: 16 }}>
                          <MaterialCommunityIcons name="book-open-page-variant" size={32} color="#fff" />
                        </LinearGradient>
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "900" }}>{language === "sw" ? (item.name_SW || item.name) : item.name}</Text>
                          <Text style={{ color: "#94a3b8", fontSize: 14 }}>{language === "sw" ? "Somo Linapatikana" : "Subject Available"}</Text>
                        </View>

                        {/* ACTION BUTTONS (FILTERED BY ROLE) */}
                        {isAdmin && (
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingLeft: 5 }}>
                            <TouchableOpacity onPress={() => goToEdit(item)} style={{ padding: 5 }}>
                              <Ionicons name="create" size={24} color="#38bdf8" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => confirmDelete(item.id)} style={{ padding: 5 }}>
                              <Ionicons name="trash" size={24} color="#ef4444" />
                            </TouchableOpacity>
                          </View>
                        )}
                        <Ionicons name="chevron-forward-circle" size={26} color="#60a5fa" style={{ marginLeft: isAdmin ? 0 : 10 }} />
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </LinearGradient>
        </BlurView>
      </ScrollView>

      {/* MODALS AND LOADERS ... */}
      <Modal visible={deleteModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", padding: 20 }}>
          <View style={{ backgroundColor: "#0f172a", padding: 24, borderRadius: 25, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
            <Text style={{ color: "#fff", marginBottom: 25, fontSize: 16, textAlign: "center" }}>
              {language === "sw" ? "Je, una uhakika unataka kufuta somo hili kabisa?" : "Are you sure you want to delete this subject?"}
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
              <TouchableOpacity onPress={() => setDeleteModal(false)} style={{ padding: 10 }}><Text style={{ color: "#94a3b8", fontSize: 16, fontWeight: "600" }}>{language === "sw" ? "Ghairi" : "Cancel"}</Text></TouchableOpacity>
              <TouchableOpacity onPress={deleteSubject} style={{ padding: 10 }}><Text style={{ color: "#ef4444", fontWeight: "bold", fontSize: 16 }}>{language === "sw" ? "Futa" : "Delete"}</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {loading && (
        <View style={styles.loader}>
          <BlurView intensity={80} tint="dark" style={{ width: 220, paddingVertical: 30, borderRadius: 30, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#38bdf8" />
            <Text style={{ color: "#ffffff", marginTop: 18, fontSize: 16 }}>{language === "sw" ? "Inapakua..." : "Loading..."}</Text>
          </BlurView>
        </View>
      )}

      <Toast />
    </LinearGradient>
  );
}