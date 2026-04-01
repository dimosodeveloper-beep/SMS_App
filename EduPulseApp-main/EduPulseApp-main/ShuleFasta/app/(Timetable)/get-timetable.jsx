import React,{useState,useEffect} from "react";
import{
View,Text,TouchableOpacity,Image,ActivityIndicator,ScrollView,Animated
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

export default function ClassTimetable(){

const {classId} = useLocalSearchParams();

const[token,setToken] = useState(null);
const[data,setData] = useState([]);
const[loading,setLoading] = useState(false);

useEffect(()=>{
const load = async()=>{
const t = await AsyncStorage.getItem("userToken");

console.log("===== TOKEN =====");
console.log(t);

setToken(t);
};
load();
},[]);

useEffect(()=>{
console.log("===== CLASS ID =====");
console.log(classId);

if(token && classId){
fetchData();
}else{
console.log("TOKEN OR CLASSID MISSING");
}
},[token,classId]);

const fetchData = async()=>{

console.log("===== FETCH START =====");

if(!classId){
console.log("CLASS ID IS NULL");

Toast.show({
type:"error",
text1:"Error",
text2:"Class ID missing"
});
return;
}

setLoading(true);

try{

const url = EndPoint+`/class-timetable/${classId}/`;

console.log("===== REQUEST URL =====");
console.log(url);

const res = await axios.get(
url,
{
headers:{Authorization:`Token ${token}`}
}
);

console.log("===== RESPONSE DATA =====");
console.log(res.data);

setData(res.data);

}catch(e){

console.log("===== ERROR FULL =====");
console.log(e);

console.log("===== ERROR RESPONSE =====");
console.log(e.response?.data);

console.log("===== ERROR STATUS =====");
console.log(e.response?.status);

Toast.show({
type:"error",
text1:"Failed",
text2:"Timetable not found or server error"
});

}

setLoading(false);
};

return(
<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>

<Image
source={{uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"}}
style={styles.bg}
/>

<Header title="Timetable" subtitle="Weekly Schedule"/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:200}}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>Class Timetable</Text>

{data.length === 0 && !loading &&(
<Text style={{color:"#94a3b8",textAlign:"center",marginTop:30}}>
No timetable available
</Text>
)}

{data.map((item,index)=>(

<Animated.View key={index} style={{marginTop:15}}>

<LinearGradient
colors={["#1e293b","#0f172a"]}
style={{
padding:15,
borderRadius:12,
borderWidth:1,
borderColor:"#334155"
}}
>

<Text style={{color:"#38bdf8",fontWeight:"bold"}}>
{item.day}
</Text>

<Text style={{color:"#fff",fontSize:16,fontWeight:"bold"}}>
{item.subject_name}
</Text>

<Text style={{color:"#94a3b8"}}>
👨‍🏫 {item.teacher_name}
</Text>

<Text style={{color:"#22c55e"}}>
⏰ {item.start_time} - {item.end_time}
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
<Text style={styles.loadingText}>Loading...</Text>
</View>
</View>
)}

<Toast/>

</LinearGradient>
)
}