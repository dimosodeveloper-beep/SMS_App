import React,{useState,useEffect} from "react";

import{
View,
Text,
TouchableOpacity,
Image,
ActivityIndicator,
ScrollView
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {LinearGradient} from "expo-linear-gradient";
import {BlurView} from "expo-blur";

import Toast from "react-native-toast-message";

import styles from "../../components/LoginStyles";
import {EndPoint} from "../../components/links";
import Header from "../../components/Header";

export default function BulkAttendance(){

const[students,setStudents] = useState([]);
const[classroom,setClassroom] = useState(null);
const[stream,setStream] = useState(null);

const[date,setDate] = useState(new Date());
const[showDate,setShowDate] = useState(false);

const[attendance,setAttendance] = useState([]);

const[token,setToken] = useState(null);
const[loading,setLoading] = useState(false);

/* TOKEN */
useEffect(()=>{
AsyncStorage.getItem("userToken").then(setToken);
},[]);

/* FETCH STUDENTS */
useEffect(()=>{
if(token && classroom){
fetchStudents();
}
},[token,classroom]);

const fetchStudents = async()=>{
try{

const res = await axios.get(EndPoint+"/students/",{
headers:{Authorization:`Token ${token}`}
});

setStudents(res.data);

/* initialize attendance */
const init = res.data.map(s=>({
student:s.id,
status:"present"
}));

setAttendance(init);

}catch(e){
console.log(e);
}
};

/* TOGGLE STATUS */
const toggleStatus = (index)=>{
const data = [...attendance];
data[index].status = data[index].status==="present"?"absent":"present";
setAttendance(data);
};

/* FORMAT DATE */
const formatDate = (d)=> d.toISOString().split("T")[0];

/* SUBMIT */
const submitBulk = async()=>{

if(!classroom || !stream){
Toast.show({type:"error",text1:"Select class & stream"});
return;
}

setLoading(true);

try{

const payload = attendance.map(a=>({
student:a.student,
classroom:classroom,
stream:stream,
date:formatDate(date),
status:a.status
}));

await axios.post(
EndPoint+"/bulk-attendance/",
payload,
{
headers:{Authorization:`Token ${token}`}
}
);

Toast.show({type:"success",text1:"Attendance saved"});

setLoading(false);

}catch(e){
setLoading(false);
Toast.show({
type:"error",
text1:"Error",
text2:JSON.stringify(e.response?.data)
});
}
};

return(

<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>

<Image source={{uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"}} style={styles.bg}/>

<Header title="Bulk Attendance" subtitle="Whole Class"/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:500}}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>Class Attendance</Text>

<TouchableOpacity onPress={()=>setShowDate(true)}>
<Text style={styles.input}>{formatDate(date)}</Text>
</TouchableOpacity>

{showDate &&(
<DateTimePicker
value={date}
mode="date"
onChange={(e,d)=>{
setShowDate(false);
if(d) setDate(d);
}}
/>
)}

{students.map((s,index)=>(

<View key={s.id} style={{
flexDirection:"row",
justifyContent:"space-between",
backgroundColor:"#1e293b",
padding:10,
marginVertical:5,
borderRadius:8
}}>

<Text style={{color:"#fff"}}>
{s.first_name} {s.last_name}
</Text>

<TouchableOpacity onPress={()=>toggleStatus(index)}>
<Text style={{
color:attendance[index]?.status==="present"?"#00ffcc":"#ff4d4d"
}}>
{attendance[index]?.status}
</Text>
</TouchableOpacity>

</View>

))}

<TouchableOpacity onPress={submitBulk}>
<Text style={{color:"#38bdf8",textAlign:"center",marginTop:20}}>
Submit Attendance
</Text>
</TouchableOpacity>

</BlurView>

</ScrollView>

{loading && <ActivityIndicator size="large" color="#2563eb"/>}

<Toast/>

</LinearGradient>

)
}