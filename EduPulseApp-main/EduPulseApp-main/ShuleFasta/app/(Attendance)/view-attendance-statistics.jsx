import React,{useState,useEffect,useContext} from "react";

import{
View,
Text,
ScrollView,
ActivityIndicator
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {LinearGradient} from "expo-linear-gradient";
import {BlurView} from "expo-blur";

import Toast from "react-native-toast-message";

import styles from "../../components/LoginStyles";
import {EndPoint} from "../../components/links";
import Header from "../../components/Header";

import {useLocalSearchParams} from "expo-router";

import { LanguageContext } from "../../components/LanguageContext";

export default function ViewAttendanceStatistics(){

const { language } = useContext(LanguageContext);

const {studentId} = useLocalSearchParams();

const[token,setToken] = useState(null);
const[data,setData] = useState(null);
const[loading,setLoading] = useState(false);

/* LOAD TOKEN */
useEffect(()=>{
const loadToken = async()=>{
const t = await AsyncStorage.getItem("userToken");
setToken(t);
};
loadToken();
},[]);

/* FETCH */
useEffect(()=>{
if(token && studentId){
fetchData();
}
},[token,studentId]);

const fetchData = async()=>{

setLoading(true);

try{

const res = await axios.get(
EndPoint + `/attendance-statistics/${studentId}/`,
{
headers:{Authorization:`Token ${token}`}
}
);

setData(res.data);

}catch(e){

Toast.show({
type:"error",
text1:
language === "sw"
? "Hitilafu kupakia takwimu"
: "Error loading statistics"
});

}

setLoading(false);
};

return(

<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>

<Header 
title={
language === "sw"
? "Takwimu za Mwanafunzi"
: "Student Statistics"
} 
subtitle={
language === "sw"
? "Mstari wa Muda wa Mahudhurio"
: "Attendance Timeline"
}
/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:200}}>

{loading &&(
<ActivityIndicator size="large" color="#2563eb"/>
)}

{data ? (

<BlurView intensity={40} tint="dark" style={styles.blur}>

{/* =========================
STUDENT PROFILE CARD
========================= */}
<View style={{
backgroundColor:"#0f172a",
borderRadius:16,
padding:15,
borderWidth:1,
borderColor:"#334155",
marginBottom:15
}}>

{/* AVATAR + NAME */}
<View style={{flexDirection:"row",alignItems:"center"}}>

<View style={{
width:60,
height:60,
borderRadius:30,
backgroundColor:"#2563eb",
justifyContent:"center",
alignItems:"center",
marginRight:12
}}>
<Text style={{color:"#fff",fontSize:22,fontWeight:"bold"}}>
{data.student?.name?.charAt(0) || "?"}
</Text>
</View>

<View>
<Text style={{
color:"#fff",
fontSize:18,
fontWeight:"bold"
}}>
{data.student?.name || "Unknown Student"}
</Text>

<Text style={{color:"#94a3b8"}}>
{
language === "sw"
? `Namba ya Usajili: ${data.student?.admission_number || "-"}`
: `Adm: ${data.student?.admission_number || "-"}`
}
</Text>
</View>

</View>

{/* INFO GRID */}
<View style={{
flexDirection:"row",
flexWrap:"wrap",
marginTop:15
}}>

<View style={{width:"50%",marginBottom:10}}>
<Text style={{color:"#64748b",fontSize:12}}>
{
language === "sw"
? "Darasa"
: "Class"
}
</Text>
<Text style={{color:"#fff",fontWeight:"600"}}>
{data.student?.classroom || "-"}
</Text>
</View>

<View style={{width:"50%",marginBottom:10}}>
<Text style={{color:"#64748b",fontSize:12}}>
{
language === "sw"
? "Mkondo"
: "Stream"
}
</Text>
<Text style={{color:"#fff",fontWeight:"600"}}>
{data.student?.stream || "-"}
</Text>
</View>

<View style={{width:"50%"}}>
<Text style={{color:"#64748b",fontSize:12}}>
{
language === "sw"
? "Jinsia"
: "Gender"
}
</Text>
<Text style={{color:"#fff",fontWeight:"600"}}>
{
language === "sw"
? (data.student?.gender?.toLowerCase() === "male" || data.student?.gender === "ME" ? "Kiume" : data.student?.gender?.toLowerCase() === "female" || data.student?.gender === "KE" ? "Kike" : data.student?.gender || "-")
: (data.student?.gender || "-")
}
</Text>
</View>

</View>

</View>

{/* =========================
SUMMARY CARDS
========================= */}
<View style={{flexDirection:"row",marginBottom:15}}>

<View style={{
flex:1,
borderRadius:14,
overflow:"hidden",
marginRight:5
}}>
<LinearGradient colors={["#16a34a","#22c55e"]} style={{padding:14}}>
<Text style={{color:"#dcfce7",fontSize:12}}>
{
language === "sw"
? "Siku Alizopo"
: "Present Days"
}
</Text>
<Text style={{color:"#fff",fontSize:20,fontWeight:"bold"}}>
{data.present_days || 0}
</Text>
</LinearGradient>
</View>

<View style={{
flex:1,
borderRadius:14,
overflow:"hidden",
marginLeft:5
}}>
<LinearGradient colors={["#dc2626","#ef4444"]} style={{padding:14}}>
<Text style={{color:"#fee2e2",fontSize:12}}>
{
language === "sw"
? "Siku Asizopo"
: "Absent Days"
}
</Text>
<Text style={{color:"#fff",fontSize:20,fontWeight:"bold"}}>
{data.absent_days || 0}
</Text>
</LinearGradient>
</View>

</View>

{/* =========================
TIMELINE
========================= */}
<Text style={{
color:"#38bdf8",
fontWeight:"bold",
marginBottom:10
}}>
{
language === "sw"
? "Mstari wa Muda wa Mahudhurio"
: "Attendance Timeline"
}
</Text>

{data.timeline && data.timeline.length > 0 ? (

data.timeline.map((item,index)=>(

<View key={index} style={{
backgroundColor:"#0f172a",
padding:12,
borderRadius:12,
marginBottom:8,
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
borderWidth:1,
borderColor:"#334155"
}}>

<View>
<Text style={{color:"#fff",fontWeight:"600"}}>
{item.date}
</Text>
</View>

<View style={{
paddingHorizontal:10,
paddingVertical:4,
borderRadius:20,
backgroundColor:item.status==="present"?"#14532d":"#7f1d1d"
}}>
<Text style={{
color:item.status==="present"?"#22c55e":"#ef4444",
fontWeight:"bold"
}}>
{
language === "sw"
? (item.status === "present" ? "UPO" : "HAUPO")
: item.status.toUpperCase()
}
</Text>
</View>

</View>

))

) : (

<Text style={{color:"#94a3b8",textAlign:"center"}}>
{
language === "sw"
? "Hakuna kumbukumbu za mahudhurio"
: "No attendance records"
}
</Text>

)}

</BlurView>

) : (

<Text style={{color:"#fff",textAlign:"center",marginTop:50}}>
{
language === "sw"
? "Tunapakia data..."
: "Loading data..."
}
</Text>

)}

</ScrollView>

<Toast/>

</LinearGradient>

)
}