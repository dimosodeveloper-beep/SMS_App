import React,{useState} from "react";
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

const[username,setUsername] = useState("");
const[email,setEmail] = useState("");
const[password,setPassword] = useState("");
const[role,setRole] = useState("teacher");

const[loading,setLoading] = useState(false);
const[showPassword,setShowPassword] = useState(false);

const scaleAnim = new Animated.Value(1);



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



const registerUser = async()=>{

if(!username || !email || !password){

Toast.show({
type:"error",
text1:"Missing Fields",
text2:"Please fill all fields"
});

return;
}

setLoading(true);

try{

const token = await AsyncStorage.getItem("token");

const response = await axios.post(

EndPoint + "/register/",

{
username:username,
email:email,
password:password,
role:role
},

{
headers:{
Authorization:`Token ${token}`
}
}

);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

setLoading(false);

Toast.show({
type:"success",
text1:"Registration Successful",
text2:"User created successfully"
});

setTimeout(()=>{
router.replace("/");
},1500);

}catch(error){

setLoading(false);

console.log("REGISTER ERROR:",error.response?.data);

Toast.show({
type:"error",
text1:"Registration Failed",
text2:"Please check your information"
});

}

}



return(

<LinearGradient
colors={["#020617","#0f172a","#1e293b"]}
style={{flex:1}}
>

<Image
source={{
uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"
}}
style={styles.bg}
/>

<Header
title="School Dashboard"
subtitle="Management System"
/>

<ScrollView
contentContainerStyle={{
padding:20,
paddingBottom:150
}}
showsVerticalScrollIndicator={false}
keyboardShouldPersistTaps="handled"
>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>EduPulse</Text>
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



<Text style={styles.label}>Role</Text>

<View
style={{
borderWidth:1,
borderColor:"#334155",
borderRadius:10,
marginBottom:15
}}
>

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
secureTextEntry={!showPassword}
value={password}
onChangeText={setPassword}
placeholder="Enter password"
placeholderTextColor="#94a3b8"
/>

<TouchableOpacity
onPress={()=>setShowPassword(!showPassword)}
>

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
onPress={registerUser}
>

<LinearGradient
colors={["#22c55e","#4ade80"]}
style={styles.button}
>

<Text style={styles.buttonText}>
Register
</Text>

</LinearGradient>

</TouchableOpacity>

</Animated.View>



<TouchableOpacity
onPress={()=>router.push("/login")}
>

<Text style={styles.link}>
Already have account? Login
</Text>

</TouchableOpacity>



</View>

</BlurView>

</ScrollView>



{loading &&(

<View style={styles.loader}>

<View style={styles.loaderCard}>

<ActivityIndicator
size="large"
color="#22c55e"
/>

<Text style={styles.loadingText}>
Creating user...
</Text>

</View>

</View>

)}

<Toast/>

</LinearGradient>

)

}