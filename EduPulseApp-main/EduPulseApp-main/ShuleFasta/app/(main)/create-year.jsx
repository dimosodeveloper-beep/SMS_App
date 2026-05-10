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

export default function CreateAcademicYear(){

const { t } = useContext(LanguageContext);

const[year,setYear] = useState("");

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
title={t("school_dashboard")}
subtitle={t("management_system")}
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
Create Academic Year
</Text>

<Text style={styles.subtitle}>
School Management System
</Text>

<View style={styles.form}>

<Text style={styles.label}>
Academic Year
</Text>

<TextInput
style={styles.input}
value={year}
onChangeText={setYear}
placeholder="Example 2026"
placeholderTextColor="#94a3b8"
keyboardType="numeric"
/>

<Animated.View style={{transform:[{scale:scaleAnim}]}}>

<TouchableOpacity
onPressIn={pressIn}
onPressOut={pressOut}
onPress={createYear}
>

<LinearGradient
colors={["#2563eb","#38bdf8"]}
style={styles.button}
>

<Text style={styles.buttonText}>
Create Academic Year
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
Creating academic year...
</Text>

</View>

</View>

)}

<Toast/>

</LinearGradient>

)

}