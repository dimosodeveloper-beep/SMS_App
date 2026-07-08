import React, { useState, useEffect, useContext, useRef } from "react";

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
import { LanguageContext } from "../../components/LanguageContext";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function CreateClass() {

  const { t, language } = useContext(LanguageContext);

  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true
    }).start();
  }

  const pressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true
    }).start();
  }

  /* =========================
  LOAD TOKEN
  ========================= */

  useEffect(() => {

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true
      })
    ]).start();

    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem("userToken");
      setToken(savedToken);
    };

    loadToken();

  }, []);


  /* =========================
  CREATE CLASS
  ========================= */

  const createClass = async () => {

    if (!name) {
      Toast.show({
        type: "error",
        text1: t("missing_field"),
        text2: t("enter_class_name")
      });
      return;
    }

    if (!token) {
      Toast.show({
        type: "error",
        text1: t("auth_error"),
        text2: t("login_again")
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        EndPoint + "/create-class/",
        {
          name: name
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );

      setLoading(false);

      Toast.show({
        type: "success",
        text1: t("class_created"),
        text2: t("class_created_success")
      });

      setName("");

    } catch (error) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: t("error"),
        text2: JSON.stringify(error.response?.data)
      });
    }
  }

  return (
    <LinearGradient
      colors={["#020617", "#0f172a", "#1e293b", "#020617"]}
      style={styles.container}
    >

      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1588072432836-e10032774350"
        }}
        style={[styles.bg, {
          opacity: 0.18
        }]}
      />

      <View style={{
        position: "absolute",
        top: -120,
        right: -100,
        width: 250,
        height: 250,
        borderRadius: 200,
        backgroundColor: "rgba(37,99,235,0.18)"
      }} />

      <View style={{
        position: "absolute",
        bottom: -120,
        left: -100,
        width: 260,
        height: 260,
        borderRadius: 200,
        backgroundColor: "rgba(56,189,248,0.12)"
      }} />

      <Header
        title={t("school_dashboard")}
        subtitle={t("management_system")}
      />

      <ScrollView
        contentContainerStyle={{
          padding: 14,
          paddingBottom: 180
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >

          <BlurView
            intensity={55}
            tint="dark"
            style={[
              styles.blur,
              {
                backgroundColor: "rgba(15,23,42,0.55)",
                borderWidth: 1,
                borderColor: "rgba(148,163,184,0.15)",
                borderRadius: 30,
                overflow: "hidden",
                padding: 0
              }
            ]}
          >

            {/* TOP DESIGN */}
            <LinearGradient
              colors={[
                "rgba(37,99,235,0.28)",
                "rgba(56,189,248,0.10)",
                "transparent"
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                padding: 24,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(148,163,184,0.08)"
              }}
            >

              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}>

                <View style={{ flex: 1, paddingRight: 15 }}>

                  <Text style={{
                    color: "#ffffff",
                    fontSize: 28,
                    fontWeight: "bold",
                    letterSpacing: 0.5
                  }}>
                    {t("create_class")}
                  </Text>

                  <Text style={{
                    color: "#cbd5e1",
                    fontSize: 14,
                    marginTop: 8,
                    lineHeight: 22
                  }}>
                    {t("management_system")}
                  </Text>

                </View>

                <View style={{
                  width: 75,
                  height: 75,
                  borderRadius: 24,
                  backgroundColor: "rgba(37,99,235,0.18)",
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "rgba(96,165,250,0.25)"
                }}>
                  <MaterialCommunityIcons
                    name="google-classroom"
                    size={38}
                    color="#60a5fa"
                  />
                </View>

              </View>

            </LinearGradient>

            <View style={{
              padding: 22
            }}>

              {/* STATS CARD */}
              <LinearGradient
                colors={["#1e293b", "#0f172a"]}
                style={{
                  borderRadius: 24,
                  padding: 18,
                  borderWidth: 1,
                  borderColor: "rgba(148,163,184,0.12)",
                  marginBottom: 24
                }}
              >

                <View style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>

                  <View>
                    <Text style={{
                      color: "#94a3b8",
                      fontSize: 12,
                      fontWeight: "600",
                      letterSpacing: 1
                    }}>
                      {language === "sw" ? "DARASA LA SHULE" : "SCHOOL CLASS"}
                    </Text>

                    <Text style={{
                      color: "#ffffff",
                      fontSize: 22,
                      fontWeight: "bold",
                      marginTop: 6
                    }}>
                      {language === "sw" ? "Tengeneza Darasa Jipya" : "Create New Class"}
                    </Text>
                  </View>

                  <View style={{
                    backgroundColor: "rgba(34,197,94,0.15)",
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 14,
                    flexDirection: "row",
                    alignItems: "center"
                  }}>
                    <Ionicons
                      name="school"
                      size={16}
                      color="#22c55e"
                    />

                    <Text style={{
                      color: "#22c55e",
                      marginLeft: 6,
                      fontWeight: "bold"
                    }}>
                      {language === "sw" ? "LINALOENDELEA" : "ACTIVE"}
                    </Text>
                  </View>

                </View>

              </LinearGradient>

              {/* INPUT */}
              <View style={{ marginBottom: 25 }}>

                <Text style={{
                  color: "#e2e8f0",
                  fontSize: 15,
                  fontWeight: "700",
                  marginBottom: 12,
                  marginLeft: 4
                }}>
                  {language === "sw" ? "Jina la Darasa" : "Class Name"}
                </Text>

                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "rgba(15,23,42,0.95)",
                  borderWidth: 1.5,
                  borderColor: "#334155",
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  height: 64
                }}>

                  <View style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    backgroundColor: "rgba(37,99,235,0.15)",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12
                  }}>
                    <Ionicons
                      name="library-outline"
                      size={22}
                      color="#38bdf8"
                    />
                  </View>

                  <TextInput
                    style={{
                      flex: 1,
                      color: "#ffffff",
                      fontSize: 16,
                      fontWeight: "600"
                    }}
                    value={name}
                    onChangeText={setName}
                    placeholder={language === "sw" ? "mfano: darasa la kwanza" : "example: form 1"}
                    placeholderTextColor="#64748b"
                  />

                </View>

              </View>

              {/* INFO CARD */}
              <View style={{
                backgroundColor: "rgba(15,23,42,0.65)",
                borderRadius: 22,
                padding: 18,
                borderWidth: 1,
                borderColor: "rgba(148,163,184,0.10)",
                marginBottom: 28
              }}>

                <View style={{
                  flexDirection: "row",
                  alignItems: "center"
                }}>

                  <View style={{
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    backgroundColor: "rgba(56,189,248,0.15)",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 14
                  }}>
                    <Ionicons
                      name="information-circle-outline"
                      size={24}
                      color="#38bdf8"
                    />
                  </View>

                  <View style={{ flex: 1 }}>

                    <Text style={{
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontSize: 15
                    }}>
                      {language === "sw" ? "Taarifa za Darasa" : "Class Information"}
                    </Text>

                    <Text style={{
                      color: "#94a3b8",
                      marginTop: 4,
                      lineHeight: 20,
                      fontSize: 13
                    }}>
                      {language === "sw" 
                        ? "Tengeneza majina ya darasa kama Darasa la Kwanza, Kidato cha Nne, Chekechea au darasa lolote maalum." 
                        : "Create classroom names like Form One, Grade Seven, Nursery or any custom school class."}
                    </Text>

                  </View>

                </View>

              </View>

              {/* BUTTON */}
              <Animated.View style={{
                transform: [{ scale: scaleAnim }]
              }}>

                <TouchableOpacity
                  onPressIn={pressIn}
                  onPressOut={pressOut}
                  onPress={createClass}
                  activeOpacity={0.9}
                >

                  <LinearGradient
                    colors={["#2563eb", "#38bdf8", "#0ea5e9"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      height: 64,
                      borderRadius: 22,
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      shadowColor: "#38bdf8",
                      shadowOpacity: 0.35,
                      shadowRadius: 12,
                      elevation: 10
                    }}
                  >

                    <View style={{
                      width: 42,
                      height: 42,
                      borderRadius: 14,
                      backgroundColor: "rgba(255,255,255,0.18)",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 12
                    }}>
                      <Ionicons
                        name="add-circle-outline"
                        size={24}
                        color="#ffffff"
                      />
                    </View>

                    <Text style={{
                      color: "#ffffff",
                      fontSize: 17,
                      fontWeight: "bold",
                      letterSpacing: 0.5
                    }}>
                      {t("create_class")}
                    </Text>

                  </LinearGradient>

                </TouchableOpacity>

              </Animated.View>

            </View>

          </BlurView>

        </Animated.View>

      </ScrollView>

      {loading && (

        <View style={styles.loader}>

          <View style={[
            styles.loaderCard,
            {
              backgroundColor: "#0f172a",
              borderWidth: 1,
              borderColor: "#334155",
              borderRadius: 24
            }
          ]}>

            <ActivityIndicator
              size="large"
              color="#38bdf8"
            />

            <Text style={[
              styles.loadingText,
              {
                marginTop: 14,
                fontSize: 15,
                color: "#e2e8f0"
              }
            ]}>
              {t("creating_class")}
            </Text>

          </View>

        </View>

      )}

      <Toast />

    </LinearGradient>
  )
}