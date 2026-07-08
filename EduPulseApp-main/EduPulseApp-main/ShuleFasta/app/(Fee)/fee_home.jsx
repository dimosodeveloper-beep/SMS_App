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
import { LanguageContext } from "../../components/LanguageContext";

export default function FeeDashboardOptions() {

  const router = useRouter();
  const { userData } = useContext(UserContext);
  const { language } = useContext(LanguageContext);

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

    if (hour < 12) return language === "sw" ? "Habari za Asubuhi ☀️" : "Good Morning ☀️";
    if (hour < 18) return language === "sw" ? "Habari za Mchana 🌤️" : "Good Afternoon 🌤️";
    return language === "sw" ? "Habari za Jioni 🌙" : "Good Evening 🌙";
  };

  const options = [
    /* ADMIN / STAFF FUNCTIONS */
    {
      title: language === "sw" ? "Tengeneza Mfumo wa Ada" : "Create Fee Structure",
      icon: <Ionicons name="create" size={24} color="#fff" />,
      route: "(Fee)/create-fee-structure",
      colors: ["#22c55e", "#4ade80", "#16a34a"],
      adminOnly: true
    },
    {
      title: language === "sw" ? "Tengeneza Malipo ya Ada" : "Create Fee Payment",
      icon: <MaterialIcons name="payment" size={24} color="#fff" />,
      route: "(Fee)/create-fee-payment",
      colors: ["#3b82f6", "#60a5fa", "#2563eb"],
      adminOnly: true
    },
    /* ALL USERS */
    {
      title: language === "sw" ? "Mifumo Yote ya Ada" : "All Fee Structures",
      icon: <FontAwesome5 name="list-alt" size={22} color="#fff" />,
      route: "(Fee)/all-fee-structure",
      colors: ["#9333ea", "#c084fc", "#7e22ce"],
      adminOnly: false
    },
    {
      title: language === "sw" ? "Malipo Yote ya Ada" : "All Fee Payments",
      icon: <Ionicons name="cash" size={24} color="#fff" />,
      route: "(Fee)/all-fee-years",
      colors: ["#f59e0b", "#fbbf24", "#d97706"],
      adminOnly: false
    },
    /* ADMIN + TEACHER ONLY */
    {
      title: language === "sw" ? "Ripoti za Ada" : "Fee Reports",
      icon: <Ionicons name="document-text" size={24} color="#fff" />,
      route: "(Fee)/fee-reports",
      colors: ["#06b6d4", "#22d3ee", "#0891b2"],
      adminOnly: true
    }
  ];

  const filteredOptions = options.filter(item => {
    if (role === "admin") return true;

    if (role === "parent") {
      if (
        item.title === (language === "sw" ? "Tengeneza Mfumo wa Ada" : "Create Fee Structure") ||
        item.title === (language === "sw" ? "Tengeneza Malipo ya Ada" : "Create Fee Payment") ||
        item.title === (language === "sw" ? "Ripoti za Ada" : "Fee Reports")
      ) {
        return false;
      }
      return true;
    }

    if (role === "teacher") {
      if (
        item.title === (language === "sw" ? "Tengeneza Mfumo wa Ada" : "Create Fee Structure") ||
        item.title === (language === "sw" ? "Tengeneza Malipo ya Ada" : "Create Fee Payment")
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
        title={language === "sw" ? "Mfumo wa Ada" : "Fee Management System"}
        subtitle={language === "sw" ? "Dashibodi ya Fedha za Shule" : "School Finance Dashboard"}
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
            {language === "sw"
              ? "Simamia ada za shule kwa urahisi na kitaalamu 💰"
              : "Manage school fees easily & professionally 💰"}
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
            {language === "sw"
              ? "Shule Fasta 🚀 | Mfumo wa Usimamizi wa Ada"
              : "Shule Fasta 🚀 | Fee Management System"}
          </Text>
        </BlurView>
      </ScrollView>
    </LinearGradient>
  );
}