import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Image,
  Dimensions,
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

const { width } = Dimensions.get("window");

export default function Home() {
  const router = useRouter();
  const scrollY = useSharedValue(0);

  const stats = [
    { id: 1, title: "Results", value: 1245, icon: "people", route: "/(Screens)/results-homepage", percentage: 75 },
    // { id: 1, title: "Students", value: 1245, icon: "people", route: "/all-school-students", percentage: 75 },
    { id: 2, title: "Attendance", value: 86, icon: "school", route: "/(Attendance)/view-attendance-classes", percentage: 86 },
    { id: 3, title: "Classes", value: 32, icon: "class", route: "/all-classes", percentage: 60 },
    { id: 4, title: "Subjects", value: 18, icon: "menu-book", route: "/all-subjects", percentage: 45 },
  ];

  const actions = [
    { id: 1, title: "Add Student", icon: "user-plus", route: "/create-student" },
    { id: 2, title: "Add Subject", icon: "chalkboard-teacher", route: "/create-subject" },
    { id: 3, title: "Create Class", icon: "school", route: "/create-class" },
    { id: 4, title: "Take Attendance", icon: "chart-bar", route: "/(Attendance)/attendance-all-classes" },
  ];

  const AnimatedCard = ({ children, onPress, index, percentage }) => {
    const scale = useSharedValue(1);
    const float = useSharedValue(0);
    const progress = useSharedValue(0);

    useEffect(() => {
      float.value = withRepeat(withTiming(-6, { duration: 2000 }), -1, true);
      progress.value = withTiming(percentage, { duration: 1000, easing: Easing.out(Easing.cubic) });
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }, { translateY: float.value }],
      };
    });

    const progressStyle = useAnimatedStyle(() => {
      return {
        width: `${progress.value}%`,
      };
    });

    return (
      <Animated.View style={[styles.card, animatedStyle]}>
        <Pressable
          android_ripple={{ color: "rgba(255,255,255,0.2)", borderless: true }}
          onPress={onPress}
          onPressIn={() => (scale.value = withSpring(0.96))}
          onPressOut={() => (scale.value = withSpring(1))}
        >
          {children}
          {percentage !== undefined && (
            <View style={styles.progressBarBackground}>
              <Animated.View style={[styles.progressBarFill, progressStyle]} />
            </View>
          )}
        </Pressable>
      </Animated.View>
    );
  };

  const heroTranslate = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: scrollY.value * 0.3 }],
    };
  });

  return (
    <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <MainHeader title="School Dashboard" subtitle="Management System" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        {/* HERO SECTION WITH PARTICLES */}
        <View style={styles.heroContainer}>
          <Animated.Image
            source={{ uri: "https://images.unsplash.com/photo-1523240795612-9a054b0db644" }}
            style={[styles.heroImage, heroTranslate]}
          />
          <View style={styles.particlesBackground}>
            {Array.from({ length: 20 }).map((_, i) => (
              <Animated.View
                key={i}
                entering={BounceIn.delay(i * 200)}
                style={[
                  styles.particle,
                  {
                    left: Math.random() * width * 0.9,
                    top: Math.random() * 180,
                    width: Math.random() * 6 + 4,
                    height: Math.random() * 6 + 4,
                  },
                ]}
              />
            ))}
          </View>

          <View style={styles.heroOverlay}>
            <Animated.Text entering={FadeInDown.duration(600)} style={styles.heroTitle}>
              Welcome Back
            </Animated.Text>
            <Animated.Text entering={FadeInDown.delay(200).duration(600)} style={styles.heroText}>
              Manage students, teachers and classes easily with your dashboard
            </Animated.Text>

            <View style={styles.heroButtons}>
              <Animated.View entering={SlideInDown.delay(400).duration(600)}>
                <Pressable
                  android_ripple={{ color: "rgba(255,255,255,0.3)", borderless: false }}
                  style={styles.createBtn}
                  onPress={() => router.push("/create-school")}
                >
                  <Text style={styles.btnText}>Create School</Text>
                </Pressable>
              </Animated.View>

              <Animated.View entering={SlideInDown.delay(600).duration(600)}>
                <Pressable
                  android_ripple={{ color: "rgba(255,255,255,0.3)", borderless: false }}
                  style={styles.loginBtn}
                  onPress={() => router.push("/login")}
                >
                  <Text style={styles.btnText}>Login</Text>
                </Pressable>
              </Animated.View>
            </View>
          </View>
        </View>

        {/* STATS CARDS */}
        <View style={styles.statsContainer}>
          {stats.map((item, index) => (
            <AnimatedCard
              key={item.id}
              onPress={() => router.push(item.route)}
              index={index}
              percentage={item.percentage}
            >
              <LinearGradient colors={["#ff6a00", "#ee0979"]} style={styles.iconCircle}>
                <MaterialIcons name={item.icon} size={28} color="#fff" />
              </LinearGradient>
              <Text style={styles.cardNumber}>{item.value}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </AnimatedCard>
          ))}
        </View>

        {/* QUICK ACTIONS */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          {actions.map((item, index) => (
            <Animated.View entering={FadeInDown.delay(index * 150)} key={item.id} style={{ width: "47%" }}>
              <Pressable
                android_ripple={{ color: "rgba(255,255,255,0.2)", borderless: true }}
                style={({ pressed }) => [
                  styles.actionCard,
                  pressed && { transform: [{ scale: 0.97 }], shadowOpacity: 0.6 },
                ]}
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

        {/* RECENT ACTIVITIES */}
        <Text style={styles.sectionTitle}>Recent Activities</Text>

        <Animated.View entering={FadeIn.duration(500)} style={styles.activityCard}>
          <Text style={styles.activityText}>New student registered in Form One.</Text>
          <Text style={styles.activityTime}>2 minutes ago</Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(200).duration(500)} style={styles.activityCard}>
          <Text style={styles.activityText}>Mathematics exam results uploaded.</Text>
          <Text style={styles.activityTime}>30 minutes ago</Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(400).duration(500)} style={styles.activityCard}>
          <Text style={styles.activityText}>Teacher meeting scheduled for tomorrow.</Text>
          <Text style={styles.activityTime}>1 hour ago</Text>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  heroContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },

  heroImage: { height: 180, width: "100%" },

  particlesBackground: { position: "absolute", width: "100%", height: 180 },

  particle: {
    backgroundColor: "#fff",
    borderRadius: 3,
    opacity: 0.4,
  },

  heroOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 15,
  },

  heroTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  heroText: { color: "#ccc", marginTop: 6, fontSize: 14 },
  heroButtons: { flexDirection: "row", marginTop: 12 },

  createBtn: {
    backgroundColor: "#4A6CF7",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginRight: 10,
    shadowColor: "#4A6CF7",
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },

  loginBtn: {
    backgroundColor: "#2ecc71",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: "#2ecc71",
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },

  btnText: { color: "#fff", fontWeight: "bold", fontSize: 14 },

  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  card: {
    width: "47%",
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 18,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },

  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  cardNumber: { color: "#fff", fontSize: 22, fontWeight: "bold", marginTop: 5 },
  cardTitle: { color: "#ccc", marginTop: 4, fontSize: 14, fontWeight: "600" },

  progressBarBackground: {
    height: 6,
    width: "100%",
    backgroundColor: "#333",
    borderRadius: 4,
    marginTop: 10,
  },

  progressBarFill: {
    height: 6,
    backgroundColor: "#ff6a00",
    borderRadius: 4,
    width: "0%",
  },

  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", marginLeft: 15, marginBottom: 10 },

  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  actionCard: {
    width: "100%",
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 14,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  actionText: { color: "#fff", fontSize: 14, fontWeight: "600" },

  activityCard: {
    backgroundColor: "#111",
    marginHorizontal: 15,
    marginBottom: 12,
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },

  activityText: { color: "#fff", fontSize: 15 },
  activityTime: { color: "#777", marginTop: 5, fontSize: 12 },
});