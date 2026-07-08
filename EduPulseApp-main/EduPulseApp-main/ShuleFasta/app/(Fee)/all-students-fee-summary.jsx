// app/(Screens)/all-students-fee-summary.jsx

import React,{useState,useEffect,useContext} from "react";
import{
View,
Text,
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

export default function AllStudentsFeeSummary(){

const [students,setStudents] = useState([]);
const [filtered,setFiltered] = useState([]);
const [search,setSearch] = useState("");
const [loading,setLoading] = useState(false);
const [token,setToken] = useState(null);

const { language } = useContext(LanguageContext);

const scaleAnim = new Animated.Value(1);

useEffect(()=>{
const loadToken = async()=>{
const savedToken = await AsyncStorage.getItem("userToken");
setToken(savedToken);
};
loadToken();
},[]);

useEffect(()=>{
if(token){
fetchData(token);
}
},[token]);

const fetchData = async(token)=>{
setLoading(true);

try{

const res = await axios.get(
EndPoint + "/all-students-fee-summary/",
{
headers:{
Authorization:`Token ${token}`
}
}
);

setStudents(res.data);
setFiltered(res.data);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

}catch(error){

Toast.show({
type:"error",
text1:
language === "sw"
? "Hitilafu"
: "Error",
text2:JSON.stringify(error.response?.data)
});

}

setLoading(false);
};

const handleSearch=(text)=>{
setSearch(text);

if(text === ""){
setFiltered(students);
return;
}

const filteredData = students.filter((item)=>
item.student_name?.toLowerCase().includes(text.toLowerCase())
);

setFiltered(filteredData);
};

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
? "Muhtasari wa Ada za Wanafunzi"
: "Students Fees Summary"
}
/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:300}}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>
{
language === "sw"
? "Muhtasari wa Ada"
: "Fee Summary"
}
</Text>

<Text style={styles.subtitle}>
{
language === "sw"
? "Hali ya kifedha ya wanafunzi wote"
: "All students financial status"
}
</Text>

{filtered.map((item,index)=>(

<Animated.View
key={item.id}
style={{
transform:[{scale:scaleAnim}],
marginTop:15
}}
>

<LinearGradient
colors={["#1e293b","#0f172a"]}
style={{
padding:18,
borderRadius:14,
borderWidth:1,
borderColor:"#334155"
}}
>

<Text style={{
color:"#fff",
fontSize:18,
fontWeight:"bold"
}}>
{item.student_name}
</Text>

<Text style={{color:"#94a3b8"}}>
{
language === "sw"
? `Darasa: ${item.classroom_name_SW || item.classroom_name}`
: `Class: ${item.classroom_name}`
}
</Text>

<Text style={{color:"#94a3b8"}}>
{
language === "sw"
? `Mkondo: ${item.stream_name_SW || item.stream_name}`
: `Stream: ${item.stream_name}`
}
</Text>

<Text style={{
color:"#38bdf8",
marginTop:10
}}>
{
language === "sw"
? `Jumla ya Ada: ${item.total_fee}`
: `Total Fee: ${item.total_fee}`
}
</Text>

<Text style={{
color:"#22c55e"
}}>
{
language === "sw"
? `Iliyolipwa: ${item.total_paid}`
: `Paid: ${item.total_paid}`
}
</Text>

<Text style={{
color:"#ef4444"
}}>
{
language === "sw"
? `Kiporo: ${item.balance}`
: `Balance: ${item.balance}`
}
</Text>

</LinearGradient>

</Animated.View>

))}

</BlurView>
</ScrollView>

{loading &&(
<View style={styles.loader}>
<View style={styles.loaderCard}>
<ActivityIndicator size="large" color="#2563eb"/>
<Text style={styles.loadingText}>
{
language === "sw"
? "Inapakia wanafunzi..."
: "Loading students..."
}
</Text>
</View>
</View>
)}

<Toast/>

</LinearGradient>
);
}