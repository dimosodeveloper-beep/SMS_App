import { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { EndPoint } from "../components/links";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const appData = await AsyncStorage.getItem("isAppFirstLaunched");

        // 1️⃣ Kama ni mara ya kwanza kabisa kufungua app
        if (appData == null) {
          await AsyncStorage.setItem("isAppFirstLaunched", "false");
          router.replace("/login");
          return;
        }

        // 2️⃣ Si mara ya kwanza → Cheki kama token ipo
        const token = await AsyncStorage.getItem("userToken");

        if (!token) {
          router.replace("/login");
          return;
        }

        // 3️⃣ Token ipo → confirm kama ni valid + pata user data
        try {
          const response = await axios.get(`${EndPoint}/Account/user_data/`, {
            headers: { Authorization: `Token ${token}` },
            timeout: 8000,
          });

          const userData = response.data;

          // 🔥 CHECK ROLE
          if (userData.role === "admin") {
            router.replace("/(main)/home");
          } else if (userData.role === "teacher") {
            router.replace("/(main)/home");
          } else if (userData.role === "parent") {
            router.replace("/(main)/home");
          } else {
            setErrorMessage(
              "The system failed to recognize your role. Please contact support."
            );
          }

        } catch (error) {
          if (error.response) {
            if (error.response.status === 401) {
              setErrorMessage(
                "Token yako imeisha muda wake. Tafadhali login tena."
              );
            } else if (error.response.status === 404) {
              setErrorMessage("Taarifa hazijapatikana. Tafadhali jaribu tena.");
            } else {
              setErrorMessage(
                "Hitilafu isiyotegemewa imejitokeza. Jaribu tena baadae."
              );
            }
          } else if (error.message === "Network Error") {
            setErrorMessage("Tatizo la mtandao. Hakikisha unayo internet.");
          } else if (error.code === "ECONNABORTED") {
            setErrorMessage(
              "Ombi limechukua muda mrefu mno. Tafadhali jaribu tena."
            );
          } else {
            setErrorMessage("Kuna tatizo  limejitokeza.");
          }

          router.replace("/login");
        }
      } catch (err) {
        console.error("Error initializing app:", err);
        setErrorMessage("Kuna tatizo kwenye mfumo. Tafadhali jaribu tena baadae.");
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // ======================= LOADING SCREEN =======================
  if (loading) {
    return (
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1588072432836-e10032774350",
        }}
        style={styles.background}
        blurRadius={3}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.2)"]}
          style={styles.gradientOverlay}
        >
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1588072432836-e10032774350",
            }}
            style={styles.logo}
          />
          <ActivityIndicator size="large" color="#22c55e" style={{ marginTop: 20 }} />
          <Text style={styles.loadingText}>Karibu ShuleFasta...</Text>
        </LinearGradient>
      </ImageBackground>
    );
  }

  // ======================= ERROR SCREEN =======================
  if (errorMessage) {
    return (
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1596496050323-77c7e605f0f6",
        }}
        style={styles.background}
        blurRadius={3}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.3)"]}
          style={styles.gradientOverlay}
        >
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Text style={styles.infoText}>Utapelekwa kwenye ukurasa wa login...</Text>
          <ActivityIndicator size="large" color="#fbbf24" style={{ marginTop: 20 }} />
        </LinearGradient>
      </ImageBackground>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gradientOverlay: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  logo: {
    width: 180,
    height: 180,
    borderRadius: 20,
    marginBottom: 25,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  errorText: {
    color: "#f87171",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  infoText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});