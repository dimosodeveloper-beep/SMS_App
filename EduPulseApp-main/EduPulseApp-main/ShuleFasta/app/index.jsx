import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { EndPoint } from "../components/links";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        if (!token) {
          router.replace("/login");
          return;
        }

        const res = await axios.get(EndPoint + "/Account/user_data/", {
          headers: { Authorization: `Token ${token}` }
        });

        const user = res.data;

        if (user.role === "parent") {
          router.replace("/(Parents)/parent_home");
        } else {
          router.replace("/(main)/home");
        }

      } catch (err) {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  return (
    <LinearGradient colors={["#0f172a", "#1e293b", "#0f172a"]} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

      <Image
        source={{ uri: "https://images.unsplash.com/photo-1523240795612-9a054b0db644" }}
        style={{ width: 120, height: 120, borderRadius: 20, marginBottom: 20 }}
      />

      <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
        Shule Fasta
      </Text>

      <Text style={{ color: "#94a3b8", marginTop: 5 }}>
        Smart School Management System
      </Text>

      <ActivityIndicator size="large" color="#38bdf8" style={{ marginTop: 20 }} />

    </LinearGradient>
  );
}