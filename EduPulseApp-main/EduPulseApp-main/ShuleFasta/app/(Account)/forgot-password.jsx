import React,{useState,useRef,useEffect} from "react";

import{
View,
Text,
TextInput,
TouchableOpacity,
ActivityIndicator,
Animated,
ScrollView,
KeyboardAvoidingView,
TouchableWithoutFeedback,
Keyboard,
Platform
} from "react-native";

import axios from "axios";
import {LinearGradient} from "expo-linear-gradient";
import {BlurView} from "expo-blur";
import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import styles from "../../components/LoginStyles";
import {EndPoint} from "../../components/links";

export default function ForgotPasswordScreen(){

const router = useRouter();

const [email,setEmail] = useState("");
const [loading,setLoading] = useState(false);

const fadeAnim = useRef(new Animated.Value(0)).current;
const slideAnim = useRef(new Animated.Value(40)).current;

useEffect(()=>{

Animated.parallel([
Animated.timing(fadeAnim,{
toValue:1,
duration:700,
useNativeDriver:true
}),
Animated.timing(slideAnim,{
toValue:0,
duration:700,
useNativeDriver:true
})
]).start();

},[]);

/* =========================
SEND OTP (FIXED KEYBOARD ISSUE)
========================= */

const sendOTP = async()=>{

Keyboard.dismiss(); // 🔥 FIX: closes keyboard immediately

if(!email){
Toast.show({type:"error",text1:"Enter email"});
return;
}

setLoading(true);

try{

const res = await axios.post(
EndPoint+"/forgot-password/",
{email}
);

Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

Toast.show({
type:"success",
text1:"OTP Sent",
text2:res.data.message
});

router.push({
pathname:"/(Account)/verify_otp",
params:{email}
});

}catch(error){

Toast.show({
type:"error",
text1:"Error",
text2:JSON.stringify(error.response?.data)
});

}finally{
setLoading(false);
}

};

/* =========================
UI
========================= */

return(

<LinearGradient
colors={["#020617","#0f172a","#1e293b"]}
style={{flex:1}}
>

{/* BACK BUTTON */}
<TouchableOpacity
onPress={()=>router.back()}
style={{
position:"absolute",
top:50,
left:20,
zIndex:10,
backgroundColor:"rgba(255,255,255,0.08)",
padding:10,
borderRadius:14,
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)"
}}
>

<Ionicons name="arrow-back" size={22} color="#38bdf8" />

</TouchableOpacity>

{/* BACKGROUND GLOW */}
<View style={{
position:"absolute",
top:-120,
right:-120,
width:250,
height:250,
borderRadius:200,
backgroundColor:"rgba(56,189,248,0.12)"
}}/>

<View style={{
position:"absolute",
bottom:-120,
left:-120,
width:260,
height:260,
borderRadius:200,
backgroundColor:"rgba(37,99,235,0.10)"
}}/>

{/* KEYBOARD FIX WRAPPER */}
<KeyboardAvoidingView
style={{flex:1}}
behavior={Platform.OS === "ios" ? "padding" : undefined}
>

<TouchableWithoutFeedback onPress={Keyboard.dismiss}>

<ScrollView
keyboardShouldPersistTaps="handled"
contentContainerStyle={{
flexGrow:1,
justifyContent:"center",
alignItems:"center",
padding:20,
paddingBottom:120 // 🔥 FIX: space above keyboard
}}
>

<Animated.View
style={{
width:"100%",
opacity:fadeAnim,
transform:[{translateY:slideAnim}]
}}
>

<BlurView
intensity={70}
tint="dark"
style={{
borderRadius:30,
padding:25,
borderWidth:1,
borderColor:"rgba(56,189,248,0.25)",
backgroundColor:"rgba(15,23,42,0.55)"
}}
>

{/* ICON */}
<View style={{
alignItems:"center",
marginBottom:15
}}>

<View style={{
width:80,
height:80,
borderRadius:20,
backgroundColor:"rgba(56,189,248,0.15)",
justifyContent:"center",
alignItems:"center",
borderWidth:1,
borderColor:"rgba(56,189,248,0.25)"
}}>

<Ionicons name="mail-outline" size={40} color="#38bdf8" />

</View>

</View>

{/* TITLE */}
<Text style={{
textAlign:"center",
fontSize:26,
fontWeight:"bold",
color:"#38bdf8"
}}>
Forgot Password
</Text>

<Text style={{
textAlign:"center",
color:"#94a3b8",
marginTop:10,
fontSize:13,
lineHeight:20
}}>
Enter your email address and we will send you a verification OTP to reset your password securely.
</Text>

{/* INPUT */}
<View style={{marginTop:25}}>

<View style={{
flexDirection:"row",
alignItems:"center",
backgroundColor:"rgba(255,255,255,0.08)",
borderRadius:16,
paddingHorizontal:15,
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)"
}}>

<Ionicons name="mail-outline" size={20} color="#94a3b8" />

<TextInput
value={email}
onChangeText={setEmail}
placeholder="Enter your email"
placeholderTextColor="#94a3b8"
keyboardType="email-address"
autoCapitalize="none"
style={{
flex:1,
paddingVertical:16,
paddingHorizontal:12,
color:"#fff",
fontSize:15
}}
/>

</View>

</View>

{/* BUTTON */}
<TouchableOpacity
onPress={sendOTP}
style={{marginTop:25}}
activeOpacity={0.85}
>

<LinearGradient
colors={["#2563eb","#38bdf8"]}
style={{
paddingVertical:16,
borderRadius:18,
alignItems:"center",
justifyContent:"center",
flexDirection:"row"
}}
>

{loading ? (
<>
<ActivityIndicator color="#fff" />
<Text style={{color:"#fff",marginLeft:10}}>
Sending OTP...
</Text>
</>
) : (
<>
<Ionicons name="send-outline" size={18} color="#fff" />
<Text style={{
color:"#fff",
fontWeight:"700",
marginLeft:8
}}>
Send OTP
</Text>
</>
)}

</LinearGradient>

</TouchableOpacity>

{/* INFO */}
<View style={{
marginTop:20,
alignItems:"center"
}}>

<Text style={{
color:"#64748b",
fontSize:12,
textAlign:"center"
}}>
Make sure you enter a valid email linked to your account.
</Text>

</View>

</BlurView>

</Animated.View>

</ScrollView>

</TouchableWithoutFeedback>

</KeyboardAvoidingView>

<Toast />

</LinearGradient>

);

}