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

import styles from "../components/LoginStyles"; // imported styles
import { EndPoint } from "../components/links";

export default function Login() {

  const router = useRouter();

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [showPassword,setShowPassword] = useState(false);

  const scaleAnim = new Animated.Value(1);

   const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

 const showAlertFunction = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const hideAlert = () => {
    setShowAlert(false);
  };


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




//showAlert

  
 
  const [error, setError] = useState('');
  //TO MAKE A LOADING MESSAGE ON A BUTTON
  const [isPending, setPending] = useState(false);
    const [secureText, setSecureText] = useState(true);
   
    const fadeAnim = useState(new Animated.Value(1))[0];

  //const navigation = useNavigation();

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const checkLoggedIn = async () => {
    const token = await AsyncStorage.getItem('userToken');


    if (token) {
      try {
        const userResponse = await axios.get(
          EndPoint + '/Account/user_data/',
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const userData = userResponse.data;
       

      } catch (error) {
        
      }
    }
  };




// const [error, setError] = useState(null);
const [errorMessage, setErrorMessage] = useState('');
const emailRegex = /\S+@\S+\.\S+/;

const handleErrorMessage = (error) => {
    if (error.response) {
     
    }  if (error.message === 'Network Error') {
      setLoading(false);
      setPending(false);
      Toast.show({
              type:"error",
              text1:"Missing Fields",
              text2:"Network error"
            });
    } else {
      setLoading(false);
      setPending(false);
      Toast.show({
              type:"error",
              text1:"Missing Fields",
              text2:"An error occurred, please try again."
            });
      
    }
  };

  const loginUser = async () => {
   
    

    if (!username && !password) {
      //setError('Please fill in all fields correctly');
      
       Toast.show({
        type:"error",
        text1:"Missing Fields",
        text2:"Please fill in all the information accurately"
      });
       setLoading(false);
      return;
    }

    if (!username) {
     // setError('Please enter your registration username correctly');
      
      Toast.show({
        type:"error",
        text1:"Missing Fields",
        text2:"Please fill in your username accurately"
      });
      setLoading(false);
      return;
    }

 

    if (!password) {
      //setError('Please enter your registration password correctly');
      
       Toast.show({
        type:"error",
        text1:"Missing Fields",
        text2:"Please fill in your password accurately"
      });
      setLoading(false);
      return;
    }
    setPending(true);
     setLoading(true);

    try {
      const response = await axios.post(EndPoint + '/Account/login_user/', {
        username: username,
        password: password,
      });

      const token = response.data.token;
      await AsyncStorage.setItem('userToken', token);
      //navigation.emit('updateUserToken', token);

      console.log("ENDPOINT", EndPoint);

      // Now, make another request to get user data
      const userResponse = await axios.get(EndPoint + '/Account/user_data/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const userData = userResponse.data;
      // Save user data to AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      // Emit the 'updateUserToken' event
      // hii inasaidia kupata a login user token automatically without
      // page refreshing
      EventRegister.emit('updateUserToken', token);

        // Confirm AsyncStorage writes are complete before navigating
    await Promise.all([
      AsyncStorage.getItem('userToken'),
      AsyncStorage.getItem('userData'),
    ]);
   

   console.log("Token Saved:", token);
console.log("UserData Saved:", userData);


       Toast.show({
               type:"success",
               text1:"Login Successful",
               text2:"Welcome to EduPulse"
             });
      router.replace("/(main)/home");

      setLoading(false);
      setPending(false);


    } catch (error) {
      
      
      Toast.show({
      type:"error",
      text1:"Login Failed",
      text2:"Invalid username or password"
    });
      setPending(false);
      console.log("Error", error);
       setLoading(false);
    }
  };



  
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

        <Text style={styles.title}>SHULE FASTA</Text>
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