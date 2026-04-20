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

export default function ParentHome() {
  const router = useRouter();
  const { setUserData, setUserToken } = useContext(UserContext);

  const [token, setToken] = useState(null);
  const [logoutModal, setLogoutModal] = useState(false);

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

  /* ================= MENU ================= */
  const menu = [
    {
      title: "Results",
      icon: "assessment",
      route: "/(Parents)/parents-exam-categories",
      color: ["#4f46e5", "#06b6d4"],
    },
    {
      title: "Attendance",
      icon: "how-to-reg",
      route: "/(Screens)/attendance-homepage",
      color: ["#f97316", "#ef4444"],
    },
    {
      title: "Events",
      icon: "event",
      route: "/(Calender)/events-calender",
      color: ["#22c55e", "#16a34a"],
    },
    {
      title: "Reports",
      icon: "bar-chart",
      route: "/(Reports)/report-exam-categories",
      color: ["#a855f7", "#ec4899"],
    },
    {
      title: "TimeTable",
      icon: "schedule",
      route: "/(Timetable)/timetable-class",
      color: ["#0ea5e9", "#2563eb"],
    },
    {
      title: "ShuleFasta",
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

      {/* HEADER */}
      <ParentHeader
        title="Parent Dashboard"
        subtitle="Monitor your child progress"
      />

      {/* HERO */}
      <LinearGradient colors={["#2563eb", "#7c3aed"]} style={styles.hero}>
        <Text style={styles.heroTitle}>Welcome Parent 👋</Text>
        <Text style={styles.heroText}>
          Everything is now organized for your child’s academic journey
        </Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* GRID */}
        <View style={styles.grid}>
          {menu.map((item, index) => (
            <Card key={index} item={item} />
          ))}
        </View>

        {/* PARENT INSIGHTS (RESTORED) */}
        <View style={styles.insight}>
          <Text style={styles.sectionTitle}>Parent Insights</Text>

          <View style={styles.insightCard}>
            <Text style={styles.insightText}>📊 Track academic performance in real time</Text>
            <Text style={styles.insightText}>📅 Monitor attendance history</Text>
            <Text style={styles.insightText}>🏆 View exam & event updates</Text>
            <Text style={styles.insightText}>📩 Receive instant notifications</Text>
            <Text style={styles.insightText}>🕒 Check timetable anytime</Text>
          </View>
        </View>

        {/* LOGOUT BUTTON */}
        <View style={styles.logoutBox}>
          <Pressable onPress={() => setLogoutModal(true)} style={styles.logoutBtn}>
            <FontAwesome name="sign-out" size={20} color="#fff" />
            <Text style={{ color: "#fff", marginLeft: 10 }}>Logout</Text>
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* LOGOUT MODAL */}
      <Modal transparent visible={logoutModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setLogoutModal(false)}>
                <Text style={{ color: "#ef4444" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleLogout}>
                <Text style={{ color: "#22c55e" }}>Yes Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1 },

  hero: {
    margin: 15,
    padding: 18,
    borderRadius: 18,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  heroText: {
    color: "#e2e8f0",
    marginTop: 5,
  },

  grid: {
    paddingHorizontal: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "47%",
    backgroundColor: "#0f172a",
    borderRadius: 18,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#1e293b",
    alignItems: "center",
  },

  iconBox: {
    width: 55,
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  arrow: {
    marginTop: 5,
  },

  insight: {
    margin: 15,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  insightCard: {
    backgroundColor: "#0f172a",
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  insightText: {
    color: "#cbd5e1",
    marginBottom: 6,
  },

  logoutBox: {
    alignItems: "center",
    marginTop: 20,
    marginBottom:100,
  },

  logoutBtn: {
    flexDirection: "row",
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    backgroundColor: "#0f172a",
    padding: 20,
    borderRadius: 15,
    width: "80%",
  },

  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  modalText: {
    color: "#cbd5e1",
    marginVertical: 10,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});