import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView
} from "react-native";

import axios from "axios";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";

import Header from "../components/Header";
import styles from "../components/CreateSchoolStyles"; // IMPORTED STYLES
import { loadFonts } from "../components/Fonts"; // IMPORT FONTS
import { useFonts } from "expo-font";

export default function CreateSchool() {

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdSchool, setCreatedSchool] = useState(null);

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  const scaleAnim = new Animated.Value(1);

  // BUTTON ANIMATION
  const pressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true
    }).start();
  }

  const pressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true
    }).start();
  }

  // CREATE SCHOOL
  const createSchool = async () => {
    if (!name.trim()) {
      Toast.show({
        type: "error",
        text1: "School Name Required",
        text2: "Please enter school name"
      });
      return;
    }
    if (!location.trim()) {
      Toast.show({
        type: "error",
        text1: "Location Required",
        text2: "Please enter school location"
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "https://edupulse.pythonanywhere.com/create-school/",
        { name, location }
      );

      setLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Toast.show({
        type: "success",
        text1: "School Created",
        text2: "Your school was registered successfully"
      });

      setCreatedSchool({ name, location });
      setName("");
      setLocation("");

    } catch (error) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to create school"
      });
    }
  }

  if (!fontsLoaded) return null; // wait for fonts to load

  return (
    <LinearGradient
      colors={["#020617", "#0f172a", "#1e293b"]}
      style={styles.container}
    >

      <Header
        title="School Dashboard"
        subtitle="Management System"
      />

      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1588072432836-e10032774350"
        }}
        style={styles.bg}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          <BlurView intensity={40} tint="dark" style={styles.blur}>

            <Text style={[styles.title, { fontFamily: "Poppins-Regular" }]}>Register School</Text>
            <Text style={[styles.subtitle, { fontFamily: "Poppins-Regular" }]}>
              Create your school and start managing students
            </Text>

            <View style={styles.form}>

              <Text style={[styles.label, { fontFamily: "Poppins-SemiBold" }]}>School Name</Text>
              <TextInput
                style={[styles.input, { fontFamily: "Poppins-Regular" }]}
                placeholder="Enter school name"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={setName}
              />

              <Text style={[styles.label, { fontFamily: "Poppins-SemiBold" }]}>School Location</Text>
              <TextInput
                style={[styles.input, { fontFamily: "Poppins-Regular" }]}
                placeholder="Enter school location"
                placeholderTextColor="#94a3b8"
                value={location}
                onChangeText={setLocation}
              />

              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                  onPressIn={pressIn}
                  onPressOut={pressOut}
                  onPress={createSchool}
                >
                  <LinearGradient
                    colors={["#2563eb", "#38bdf8"]}
                    style={styles.button}
                  >
                    <Text style={[styles.buttonText, { fontFamily: "Poppins-Bold" }]}>Create School</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              <TouchableOpacity style={{ marginTop: 20 }} onPress={() => { /* optional navigation */ }}>
                <Text style={[styles.link, { fontFamily: "Poppins-SemiBold" }]}>
                  Already have account? Login
                </Text>
              </TouchableOpacity>

            </View>

            {createdSchool && (
              <View style={styles.createdCard}>
                <Text style={[styles.createdTitle, { fontFamily: "Poppins-Bold" }]}>Created School:</Text>
                <Text style={[styles.createdName, { fontFamily: "Poppins-Regular" }]}>
                  Name: {createdSchool.name}
                </Text>
                <Text style={[styles.createdLocation, { fontFamily: "Poppins-Regular" }]}>
                  Location: {createdSchool.location}
                </Text>
              </View>
            )}

          </BlurView>

        </ScrollView>
      </KeyboardAvoidingView>

      {loading && (
        <View style={styles.loader}>
          <View style={styles.loaderCard}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={[styles.loadingText, { fontFamily: "Poppins-SemiBold" }]}>
              Creating school...
            </Text>
          </View>
        </View>
      )}

      <Toast />

    </LinearGradient>
  )
}