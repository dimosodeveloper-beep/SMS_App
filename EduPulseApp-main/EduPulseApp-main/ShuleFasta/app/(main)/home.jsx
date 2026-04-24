import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
  FadeIn,
  FadeInDown,
  SlideInDown,
  BounceIn,
} from "react-native-reanimated";
import MainHeader from "../../components/MainHeader";
import { UserContext } from "../../components/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { EndPoint } from "../../components/links";
import i18n from "../../components/translations";

const { width } = Dimensions.get("window");

export default function Home() {
  const router = useRouter();
  const scrollY = useSharedValue(0);
  const { userData, setUserData } = useContext(UserContext);

  const [statsData, setStatsData] = useState({
    results_count: 0,
    attendance_count: 0,
    exams_count: 0,
    students_count: 0,
  });

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem("userToken");
      setToken(savedToken);

      const savedUser = await AsyncStorage.getItem("userData");
      if (savedUser) setUserData(JSON.parse(savedUser));
    };
    loadToken();
  }, []);

  useEffect(() => {
    if (token) fetchDashboardStats(token);
  }, [token]);

  const fetchDashboardStats = async (token) => {
    setLoading(true);
    try {
      const response = await axios.get(EndPoint + "/dashboard-stats/", {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      setStatsData(response.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      id: 1,
      title: i18n.t("results"),
      value: statsData.results_count,
      icon: "assessment",
      route: "/(Screens)/results-homepage",
      percentage: statsData.results_count,
    },
    {
      id: 2,
      title: i18n.t("attendance"),
      value: statsData.attendance_count,
      icon: "how-to-reg",
      route: "/(Screens)/attendance-homepage",
      percentage: statsData.attendance_count,
    },
    {
      id: 3,
      title: i18n.t("exams"),
      value: statsData.exams_count,
      icon: "assignment",
      route: "/(Screens)/exams-homepage",
      percentage: statsData.exams_count,
    },
    {
      id: 4,
      title: i18n.t("students"),
      value: statsData.students_count,
      icon: "school",
      route: "/(Screens)/students-homepage",
      percentage: statsData.students_count,
    },
  ];

  const actions = [
    { id: 1, title: i18n.t("all_subjects"), icon: "book-open", route: "/(Screens)/all-subjects" },
    { id: 2, title: i18n.t("add_subject"), icon: "book", route: "/create-subject" },
    { id: 3, title: i18n.t("teachers"), icon: "school", route: "/(Teachers)/all-teachers" },
    { id: 4, title: i18n.t("timetable"), icon: "check-circle", route: "/(Timetable)/timetable-class" },
    { id: 5, title: i18n.t("all_events"), icon: "book-open", route: "/(Calender)/events-calender" },
    { id: 6, title: i18n.t("all_grades"), icon: "book", route: "/(Grading)/all-grades" },
    { id: 7, title: i18n.t("view_reports"), icon: "book-open", route: "/(Reports)/report-exam-categories" },
    { id: 8, title: i18n.t("about_app"), icon: "book", route: "/(Screens)/AboutApp" },
  ];

  const AnimatedCard = ({ children, onPress, index, percentage, isLoading }) => {
    const scale = useSharedValue(1);
    const float = useSharedValue(0);
    const progress = useSharedValue(0);

    useEffect(() => {
      float.value = withRepeat(withTiming(-6, { duration: 2000 }), -1, true);
      progress.value = withTiming(
        Math.min(percentage, 100),
        { duration: 1000, easing: Easing.out(Easing.cubic) }
      );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }, { translateY: float.value }],
    }));

    const progressStyle = useAnimatedStyle(() => ({
      width: `${progress.value}%`,
    }));

    return (
      <Animated.View style={[styles.card, animatedStyle]}>
        <Pressable
          android_ripple={{ color: "rgba(255,255,255,0.2)", borderless: true }}
          onPress={onPress}
          onPressIn={() => (scale.value = withSpring(0.96))}
          onPressOut={() => (scale.value = withSpring(1))}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ff6a00" />
            </View>
          ) : (
            <>
              {children}
              {percentage !== undefined && (
                <View style={styles.progressBarBackground}>
                  <Animated.View style={[styles.progressBarFill, progressStyle]} />
                </View>
              )}
            </>
          )}
        </Pressable>
      </Animated.View>
    );
  };

  const heroTranslate = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value * 0.3 }],
  }));

  return (
    <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <MainHeader
        title={i18n.t("dashboard_title")}
        subtitle={i18n.t("management_system")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        <View style={styles.heroContainer}>
          <Animated.Image
            source={{ uri: "https://images.unsplash.com/photo-1523240795612-9a054b0db644" }}
            style={[styles.heroImage, heroTranslate]}
          />

          <View style={styles.heroOverlay}>
            <Animated.Text entering={FadeInDown.duration(600)} style={styles.heroTitle}>
              {i18n.t("welcome_back")}
            </Animated.Text>

            <Animated.Text entering={FadeInDown.delay(200).duration(600)} style={styles.heroText}>
              Manage students, teachers and classes easily with your dashboard
            </Animated.Text>

            <View style={styles.heroButtons}>
              <Animated.View entering={SlideInDown.delay(400).duration(600)}>
                <Pressable style={styles.createBtn}>
                  <Text style={styles.btnText}>{i18n.t("welcome_btn")}</Text>
                </Pressable>
              </Animated.View>

              <Animated.View entering={SlideInDown.delay(600).duration(600)}>
                <Pressable style={styles.loginBtn}>
                  <Text style={styles.btnText}>
                    {userData?.username || i18n.t("login")}
                  </Text>
                </Pressable>
              </Animated.View>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          {stats.map((item) => (
            <AnimatedCard
              key={item.id}
              onPress={() => router.push(item.route)}
              percentage={item.percentage}
              isLoading={loading}
            >
              <LinearGradient colors={["#ff6a00", "#ee0979"]} style={styles.iconCircle}>
                <MaterialIcons name={item.icon} size={28} color="#fff" />
              </LinearGradient>
              <Text style={styles.cardNumber}>{item.value}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </AnimatedCard>
          ))}
        </View>

        <Text style={styles.sectionTitle}>
          {i18n.t("quick_actions")}
        </Text>

        <View style={styles.actionsContainer}>
          {actions.map((item) => (
            <Animated.View key={item.id} style={{ width: "47%" }}>
              <Pressable
                style={styles.actionCard}
                onPress={() => router.push(item.route)}
              >
                <LinearGradient colors={["#36d1dc", "#5b86e5"]} style={styles.iconBox}>
                  <FontAwesome5 name={item.icon} size={18} color="#fff" />
                </LinearGradient>
                <Text style={styles.actionText}>{item.title}</Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>

     


        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
}

/* styles unchanged */
const styles = StyleSheet.create({
  container: { flex: 1 },
  heroContainer: { marginHorizontal: 15, marginBottom: 20, borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: "#2a2a2a", shadowColor: "#000", shadowOpacity: 0.5, shadowRadius: 10, elevation: 8 },
  heroImage: { height: 180, width: "100%" },
  heroOverlay: { position: "absolute", bottom: 0, width: "100%", backgroundColor: "rgba(0,0,0,0.55)", padding: 15 },
  heroTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  heroText: { color: "#ccc", marginTop: 6, fontSize: 14 },
  heroButtons: { flexDirection: "row", marginTop: 12 },
  createBtn: { backgroundColor: "#4A6CF7", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, marginRight: 10 },
  loginBtn: { backgroundColor: "#2ecc71", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 },
  btnText: { color: "#fff", fontWeight: "bold" },

  statsContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 15, marginBottom: 15 },
  card: { width: "47%", backgroundColor: "#111", borderRadius: 20, padding: 18, marginBottom: 15, alignItems: "center", borderWidth: 1, borderColor: "#2a2a2a" },
  iconCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  cardNumber: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  cardTitle: { color: "#ccc", fontSize: 14 },

  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", marginLeft: 15, marginBottom: 10 },

  actionsContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 15 },

  actionCard: { width: "100%", backgroundColor: "#111", borderRadius: 16, padding: 14, marginBottom: 15, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#2a2a2a" },

  iconBox: { width: 42, height: 42, borderRadius: 12, justifyContent: "center", alignItems: "center", marginRight: 12 },

  actionText: { color: "#fff", fontSize: 14, fontWeight: "600" },

  activityCard: { backgroundColor: "#111", marginHorizontal: 15, marginBottom: 12, padding: 15, borderRadius: 16, borderWidth: 1, borderColor: "#2a2a2a" },

  activityText: { color: "#fff", fontSize: 15 },
  activityTime: { color: "#777", fontSize: 12 },

  loadingContainer: { height: 100, justifyContent: "center", alignItems: "center" },
});