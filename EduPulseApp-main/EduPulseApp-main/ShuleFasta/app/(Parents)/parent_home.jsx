import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Modal,
  TouchableOpacity,
} from "react-native";

import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import ParentHeader from "../../components/ParentHeader";
import { UserContext } from "../../components/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { EndPoint } from "../../components/links";
import { useRouter } from "expo-router";

import i18n from "../../components/translations";
import { LanguageContext } from "../../components/LanguageContext"; // 🔥 ADDED

export default function ParentHome() {
  const router = useRouter();

  const { setUserData, setUserToken } = useContext(UserContext);
  const { changeLanguage } = useContext(LanguageContext); // 🔥 ADDED

  const [token, setToken] = useState(null);
  const [logoutModal, setLogoutModal] = useState(false);
  const [langModal, setLangModal] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");

  const [statsData, setStatsData] = useState({
    results_count: 0,
    attendance_count: 0,
    exams_count: 0,
    students_count: 0,
  });

  useEffect(() => {
    const load = async () => {
      const t = await AsyncStorage.getItem("userToken");
      setToken(t);

      const u = await AsyncStorage.getItem("userData");
      if (u) setUserData(JSON.parse(u));
    };
    load();
  }, []);

  useEffect(() => {
    if (token) fetchStats();
  }, [token]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(EndPoint + "/dashboard-stats/", {
        headers: { Authorization: `Token ${token}` },
      });
      setStatsData(res.data);
    } catch (e) {
      console.log(e.message);
    }
  };

  const menu = [
    {
      title: i18n.t("results"),
      icon: "assessment",
      route: "/(Parents)/parents-exam-categories",
      color: ["#4f46e5", "#06b6d4"],
    },
    {
      title: i18n.t("attendance"),
      icon: "how-to-reg",
      route: "/(Screens)/attendance-homepage",
      color: ["#f97316", "#ef4444"],
    },
    {
      title: i18n.t("all_events"),
      icon: "event",
      route: "/(Calender)/events-calender",
      color: ["#22c55e", "#16a34a"],
    },
    {
      title: i18n.t("Fee"),
      icon: "bar-chart",
      route: "/(Fee)/fee_home",
      color: ["#a855f7", "#ec4899"],
    },
    {
      title: i18n.t("timetable"),
      icon: "schedule",
      route: "/(Timetable)/timetable-class",
      color: ["#0ea5e9", "#2563eb"],
    },
    {
      title: i18n.t("about_app"),
      icon: "school",
      route: "/(Screens)/AboutApp",
      color: ["#f59e0b", "#ef4444"],
    },
  ];

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");

      setUserData(null);
      setUserToken(null);

      setLogoutModal(false);

      router.replace("/login");
    } catch (e) {
      router.replace("/login");
    }
  };

  // 🔥 LANGUAGE CHANGE (SAME AS LOGIN)
  const confirmLanguageChange = async () => {
    await changeLanguage(selectedLang);
    setLangModal(false);
  };

  const Card = ({ item }) => {
    const scale = useSharedValue(1);

    const style = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <Animated.View style={[styles.card, style]}>
        <Pressable
          onPress={() => router.push(item.route)}
          onPressIn={() => (scale.value = withSpring(0.95))}
          onPressOut={() => (scale.value = withSpring(1))}
        >
          <LinearGradient colors={item.color} style={styles.iconBox}>
            <MaterialIcons name={item.icon} size={26} color="#fff" />
          </LinearGradient>

          <Text style={styles.title}>{item.title}</Text>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#94a3b8"
            style={styles.arrow}
          />
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <LinearGradient colors={["#020617", "#0f172a", "#020617"]} style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 🔥 HEADER + LANGUAGE ICONS */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 15, marginTop: 10 }}>

        <ParentHeader
          title={i18n.t("dashboard")}
          subtitle={i18n.t("dashboard_description")}
        />

        {/* LANGUAGE ICONS */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity onPress={() => { setSelectedLang("en"); setLangModal(true); }}>
            <Text style={{ fontSize: 22 }}>🇬🇧</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setSelectedLang("sw"); setLangModal(true); }}>
            <Text style={{ fontSize: 22 }}>🇹🇿</Text>
          </TouchableOpacity>
        </View>

      </View>

      <LinearGradient colors={["#2563eb", "#7c3aed"]} style={styles.hero}>
        <Text style={styles.heroTitle}>{i18n.t("welcome")} 👋</Text>
        <Text style={styles.heroText}>
          {i18n.t("dashboard_description")}
        </Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {menu.map((item, index) => (
            <Card key={index} item={item} />
          ))}
        </View>

        <View style={styles.insight}>
          <Text style={styles.sectionTitle}>{i18n.t("dashboard")}</Text>

          <View style={styles.insightCard}>
            <Text style={styles.insightText}>📊 {i18n.t("dashboard_description")}</Text>
            <Text style={styles.insightText}>📅 {i18n.t("attendance")}</Text>
            <Text style={styles.insightText}>🏆 {i18n.t("results")}</Text>
            <Text style={styles.insightText}>📩 {i18n.t("recent_activities")}</Text>
            <Text style={styles.insightText}>🕒 {i18n.t("timetable")}</Text>
          </View>
        </View>

        <View style={styles.logoutBox}>
          <Pressable onPress={() => setLogoutModal(true)} style={styles.logoutBtn}>
            <FontAwesome name="sign-out" size={20} color="#fff" />
            <Text style={{ color: "#fff", marginLeft: 10 }}>
              {i18n.t("logout")}
            </Text>
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* LANGUAGE MODAL */}
      <Modal transparent visible={langModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {selectedLang === "en"
                ? i18n.t("change_lang_en")
                : i18n.t("change_lang_sw")}
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setLangModal(false)}>
                <Text style={{ color: "#ef4444" }}>{i18n.t("no")}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={confirmLanguageChange}>
                <Text style={{ color: "#22c55e" }}>{i18n.t("yes")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* LOGOUT MODAL */}
      <Modal transparent visible={logoutModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{i18n.t("logout")}</Text>

            <Text style={styles.modalText}>
              {i18n.t("confirm_logout")}
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setLogoutModal(false)}>
                <Text style={{ color: "#ef4444" }}>{i18n.t("no")}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleLogout}>
                <Text style={{ color: "#22c55e" }}>{i18n.t("yes")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </LinearGradient>
  );
}

/* styles unchanged */
const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { margin: 15, padding: 18, borderRadius: 18 },
  heroTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  heroText: { color: "#e2e8f0", marginTop: 5 },
  grid: { paddingHorizontal: 15, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: { width: "47%", backgroundColor: "#0f172a", borderRadius: 18, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: "#1e293b", alignItems: "center" },
  iconBox: { width: 55, height: 55, borderRadius: 15, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  title: { color: "#fff", fontSize: 14, fontWeight: "600" },
  arrow: { marginTop: 5 },
  insight: { margin: 15 },
  sectionTitle: { color: "#fff", fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  insightCard: { backgroundColor: "#0f172a", padding: 15, borderRadius: 15, borderWidth: 1, borderColor: "#1e293b" },
  insightText: { color: "#cbd5e1", marginBottom: 6 },
  logoutBox: { alignItems: "center", marginTop: 20, marginBottom: 100 },
  logoutBtn: { flexDirection: "row", backgroundColor: "#ef4444", padding: 12, borderRadius: 12, alignItems: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  modalBox: { backgroundColor: "#0f172a", padding: 20, borderRadius: 15, width: "80%" },
  modalTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  modalText: { color: "#cbd5e1", marginVertical: 10 },
  modalActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
});