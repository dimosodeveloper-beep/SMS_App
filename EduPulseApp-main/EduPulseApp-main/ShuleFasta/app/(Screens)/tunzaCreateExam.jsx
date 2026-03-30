import React,{useState,useEffect} from "react";
import * as Animatable from "react-native-animatable";
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

export default function CreateExam(){

const[name,setName] = useState("");
const[date,setDate] = useState("");

const[classrooms,setClassrooms] = useState([]);
const[categories,setCategories] = useState([]);

const[selectedClassrooms,setSelectedClassrooms] = useState([]);
const[selectedCategory,setSelectedCategory] = useState(null);

const[showClasses,setShowClasses] = useState(false);

const[loading,setLoading] = useState(false);
const[token,setToken] = useState(null);

const scaleAnim = new Animated.Value(1);

/* ANIMATION */
const pressIn=()=>{
Animated.spring(scaleAnim,{toValue:0.95,useNativeDriver:true}).start();
}
const pressOut=()=>{
Animated.spring(scaleAnim,{toValue:1,useNativeDriver:true}).start();
}
//scaleAnim
/* LOAD TOKEN */
useEffect(()=>{
const loadToken = async()=>{
const savedToken = await AsyncStorage.getItem("userToken");
setToken(savedToken);
};
loadToken();
},[]);

/* FETCH DATA */
useEffect(()=>{
if(token){
fetchData();
}
},[token]);

const fetchData = async()=>{
try{

const classRes = await axios.get(
EndPoint + "/get-classrooms/",
{headers:{Authorization:`Token ${token}`}}
);

const catRes = await axios.get(
EndPoint + "/exam-categories/",
{headers:{Authorization:`Token ${token}`}}
);

setClassrooms(classRes.data);
setCategories(catRes.data);

}catch(e){
console.log(e);
}
}

/* TOGGLE CLASS */
const toggleClass = (id)=>{

if(selectedClassrooms.includes(id)){
setSelectedClassrooms(prev=>prev.filter(x=>x!==id));
}else{
setSelectedClassrooms(prev=>[...prev,id]);
}

}

/* CREATE EXAM */
const createExam = async()=>{

if(!name || !date || selectedClassrooms.length === 0 || !selectedCategory){

Toast.show({
type:"error",
text1:"Missing Fields",
text2:"Fill all fields"
});
return;
}

setLoading(true);

try{

const payload = {
name:name,
date:date,
category:selectedCategory,
classrooms:selectedClassrooms
};

console.log("PAYLOAD => ", payload);

const res = await axios.post(
EndPoint + "/create-exam/",
payload,
{
headers:{
Authorization:`Token ${token}`,
"Content-Type":"application/json"
}
}
);

console.log("RESPONSE => ", res.data);

Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

Toast.show({
type:"success",
text1:"Exam Created",
text2:"Saved successfully"
});

setName("");
setDate("");
setSelectedClassrooms([]);
setSelectedCategory(null);

setLoading(false);

}catch(error){

setLoading(false);

console.log("ERROR FULL => ", error.response?.data);

Toast.show({
type:"error",
text1:"Error",
text2:JSON.stringify(error.response?.data)
});

}
}

return(

<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>

<Image
source={{uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"}}
style={styles.bg}
/>

<Header title="Create Exam" subtitle="School Management System"/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:500}}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>Create Exam</Text>

<View style={styles.form}>

<Text style={styles.label}>Exam Name</Text>
<TextInput
style={styles.input}
value={name}
onChangeText={setName}
placeholder="Midterm"
placeholderTextColor="#94a3b8"
/>

<Text style={styles.label}>Date</Text>
<TextInput
style={styles.input}
value={date}
onChangeText={setDate}
placeholder="2026-03-20"
placeholderTextColor="#94a3b8"
/>

<TouchableOpacity onPress={()=>setShowClasses(!showClasses)}>
<Text style={{
color:"#38bdf8",
fontWeight:"bold",
marginVertical:10
}}>
{showClasses ? "Close Classes ▲" : "Put a tick to all classes performing this exam ▼"}
</Text>
</TouchableOpacity>

{showClasses && classrooms.map(item=>(

<TouchableOpacity
key={item.id}
onPress={()=>toggleClass(item.id)}
>
<Text style={{
color:selectedClassrooms.includes(item.id) ? "#00ffcc" : "#fff",
marginLeft:10,
marginVertical:4
}}>
{selectedClassrooms.includes(item.id) ? "☑" : "☐"} {item.name}
</Text>
</TouchableOpacity>

))}

<Text style={styles.label}>Select Category</Text>

{categories.map(item=>(

<TouchableOpacity
key={item.id}
onPress={()=>setSelectedCategory(item.id)}
>
<Text style={{
color:selectedCategory===item.id ? "#00ffcc" : "#fff",
marginVertical:5
}}>
☑ {item.name}
</Text>
</TouchableOpacity>

))}

<Animated.View style={{transform:[{scale:scaleAnim}]}}>

<TouchableOpacity
onPressIn={pressIn}
onPressOut={pressOut}
onPress={createExam}
>

<LinearGradient colors={["#2563eb","#38bdf8"]} style={styles.button}>
<Text style={styles.buttonText}>Create Exam</Text>
</LinearGradient>

</TouchableOpacity>

</Animated.View>

</View>

</BlurView>

</ScrollView>

{loading &&(
<View style={styles.loader}>
<View style={styles.loaderCard}>
<ActivityIndicator size="large" color="#2563eb"/>
<Text style={styles.loadingText}>Creating exam...</Text>
</View>
</View>
)}

<Toast/>

</LinearGradient>

)
}