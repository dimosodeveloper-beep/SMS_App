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

import { LanguageContext } from "../../components/LanguageContext";

export default function DashboardOptions() {

  const router = useRouter();
  const { language } = useContext(LanguageContext);

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

    if (language === "sw") {
      if (hour < 12) return "Habari za Asubuhi ☀️";
      if (hour < 18) return "Habari za Mchana 🌤️";
      return "Habari za Jioni 🌙";
    }

    if (hour < 12) return "Good Morning ☀️";
    if (hour < 18) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  };

  const options = [
    {
      title: language === "sw" ? "Wanafunzi Shuleni" : "Students in School",
      icon: <Ionicons name="checkmark-done" size={24} color="#fff" />,
      route: "/all-school-students",
      colors: ["#22c55e", "#4ade80", "#16a34a"]
    },
    {
      title: language === "sw" ? "Wanafunzi Darasani" : "Students in classes",
      icon: <MaterialIcons name="history" size={24} color="#fff" />,
      route: "(Screens)/all-classes",
      colors: ["#3b82f6", "#60a5fa", "#2563eb"]
    },
    {
      title: language === "sw" ? "Ongeza Wanafunzi" : "Add New Students",
      icon: <Ionicons name="people" size={24} color="#fff" />,
      route: "create-student",
      colors: ["#9333ea", "#c084fc", "#7e22ce"]
    },
    {
      title: language === "sw" ? "Madarasa na Mikondo" : "Classes & Streams",
      icon: <FontAwesome5 name="file-alt" size={22} color="#fff" />,
      route: "(Screens)/all-classes",
      colors: ["#f59e0b", "#fbbf24", "#d97706"]
    },
  ];

  return (
    <LinearGradient
      colors={["#020617", "#0f172a", "#1e293b"]}
      style={styles.container}
    >

      <Image
        source={{ uri: "https://images.unsplash.com/photo-1577896851231-70ef18881754" }}
        style={styles.bg}
      />

      <Header
        title={language === "sw" ? "Dashibodi ya Shule" : "School Dashboard"}
        subtitle={language === "sw" ? "Mfumo wa Usimamizi" : "Management System"}
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
              ? "Simamia shule yako kwa urahisi na kitaalamu 🚀" 
              : "Manage your school easily & professionally 🚀"}
          </Text>
        </BlurView>

        <View style={styles.optionsContainer}>

          {options.map((item, index) => (
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

                    <Ionicons name="chevron-forward" size={22} color="#fff" />

                  </View>

                </LinearGradient>

              </TouchableOpacity>

            </Animated.View>
          ))}

        </View>

        <BlurView intensity={30} tint="dark" style={styles.footer}>
          <Text style={styles.footerText}>
            Shule Fasta 🚀 | {language === "sw" ? "Mfumo wa Shule Mahiri" : "Smart School System"}
          </Text>
        </BlurView>

      </ScrollView>

    </LinearGradient>
  );
}