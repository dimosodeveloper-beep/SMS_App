import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  ActivityIndicator
} from "react-native";
import { EventRegister } from 'react-native-event-listeners';

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Toast from "react-native-toast-message";

import * as LocalAuthentication from "expo-local-authentication";
import * as Haptics from "expo-haptics";

import { Ionicons } from "@expo/vector-icons";

import styles from "../components/LoginStyles";
import { EndPoint } from "../components/links";

export default function Login() {

  const router = useRouter();

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [showPassword,setShowPassword] = useState(false);
  const [remember,setRemember] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(()=>{
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim,{toValue:1,duration:3000,useNativeDriver:true}),
        Animated.timing(floatAnim,{toValue:0,duration:3000,useNativeDriver:true})
      ])
    ).start();

    Animated.timing(fadeAnim,{
      toValue:1,
      duration:1000,
      useNativeDriver:true
    }).start();

    checkLoggedIn();
  },[]);

  const floatInterpolate = floatAnim.interpolate({
    inputRange:[0,1],
    outputRange:[0,-10]
  });

  const shake = ()=>{
    Animated.sequence([
      Animated.timing(shakeAnim,{toValue:10,duration:50,useNativeDriver:true}),
      Animated.timing(shakeAnim,{toValue:-10,duration:50,useNativeDriver:true}),
      Animated.timing(shakeAnim,{toValue:6,duration:50,useNativeDriver:true}),
      Animated.timing(shakeAnim,{toValue:0,duration:50,useNativeDriver:true})
    ]).start();
  }

  const pressIn = ()=>{
    Animated.spring(scaleAnim,{toValue:0.95,useNativeDriver:true}).start();
  }

  const pressOut = ()=>{
    Animated.spring(scaleAnim,{toValue:1,useNativeDriver:true}).start();
  }

  const checkLoggedIn = async () => {
    const token = await AsyncStorage.getItem('userToken');
  };

  const loginUser = async () => {

    if (!username || !password) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shake();
      Toast.show({
        type:"error",
        text1:"Missing Fields",
        text2:"Fill all fields"
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(EndPoint + '/Account/login_user/', {
        username: username,
        password: password,
      });

      const token = response.data.token;
      await AsyncStorage.setItem('userToken', token);

      if(remember){
        await AsyncStorage.setItem("rememberUser", username);
      }

      const userResponse = await axios.get(EndPoint + '/Account/user_data/', {
        headers: { Authorization: `Token ${token}` },
      });

      await AsyncStorage.setItem('userData', JSON.stringify(userResponse.data));

      EventRegister.emit('updateUserToken', token);

      Toast.show({
        type:"success",
        text1:"Login Successful"
      });

      router.replace("/(main)/home");

      setLoading(false);

    } catch (error) {
      shake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      Toast.show({
        type:"error",
        text1:"Login Failed",
        text2:"Invalid credentials"
      });

      setLoading(false);
    }
  };

  const biometricLogin = async()=>{
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if(!compatible){
      Toast.show({ type:"error", text1:"Not Supported" });
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage:"Login with Biometrics"
    });

    if(result.success){
      router.replace("/(main)/home");
    }
  }

  return(
    <LinearGradient
      colors={["#020617","#0f172a","#1e3a8a"]}
      style={{flex:1,justifyContent:"center"}}
    >

      <Image
        source={{
          uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"
        }}
        style={{position:"absolute",width:"100%",height:"100%"}}
        blurRadius={3}
      />

      <View style={{
        position:"absolute",
        width:"100%",
        height:"100%",
        backgroundColor:"rgba(0,0,0,0.65)"
      }}/>

      <Animated.View style={{
        margin:20,
        transform:[{translateY:floatInterpolate},{translateX:shakeAnim}],
        opacity:fadeAnim
      }}>

        <BlurView intensity={60} tint="dark" style={{
          borderRadius:25,
          padding:25,
          backgroundColor:"rgba(255,255,255,0.05)"
        }}>

          <Text style={{
            fontSize:30,
            color:"#fff",
            textAlign:"center",
            fontWeight:"bold"
          }}>SHULE FASTA</Text>

          <Text style={{
            textAlign:"center",
            color:"#cbd5f5",
            marginBottom:20
          }}>Smart School System</Text>

          <TextInput
            style={{
              backgroundColor:"rgba(255,255,255,0.08)",
              padding:15,
              borderRadius:12,
              color:"#fff",
              marginBottom:15
            }}
            placeholder="Username"
            placeholderTextColor="#94a3b8"
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            style={{
              backgroundColor:"rgba(255,255,255,0.08)",
              padding:15,
              borderRadius:12,
              color:"#fff"
            }}
            secureTextEntry={!showPassword}
            placeholder="Password"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity onPress={()=>setShowPassword(!showPassword)}>
            <Text style={{color:"#38bdf8",marginTop:5}}>
              {showPassword?"Hide Password":"Show Password"}
            </Text>
          </TouchableOpacity>

          <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:15}}>
            <TouchableOpacity onPress={()=>setRemember(!remember)}>
              <Text style={{color:"#fff"}}>
                {remember?"☑":"☐"} Remember Me
              </Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={{color:"#38bdf8"}}>Forgot?</Text>
            </TouchableOpacity>
          </View>

          <Animated.View style={{transform:[{scale:scaleAnim}],marginTop:20}}>
            <TouchableOpacity
              onPressIn={pressIn}
              onPressOut={pressOut}
              onPress={()=>{
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                loginUser();
              }}
            >
              <LinearGradient
                colors={["#2563eb","#38bdf8"]}
                style={{
                  padding:15,
                  borderRadius:15,
                  alignItems:"center"
                }}
              >
                <Text style={{color:"#fff",fontWeight:"bold"}}>
                  Login
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity onPress={biometricLogin} style={{marginTop:20,alignItems:"center"}}>
            <Ionicons name="finger-print" size={28} color="#38bdf8"/>
          </TouchableOpacity>

        </BlurView>
      </Animated.View>

      {loading && (
        <View style={{
          position:"absolute",
          width:"100%",
          height:"100%",
          justifyContent:"center",
          alignItems:"center",
          backgroundColor:"rgba(0,0,0,0.6)"
        }}>
          <View style={{
            backgroundColor:"#fff",
            padding:25,
            borderRadius:20,
            alignItems:"center"
          }}>
            <ActivityIndicator size="large" color="#2563eb"/>
            <Text style={{
              marginTop:10,
              fontWeight:"600"
            }}>
              Signing you in...
            </Text>
          </View>
        </View>
      )}

      <Toast/>

    </LinearGradient>
  )
}