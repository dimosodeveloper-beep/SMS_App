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

const scaleAnim = new Animated.Value(1);



/* =========================
ANIMATION
========================= */

const pressIn=()=>{

Animated.spring(scaleAnim,{
toValue:0.95,
useNativeDriver:true
}).start();

}

const pressOut=()=>{

Animated.spring(scaleAnim,{
toValue:1,
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

console.log("PAYLOAD => ",payload);

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

console.log("SUCCESS => ",response.data);

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

setLoading(false);

}catch(error){

setLoading(false);

console.log("ERROR => ",error.response?.data);

Toast.show({
type:"error",
text1:"Error",
text2:JSON.stringify(error.response?.data)
});

}

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
title="School Dashboard"
subtitle="Management System"
/>

<ScrollView
contentContainerStyle={{
padding:10,
paddingBottom:300
}}
showsVerticalScrollIndicator={false}
keyboardShouldPersistTaps="handled"
>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>
Create Student Behaviour
</Text>

<Text style={styles.subtitle}>
Student behaviour management
</Text>

<View style={styles.form}>


{/* SELECT STUDENT */}

<Text style={styles.label}>
Student
</Text>

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
maxHeight:200
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

setSearchStudent(
item.first_name + " " + item.last_name
);

setShowStudent(false);

}}
>

<Text style={{
color:"#fff",
padding:8
}}>
{item.first_name} {item.last_name}
</Text>

</TouchableOpacity>

))}

</ScrollView>

</View>

)}



{/* TITLE */}

<Text style={styles.label}>
Behaviour Title
</Text>

<TextInput
style={styles.input}
value={title}
onChangeText={setTitle}
placeholder="Enter behaviour title"
placeholderTextColor="#94a3b8"
/>



{/* DESCRIPTION */}

<Text style={[styles.label,{marginTop:15}]}>
Description
</Text>

<TextInput
style={[
styles.input,
{
height:120,
textAlignVertical:"top",
paddingTop:15
}
]}
multiline={true}
value={description}
onChangeText={setDescription}
placeholder="Enter behaviour description"
placeholderTextColor="#94a3b8"
/>



{/* STATUS */}

<Text style={[styles.label,{marginTop:15}]}>
Status
</Text>

<TextInput
style={styles.input}
value={status}
onChangeText={setStatus}
placeholder="Example: Good / Warning / Excellent"
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

</ScrollView>



{loading &&(

<View style={styles.loader}>

<View style={styles.loaderCard}>

<ActivityIndicator
size="large"
color="#2563eb"
/>

<Text style={styles.loadingText}>
Saving behaviour...
</Text>

</View>

</View>

)}

<Toast/>

</LinearGradient>

)

}