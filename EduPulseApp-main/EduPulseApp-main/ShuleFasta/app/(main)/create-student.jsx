import React,{useState,useEffect,useRef} from "react";

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

  const scaleAnim = useRef(new Animated.Value(1)).current;

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
        style={[styles.bg,{opacity:0.18}]}
      />

      <View style={{
        position:"absolute",
        top:120,
        right:-40,
        width:180,
        height:180,
        borderRadius:100,
        backgroundColor:"rgba(56,189,248,0.08)"
      }}/>

      <View style={{
        position:"absolute",
        bottom:120,
        left:-50,
        width:220,
        height:220,
        borderRadius:120,
        backgroundColor:"rgba(37,99,235,0.08)"
      }}/>

      <Header title="School Dashboard" subtitle="Management System" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
        style={{flex:1}}
      >

      <ScrollView
        contentContainerStyle={{ padding:14, paddingBottom:500 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        <BlurView
          intensity={45}
          tint="dark"
          style={{
            backgroundColor:"rgba(15,23,42,0.72)",
            borderRadius:28,
            padding:20,
            borderWidth:1,
            borderColor:"rgba(148,163,184,0.15)",
            overflow:"hidden"
          }}
        >

          <LinearGradient
            colors={[
              "rgba(255,255,255,0.08)",
              "rgba(255,255,255,0.02)"
            ]}
            start={{x:0,y:0}}
            end={{x:1,y:1}}
            style={{
              position:"absolute",
              top:0,
              left:0,
              right:0,
              height:120,
              borderTopLeftRadius:28,
              borderTopRightRadius:28
            }}
          />

          <View style={{
            flexDirection:"row",
            alignItems:"center",
            justifyContent:"space-between",
            marginBottom:25
          }}>

            <View style={{flex:1}}>

              <Text style={{
                color:"#ffffff",
                fontSize:28,
                fontWeight:"bold",
                letterSpacing:0.5
              }}>
                Create User
              </Text>

              <Text style={{
                color:"#94a3b8",
                fontSize:14,
                marginTop:6,
                lineHeight:22
              }}>
                Register new system users easily
              </Text>

            </View>

            <View style={{
              width:62,
              height:62,
              borderRadius:20,
              backgroundColor:"rgba(37,99,235,0.18)",
              justifyContent:"center",
              alignItems:"center",
              borderWidth:1,
              borderColor:"rgba(59,130,246,0.25)"
            }}>
              <Ionicons name="person-add-outline" size={28} color="#38bdf8"/>
            </View>

          </View>

          {/* FORM */}
          <View style={{backgroundColor:"rgba(2,6,23,0.45)",padding:18,borderRadius:24,borderWidth:1,borderColor:"rgba(148,163,184,0.1)"}}>

            {/* USERNAME */}
            <Text style={{color:"#e2e8f0",fontWeight:"700",marginBottom:8,fontSize:14}}>Username</Text>
            <TextInput
              style={{backgroundColor:"#0f172a",borderRadius:16,borderWidth:1,borderColor:"#334155",padding:14,color:"#fff",marginBottom:8}}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor="#94a3b8"
            />
            {errors.username && <Text style={{color:"red",marginBottom:10}}>{errors.username}</Text>}

            {/* EMAIL */}
            <Text style={{color:"#e2e8f0",fontWeight:"700",marginBottom:8,fontSize:14}}>Email</Text>
            <TextInput
              style={{backgroundColor:"#0f172a",borderRadius:16,borderWidth:1,borderColor:"#334155",padding:14,color:"#fff",marginBottom:8}}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              placeholderTextColor="#94a3b8"
            />
            {errors.email && <Text style={{color:"red",marginBottom:10}}>{errors.email}</Text>}

            {/* ROLE */}
            <Text style={{color:"#e2e8f0",fontWeight:"700",marginBottom:8,fontSize:14}}>Role</Text>
            <View style={{borderWidth:1,borderColor:"#334155",borderRadius:16,marginBottom:18,overflow:"hidden"}}>
              <Picker
                selectedValue={role}
                onValueChange={(itemValue)=>setRole(itemValue)}
                dropdownIconColor="#38bdf8"
                style={{color:"#fff",backgroundColor:"#0f172a"}}
              >
                <Picker.Item label="Teacher" value="teacher"/>
                <Picker.Item label="Admin" value="admin"/>
                <Picker.Item label="Parent" value="parent"/>
              </Picker>
            </View>

            {/* PASSWORD */}
            <Text style={{color:"#e2e8f0",fontWeight:"700",marginBottom:8,fontSize:14}}>Password</Text>
            <TextInput
              style={{backgroundColor:"#0f172a",borderRadius:16,borderWidth:1,borderColor:"#334155",padding:14,color:"#fff",marginBottom:8}}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Enter password"
              placeholderTextColor="#94a3b8"
            />
            {errors.password && <Text style={{color:"red",marginBottom:10}}>{errors.password}</Text>}

            {/* CONFIRM PASSWORD */}
            <Text style={{color:"#e2e8f0",fontWeight:"700",marginBottom:8,fontSize:14}}>Confirm Password</Text>
            <TextInput
              style={{backgroundColor:"#0f172a",borderRadius:16,borderWidth:1,borderColor:"#334155",padding:14,color:"#fff",marginBottom:8}}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Confirm password"
              placeholderTextColor="#94a3b8"
            />
            {errors.confirmPassword && <Text style={{color:"red",marginBottom:10}}>{errors.confirmPassword}</Text>}

            {/* BUTTON */}
            <Animated.View style={{transform:[{scale:scaleAnim}],marginTop:20}}>
              <TouchableOpacity
                disabled={!isFormValid}
                onPressIn={pressIn}
                onPressOut={pressOut}
                onPress={registerUser}
              >
                <LinearGradient
                  colors={isFormValid ? ["#2563eb","#38bdf8","#0ea5e9"] : ["#334155","#334155","#334155"]}
                  start={{x:0,y:0}}
                  end={{x:1,y:1}}
                  style={{
                    paddingVertical:17,
                    borderRadius:18,
                    justifyContent:"center",
                    alignItems:"center",
                    shadowColor:"#38bdf8",
                    shadowOpacity:0.35,
                    shadowRadius:12,
                    elevation:10
                  }}
                >
                  <Text style={{color:"#fff",fontWeight:"bold",fontSize:16}}>
                    Register
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity onPress={()=>router.push("/login")} style={{marginTop:15}}>
              <Text style={{color:"#94a3b8",textAlign:"center"}}>
                Already have account? Login
              </Text>
            </TouchableOpacity>

          </View>

        </BlurView>

      </ScrollView>
      </KeyboardAvoidingView>

      {loading &&(
        <View style={styles.loader}>
          <View style={[styles.loaderCard,{backgroundColor:"#0f172a",borderWidth:1,borderColor:"#334155"}]}>
            <ActivityIndicator size="large" color="#38bdf8"/>
            <Text style={{marginTop:12,color:"#fff"}}>Creating user...</Text>
          </View>
        </View>
      )}

      <Toast/>

    </LinearGradient>
  )
}