import React,{useState,useEffect,useContext,useRef} from "react";

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
import { LanguageContext } from "../../components/LanguageContext";

import {
Ionicons,
MaterialCommunityIcons
} from "@expo/vector-icons";

export default function CreateAcademicYear(){

const { t } = useContext(LanguageContext);

const[year,setYear] = useState("");

const[loading,setLoading] = useState(false);
const[token,setToken] = useState(null);

const fadeAnim = useRef(new Animated.Value(0)).current;
const slideAnim = useRef(new Animated.Value(40)).current;
const scaleAnim = useRef(new Animated.Value(1)).current;

/* SCREEN ANIMATION */
useEffect(()=>{

Animated.parallel([

Animated.timing(fadeAnim,{
toValue:1,
duration:900,
useNativeDriver:true
}),

Animated.timing(slideAnim,{
toValue:0,
duration:900,
useNativeDriver:true
})

]).start();

},[]);

const pressIn=()=>{

Animated.spring(scaleAnim,{
toValue:0.96,
useNativeDriver:true
}).start();

Haptics.impactAsync(
Haptics.ImpactFeedbackStyle.Light
);

}

const pressOut=()=>{

Animated.spring(scaleAnim,{
toValue:1,
friction:4,
useNativeDriver:true
}).start();

}


/* =========================
LOAD TOKEN
========================= */

useEffect(()=>{

const loadToken = async()=>{

const savedToken = await AsyncStorage.getItem("userToken");

setToken(savedToken);

};

loadToken();

},[]);


/* =========================
CREATE YEAR
========================= */

const createYear = async()=>{

if(!year){

Toast.show({
type:"error",
text1:t("missing_field"),
text2:"Please enter academic year"
});

return;
}

if(!token){

Toast.show({
type:"error",
text1:t("auth_error"),
text2:t("login_again")
});

return;
}

setLoading(true);

try{

console.log("TOKEN => ",token);

const response = await axios.post(

EndPoint + "/create-academic-year/",

{
year:year
},

{
headers:{
Authorization:`Token ${token}`,
"Content-Type":"application/json"
}
}

);

console.log("SUCCESS => ",response.data);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

setLoading(false);

Toast.show({
type:"success",
text1:"Academic Year Created",
text2:"Academic year created successfully"
});

setYear("");

}catch(error){

setLoading(false);

console.log("FULL ERROR => ",error.response?.data);

Toast.show({
type:"error",
text1:t("error"),
text2:JSON.stringify(error.response?.data)
});

}

}

return(

<LinearGradient
colors={["#020617","#0f172a","#111827","#1e293b"]}
style={styles.container}
>

<Image
source={{
uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"
}}
style={[
styles.bg,
{
opacity:0.18
}
]}
/>

<View style={{
position:"absolute",
top:-120,
right:-100,
width:260,
height:260,
borderRadius:200,
backgroundColor:"rgba(59,130,246,0.18)"
}}/>

<View style={{
position:"absolute",
bottom:-140,
left:-100,
width:260,
height:260,
borderRadius:200,
backgroundColor:"rgba(14,165,233,0.12)"
}}/>

<Header
title={t("school_dashboard")}
subtitle={t("management_system")}
/>

<Animated.ScrollView
contentContainerStyle={{
padding:14,
paddingBottom:500
}}
showsVerticalScrollIndicator={false}
keyboardShouldPersistTaps="handled"
style={{
opacity:fadeAnim,
transform:[
{
translateY:slideAnim
}
]
}}
>

<BlurView
intensity={60}
tint="dark"
style={[
styles.blur,
{
overflow:"hidden",
borderRadius:28,
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)",
backgroundColor:"rgba(15,23,42,0.72)",
padding:20
}
]}
>

{/* TOP ICON */}
<View style={{
alignItems:"center",
marginBottom:25
}}>

<View style={{
width:80,
height:80,
borderRadius:25,
justifyContent:"center",
alignItems:"center",
backgroundColor:"rgba(37,99,235,0.15)",
borderWidth:1,
borderColor:"rgba(96,165,250,0.3)",
marginBottom:18
}}>

<LinearGradient
colors={["#2563eb","#38bdf8"]}
style={{
width:62,
height:62,
borderRadius:20,
justifyContent:"center",
alignItems:"center"
}}
>

<Ionicons
name="calendar"
size={30}
color="#fff"
/>

</LinearGradient>

</View>

<Text style={{
color:"#ffffff",
fontSize:30,
fontWeight:"bold",
textAlign:"center",
letterSpacing:0.5
}}>
Create Academic Year
</Text>

<Text style={{
color:"#94a3b8",
textAlign:"center",
marginTop:10,
fontSize:15,
lineHeight:22
}}>
Create and manage new academic years for your school system
</Text>

</View>

{/* FORM */}
<View style={styles.form}>

<Text style={{
color:"#e2e8f0",
fontSize:15,
fontWeight:"600",
marginBottom:10,
marginLeft:4
}}>
Academic Year
</Text>

<View style={{
flexDirection:"row",
alignItems:"center",
backgroundColor:"rgba(15,23,42,0.92)",
borderWidth:1,
borderColor:"rgba(148,163,184,0.15)",
borderRadius:18,
paddingHorizontal:15,
height:60,
marginBottom:25
}}>

<Ionicons
name="calendar-outline"
size={22}
color="#64748b"
/>

<TextInput
style={{
flex:1,
color:"#fff",
fontSize:16,
marginLeft:12
}}
value={year}
onChangeText={setYear}
placeholder="Example 2026"
placeholderTextColor="#64748b"
keyboardType="numeric"
/>

{year !== "" &&(

<TouchableOpacity
onPress={()=>setYear("")}
>

<Ionicons
name="close-circle"
size={22}
color="#64748b"
/>

</TouchableOpacity>

)}

</View>

{/* INFO CARD */}
<View style={{
backgroundColor:"rgba(30,41,59,0.7)",
borderRadius:20,
padding:16,
borderWidth:1,
borderColor:"rgba(148,163,184,0.1)",
marginBottom:25
}}>

<View style={{
flexDirection:"row",
alignItems:"center"
}}>

<View style={{
width:42,
height:42,
borderRadius:14,
justifyContent:"center",
alignItems:"center",
backgroundColor:"rgba(34,197,94,0.15)"
}}>

<MaterialCommunityIcons
name="school-outline"
size={22}
color="#22c55e"
/>

</View>

<View style={{
marginLeft:12,
flex:1
}}>

<Text style={{
color:"#ffffff",
fontWeight:"bold",
fontSize:15
}}>
Academic Session
</Text>

<Text style={{
color:"#94a3b8",
marginTop:4,
fontSize:13,
lineHeight:20
}}>
Use unique academic years like 2025 or 2026 for proper school records management.
</Text>

</View>

</View>

</View>

{/* BUTTON */}
<Animated.View style={{transform:[{scale:scaleAnim}]}}>

<TouchableOpacity
onPressIn={pressIn}
onPressOut={pressOut}
onPress={createYear}
activeOpacity={0.9}
>

<LinearGradient
colors={["#2563eb","#38bdf8","#0ea5e9"]}
start={{x:0,y:0}}
end={{x:1,y:1}}
style={{
height:60,
borderRadius:20,
justifyContent:"center",
alignItems:"center",
flexDirection:"row",
shadowColor:"#2563eb",
shadowOpacity:0.35,
shadowRadius:12,
elevation:8
}}
>

<Ionicons
name="add-circle-outline"
size={24}
color="#fff"
/>

<Text style={{
color:"#ffffff",
fontWeight:"bold",
fontSize:17,
marginLeft:10,
letterSpacing:0.3
}}>
Create Academic Year
</Text>

</LinearGradient>

</TouchableOpacity>

</Animated.View>

</View>

</BlurView>


</Animated.ScrollView>

{loading &&(

<View style={styles.loader}>

<View style={[
styles.loaderCard,
{
backgroundColor:"#0f172a",
borderWidth:1,
borderColor:"rgba(148,163,184,0.15)",
borderRadius:24
}
]}>

<ActivityIndicator
size="large"
color="#3b82f6"
/>

<Text style={{
color:"#ffffff",
marginTop:15,
fontSize:16,
fontWeight:"600"
}}>
Creating academic year...
</Text>

<Text style={{
color:"#94a3b8",
marginTop:5,
fontSize:13
}}>
Please wait a moment
</Text>

</View>

</View>

)}

<Toast/>

</LinearGradient>

)

}