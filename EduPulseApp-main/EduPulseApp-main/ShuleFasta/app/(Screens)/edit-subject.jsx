import React, { useState, useEffect, useRef, useContext } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  ScrollView
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";

import styles from "../../components/LoginStyles";
import { EndPoint } from "../../components/links";
import Header from "../../components/Header";

import { useRouter, useLocalSearchParams } from "expo-router";
import { LanguageContext } from "../../components/LanguageContext";

export default function EditSubject() {

  const router = useRouter();
  const params = useLocalSearchParams();
  const { language } = useContext(LanguageContext);

  // States kwa ajili ya data ya somo (English Name na Swahili Name)
  const [name, setName] = useState(params.name || "");
  const [nameSW, setNameSW] = useState(params.name_SW || "");

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const pressIn = () => { Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start(); }
  const pressOut = () => { Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start(); }

  useEffect(() => {
    const loadToken = async () => {
      const t = await AsyncStorage.getItem("userToken");
      setToken(t);
    };
    loadToken();
  }, []);

  const updateSubject = async () => {

    if (!name) {
      Toast.show({
        type: "error",
        text1: language === "sw" ? "Jaza jina la somo" : "Fill subject name"
      });
      return;
    }

    setLoading(true);

    try {

      await axios.put(
        EndPoint + `/subjects/${params.id}/`,
        {
          name: name,
          name_SW: nameSW
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Toast.show({
        type: "success",
        text1: language === "sw" ? "Somo Limebadilishwa" : "Updated Successfully"
      });

      router.back();

    } catch (e) {

      Toast.show({
        type: "error",
        text1: language === "sw" ? "Hitilafu imetokea" : "Error",
        text2: JSON.stringify(e.response?.data)
      });

    }

    setLoading(false);
  };

  return (
    <LinearGradient colors={["#020617", "#0f172a", "#1e293b"]} style={styles.container}>

      <Image
        source={{ uri: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f" }}
        style={[styles.bg, { opacity: 0.15 }]}
        blurRadius={2}
      />

      <Header
        title={language === "sw" ? "Hariri Somo" : "Edit Subject"}
        subtitle={language === "sw" ? "Rekebisha Taarifa" : "Update Subject Details"}
      />

      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 200 }}>

        <BlurView intensity={40} tint="dark" style={styles.blur}>

          <Text style={styles.title}>
            {language === "sw" ? "Hariri Somo" : "Edit Subject"}
          </Text>

          <View style={styles.form}>

            {/* Input ya Jina la Somo (English) */}
            <Text style={styles.label}>
              {language === "sw" ? "Jina la Somo (Kiingereza)" : "Subject Name (English)"}
            </Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={language === "sw" ? "mfano: Mathematics" : "e.g. Mathematics"}
              placeholderTextColor="#475569"
            />

            {/* Input ya Jina la Somo (Swahili) */}
            <Text style={styles.label}>
              {language === "sw" ? "Jina la Somo (Kiswahili)" : "Subject Name (Swahili)"}
            </Text>
            <TextInput
              style={styles.input}
              value={nameSW}
              onChangeText={setNameSW}
              placeholder={language === "sw" ? "mfano: Hisabati" : "e.g. Hisabati"}
              placeholderTextColor="#475569"
            />

            <Animated.View style={{ transform: [{ scale: scaleAnim }], marginTop: 30 }}>
              <TouchableOpacity onPressIn={pressIn} onPressOut={pressOut} onPress={updateSubject}>
                <LinearGradient colors={["#2563eb", "#38bdf8"]} style={styles.button}>
                  <Text style={styles.buttonText}>
                    {language === "sw" ? "Huisha Taarifa" : "Update"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

          </View>
        </BlurView>
      </ScrollView>

      {loading && (
        <View style={styles.loader}>
          <View style={styles.loaderCard}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>
              {language === "sw" ? "Inasasisha..." : "Updating..."}
            </Text>
          </View>
        </View>
      )}

      <Toast />

    </LinearGradient>
  )
}