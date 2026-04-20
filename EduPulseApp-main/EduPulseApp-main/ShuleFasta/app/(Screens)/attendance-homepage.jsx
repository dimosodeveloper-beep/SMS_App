import React, { useRef, useContext, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import Header from "../../components/Header";

import { useRouter } from "expo-router";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import * as Haptics from "expo-haptics";

import styles from "../../components/LoginStyles";

import { UserContext } from "../../components/UserContext";

export default function DashboardOptions() {

  const router = useRouter();

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const { userData } = useContext(UserContext);

  const role = userData?.role || "user";

  const pressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true
    }).start();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning ☀️";
    if (hour < 18) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  };

  /* ================= OPTIONS ================= */
  const options = [
    {
      title: "All Class Attendances",
      icon: <Ionicons name="checkmark-done" size={24} color="#fff" />,
      route: "(Attendance)/view-attendance-classes",
      colors: ["#22c55e", "#4ade80", "#16a34a"],
      for: ["admin", "teacher", "staff", "parent"]
    },
    {
      title: "Take Attendance",
      icon: <MaterialIcons name="how-to-reg" size={24} color="#fff" />,
      route: "(Attendance)/attendance-all-classes",
      colors: ["#3b82f6", "#60a5fa", "#2563eb"],
      for: ["admin", "teacher", "staff"]
    }
  ];

  /* ================= ROLE FILTER ================= */
  const filteredOptions = useMemo(() => {
    return options.filter(item => item.for.includes(role));
  }, [role]);

  return (
    <LinearGradient
      colors={["#020617", "#0f172a", "#1e293b"]}
      style={styles.container}
    >

      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1577896851231-70ef18881754"
        }}
        style={styles.bg}
      />

      <Header
        title="School Dashboard"
        subtitle="Management System"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* GREETING */}
        <BlurView intensity={50} tint="dark" style={styles.greetingCard}>
          <Text style={styles.greetingTitle}>
            {getGreeting()}
          </Text>

          <Text style={styles.greetingSubtitle}>
            Manage attendance easily & professionally 🚀
          </Text>
        </BlurView>

        {/* OPTIONS */}
        <View style={styles.optionsContainer}>

          {filteredOptions.map((item, index) => (

            <Animated.View
              key={index}
              style={[
                styles.cardWrapper,
                { transform: [{ scale: scaleAnim }] }
              ]}
            >

              <TouchableOpacity
                activeOpacity={0.9}
                onPressIn={pressIn}
                onPressOut={pressOut}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  router.push(item.route);
                }}
              >

                <LinearGradient
                  colors={item.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.card}
                >

                  <View style={styles.cardContent}>

                    <View style={styles.leftContent}>
                      <View style={styles.iconBox}>
                        {item.icon}
                      </View>

                      <Text style={styles.cardText}>
                        {item.title}
                      </Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={22}
                      color="#fff"
                    />

                  </View>

                </LinearGradient>

              </TouchableOpacity>

            </Animated.View>

          ))}

        </View>

        {/* FOOTER */}
        <BlurView intensity={30} tint="dark" style={styles.footer}>
          <Text style={styles.footerText}>
            Shule Fasta 🚀 | Smart School System
          </Text>
        </BlurView>

      </ScrollView>

    </LinearGradient>
  );
}