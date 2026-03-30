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

import DateTimePicker from "@react-native-community/datetimepicker";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {LinearGradient} from "expo-linear-gradient";
import {BlurView} from "expo-blur";

import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";

import styles from "../../components/LoginStyles";
import {EndPoint} from "../../components/links";
import Header from "../../components/Header";

export default function TakeAttendance(){

const[students,setStudents] = useState([]);
const[classrooms,setClassrooms] = useState([]);
const[streams,setStreams] = useState([]);

const[student,setStudent] = useState(null);
const[classroom,setClassroom] = useState(null);
const[stream,setStream] = useState(null);

const[searchStudent,setSearchStudent] = useState("");
const[showStudent,setShowStudent] = useState(false);

const[date,setDate] = useState(new Date());
const[showDate,setShowDate] = useState(false);

const[status,setStatus] = useState("present");

const[loading,setLoading] = useState(false);
const[token,setToken] = useState(null);

const scaleAnim = new Animated.Value(1);

const pressIn=()=>{Animated.spring(scaleAnim,{toValue:0.95,useNativeDriver:true}).start();}
const pressOut=()=>{Animated.spring(scaleAnim,{toValue:1,useNativeDriver:true}).start();}

/* TOKEN */
useEffect(()=>{
AsyncStorage.getItem("userToken").then(setToken);
},[]);

/* FETCH */
useEffect(()=>{
if(token){
fetchData();
}
},[token]);

const fetchData = async()=>{
try{

const s = await axios.get(EndPoint+"/students/",{
headers:{Authorization:`Token ${token}`}
});

const c = await axios.get(EndPoint+"/get-classrooms/",{
headers:{Authorization:`Token ${token}`}
});

const st = await axios.get(EndPoint+"/streams/",{
headers:{Authorization:`Token ${token}`}
});

setStudents(s.data);
setClassrooms(c.data);
setStreams(st.data);

}catch(e){
console.log(e.response?.data || e.message);
}
};

/* FILTER */
const filteredStudents = students.filter(x =>
(`${x.first_name} ${x.last_name}`).toLowerCase().includes(searchStudent.toLowerCase())
);

/* FORMAT DATE */
const formatDate = (d)=>{
return d.toISOString().split("T")[0];
};

/* SUBMIT */
const submitAttendance = async()=>{

if(!student || !classroom || !stream || !status){
Toast.show({type:"error",text1:"Fill all fields"});
return;
}

setLoading(true);

try{

const payload = {
student:student,
classroom:classroom,
stream:stream,
date:formatDate(date),
status:status
};

const res = await axios.post(
EndPoint + "/take-attendance/",
payload,
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
text1:"Success",
text2:"Attendance saved"
});

setLoading(false);

}catch(error){
setLoading(false);
Toast.show({
type:"error",
text1:"Error",
text2:JSON.stringify(error.response?.data)
});
}
};

return(

<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>

<Image source={{uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"}} style={styles.bg}/>

<Header title="Attendance" subtitle="Single Student"/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:400}}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>Take Attendance</Text>

{/* STUDENT */}
<Text style={styles.label}>Student</Text>
<TextInput
style={styles.input}
placeholder="Search student..."
value={searchStudent}
onFocus={()=>setShowStudent(true)}
onChangeText={(t)=>{
setSearchStudent(t);
setShowStudent(true);
}}
/>

{showStudent && filteredStudents.slice(0,5).map(item=>(
<TouchableOpacity
key={item.id}
style={{backgroundColor:"#020617",padding:10,marginVertical:3,borderRadius:8}}
onPress={()=>{
setStudent(item.id);
setSearchStudent(item.first_name+" "+item.last_name);
setShowStudent(false);
}}
>
<Text style={{color:"#fff"}}>{item.first_name} {item.last_name}</Text>
</TouchableOpacity>
))}

{/* CLASSROOM */}
<Text style={styles.label}>Classroom</Text>
{classrooms.map(c=>(
<TouchableOpacity key={c.id} onPress={()=>setClassroom(c.id)}>
<Text style={{color:classroom===c.id?"#00ffcc":"#fff"}}>
☑ {c.name}
</Text>
</TouchableOpacity>
))}

{/* STREAM */}
<Text style={styles.label}>Stream</Text>
{streams.map(s=>(
<TouchableOpacity key={s.id} onPress={()=>setStream(s.id)}>
<Text style={{color:stream===s.id?"#00ffcc":"#fff"}}>
☑ {s.name}
</Text>
</TouchableOpacity>
))}

{/* DATE */}
<Text style={styles.label}>Date</Text>
<TouchableOpacity onPress={()=>setShowDate(true)}>
<Text style={styles.input}>{formatDate(date)}</Text>
</TouchableOpacity>

{showDate &&(
<DateTimePicker
value={date}
mode="date"
display="default"
onChange={(e,selected)=>{
setShowDate(false);
if(selected){setDate(selected);}
}}
/>
)}

{/* STATUS */}
<Text style={styles.label}>Status</Text>

<View style={{flexDirection:"row",gap:10}}>

<TouchableOpacity onPress={()=>setStatus("present")}>
<Text style={{
color:status==="present"?"#00ffcc":"#fff"
}}>Present</Text>
</TouchableOpacity>

<TouchableOpacity onPress={()=>setStatus("absent")}>
<Text style={{
color:status==="absent"?"#ff4d4d":"#fff"
}}>Absent</Text>
</TouchableOpacity>

</View>

<Animated.View style={{transform:[{scale:scaleAnim}]}}>

<TouchableOpacity onPressIn={pressIn} onPressOut={pressOut} onPress={submitAttendance}>

<LinearGradient colors={["#2563eb","#38bdf8"]} style={styles.button}>
<Text style={styles.buttonText}>Save Attendance</Text>
</LinearGradient>

</TouchableOpacity>

</Animated.View>

</BlurView>

</ScrollView>

{loading &&(
<View style={styles.loader}>
<ActivityIndicator size="large" color="#2563eb"/>
</View>
)}

<Toast/>

</LinearGradient>

)
}