import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import { EndPoint } from "../components/links";

const { width, height } = Dimensions.get("window");

// 🌌 galaxy particles
const createStars = (count = 40) =>
  Array.from({ length: count }).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 2 + 0.5,
    angle: Math.random() * 360,
  }));

export default function Index() {
  const router = useRouter();

  const [count, setCount] = useState(3);
  const [progress, setProgress] = useState(0);

  const stars = useRef(createStars()).current;

  const spin = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const scan = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const auroraShift = useRef(new Animated.Value(0)).current;

  const soundRef = useRef(null);

  useEffect(() => {
    startAllAnimations();
    startCountdown();
    startProgress();
    playSound();
  }, []);

  // 🌈 AURORA BACKGROUND ANIMATION
  const startAllAnimations = () => {
    Animated.loop(
      Animated.timing(auroraShift, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();

    // 3D LOGO SPIN
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // GLOW
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // AI SCAN
    Animated.loop(
      Animated.timing(scan, {
        toValue: 1,
        duration: 1800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const startCountdown = () => {
    let c = 3;
    const interval = setInterval(() => {
      c -= 1;
      setCount(c);
      if (c <= 0) clearInterval(interval);
    }, 1000);
  };

  const startProgress = () => {
    let p = 0;
    const interval = setInterval(() => {
      p += 33;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        navigateNext();
      }
    }, 1000);
  };

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/school-bell.mp3")
      );
      soundRef.current = sound;
      await sound.playAsync();
    } catch (e) {}
  };

  const navigateNext = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        fadeOut(() => router.replace("/login"));
        return;
      }

      const res = await axios.get(EndPoint + "/Account/user_data/", {
        headers: { Authorization: `Token ${token}` },
      });

      const user = res.data;

      fadeOut(() => {
        if (user.role === "parent") {
          router.replace("/(Parents)/parent_home");
        } else {
          router.replace("/(main)/home");
        }
      });
    } catch {
      fadeOut(() => router.replace("/login"));
    }
  };

  const fadeOut = (cb) => {
    Animated.timing(fade, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start(cb);
  };

  // 🌌 SPIN 3D LOGO
  const rotateY = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // 🌈 AURORA COLOR SHIFT
  const aurora1 = auroraShift.interpolate({
    inputRange: [0, 1],
    outputRange: ["#0f172a", "#1e1b4b"],
  });

  const aurora2 = auroraShift.interpolate({
    inputRange: [0, 1],
    outputRange: ["#1e1b4b", "#0ea5e9"],
  });

  const scanTranslate = scan.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <Animated.View style={{ flex: 1, opacity: fade }}>
      {/* 🌈 AURORA BACKGROUND */}
      <LinearGradient
        colors={["#0f172a", "#1e1b4b", "#0ea5e9"]}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        {/* 🌌 GALAXY STARS */}
        {stars.map((s, i) => (
          <View
            key={i}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
              borderRadius: 50,
              backgroundColor: "white",
              opacity: 0.4,
            }}
          />
        ))}

        {/* 🤖 AI SCAN LINE */}
        <Animated.View
          style={{
            position: "absolute",
            width: "100%",
            height: 2,
            backgroundColor: "#38bdf8",
            opacity: 0.5,
            transform: [{ translateY: scanTranslate }],
          }}
        />

        {/* 🔵 GLOW ORB */}
        <Animated.View
          style={{
            position: "absolute",
            width: 250,
            height: 250,
            borderRadius: 150,
            backgroundColor: glow.interpolate({
              inputRange: [0, 1],
              outputRange: ["rgba(56,189,248,0.1)", "rgba(14,165,233,0.5)"],
            }),
          }}
        />

        {/* 🌀 3D LOGO */}
        <Animated.View
          style={{
            transform: [{ rotateY }, { perspective: 800 }],
            width: 120,
            height: 120,
            borderRadius: 25,
            borderWidth: 2,
            borderColor: "#38bdf8",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "#38bdf8", fontSize: 30, fontWeight: "bold" }}>
            SF
          </Text>
        </Animated.View>

        {/* TEXT */}
        <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>
          Shule Fasta
        </Text>

        <Text style={{ color: "#94a3b8", marginTop: 6 }}>
          AI Powered School System
        </Text>

        {/* COUNTDOWN */}
        <Text style={{ color: "#38bdf8", fontSize: 28, marginTop: 20 }}>
          {count > 0 ? count : "GO"}
        </Text>

        {/* PROGRESS */}
        <View
          style={{
            width: "80%",
            height: 6,
            backgroundColor: "#1e293b",
            borderRadius: 10,
            marginTop: 20,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: `${progress}%`,
              height: "100%",
              backgroundColor: "#38bdf8",
            }}
          />
        </View>

        <Text style={{ color: "#64748b", marginTop: 15 }}>
          AI initializing... {progress}%
        </Text>
      </LinearGradient>
    </Animated.View>
  );
}