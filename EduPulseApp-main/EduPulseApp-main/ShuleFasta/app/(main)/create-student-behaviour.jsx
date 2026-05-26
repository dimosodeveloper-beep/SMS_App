import React,{useState,useEffect,useRef} from "react";

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

export default function CreateStudentBehaviour(){

const[students,setStudents] = useState([]);

const[student,setStudent] = useState(null);

const[title,setTitle] = useState("");
const[description,setDescription] = useState("");
const[status,setStatus] = useState("");

const[searchStudent,setSearchStudent] = useState("");

const[showStudent,setShowStudent] = useState(false);

const[loading,setLoading] = useState(false);

const[token,setToken] = useState(null);

const fadeAnim = useRef(new Animated.Value(0)).current;
const slideAnim = useRef(new Animated.Value(40)).current;
const scaleAnim = useRef(new Animated.Value(1)).current;

/* =========================
SCREEN ANIMATION
========================= */
useEffect(()=>{

Animated.parallel([

Animated.timing(fadeAnim,{
toValue:1,
duration:800,
useNativeDriver:true
}),

Animated.timing(slideAnim,{
toValue:0,
duration:800,
useNativeDriver:true
})

]).start();

},[]);

/* =========================
PRESS ANIMATION
========================= */
const pressIn=()=>{

Animated.spring(scaleAnim,{
toValue:0.96,
useNativeDriver:true
}).start();

Haptics.impactAsync(
Haptics.ImpactFeedbackStyle.Light
);

}

const pressOut=()=>{

Animated.spring(scaleAnim,{
toValue:1,
friction:5,
useNativeDriver:true
}).start();

}


/* =========================
LOAD TOKEN
========================= */

useEffect(()=>{

const loadToken = async()=>{

const savedToken = await AsyncStorage.getItem("userToken");

if(!savedToken){

Toast.show({
type:"error",
text1:"Authentication Error",
text2:"Login again"
});

return;

}

setToken(savedToken);

};

loadToken();

},[]);


/* =========================
FETCH STUDENTS
========================= */

useEffect(()=>{

if(token){

fetchStudents();

}

},[token]);


const fetchStudents = async()=>{

try{

const response = await axios.get(

EndPoint + "/students/",

{
headers:{
Authorization:`Token ${token}`
}
}

);

setStudents(response.data);

}catch(error){

console.log("ERROR => ",error.response?.data);

}

}


/* =========================
FILTER STUDENTS
========================= */

const filteredStudents = students.filter((item)=>

(`${item.first_name} ${item.last_name}`)
.toLowerCase()
.includes(searchStudent.toLowerCase())

);


/* =========================
CREATE BEHAVIOUR
========================= */

const createBehaviour = async()=>{

if(!student || !title || !description || !status){

Toast.show({
type:"error",
text1:"Missing Fields",
text2:"Please fill all fields"
});

return;

}

if(!token){

Toast.show({
type:"error",
text1:"Authentication Error",
text2:"Please login again"
});

return;

}

setLoading(true);

try{

const payload = {

student:student,
title:title,
description:description,
status:status

};

const response = await axios.post(

EndPoint + "/create-student-behaviour/",

payload,

{
headers:{
Authorization:`Token ${token}`,
"Content-Type":"application/json"
}
}

);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

Toast.show({
type:"success",
text1:"Success",
text2:"Student behaviour saved successfully"
});

setStudent(null);
setTitle("");
setDescription("");
setStatus("");
setSearchStudent("");

}catch(error){

console.log("ERROR => ",error.response?.data);

Toast.show({
type:"error",
text1:"Error",
text2:JSON.stringify(error.response?.data)
});

}

setLoading(false);

};


return(

<LinearGradient
colors={["#020617","#0f172a","#111827","#1e293b"]}
style={styles.container}
>

<Image
source={{
uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"
}}
style={[
styles.bg,
{opacity:0.18}
]}
/>

<View style={{
position:"absolute",
top:-120,
right:-100,
width:260,
height:260,
borderRadius:200,
backgroundColor:"rgba(59,130,246,0.18)"
}}/>

<View style={{
position:"absolute",
bottom:-140,
left:-100,
width:260,
height:260,
borderRadius:200,
backgroundColor:"rgba(14,165,233,0.12)"
}}/>

<Header
title="School Dashboard"
subtitle="Management System"
/>

<Animated.ScrollView
contentContainerStyle={{
padding:14,
paddingBottom:300
}}
showsVerticalScrollIndicator={false}
keyboardShouldPersistTaps="handled"
style={{
opacity:fadeAnim,
transform:[{translateY:slideAnim}]
}}
>

<BlurView
intensity={60}
tint="dark"
style={[
styles.blur,
{
borderRadius:28,
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)",
backgroundColor:"rgba(15,23,42,0.72)",
padding:18
}
]}
>

<Text style={{
color:"#fff",
fontSize:26,
fontWeight:"bold",
textAlign:"center"
}}>
Create Student Behaviour
</Text>

<Text style={{
color:"#94a3b8",
textAlign:"center",
marginTop:6,
marginBottom:20
}}>
Student behaviour management system
</Text>

<View style={styles.form}>

{/* STUDENT SELECT */}
<Text style={styles.label}>Student</Text>

<TouchableOpacity onPress={()=>setShowStudent(true)}>

<TextInput
style={styles.input}
placeholder="Select student"
placeholderTextColor="#94a3b8"
value={searchStudent}
editable={false}
/>

</TouchableOpacity>

{showStudent &&(

<View style={{
backgroundColor:"#0f172a",
borderRadius:12,
padding:10,
marginBottom:10,
maxHeight:200,
borderWidth:1,
borderColor:"rgba(148,163,184,0.15)"
}}>

<TextInput
placeholder="Search student..."
placeholderTextColor="#94a3b8"
style={[styles.input,{marginBottom:10}]}
value={searchStudent}
onChangeText={setSearchStudent}
/>

<ScrollView>

{filteredStudents.map((item)=>(

<TouchableOpacity
key={item.id}
onPress={()=>{

setStudent(item.id);
setSearchStudent(item.first_name + " " + item.last_name);
setShowStudent(false);

}}
>

<Text style={{
color:"#fff",
padding:10
}}>
{item.first_name} {item.last_name}
</Text>

</TouchableOpacity>

))}

</ScrollView>

</View>

)}

{/* TITLE */}
<Text style={styles.label}>Behaviour Title</Text>

<TextInput
style={styles.input}
value={title}
onChangeText={setTitle}
placeholder="Enter behaviour title"
placeholderTextColor="#94a3b8"
/>

{/* DESCRIPTION */}
<Text style={styles.label}>Description</Text>

<TextInput
style={[
styles.input,
{
height:120,
textAlignVertical:"top"
}
]}
multiline
value={description}
onChangeText={setDescription}
placeholder="Enter behaviour description"
placeholderTextColor="#94a3b8"
/>

{/* STATUS */}
<Text style={styles.label}>Status</Text>

<TextInput
style={styles.input}
value={status}
onChangeText={setStatus}
placeholder="Good / Warning / Excellent"
placeholderTextColor="#94a3b8"
/>

<Animated.View style={{
transform:[{scale:scaleAnim}],
marginTop:25
}}>

<TouchableOpacity
onPressIn={pressIn}
onPressOut={pressOut}
onPress={createBehaviour}
activeOpacity={0.9}
>

<LinearGradient
colors={["#2563eb","#38bdf8"]}
style={styles.button}
>

<Text style={styles.buttonText}>
Save Behaviour
</Text>

</LinearGradient>

</TouchableOpacity>

</Animated.View>

</View>

</BlurView>

</Animated.ScrollView>

{loading &&(

<View style={styles.loader}>

<View style={[
styles.loaderCard,
{
backgroundColor:"#0f172a",
borderRadius:20,
borderWidth:1,
borderColor:"rgba(148,163,184,0.15)"
}
]}>

<ActivityIndicator size="large" color="#3b82f6"/>

<Text style={{
color:"#fff",
marginTop:15,
fontSize:16,
fontWeight:"600"
}}>
Saving behaviour...
</Text>

</View>

</View>

)}

<Toast/>

</LinearGradient>

)

}