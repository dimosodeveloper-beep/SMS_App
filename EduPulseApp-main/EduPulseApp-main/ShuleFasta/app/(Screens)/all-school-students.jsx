import React, { useState, useEffect, useRef, useContext } from "react";
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
import { useRouter, useLocalSearchParams } from "expo-router";
import { LanguageContext } from "../../components/LanguageContext";

import {
  Ionicons,
  MaterialIcons,
  FontAwesome5
} from "@expo/vector-icons";

export default function AllStudents() {

  const router = useRouter();
  const { language } = useContext(LanguageContext);
  const { streamId, streamName, className } = useLocalSearchParams();

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

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
  useEffect(() => {
    if (token) {
      fetchStudents(token);
      checkLoggedIn(token);
    }
  }, [token]);

  const fetchStudents = async (token) => {
    setLoading(true);
    try {
      const response = await axios.get(
        EndPoint + "/students/",
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setStudents(response.data);
      setFilteredStudents(response.data);
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
  }

  /* =========================
  CHECK LOGIN
  ========================= */
  const checkLoggedIn = async (token) => {
    try {
      await axios.get(EndPoint + '/Account/user_data/', {
        headers: { Authorization: `Token ${token}` }
      });
    } catch (error) { }
  }

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
  DELETE
  ========================= */
  const confirmDelete = (id) => {
    setSelectedId(id);
    setDeleteModal(true);
  };

  const deleteStudent = async () => {
    try {
      await axios.delete(
        EndPoint + `/update-delete-student/${selectedId}/`,
        { headers: { Authorization: `Token ${token}` } }
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({
        type: "success",
        text1: language === "sw" ? "Imefutwa kikamilifu" : "Deleted Successfully"
      });
      setDeleteModal(false);
      fetchStudents(token);
    } catch (e) {
      Toast.show({
        type: "error",
        text1: language === "sw" ? "Kufuta kumeshindikana" : "Delete failed"
      });
    }
  };

  /* =========================
  EDIT
  ========================= */
  const goToEdit = (item) => {
    router.push({
      pathname: "/(Screens)/edit-student",
      params: item
    });
  };

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
        contentContainerStyle={{ padding: 12, paddingBottom: 180 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* TOP CARD */}
        <BlurView
          intensity={55}
          tint="dark"
          style={{
            padding: 20,
            borderRadius: 28,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
            backgroundColor: "rgba(15,23,42,0.6)"
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <LinearGradient colors={["#2563eb", "#38bdf8"]} style={{ width: 62, height: 62, borderRadius: 100, justifyContent: "center", alignItems: "center", marginRight: 15 }}>
                <Ionicons name="school-outline" size={30} color="#fff" />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#ffffff", fontSize: 21, fontWeight: "700" }} numberOfLines={1}>
                  {className || (language === "sw" ? "Wanafunzi" : "Students")}
                </Text>
                <Text style={{ color: "#94a3b8", fontSize: 13, marginTop: 5 }} numberOfLines={1}>
                  {streamName || (language === "sw" ? "Orodha ya Wanafunzi Wote" : "All Students List")}
                </Text>
              </View>
            </View>
            <View style={{ backgroundColor: "rgba(37,99,235,0.15)", paddingHorizontal: 15, paddingVertical: 10, borderRadius: 16, borderWidth: 1, borderColor: "rgba(59,130,246,0.25)" }}>
              <Text style={{ color: "#38bdf8", fontWeight: "700", fontSize: 13 }}>
                {filteredStudents.length} {language === "sw" ? "Wanafunzi" : "Students"}
              </Text>
            </View>
          </View>

          {/* SEARCH */}
          <View style={{ marginTop: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(2,6,23,0.95)", borderRadius: 18, paddingHorizontal: 15, borderWidth: 1, borderColor: "rgba(148,163,184,0.18)" }}>
              <Ionicons name="search" size={20} color="#94a3b8" />
              <TextInput
                value={search}
                onChangeText={handleSearch}
                placeholder={language === "sw" ? "Tafuta mwanafunzi au namba ya kujiunga..." : "Search student or admission number..."}
                placeholderTextColor="#94a3b8"
                style={{ flex: 1, paddingVertical: 15, paddingHorizontal: 10, color: "#fff", fontSize: 15 }}
              />
            </View>
          </View>
        </BlurView>

        {/* EMPTY */}
        {filteredStudents.length === 0 && !loading && (
          <View style={{ marginTop: 25, padding: 28, borderRadius: 24, backgroundColor: "rgba(15,23,42,0.8)", borderWidth: 1, borderColor: "rgba(148,163,184,0.15)", alignItems: "center" }}>
            <View style={{ width: 85, height: 85, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.04)", justifyContent: "center", alignItems: "center" }}>
              <Ionicons name="people-outline" size={48} color="#64748b" />
            </View>
            <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "700", marginTop: 18 }}>
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
                <LinearGradient colors={["rgba(17,24,39,0.98)", "rgba(2,6,23,0.98)"]} style={{ padding: 18, borderRadius: 26, borderWidth: 1, borderColor: "rgba(148,163,184,0.12)" }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ width: 68, height: 68, borderRadius: 100, backgroundColor: "rgba(37,99,235,0.15)", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(59,130,246,0.25)" }}>
                      <FontAwesome5 name="user-graduate" size={26} color="#38bdf8" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 15 }}>
                      <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "700" }} numberOfLines={1}>{item.first_name} {item.last_name}</Text>
                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                        <MaterialIcons name="badge" size={17} color="#94a3b8" />
                        <Text style={{ color: "#94a3b8", fontSize: 13, marginLeft: 6 }}>
                          {language === "sw" ? "Namba ya Kujiunga" : "Admission No"}: {item.admission_number}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                        <Ionicons name="male-female-outline" size={16} color="#94a3b8" />
                        <Text style={{ color: "#94a3b8", fontSize: 13, marginLeft: 6, textTransform: "capitalize" }}>{item.gender}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ height: 1, backgroundColor: "rgba(148,163,184,0.12)", marginVertical: 18 }} />
                  {/* ACTIONS */}
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View style={{ width: 42, height: 42, borderRadius: 100, backgroundColor: "rgba(59,130,246,0.15)", justifyContent: "center", alignItems: "center" }}>
                        <Ionicons name="person-outline" size={22} color="#38bdf8" />
                      </View>
                      <View style={{ marginLeft: 10 }}>
                        <Text style={{ color: "#ffffff", fontWeight: "700", fontSize: 14 }}>
                          {language === "sw" ? "Wasifu wa Mwanafunzi" : "Student Profile"}
                        </Text>
                        <Text style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>
                          {language === "sw" ? "Simamia taarifa za mwanafunzi" : "Manage student information"}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <TouchableOpacity onPress={() => goToEdit(item)} activeOpacity={0.85}>
                        <LinearGradient colors={["#2563eb", "#38bdf8"]} style={{ width: 45, height: 45, borderRadius: 14, justifyContent: "center", alignItems: "center", marginRight: 10 }}>
                          <Ionicons name="create-outline" size={22} color="#fff" />
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => confirmDelete(item.id)} activeOpacity={0.85}>
                        <LinearGradient colors={["#dc2626", "#ef4444"]} style={{ width: 45, height: 45, borderRadius: 14, justifyContent: "center", alignItems: "center" }}>
                          <Ionicons name="trash-outline" size={22} color="#fff" />
                        </LinearGradient>
                      </TouchableOpacity>
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

      {/* DELETE MODAL */}
      <Modal visible={deleteModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", padding: 20 }}>
          <BlurView intensity={60} tint="dark" style={{ borderRadius: 24, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
            <View style={{ backgroundColor: "rgba(2,6,23,0.95)", padding: 24 }}>
              <View style={{ width: 70, height: 70, borderRadius: 100, backgroundColor: "rgba(239,68,68,0.15)", justifyContent: "center", alignItems: "center", alignSelf: "center", marginBottom: 18 }}>
                <Ionicons name="trash-outline" size={34} color="#ef4444" />
              </View>
              <Text style={{ color: "#ffffff", fontSize: 19, fontWeight: "700", textAlign: "center" }}>
                {language === "sw" ? "Futa Mwanafunzi" : "Delete Student"}
              </Text>
              <Text style={{ color: "#94a3b8", marginTop: 12, textAlign: "center", lineHeight: 22 }}>
                {language === "sw" ? "Je, una uhakika unataka kufuta mwanafunzi huyu kabisa?" : "Are you sure you want to delete this student permanently?"}
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 28 }}>
                <TouchableOpacity onPress={() => setDeleteModal(false)} style={{ flex: 1, backgroundColor: "rgba(148,163,184,0.12)", paddingVertical: 14, borderRadius: 16, alignItems: "center", marginRight: 10 }}>
                  <Text style={{ color: "#cbd5e1", fontWeight: "700" }}>{language === "sw" ? "Ghairi" : "Cancel"}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={deleteStudent} style={{ flex: 1, backgroundColor: "#dc2626", paddingVertical: 14, borderRadius: 16, alignItems: "center" }}>
                  <Text style={{ color: "#fff", fontWeight: "700" }}>{language === "sw" ? "Futa" : "Delete"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </View>
      </Modal>

      <Toast />
    </LinearGradient>
  )
}