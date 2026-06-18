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

export default function CreateExamCategory(){

const { language } = useContext(LanguageContext);

const[name,setName] = useState("");

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

/* LOAD TOKEN */
useEffect(()=>{

const loadToken = async()=>{

const savedToken = await AsyncStorage.getItem("userToken");

setToken(savedToken);

};

loadToken();

},[]);


/* CREATE EXAM CATEGORY */
const createCategory = async()=>{

if(!name){

Toast.show({
type:"error",
text1:
language === "sw"
? "Kuna sehemu haijajazwa"
: "Missing Field",
text2:
language === "sw"
? "Weka jina la category"
: "Enter category name"
});

return;
}

if(!token){

Toast.show({
type:"error",
text1:
language === "sw"
? "Hitilafu ya uthibitisho"
: "Authentication Error",
text2:
language === "sw"
? "Ingia tena"
: "Login again"
});

return;
}

setLoading(true);

try{

const response = await axios.post(

EndPoint + "/create-exam-category/",

{
name:name
},

{
headers:{
Authorization:`Token ${token}`,
"Content-Type":"application/json"
}
}

);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

setLoading(false);

Toast.show({
type:"success",
text1:
language === "sw"
? "Imefanikiwa"
: "Success",
text2:
language === "sw"
? "Category ya mtihani imeundwa"
: "Exam category created"
});

setName("");

}catch(error){

setLoading(false);

console.log("ERROR => ",error.response?.data);

Toast.show({
type:"error",
text1:
language === "sw"
? "Hitilafu"
: "Error",
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
title={
language === "sw"
? "Dashibodi ya Shule"
: "School Dashboard"
}
subtitle={
language === "sw"
? "Mfumo wa Usimamizi"
: "Management System"
}
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
{
language === "sw"
? "Tengeneza Category ya Mtihani"
: "Create Exam Category"
}
</Text>

<Text style={styles.subtitle}>
{
language === "sw"
? "Mfumo wa Usimamizi wa Shule"
: "School Management System"
}
</Text>

<View style={styles.form}>

<Text style={styles.label}>
{
language === "sw"
? "Jina la Category"
: "Category Name"
}
</Text>

<TextInput
style={styles.input}
value={name}
onChangeText={setName}
placeholder={
language === "sw"
? "Mfano: Midterm"
: "Example: Midterm"
}
placeholderTextColor="#94a3b8"
/>

<Animated.View style={{transform:[{scale:scaleAnim}]}}>

<TouchableOpacity
onPressIn={pressIn}
onPressOut={pressOut}
onPress={createCategory}
>

<LinearGradient
colors={["#2563eb","#38bdf8"]}
style={styles.button}
>

<Text style={styles.buttonText}>
{
language === "sw"
? "Tengeneza Category"
: "Create Category"
}
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
{
language === "sw"
? "Inatengeneza category..."
: "Creating category..."
}
</Text>

</View>

</View>

)}

<Toast/>

</LinearGradient>

)

}