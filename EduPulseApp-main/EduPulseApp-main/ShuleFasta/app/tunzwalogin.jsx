import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Toast from "react-native-toast-message";

import * as LocalAuthentication from "expo-local-authentication";
import * as Haptics from "expo-haptics";

import { Ionicons } from "@expo/vector-icons";

import styles from "../components/LoginStyles"; // imported styles

export default function Login() {

  const router = useRouter();

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [showPassword,setShowPassword] = useState(false);

  const scaleAnim = new Animated.Value(1);

  // AUTO LOGIN
  useEffect(()=>{
    checkToken();
  },[])

  const checkToken = async()=>{
    const token = await AsyncStorage.getItem("token");
    if(token){
      router.replace("/");
    }
  }

  // BUTTON ANIMATION
  const pressIn = ()=>{
    Animated.spring(scaleAnim,{
      toValue:0.95,
      useNativeDriver:true
    }).start();
  }

  const pressOut = ()=>{
    Animated.spring(scaleAnim,{
      toValue:1,
      useNativeDriver:true
    }).start();
  }

  // LOGIN FUNCTION
  const loginUser = async()=>{
    if(!username || !password){
      Toast.show({
        type:"error",
        text1:"Missing Fields",
        text2:"Please enter username and password"
      });
      return;
    }

    setLoading(true);

    try{
      const response = await axios.post(
        "https://edupulse.pythonanywhere.com/login/",
        { username, password }
      );

      const token = response.data.token;
      await AsyncStorage.setItem("token", token);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setLoading(false);

      Toast.show({
        type:"success",
        text1:"Login Successful",
        text2:"Welcome to EduPulse"
      });

      setTimeout(()=>{
        router.replace("/");
      },1500)

    }catch(error){
      setLoading(false);

      Toast.show({
        type:"error",
        text1:"Login Failed",
        text2:"Invalid username or password"
      });
    }
  }

  // BIOMETRIC LOGIN
  const biometricLogin = async()=>{
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if(!compatible){
      Toast.show({
        type:"error",
        text1:"Biometric Not Supported"
      });
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage:"Login with Biometrics"
    });

    if(result.success){
      const token = await AsyncStorage.getItem("token");
      if(token){
        router.replace("/");
      } else {
        Toast.show({
          type:"info",
          text1:"Please login once first"
        });
      }
    }
  }

  return(
    <LinearGradient
      colors={["#020617","#0f172a","#1e293b"]}
      style={styles.container}
    >

      <Image
        source={{
          uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"
        }}
        style={styles.bg}
      />

      <BlurView intensity={40} tint="dark" style={styles.blur}>

        <Text style={styles.title}>EduPulse</Text>
        <Text style={styles.subtitle}>School Management System</Text>

        <View style={styles.form}>

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordBox}>
            <TextInput
              style={styles.passwordInput}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor="#94a3b8"
            />
            <TouchableOpacity onPress={()=>setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword?"eye-off":"eye"}
                size={22}
                color="#94a3b8"
              />
            </TouchableOpacity>
          </View>

          <Animated.View style={{transform:[{scale:scaleAnim}]}}>
            <TouchableOpacity
              onPressIn={pressIn}
              onPressOut={pressOut}
              onPress={loginUser}
            >
              <LinearGradient
                colors={["#2563eb","#38bdf8"]}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity style={styles.bioButton} onPress={biometricLogin}>
            <Ionicons name="finger-print" size={26} color="#38bdf8" />
            <Text style={styles.bioText}>Login with Fingerprint</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>router.push("/create-school")}>
            <Text style={styles.link}>Register</Text>
          </TouchableOpacity>

        </View>

      </BlurView>

      {loading && (
        <View style={styles.loader}>
          <View style={styles.loaderCard}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Signing you in...</Text>
          </View>
        </View>
      )}

      <Toast/>

    </LinearGradient>
  )
}