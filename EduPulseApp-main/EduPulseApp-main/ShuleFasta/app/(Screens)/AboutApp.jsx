import React,{useState,useEffect} from "react";
import{
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

import {LinearGradient} from "expo-linear-gradient";
import {BlurView} from "expo-blur";

import Toast from "react-native-toast-message";

import * as Haptics from "expo-haptics";

import styles from "../../components/LoginStyles";
import {EndPoint} from "../../components/links";
import Header from "../../components/Header";

import {useRouter} from "expo-router";

export default function AboutApp(){

  const router = useRouter();

  const [loading,setLoading] = useState(false);
  const [token,setToken] = useState(null);

  const scaleAnim = new Animated.Value(1);

  // Animation
  const pressIn=()=>{
    Animated.spring(scaleAnim,{
      toValue:0.95,
      useNativeDriver:true
    }).start();
  }

  const pressOut=()=>{
    Animated.spring(scaleAnim,{
      toValue:1,
      useNativeDriver:true
    }).start();
  }

  // Load token (for consistency with other pages)
  useEffect(()=>{
    const loadToken = async()=>{
      const savedToken = await AsyncStorage.getItem("userToken");
      setToken(savedToken);
    };
    loadToken();
  },[]);

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

      <Header
        title="ShuleFasta"
        subtitle="About Application"
      />

      <ScrollView
        contentContainerStyle={{
          padding:10,
          paddingBottom:300
        }}
        showsVerticalScrollIndicator={false}
      >

      <BlurView intensity={40} tint="dark" style={styles.blur}>

        <Text style={styles.title}>
          About ShuleFasta
        </Text>

        <Text style={styles.subtitle}>
          Modern School Management System
        </Text>

        <View style={{marginTop:20}}>

          {/* INTRO */}
          <Animated.View style={{transform:[{scale:scaleAnim}],marginBottom:15}}>
            <TouchableOpacity onPressIn={pressIn} onPressOut={pressOut} activeOpacity={0.9}>
              <LinearGradient colors={["#1e293b","#0f172a"]} style={{padding:18,borderRadius:14,borderWidth:1,borderColor:"#334155"}}>
                <Text style={{color:"#fff",fontSize:16,fontWeight:"bold"}}>
                  📌 Introduction
                </Text>
                <Text style={{color:"#94a3b8",marginTop:8}}>
                  ShuleFasta is a modern digital platform designed to simplify and automate school operations.
                  It helps schools manage students, teachers, exams, attendance, and fees efficiently.
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* FEATURES */}
          <Animated.View style={{transform:[{scale:scaleAnim}],marginBottom:15}}>
            <TouchableOpacity onPressIn={pressIn} onPressOut={pressOut}>
              <LinearGradient colors={["#1e293b","#0f172a"]} style={{padding:18,borderRadius:14}}>
                <Text style={{color:"#fff",fontSize:16,fontWeight:"bold"}}>
                  ⚙️ Key Features
                </Text>

                <Text style={{color:"#94a3b8",marginTop:8}}>
• Student Management {"\n"}
• Teacher Management {"\n"}
• Exams & Results System {"\n"}
• Ranking & Report Cards {"\n"}
• Attendance Tracking {"\n"}
• Parent Portal {"\n"}
• Fee Management {"\n"}
• Timetable System {"\n"}
• SMS Notifications {"\n"}
• Multi-School Support
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* HOW IT WORKS */}
          <Animated.View style={{transform:[{scale:scaleAnim}],marginBottom:15}}>
            <TouchableOpacity onPressIn={pressIn} onPressOut={pressOut}>
              <LinearGradient colors={["#1e293b","#0f172a"]} style={{padding:18,borderRadius:14}}>
                <Text style={{color:"#fff",fontSize:16,fontWeight:"bold"}}>
                  🚀 How It Works
                </Text>

                <Text style={{color:"#94a3b8",marginTop:8}}>
1. Register school and users {"\n"}
2. Create classes and streams {"\n"}
3. Add students and teachers {"\n"}
4. Create subjects and exams {"\n"}
5. Enter student results {"\n"}
6. System calculates averages & ranking {"\n"}
7. Generate report cards automatically {"\n"}
8. Track attendance & fees in real-time
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* SYSTEM BENEFITS */}
          <Animated.View style={{transform:[{scale:scaleAnim}],marginBottom:15}}>
            <TouchableOpacity onPressIn={pressIn} onPressOut={pressOut}>
              <LinearGradient colors={["#1e293b","#0f172a"]} style={{padding:18,borderRadius:14}}>
                <Text style={{color:"#fff",fontSize:16,fontWeight:"bold"}}>
                  📊 Benefits
                </Text>

                <Text style={{color:"#94a3b8",marginTop:8}}>
• Reduces paperwork {"\n"}
• Improves data accuracy {"\n"}
• Real-time reporting {"\n"}
• Easy access for parents and teachers {"\n"}
• Secure and scalable system
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

        

          {/* CONCLUSION */}
          <Animated.View style={{transform:[{scale:scaleAnim}],marginBottom:15}}>
            <TouchableOpacity onPressIn={pressIn} onPressOut={pressOut}>
              <LinearGradient colors={["#1e293b","#0f172a"]} style={{padding:18,borderRadius:14}}>
                <Text style={{color:"#fff",fontSize:16,fontWeight:"bold"}}>
                  ✅ Conclusion
                </Text>

                <Text style={{color:"#94a3b8",marginTop:8}}>
ShuleFasta is a powerful all-in-one school ERP system that enhances efficiency,
transparency, and performance in educational institutions.
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

        </View>

      </BlurView>

      </ScrollView>

      {loading &&(
        <View style={styles.loader}>
          <View style={styles.loaderCard}>
            <ActivityIndicator size="large" color="#2563eb"/>
            <Text style={styles.loadingText}>
              Loading...
            </Text>
          </View>
        </View>
      )}

      <Toast/>

    </LinearGradient>
  )
}