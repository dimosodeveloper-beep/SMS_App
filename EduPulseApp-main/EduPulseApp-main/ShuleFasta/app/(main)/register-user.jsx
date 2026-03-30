import React,{useState,useEffect} from "react";
import{
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRouter} from "expo-router";

import {LinearGradient} from "expo-linear-gradient";
import {BlurView} from "expo-blur";

import Toast from "react-native-toast-message";

import * as Haptics from "expo-haptics";

import {Ionicons} from "@expo/vector-icons";

import {Picker} from "@react-native-picker/picker";

import styles from "../../components/LoginStyles";
import Header from "../../components/Header";

import {EndPoint} from "../../components/links";

export default function Register(){

  const router = useRouter();

  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [role,setRole] = useState("teacher");

  const [loading,setLoading] = useState(false);

  const [errors,setErrors] = useState({});

  const scaleAnim = new Animated.Value(1);

  const pressIn=()=>{ Animated.spring(scaleAnim,{ toValue:0.95, useNativeDriver:true }).start(); }
  const pressOut=()=>{ Animated.spring(scaleAnim,{ toValue:1, useNativeDriver:true }).start(); }

  const isValidEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const isCommonPassword = (pass) => {
    const common = ["123456","password","12345678","qwerty","111111"];
    return common.includes(pass.toLowerCase());
  };

  // 🔥 VALIDATION FUNCTION
  const validate = ()=>{
    let err = {};

    if(!username){
      err.username = "Username required";
    }else if(username.length < 3){
      err.username = "Min 3 characters";
    }

    if(!email){
      err.email = "Email required";
    }else if(!isValidEmail(email)){
      err.email = "Invalid email";
    }

    if(!password){
      err.password = "Password required";
    }else if(password.length < 8){
      err.password = "Min 8 characters";
    }else if(isCommonPassword(password)){
      err.password = "Too common password";
    }

    if(!confirmPassword){
      err.confirmPassword = "Confirm password required";
    }else if(password !== confirmPassword){
      err.confirmPassword = "Passwords do not match";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  useEffect(()=>{
    validate();
  },[username,email,password,confirmPassword]);

  const registerUser = async()=>{

    if(!validate()) return;

    setLoading(true);

    try{
      const userToken = await AsyncStorage.getItem("userToken");

      const response = await axios.post(
        EndPoint + "/register/",
        {
          username,
          email,
          password,
          confirm_password: confirmPassword,
          role
        },
        {
          headers:{
            Authorization:userToken ? `Token ${userToken}` : ""
          }
        }
      );

      if(response.status === 200 || response.status === 201){

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        Toast.show({
          type:"success",
          text1:"Success",
          text2:"User created successfully"
        });

        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setRole("teacher");
        setErrors({});
      }

      setLoading(false);

    }catch(error){
      setLoading(false);

      let errorMessage = "Please check your information";

      if(error.response?.data){
        const data = error.response.data;

        errorMessage = Object.entries(data)
          .map(([key,val])=>`${key}: ${Array.isArray(val)? val.join(", "): val}`)
          .join("\n");
      }

      Toast.show({
        type:"error",
        text1:"Registration Failed",
        text2:errorMessage
      });
    }
  };

  const isFormValid = Object.keys(errors).length === 0 &&
    username && email && password && confirmPassword;

  return(
    <LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={{flex:1}}>

      <Image
        source={{ uri:"https://images.unsplash.com/photo-1588072432836-e10032774350" }}
        style={styles.bg}
      />

      <Header title="School Dashboard" subtitle="Management System" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
        style={{flex:1}}
      >

      <ScrollView
        contentContainerStyle={{ padding:20, paddingBottom:50, flexGrow:1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        <BlurView intensity={40} tint="dark" style={styles.blur}>

          <Text style={styles.title}>Shule Fasta</Text>
          <Text style={styles.subtitle}>Create User</Text>

          <View style={styles.form}>

            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor="#94a3b8"
            />
            {errors.username && <Text style={{color:"red"}}>{errors.username}</Text>}

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={{color:"red"}}>{errors.email}</Text>}

            <Text style={styles.label}>Role</Text>
            <View style={{ borderWidth:1, borderColor:"#334155", borderRadius:10, marginBottom:15 }}>
              <Picker
                selectedValue={role}
                onValueChange={(itemValue)=>setRole(itemValue)}
                dropdownIconColor="white"
                style={{color:"white"}}
              >
                <Picker.Item label="Teacher" value="teacher"/>
                <Picker.Item label="Admin" value="admin"/>
                <Picker.Item label="Parent" value="parent"/>
              </Picker>
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordBox}>
              <TextInput
                style={styles.passwordInput}
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor="#94a3b8"
              />
            </View>
            {errors.password && <Text style={{color:"red"}}>{errors.password}</Text>}

            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordBox}>
              <TextInput
                style={styles.passwordInput}
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm password"
                placeholderTextColor="#94a3b8"
              />
            </View>
            {errors.confirmPassword && <Text style={{color:"red"}}>{errors.confirmPassword}</Text>}

            <Animated.View style={{transform:[{scale:scaleAnim}]}}>
              <TouchableOpacity
                disabled={!isFormValid}
                onPressIn={pressIn}
                onPressOut={pressOut}
                onPress={registerUser}
              >
                <LinearGradient 
                  colors={isFormValid ? ["#22c55e","#4ade80"] : ["#334155","#334155"]} 
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Register</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity onPress={()=>router.push("/login")}>
              <Text style={styles.link}>Already have account? Login</Text>
            </TouchableOpacity>

          </View>

        </BlurView>

      </ScrollView>
      </KeyboardAvoidingView>

      {loading &&(
        <View style={styles.loader}>
          <View style={styles.loaderCard}>
            <ActivityIndicator size="large" color="#22c55e"/>
            <Text style={styles.loadingText}>Creating user...</Text>
          </View>
        </View>
      )}

      <Toast/>

    </LinearGradient>
  )
}