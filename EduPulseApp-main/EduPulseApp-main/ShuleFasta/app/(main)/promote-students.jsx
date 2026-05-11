import React,{useState,useEffect,useContext} from "react";

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

import {Ionicons} from "@expo/vector-icons";

export default function PromoteStudents(){

const { t } = useContext(LanguageContext);

const[currentYear,setCurrentYear] = useState("");

const[loading,setLoading] = useState(false);
const[token,setToken] = useState(null);

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
PROMOTE STUDENTS
========================= */

const promoteStudents = async()=>{

if(!currentYear){

Toast.show({
type:"error",
text1:"Missing field",
text2:"Enter current year"
});

return;
}

if(!token){

Toast.show({
type:"error",
text1:"Authentication error",
text2:"Please login again"
});

return;
}

setLoading(true);

try{

const response = await axios.post(

EndPoint + "/promote-students/",

{
current_year:currentYear
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
text1:"Students promoted successfully",
text2:`${response.data.promoted_count} students promoted`
});

setCurrentYear("");

}catch(error){

setLoading(false);

console.log("FULL ERROR => ",error.response?.data);

Toast.show({
type:"error",
text1:"Error",
text2:JSON.stringify(error.response?.data)
});

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

<Header
title="School Dashboard"
subtitle="Student Promotion"
/>

<ScrollView
contentContainerStyle={{
padding:10,
paddingBottom:500
}}
showsVerticalScrollIndicator={false}
keyboardShouldPersistTaps="handled"
>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>
Promote Students
</Text>

<Text style={styles.subtitle}>
Move students to next class
</Text>

<View style={styles.form}>

<Text style={styles.label}>
Current Academic Year
</Text>

<TextInput
style={styles.input}
value={currentYear}
onChangeText={setCurrentYear}
placeholder="Example: 2025"
placeholderTextColor="#94a3b8"
keyboardType="numeric"
/>

<View style={{
backgroundColor:"#0f172a",
padding:15,
borderRadius:12,
marginBottom:20,
borderWidth:1,
borderColor:"#334155"
}}>

<Text style={{
color:"#facc15",
fontWeight:"bold",
marginBottom:5
}}>
⚠️ Important
</Text>

<Text style={{
color:"#cbd5e1",
lineHeight:22
}}>
This process will promote all students from the selected academic year to the next class automatically.
</Text>

</View>

<Animated.View style={{transform:[{scale:scaleAnim}]}}>

<TouchableOpacity
onPressIn={pressIn}
onPressOut={pressOut}
onPress={promoteStudents}
>

<LinearGradient
colors={["#2563eb","#38bdf8"]}
style={styles.button}
>

<Ionicons
name="arrow-up-circle"
size={22}
color="#fff"
style={{marginRight:10}}
/>

<Text style={styles.buttonText}>
Promote Students
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

<ActivityIndicator
size="large"
color="#2563eb"
/>

<Text style={styles.loadingText}>
Promoting students...
</Text>

</View>

</View>

)}

<Toast/>

</LinearGradient>

)

}