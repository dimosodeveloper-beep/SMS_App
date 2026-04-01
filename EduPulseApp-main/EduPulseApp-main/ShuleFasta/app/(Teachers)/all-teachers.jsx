import React,{useState,useEffect} from "react";
import{
View,Text,TouchableOpacity,Image,ActivityIndicator,ScrollView,Animated,TextInput
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {LinearGradient} from "expo-linear-gradient";
import {BlurView} from "expo-blur";

import Toast from "react-native-toast-message";

import styles from "../../components/LoginStyles";
import {EndPoint} from "../../components/links";
import Header from "../../components/Header";

import {useRouter} from "expo-router";

export default function AllTeachers(){

const router = useRouter();

const[token,setToken] = useState(null);
const[teachers,setTeachers] = useState([]);
const[filtered,setFiltered] = useState([]);
const[search,setSearch] = useState("");
const[loading,setLoading] = useState(false);

useEffect(()=>{
const load = async()=>{
const t = await AsyncStorage.getItem("userToken");
setToken(t);
};
load();
},[]);

useEffect(()=>{
if(token) fetchTeachers();
},[token]);

const fetchTeachers = async()=>{
setLoading(true);
try{
const res = await axios.get(
EndPoint + "/teachers/",
{headers:{Authorization:`Token ${token}`}}
);
setTeachers(res.data);
setFiltered(res.data);
}catch(e){
console.log(e);
}
setLoading(false);
};

const handleSearch=(text)=>{
setSearch(text);
if(text===""){
setFiltered(teachers);
return;
}
const f = teachers.filter(item=>item.user_name.toLowerCase().includes(text.toLowerCase()));
setFiltered(f);
};

return(
<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>

<Image source={{uri:"https://images.unsplash.com/photo-1577896851231-70ef18881754"}} style={[styles.bg,{opacity:0.25}]}/>

<Header title="Teachers" subtitle="All Teachers"/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:200}}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>Teachers List</Text>

<TextInput
value={search}
onChangeText={handleSearch}
placeholder="Search teacher..."
placeholderTextColor="#94a3b8"
style={{
backgroundColor:"#0f172a",
borderWidth:1,
borderColor:"#334155",
borderRadius:10,
padding:12,
color:"#fff",
marginBottom:20
}}
/>

{filtered.map((item,index)=>(
<TouchableOpacity
key={index}
onPress={()=>router.push({pathname:"/view-teacher",params:{id:item.id}})}
style={{marginBottom:15}}
>

<LinearGradient colors={["#1e293b","#020617"]} style={{
padding:18,
borderRadius:14,
borderWidth:1,
borderColor:"#334155"
}}>

<Text style={{color:"#fff",fontWeight:"bold",fontSize:16}}>
{item.user_name}
</Text>

<Text style={{color:"#94a3b8"}}>
📞 {item.phone}
</Text>

<Text style={{color:"#38bdf8",marginTop:5}}>
Subjects: {item.subjects.map(s=>s.name).join(", ")}
</Text>

</LinearGradient>

</TouchableOpacity>
))}

</BlurView>

</ScrollView>

{loading &&(
<View style={styles.loader}>
<View style={styles.loaderCard}>
<ActivityIndicator size="large" color="#2563eb"/>
<Text style={styles.loadingText}>Loading teachers...</Text>
</View>
</View>
)}

<Toast/>

</LinearGradient>
)
}