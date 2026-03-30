import { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
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
          // Haina token → mpeleke kwa /all-products
          router.replace("/login");
          return;
        }

        // 3️⃣ Token ipo → confirm kama ni valid
        try {
          const response = await axios.get(`${EndPoint}/Account/user_data/`, {
            headers: { Authorization: `Token ${token}` },
            timeout: 8000,
          });

          // Token ni valid → mpeleke Home
          router.replace("/(main)/home");

        } catch (error) {
          // Token haifanyi kazi au ime-expire → toa ujumbe na mpeleke all-products
          if (error.response) {
            if (error.response.status === 401) {
              setErrorMessage("Token yako imeisha muda wake. Tafadhali login tena.");
            } else if (error.response.status === 404) {
              setErrorMessage("Taarifa hazijapatikana. Tafadhali jaribu tena.");
            } else {
              setErrorMessage("Hitilafu isiyotegemewa imejitokeza. Jaribu tena baadae.");
            }
          } else if (error.message === "Network Error") {
            setErrorMessage("Tatizo la mtandao. Hakikisha unayo internet.");
          } else if (error.code === "ECONNABORTED") {
            setErrorMessage("Ombi limechukua muda mrefu mno. Tafadhali jaribu tena.");
          } else {
            setErrorMessage("Kuna tatizo lisilojulikana limejitokeza.");
          }

          // Peleka user kwenye all-products hata kama error ipo
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

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#015d68",
        }}
      >
        <ActivityIndicator size="large" color="white" />
        <Text style={{ color: "white", marginTop: 10 }}>Please wait...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: "#004d40",
        }}
      >
        <Text style={{ color: "red", fontSize: 16, textAlign: "center", marginBottom: 10 }}>
          {errorMessage}
        </Text>
        <Text style={{ color: "white", fontSize: 16, textAlign: "center" }}>
          Unapelekwa kwenye ukurasa wa bidhaa...
        </Text>
        <ActivityIndicator size="small" color="white" style={{ marginTop: 15 }} />
      </View>
    );
  }

  return null;
}