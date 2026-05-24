import React,{useState,useEffect} from "react";
import{
View,Text,TextInput,TouchableOpacity,
ScrollView,ActivityIndicator
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

import {LinearGradient} from "expo-linear-gradient";
import {BlurView} from "expo-blur";

import Header from "../../components/Header";
import {EndPoint} from "../../components/links";

import {Ionicons} from "@expo/vector-icons";

export default function ParentComments(){

const[comment,setComment] = useState("");
const[data,setData] = useState([]);
const[loading,setLoading] = useState(false);
const[token,setToken] = useState(null);

useEffect(()=>{
AsyncStorage.getItem("userToken").then(setToken);
fetchData();
},[]);

const fetchData = async()=>{
try{
const res = await axios.get(
EndPoint+"/parent-comment/all/",
{headers:{Authorization:`Token ${token}`}}
);
setData(res.data);
}catch(e){}
};

const submit = async()=>{

if(!comment){
Toast.show({type:"error",text1:"Write comment"});
return;
}

setLoading(true);

try{

await axios.post(
EndPoint+"/parent-comment/create/",
{comment},
{headers:{Authorization:`Token ${token}`}}
);

Toast.show({type:"success",text1:"Sent successfully"});
setComment("");
fetchData();

}catch(e){
Toast.show({type:"error",text1:"Failed to send"});
}

setLoading(false);
};

return(
<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={{flex:1}}>

<Header title="Parent Comments" subtitle="Feedback System"/>

<ScrollView contentContainerStyle={{padding:15,paddingBottom:100}}>

{/* ================= FORM CARD ================= */}
<BlurView intensity={60} tint="dark" style={{
borderRadius:20,
padding:15,
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)",
marginBottom:20
}}>

{/* TITLE */}
<View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
<Ionicons name="chatbubble-ellipses-outline" size={20} color="#38bdf8" />
<Text style={{color:"#fff",fontSize:16,fontWeight:"bold",marginLeft:8}}>
Write Your Comment
</Text>
</View>

{/* LARGE DESCRIPTION INPUT */}
<View style={{
backgroundColor:"#0f172a",
borderRadius:15,
padding:10,
borderWidth:1,
borderColor:"rgba(255,255,255,0.1)"
}}>

<TextInput
placeholder="Type your feedback, suggestion or complaint here..."
placeholderTextColor="#94a3b8"
value={comment}
onChangeText={setComment}
multiline={true}
numberOfLines={6}
style={{
color:"#fff",
textAlignVertical:"top",
minHeight:120,
fontSize:14,
lineHeight:20
}}
/>

</View>

{/* SEND BUTTON */}
<TouchableOpacity
onPress={submit}
style={{
marginTop:15
}}>

<LinearGradient
colors={["#2563eb","#38bdf8"]}
style={{
padding:14,
borderRadius:12,
flexDirection:"row",
justifyContent:"center",
alignItems:"center"
}}
>

<Ionicons name="send" size={18} color="#fff" style={{marginRight:8}} />

<Text style={{
color:"#fff",
fontWeight:"bold"
}}>
Send Comment
</Text>

</LinearGradient>

</TouchableOpacity>

</BlurView>

{/* ================= COMMENTS LIST ================= */}
<Text style={{
color:"#94a3b8",
marginBottom:10,
fontSize:13
}}>
Recent Comments
</Text>

{data.map((i,index)=>(
<View key={index} style={{
backgroundColor:"#0f172a",
padding:12,
borderRadius:15,
marginBottom:10,
borderWidth:1,
borderColor:"rgba(255,255,255,0.06)"
}}>

{/* HEADER */}
<View style={{flexDirection:"row",alignItems:"center",marginBottom:5}}>
<Ionicons name="person-circle-outline" size={18} color="#38bdf8" />
<Text style={{color:"#38bdf8",marginLeft:6,fontWeight:"bold"}}>
{i.parent}
</Text>
</View>

{/* COMMENT TEXT */}
<Text style={{
color:"#e2e8f0",
lineHeight:20
}}>
{i.comment}
</Text>

</View>
))}

</ScrollView>

{loading &&(
<View style={{
position:"absolute",
top:0,left:0,right:0,bottom:0,
justifyContent:"center",
alignItems:"center",
backgroundColor:"rgba(0,0,0,0.5)"
}}>
<ActivityIndicator size="large" color="#38bdf8"/>
<Text style={{color:"#fff",marginTop:10}}>
Sending...
</Text>
</View>
)}

<Toast/>

</LinearGradient>
);
}