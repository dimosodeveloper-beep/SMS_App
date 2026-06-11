import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Animated,
  Platform,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";

import { EndPoint } from "../../components/links";
import Header from "../../components/Header";
import styles from "../../components/LoginStyles";

import {
  Ionicons,
  MaterialCommunityIcons
} from "@expo/vector-icons";
//route
export default function CreateEvent() {
  const [token, setToken] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("activity");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  /* SCREEN ANIMATION */
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  /* PRESS ANIMATION */
  const pressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const pressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  /* LOAD TOKEN */
  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem("userToken");
      setToken(savedToken);
    };
    loadToken();
  }, []);

  /* FORMAT DATE */
  const formatDate = (selectedDate) => {
    const d = new Date(selectedDate);
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  /* DATE CHANGE */
  const onChangeStartDate = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(formatDate(selectedDate));
    }
  };

  const onChangeEndDate = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndDate(formatDate(selectedDate));
    }
  };

  /* SUBMIT EVENT */
  const submit = async () => {
    if (!title || !description || !startDate || !endDate) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill all fields",
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title,
        description,
        event_type: eventType,
        start_date: startDate,
        end_date: endDate,
      };

      const res = await axios.post(EndPoint + "/create-event/", payload, {
        headers: { Authorization: `Token ${token}` },
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Event added",
      });

      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setLoading(false);
    } catch (error) {
      console.log("ERROR =>", error.response?.data);

      Toast.show({
        type: "error",
        text1: "Error",
        text2: JSON.stringify(error.response?.data || "Failed"),
      });

      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#020617", "#0f172a", "#111827", "#1e293b"]}
      style={styles.container}
    >
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1588072432836-e10032774350",
        }}
        style={[styles.bg, { opacity: 0.18 }]}
      />

      <View style={{
        position: "absolute",
        top: -120,
        right: -100,
        width: 260,
        height: 260,
        borderRadius: 200,
        backgroundColor: "rgba(59,130,246,0.18)"
      }} />

      <View style={{
        position: "absolute",
        bottom: -140,
        left: -100,
        width: 260,
        height: 260,
        borderRadius: 200,
        backgroundColor: "rgba(14,165,233,0.12)"
      }} />

      <Header title="Create Event" subtitle="Event Management System" />

      <Animated.ScrollView
        contentContainerStyle={{
          padding: 14,
          paddingBottom: 300,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <BlurView
          intensity={60}
          tint="dark"
          style={[
            styles.blur,
            {
              borderRadius: 28,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
              backgroundColor: "rgba(15,23,42,0.72)",
              padding: 18,
            },
          ]}
        >
          {/* HEADER ICON */}
          <View style={{
            alignItems: "center",
            marginBottom: 20
          }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 25,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(37,99,235,0.15)",
              borderWidth: 1,
              borderColor: "rgba(96,165,250,0.3)",
              marginBottom: 12
            }}>
              <LinearGradient
                colors={["#2563eb", "#38bdf8"]}
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Ionicons name="calendar" size={30} color="#fff" />
              </LinearGradient>
            </View>

            <Text style={{
              color: "#fff",
              fontSize: 26,
              fontWeight: "bold",
              textAlign: "center"
            }}>
              Create Event
            </Text>

            <Text style={{
              color: "#94a3b8",
              textAlign: "center",
              marginTop: 6
            }}>
              Event Management System
            </Text>
          </View>

          <View style={styles.form}>

            {/* TITLE */}
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Event title"
              placeholderTextColor="#94a3b8"
            />

            {/* DESCRIPTION */}
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { minHeight: 90, textAlignVertical: "top" }]}
              value={description}
              onChangeText={setDescription}
              multiline
              placeholder="Event description"
              placeholderTextColor="#94a3b8"
            />

            {/* START DATE */}
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity onPress={() => setShowStartPicker(true)}>
              <TextInput
                style={styles.input}
                value={startDate}
                placeholder="Select start date"
                placeholderTextColor="#94a3b8"
                editable={false}
              />
            </TouchableOpacity>

            {showStartPicker && (
              <DateTimePicker
                value={startDate ? new Date(startDate) : new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChangeStartDate}
              />
            )}

            {/* END DATE */}
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity onPress={() => setShowEndPicker(true)}>
              <TextInput
                style={styles.input}
                value={endDate}
                placeholder="Select end date"
                placeholderTextColor="#94a3b8"
                editable={false}
              />
            </TouchableOpacity>

            {showEndPicker && (
              <DateTimePicker
                value={endDate ? new Date(endDate) : new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChangeEndDate}
              />
            )}

            {/* BUTTON */}
            <Animated.View style={{ transform: [{ scale: scaleAnim }], marginTop: 25 }}>
              <TouchableOpacity
                onPressIn={pressIn}
                onPressOut={pressOut}
                onPress={submit}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={["#2563eb", "#38bdf8"]}
                  style={{
                    height: 58,
                    borderRadius: 18,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text style={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: 16
                  }}>
                    Save Event
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

          </View>
        </BlurView>
      </Animated.ScrollView>

      {loading && (
        <View style={styles.loader}>
          <View style={[styles.loaderCard, {
            backgroundColor: "#0f172a",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "rgba(148,163,184,0.15)"
          }]}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={{
              color: "#fff",
              marginTop: 12,
              fontSize: 15
            }}>
              Creating event...
            </Text>
          </View>
        </View>
      )}

      <Toast />
    </LinearGradient>
  );
}