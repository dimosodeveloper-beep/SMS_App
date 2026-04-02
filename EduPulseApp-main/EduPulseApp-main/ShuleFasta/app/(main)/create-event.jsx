import React, { useState, useEffect } from "react";
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
import styles from "../../components/LoginStyles"; // assume you have styles for blur and inputs

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

  const scaleAnim = new Animated.Value(1);

  /* ANIMATION */
  const pressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };
  const pressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

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

  /* LOAD TOKEN */
  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem("userToken");
      setToken(savedToken);
    };
    loadToken();
  }, []);

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

      // clear form
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
    <LinearGradient colors={["#020617", "#0f172a", "#1e293b"]} style={styles.container}>
      <Image
        source={{ uri: "https://images.unsplash.com/photo-1588072432836-e10032774350" }}
        style={styles.bg}
      />

      <Header title="Create Event" subtitle="Event Management System" />

      <ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 500 }}>
        <BlurView intensity={40} tint="dark" style={styles.blur}>
          <Text style={styles.title}>Create Event</Text>

          <View style={styles.form}>
            {/* Title */}
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Event title"
              placeholderTextColor="#94a3b8"
            />

            {/* Description */}
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { minHeight: 80, textAlignVertical: "top" }]}
              value={description}
              onChangeText={setDescription}
              multiline
              placeholder="Event description"
              placeholderTextColor="#94a3b8"
            />

            {/* Start Date */}
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
                minimumDate={new Date()}
                onChange={onChangeStartDate}
              />
            )}

            {/* End Date */}
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
                minimumDate={new Date()}
                onChange={onChangeEndDate}
              />
            )}

            {/* Submit Button */}
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity onPressIn={pressIn} onPressOut={pressOut} onPress={submit}>
                <LinearGradient colors={["#2563eb", "#38bdf8"]} style={styles.button}>
                  <Text style={styles.buttonText}>Save Event</Text>
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
            <Text style={styles.loadingText}>Creating event...</Text>
          </View>
        </View>
      )}

      <Toast />
    </LinearGradient>
  );
}