import React,{useState,useEffect} from "react";

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

export default function ViewAttendanceStatistics(){

const {studentId} = useLocalSearchParams();

const[token,setToken] = useState(null);
const[data,setData] = useState(null);
const[loading,setLoading] = useState(false);

useEffect(()=>{
const loadToken = async()=>{
const t = await AsyncStorage.getItem("userToken");
setToken(t);
};
loadToken();
},[]);

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

console.log("FULL RESPONSE => ",res.data);

setData(res.data);

}catch(e){

console.log("ERROR => ",e.response?.data);

Toast.show({
type:"error",
text1:"Error loading statistics"
});

}

setLoading(false);
};

return(

<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>

<Header title="Student Statistics" subtitle="Attendance"/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:200}}>

{/* LOADING */}
{loading &&(
<ActivityIndicator size="large" color="#2563eb"/>
)}

{/* EMPTY STATE */}
{!loading && data && !data.student &&(
<Text style={{color:"#fff",textAlign:"center"}}>
No detailed data returned from API
</Text>
)}

{/* MAIN DATA */}
{data && data.student &&(

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>
{data.student.first_name} {data.student.last_name}
</Text>

<Text style={{color:"#94a3b8"}}>
Adm: {data.student.admission_number}
</Text>

<Text style={{color:"#94a3b8"}}>
Class: {data.student.classroom}
</Text>

<Text style={{color:"#94a3b8"}}>
Stream: {data.student.stream}
</Text>

<Text style={{color:"#94a3b8"}}>
Gender: {data.student.gender}
</Text>

<View style={{flexDirection:"row",marginTop:15}}>

<View style={{
flex:1,
backgroundColor:"#16a34a",
padding:10,
borderRadius:10,
marginRight:5
}}>
<Text style={{color:"#fff",textAlign:"center"}}>
Present: {data.present_days}
</Text>
</View>

<View style={{
flex:1,
backgroundColor:"#dc2626",
padding:10,
borderRadius:10
}}>
<Text style={{color:"#fff",textAlign:"center"}}>
Absent: {data.absent_days}
</Text>
</View>

</View>

{/* TIMELINE */}
{data.timeline && Object.keys(data.timeline).map(month=>(

<View key={month} style={{marginTop:15}}>

<Text style={{
color:"#38bdf8",
fontWeight:"bold",
marginBottom:5
}}>
{month}
</Text>

{data.timeline[month].map((item,index)=>(

<View key={index} style={{
backgroundColor:"#1e293b",
padding:10,
borderRadius:8,
marginBottom:5
}}>

<Text style={{color:"#fff"}}>
{item.date}
</Text>

<Text style={{
color:item.status==="present"?"#22c55e":"#ef4444"
}}>
{item.status}
</Text>

</View>

))}

</View>

))}

</BlurView>

)}

</ScrollView>

<Toast/>

</LinearGradient>

)
}