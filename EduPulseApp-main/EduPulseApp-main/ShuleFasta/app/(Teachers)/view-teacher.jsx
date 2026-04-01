import React,{useState,useEffect} from "react";
import{
View,Text,Image,ActivityIndicator,ScrollView
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {LinearGradient} from "expo-linear-gradient";
import {BlurView} from "expo-blur";

import styles from "../../components/LoginStyles";
import {EndPoint} from "../../components/links";
import Header from "../../components/Header";

import {useLocalSearchParams} from "expo-router";

export default function TeacherView(){

const {id} = useLocalSearchParams();

const[token,setToken] = useState(null);
const[data,setData] = useState(null);
const[loading,setLoading] = useState(false);

useEffect(()=>{
const load = async()=>{
const t = await AsyncStorage.getItem("userToken");
setToken(t);
};
load();
},[]);

useEffect(()=>{
if(token) fetchTeacher();
},[token]);

const fetchTeacher = async()=>{
setLoading(true);
try{
const res = await axios.get(
EndPoint + `/teacher/${id}/`,
{headers:{Authorization:`Token ${token}`}}
);
setData(res.data);
}catch(e){
console.log(e);
}
setLoading(false);
};

if(loading || !data){
return(
<View style={[styles.container,{justifyContent:"center",alignItems:"center"}]}>
<ActivityIndicator size="large" color="#2563eb"/>
<Text style={{color:"#fff"}}>Loading...</Text>
</View>
);
}

return(
<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>

<Image source={{uri:"https://images.unsplash.com/photo-1577896851231-70ef18881754"}} style={[styles.bg,{opacity:0.25}]}/>

<Header title="Teacher Profile" subtitle={data.user_name}/>

<ScrollView contentContainerStyle={{padding:15}}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>{data.user_name}</Text>

<Text style={{color:"#94a3b8"}}>📞 {data.phone}</Text>

<Text style={{color:"#38bdf8",marginTop:15,fontWeight:"bold"}}>
Subjects Teaching
</Text>

{data.subjects.map((item,index)=>(
<View key={index} style={{
backgroundColor:"#0f172a",
padding:12,
borderRadius:10,
marginTop:10
}}>
<Text style={{color:"#fff"}}>{item.name}</Text>
</View>
))}

</BlurView>

</ScrollView>

</LinearGradient>
)
}