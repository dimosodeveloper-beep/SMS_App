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
import { Picker } from "@react-native-picker/picker";
import styles from "../../components/LoginStyles";
import { EndPoint } from "../../components/links";
import Header from "../../components/Header";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LanguageContext } from "../../components/LanguageContext";

export default function CreateStudent() {
  const router = useRouter();
  const { language } = useContext(LanguageContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [classroom, setClassroom] = useState(null);
  const [stream, setStream] = useState(null);
  const [parent, setParent] = useState(null);
  const [parentSearch, setParentSearch] = useState("");
  const [admission, setAdmission] = useState("");
  const [gender, setGender] = useState("");
  const [classrooms, setClassrooms] = useState([]);
  const [streams, setStreams] = useState([]);
  const [parents, setParents] = useState([]);
  const [filteredParents, setFilteredParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true
    }).start();
  };

  /* LOAD TOKEN */
  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem("userToken");
      setToken(savedToken);
    };
    loadToken();
  }, []);

  /* FETCH DATA */
  useEffect(() => {
    if (token) {
      fetchClassrooms(token);
      fetchParents(token);
    }
  }, [token]);

  const fetchClassrooms = async (token) => {
    try {
      const response = await axios.get(EndPoint + "/classes/", {
        headers: { Authorization: `Token ${token}` }
      });
      setClassrooms(response.data);
    } catch (error) {
      console.log("CLASSROOM ERROR", error.response?.data);
    }
  };

  const fetchStreams = async (classId) => {
    try {
      const response = await axios.get(EndPoint + "/streams/" + classId + "/", {
        headers: { Authorization: `Token ${token}` }
      });
      setStreams(response.data);
    } catch (error) {
      console.log("STREAM ERROR", error.response?.data);
    }
  };

  const fetchParents = async (token) => {
    try {
      const response = await axios.get(EndPoint + "/parents/", {
        headers: { Authorization: `Token ${token}` }
      });
      setParents(response.data);
    } catch (error) {
      console.log("PARENTS ERROR", error.response?.data);
    }
  };

  const handleClassChange = (value) => {
    setClassroom(value);
    setStream(null);
    if (value) {
      fetchStreams(value);
    }
  };

  const handleParentSearch = (text) => {
    setParentSearch(text);
    if (text.trim() === "") {
      setFilteredParents([]);
      return;
    }
    const filtered = parents.filter((item) =>
      item.username.toLowerCase().includes(text.toLowerCase())
    ).slice(0, 6);
    setFilteredParents(filtered);
  };

  const selectParent = (item) => {
    setParent(item.id);
    setParentSearch(item.username);
    setFilteredParents([]);
  };

  const createStudent = async () => {
    if (!firstName || !lastName || !classroom || !stream || !admission || !gender) {
      Toast.show({
        type: "error",
        text1: language === "sw" ? "Taarifa hazijakamilika" : "Missing Fields",
        text2: language === "sw" ? "Jaza sehemu zote zinazohitajika" : "Fill all required fields"
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
      await axios.post(
        EndPoint + "/create-student/",
        {
          first_name: firstName,
          last_name: lastName,
          classroom: classroom,
          stream: stream,
          parent: parent,
          admission_number: admission,
          gender: gender
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
        text1: language === "sw" ? "Mwanafunzi Ameundwa" : "Student Created",
        text2: language === "sw" ? "Mwanafunzi amesajiliwa kwa mafanikio" : "Student registered successfully"
      });
      router.back();
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: language === "sw" ? "Imeshindikana" : "Failed",
        text2: language === "sw" ? "Imeshindikana kusajili mwanafunzi" : "Could not create student"
      });
    }
  };

  return (
    <LinearGradient colors={["#020617", "#0f172a", "#1e293b"]} style={styles.container}>
      <Image source={{ uri: "https://images.unsplash.com/photo-1588072432836-e10032774350" }} style={[styles.bg, { opacity: 0.18 }]} />
      <View style={{ position: "absolute", top: 120, right: -40, width: 180, height: 180, borderRadius: 100, backgroundColor: "rgba(56,189,248,0.08)" }} />
      <View style={{ position: "absolute", bottom: 120, left: -50, width: 220, height: 220, borderRadius: 120, backgroundColor: "rgba(37,99,235,0.08)" }} />

      <Header
        title={language === "sw" ? "Dashibodi ya Shule" : "School Dashboard"}
        subtitle={language === "sw" ? "Mfumo wa Usimamizi" : "Management System"}
      />

      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 500 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <BlurView intensity={45} tint="dark" style={{ backgroundColor: "rgba(15,23,42,0.72)", borderRadius: 28, padding: 20, borderWidth: 1, borderColor: "rgba(148,163,184,0.15)", overflow: "hidden" }}>
          <LinearGradient colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, borderTopLeftRadius: 28, borderTopRightRadius: 28 }} />

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 25 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#ffffff", fontSize: 28, fontWeight: "bold", letterSpacing: 0.5 }}>
                {language === "sw" ? "Sajili Mwanafunzi" : "Register Student"}
              </Text>
              <Text style={{ color: "#94a3b8", fontSize: 14, marginTop: 6, lineHeight: 22 }}>
                {language === "sw" ? "Unda na udhibiti maelezo ya mwanafunzi" : "Create and manage student profiles easily"}
              </Text>
            </View>
            <View style={{ width: 62, height: 62, borderRadius: 20, backgroundColor: "rgba(37,99,235,0.18)", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(59,130,246,0.25)" }}>
              <Ionicons name="school-outline" size={30} color="#38bdf8" />
            </View>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
            <View style={{ flex: 1, marginRight: 8, backgroundColor: "rgba(15,23,42,0.7)", padding: 14, borderRadius: 18, borderWidth: 1, borderColor: "rgba(148,163,184,0.12)" }}>
              <Text style={{ color: "#94a3b8", fontSize: 12 }}>{language === "sw" ? "Wanafunzi" : "Students"}</Text>
              <Text style={{ color: "#22c55e", fontSize: 20, fontWeight: "bold", marginTop: 4 }}>{classrooms.length}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 8, backgroundColor: "rgba(15,23,42,0.7)", padding: 14, borderRadius: 18, borderWidth: 1, borderColor: "rgba(148,163,184,0.12)" }}>
              <Text style={{ color: "#94a3b8", fontSize: 12 }}>{language === "sw" ? "Wazazi" : "Parents"}</Text>
              <Text style={{ color: "#38bdf8", fontSize: 20, fontWeight: "bold", marginTop: 4 }}>{parents.length}</Text>
            </View>
          </View>

          <View style={{ backgroundColor: "rgba(2,6,23,0.45)", padding: 18, borderRadius: 24, borderWidth: 1, borderColor: "rgba(148,163,184,0.1)" }}>
            <Text style={{ color: "#e2e8f0", fontWeight: "700", marginBottom: 8, fontSize: 14 }}>{language === "sw" ? "Jina la Kwanza" : "First Name"}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#0f172a", borderRadius: 16, borderWidth: 1, borderColor: "#334155", paddingHorizontal: 14, marginBottom: 18 }}>
              <Ionicons name="person-outline" size={20} color="#38bdf8" />
              <TextInput style={{ flex: 1, paddingVertical: 15, paddingLeft: 10, color: "#fff", fontSize: 15 }} value={firstName} onChangeText={setFirstName} placeholder={language === "sw" ? "Jina la kwanza" : "First name"} placeholderTextColor="#94a3b8" />
            </View>

            <Text style={{ color: "#e2e8f0", fontWeight: "700", marginBottom: 8, fontSize: 14 }}>{language === "sw" ? "Jina la Mwisho" : "Last Name"}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#0f172a", borderRadius: 16, borderWidth: 1, borderColor: "#334155", paddingHorizontal: 14, marginBottom: 18 }}>
              <Ionicons name="person-circle-outline" size={20} color="#38bdf8" />
              <TextInput style={{ flex: 1, paddingVertical: 15, paddingLeft: 10, color: "#fff", fontSize: 15 }} value={lastName} onChangeText={setLastName} placeholder={language === "sw" ? "Jina la mwisho" : "Last name"} placeholderTextColor="#94a3b8" />
            </View>

            <Text style={{ color: "#e2e8f0", fontWeight: "700", marginBottom: 8, fontSize: 14 }}>{language === "sw" ? "Chagua Darasa" : "Select Classroom"}</Text>
            <View style={{ backgroundColor: "#0f172a", borderWidth: 1, borderColor: "#334155", borderRadius: 16, marginBottom: 18, overflow: "hidden" }}>
              <Picker selectedValue={classroom} onValueChange={(value) => handleClassChange(value)} dropdownIconColor="#38bdf8" style={{ color: "#fff" }}>
                <Picker.Item label={language === "sw" ? "Chagua Darasa" : "Select Classroom"} value={null} />
                {classrooms.map((item) => <Picker.Item key={item.id} label={item.name} value={item.id} />)}
              </Picker>
            </View>

            <Text style={{ color: "#e2e8f0", fontWeight: "700", marginBottom: 8, fontSize: 14 }}>{language === "sw" ? "Chagua Stream" : "Select Stream"}</Text>
            <View style={{ backgroundColor: "#0f172a", borderWidth: 1, borderColor: "#334155", borderRadius: 16, marginBottom: 18, overflow: "hidden" }}>
              <Picker selectedValue={stream} onValueChange={(itemValue) => setStream(itemValue)} dropdownIconColor="#38bdf8" style={{ color: "#fff" }}>
                <Picker.Item label={language === "sw" ? "Chagua Stream" : "Select Stream"} value={null} />
                {streams.map((item) => <Picker.Item key={item.id} label={item.name} value={item.id} />)}
              </Picker>
            </View>

            <Text style={{ color: "#e2e8f0", fontWeight: "700", marginBottom: 8, fontSize: 14 }}>{language === "sw" ? "Tafuta Mzazi" : "Search Parent"}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#0f172a", borderRadius: 16, borderWidth: 1, borderColor: "#334155", paddingHorizontal: 14 }}>
              <Ionicons name="search-outline" size={20} color="#38bdf8" />
              <TextInput style={{ flex: 1, paddingVertical: 15, paddingLeft: 10, color: "#fff", fontSize: 15 }} value={parentSearch} onChangeText={handleParentSearch} placeholder={language === "sw" ? "Andika jina la mzazi..." : "Type parent username..."} placeholderTextColor="#94a3b8" />
            </View>

            {filteredParents.length > 0 && (
              <View style={{ backgroundColor: "#0f172a", borderWidth: 1, borderColor: "#334155", borderRadius: 16, marginTop: 10, marginBottom: 20, overflow: "hidden" }}>
                {filteredParents.map((item, index) => (
                  <TouchableOpacity key={item.id} onPress={() => selectParent(item)} style={{ padding: 14, borderBottomWidth: index !== filteredParents.length - 1 ? 1 : 0, borderBottomColor: "#1e293b", flexDirection: "row", alignItems: "center" }}>
                    <View style={{ width: 38, height: 38, borderRadius: 20, backgroundColor: "rgba(37,99,235,0.2)", justifyContent: "center", alignItems: "center", marginRight: 12 }}>
                      <Ionicons name="people-outline" size={18} color="#38bdf8" />
                    </View>
                    <View>
                      <Text style={{ color: "#fff", fontWeight: "600" }}>{item.username}</Text>
                      <Text style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>{language === "sw" ? "Gusa kuchagua mzazi" : "Tap to select parent"}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={{ color: "#e2e8f0", fontWeight: "700", marginBottom: 8, fontSize: 14 }}>{language === "sw" ? "Namba ya Usajili" : "Admission Number"}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#0f172a", borderRadius: 16, borderWidth: 1, borderColor: "#334155", paddingHorizontal: 14, marginBottom: 18 }}>
              <MaterialCommunityIcons name="card-account-details-outline" size={20} color="#38bdf8" />
              <TextInput style={{ flex: 1, paddingVertical: 15, paddingLeft: 10, color: "#fff", fontSize: 15 }} value={admission} onChangeText={setAdmission} placeholder={language === "sw" ? "Namba ya usajili" : "Admission number"} placeholderTextColor="#94a3b8" />
            </View>

            <Text style={{ color: "#e2e8f0", fontWeight: "700", marginBottom: 8, fontSize: 14 }}>{language === "sw" ? "Jinsia" : "Gender"}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#0f172a", borderRadius: 16, borderWidth: 1, borderColor: "#334155", paddingHorizontal: 14, marginBottom: 25 }}>
              <Ionicons name="male-female-outline" size={20} color="#38bdf8" />
              <TextInput style={{ flex: 1, paddingVertical: 15, paddingLeft: 10, color: "#fff", fontSize: 15 }} value={gender} onChangeText={setGender} placeholder={language === "sw" ? "Kiume au Kike" : "Male or Female"} placeholderTextColor="#94a3b8" />
            </View>

            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity onPressIn={pressIn} onPressOut={pressOut} onPress={createStudent} activeOpacity={0.9}>
                <LinearGradient colors={["#2563eb", "#38bdf8", "#0ea5e9"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingVertical: 17, borderRadius: 18, justifyContent: "center", alignItems: "center", shadowColor: "#38bdf8", shadowOpacity: 0.35, shadowRadius: 12, elevation: 10 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="person-add-outline" size={22} color="#fff" />
                    <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16, marginLeft: 10, letterSpacing: 0.5 }}>
                      {language === "sw" ? "Sajili Mwanafunzi" : "Create Student"}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </BlurView>
      </ScrollView>

      {loading && (
        <View style={styles.loader}>
          <View style={[styles.loaderCard, { backgroundColor: "#0f172a", borderWidth: 1, borderColor: "#334155" }]}>
            <ActivityIndicator size="large" color="#38bdf8" />
            <Text style={[styles.loadingText, { marginTop: 12, color: "#fff" }]}>
              {language === "sw" ? "Inasajili mwanafunzi..." : "Creating student..."}
            </Text>
          </View>
        </View>
      )}
      <Toast />
    </LinearGradient>
  );
}