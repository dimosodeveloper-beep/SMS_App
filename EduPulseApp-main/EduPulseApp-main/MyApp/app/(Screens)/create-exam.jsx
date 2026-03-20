import React,{useState,useEffect} from "react";

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

const[selectedClassroom,setSelectedClassroom] = useState(null);
const[selectedCategory,setSelectedCategory] = useState(null);

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

/* CREATE EXAM */
const createExam = async()=>{

if(!name || !date || !selectedClassroom || !selectedCategory){

Toast.show({
type:"error",
text1:"Missing Fields",
text2:"Fill all fields"
});
return;
}

setLoading(true);

try{

await axios.post(
EndPoint + "/create-exam/",
{
name:name,
classroom:selectedClassroom,
category:selectedCategory,
date:date
},
{
headers:{
Authorization:`Token ${token}`,
"Content-Type":"application/json"
}
}
);

Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

Toast.show({
type:"success",
text1:"Exam Created",
text2:"Success"
});

setName("");
setDate("");
setSelectedClassroom(null);
setSelectedCategory(null);

setLoading(false);

}catch(error){

setLoading(false);

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

{/* NAME */}
<Text style={styles.label}>Exam Name</Text>
<TextInput
style={styles.input}
value={name}
onChangeText={setName}
placeholder="Midterm"
placeholderTextColor="#94a3b8"
/>

{/* DATE */}
<Text style={styles.label}>Date</Text>
<TextInput
style={styles.input}
value={date}
onChangeText={setDate}
placeholder="2026-03-20"
placeholderTextColor="#94a3b8"
/>

{/* CLASSROOM SELECT */}
<Text style={styles.label}>Select Classroom</Text>

{classrooms.map(item=>(
<TouchableOpacity
key={item.id}
onPress={()=>setSelectedClassroom(item.id)}
>
<Text style={{
color:selectedClassroom===item.id ? "#00ffcc" : "#fff",
marginVertical:5
}}>
☑ {item.name}
</Text>
</TouchableOpacity>
))}

{/* CATEGORY SELECT */}
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