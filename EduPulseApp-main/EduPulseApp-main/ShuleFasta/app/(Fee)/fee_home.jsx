import React, { useRef, useContext } from "react";
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

import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

import * as Haptics from "expo-haptics";

import styles from "../../components/LoginStyles";

import * as Animatable from "react-native-animatable";

import { UserContext } from "../../components/UserContext";

export default function FeeDashboardOptions() {

  const router = useRouter();
  const { userData } = useContext(UserContext);

  const role = userData?.role;

  const scaleAnim = useRef(new Animated.Value(1)).current;

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

  /* ================= FEES OPTIONS ================= */
  const options = [

    /* ADMIN / STAFF FUNCTIONS */
    {
      title: "Create Fee Structure",
      icon: <Ionicons name="create" size={24} color="#fff" />,
      route: "(Fee)/create-fee-structure",
      colors: ["#22c55e", "#4ade80", "#16a34a"],
      adminOnly: true
    },

    {
      title: "Create Fee Payment",
      icon: <MaterialIcons name="payment" size={24} color="#fff" />,
      route: "(Fee)/create-fee-payment",
      colors: ["#3b82f6", "#60a5fa", "#2563eb"],
      adminOnly: true
    },

    /* ALL USERS (ADMIN + TEACHER + PARENT CAN SEE) */
    {
      title: "All Fee Structures",
      icon: <FontAwesome5 name="list-alt" size={22} color="#fff" />,
      route: "(Fee)/all-fee-structure",
      colors: ["#9333ea", "#c084fc", "#7e22ce"],
      adminOnly: false
    },

    {
      title: "All Fee Payments",
      icon: <Ionicons name="cash" size={24} color="#fff" />,
      route: "(Fee)/all-fee-years",
      colors: ["#f59e0b", "#fbbf24", "#d97706"],
      adminOnly: false
    },



    /* ADMIN + TEACHER ONLY */
    {
      title: "Fee Reports",
      icon: <Ionicons name="document-text" size={24} color="#fff" />,
      route: "(Fee)/fee-reports",
      colors: ["#06b6d4", "#22d3ee", "#0891b2"],
      adminOnly: true
    }

  ];

  /* ================= ROLE FILTER LOGIC ================= */
  const filteredOptions = options.filter(item => {

    // ADMIN → anaona kila kitu
    if (role === "admin") return true;

    // PARENT → haoni adminOnly items + create items + reports
    if (role === "parent") {
      if (
        item.title === "Create Fee Structure" ||
        item.title === "Create Fee Payment" ||
        item.title === "Fee Reports"
      ) {
        return false;
      }
      return true;
    }

    // TEACHER / OTHER ROLES
    if (role === "teacher") {
      if (
        item.title === "Create Fee Structure" ||
        item.title === "Create Fee Payment"
      ) {
        return false;
      }
      return true;
    }

    return true;
  });

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
        title="Fee Management System"
        subtitle="School Finance Dashboard"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <BlurView intensity={50} tint="dark" style={styles.greetingCard}>
          <Text style={styles.greetingTitle}>
            {getGreeting()}
          </Text>

          <Text style={styles.greetingSubtitle}>
            Manage school fees easily & professionally 💰
          </Text>
        </BlurView>

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

        <BlurView intensity={30} tint="dark" style={styles.footer}>
          <Text style={styles.footerText}>
            Shule Fasta 🚀 | Fee Management System
          </Text>
        </BlurView>

      </ScrollView>

    </LinearGradient>
  );
}