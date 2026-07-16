import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Animated,
  Easing,
  Dimensions,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import { EndPoint } from "../components/links";
//Shule
const { width, height } = Dimensions.get("window");

// 🌌 galaxy particles
const createStars = (count = 40) =>
  Array.from({ length: count }).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 2 + 0.5,
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

  // 🌈 ANIMATIONS
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
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // GLOW EFFECT
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // AI SCAN LINE
    Animated.loop(
      Animated.timing(scan, {
        toValue: 1,
        duration: 2000,
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

  const rotateY = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const scanTranslate = scan.interpolate({
    inputRange: [0, 1],
    outputRange: [-height / 2, height / 2],
  });

  return (
    <Animated.View style={{ flex: 1, opacity: fade }}>
      <LinearGradient
        colors={["#0f172a", "#1e1b4b", "#0ea5e9"]}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
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
              opacity: 0.3,
            }}
          />
        ))}

        <Animated.View
          style={{
            position: "absolute",
            width: "100%",
            height: 2,
            backgroundColor: "#38bdf8",
            opacity: 0.3,
            transform: [{ translateY: scanTranslate }],
          }}
        />

        <Animated.View
          style={{
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: 150,
            backgroundColor: glow.interpolate({
              inputRange: [0, 1],
              outputRange: ["rgba(56,189,248,0.05)", "rgba(14,165,233,0.2)"],
            }),
          }}
        />

        {/* 🌀 LOGO CONTAINER NA IMAGE */}
        <Animated.View
          style={{
            transform: [{ rotateY }, { perspective: 1000 }],
            width: 130,
            height: 130,
            borderRadius: 30,
            borderWidth: 2,
            borderColor: "#38bdf8",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 25,
            backgroundColor: "rgba(15, 23, 42, 0.8)",
            overflow: "hidden",
          }}
        >
          <Image
            source={require("../assets/icon.png")}
            style={{ width: "80%", height: "80%", resizeMode: "contain" }}
          />
        </Animated.View>

        {/* TEXT */}
        <Text style={{ color: "#fff", fontSize: 26, fontWeight: "800", letterSpacing: 1 }}>
          Welcome ShuleFasta
        </Text>

        <Text style={{ color: "#94a3b8", marginTop: 8, fontSize: 14 }}>
          Intelligence at your service
        </Text>

        <Text style={{ color: "#38bdf8", fontSize: 28, marginTop: 25, fontWeight: "bold" }}>
          {count > 0 ? count : "INIT"}
        </Text>

        <View
          style={{
            width: "70%",
            height: 4,
            backgroundColor: "#1e293b",
            borderRadius: 10,
            marginTop: 25,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: `${progress}%`,
              height: "100%",
              backgroundColor: "#38bdf8",
              borderRadius: 10,
            }}
          />
        </View>

        <Text style={{ color: "#64748b", marginTop: 15, fontSize: 12 }}>
          System initializing... {progress}%
        </Text>
      </LinearGradient>
    </Animated.View>
  );
}