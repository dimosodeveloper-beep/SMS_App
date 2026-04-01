import React,{useState,useEffect,useRef} from "react";

import{
View,
Text,
TouchableOpacity,
Image,
ActivityIndicator,
Animated,
ScrollView,
Modal
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {LinearGradient} from "expo-linear-gradient";
import {BlurView} from "expo-blur";

import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";

import DateTimePicker from "@react-native-community/datetimepicker";

import styles from "../../components/LoginStyles";
import {EndPoint} from "../../components/links";
import Header from "../../components/Header";

import {useRouter} from "expo-router";

export default function CreateTimetable(){

const router = useRouter();

/* STATES */
const[classroom,setClassroom] = useState(null);
const[teacher,setTeacher] = useState(null);
const[subject,setSubject] = useState(null);

const[day,setDay] = useState(null);
const[startTime,setStartTime] = useState(new Date());
const[endTime,setEndTime] = useState(new Date());

const[classes,setClasses] = useState([]);
const[teachers,setTeachers] = useState([]);
const[subjects,setSubjects] = useState([]);

const[token,setToken] = useState(null);
const[loading,setLoading] = useState(false);

/* MODALS */
const[classModal,setClassModal] = useState(false);
const[teacherModal,setTeacherModal] = useState(false);
const[subjectModal,setSubjectModal] = useState(false);
const[dayModal,setDayModal] = useState(false);

const[showStartPicker,setShowStartPicker] = useState(false);
const[showEndPicker,setShowEndPicker] = useState(false);

/* FIX REANIMATED */
const scaleAnim = useRef(new Animated.Value(1)).current;

const pressIn=()=>{ Animated.spring(scaleAnim,{toValue:0.95,useNativeDriver:true}).start(); }
const pressOut=()=>{ Animated.spring(scaleAnim,{toValue:1,useNativeDriver:true}).start(); }

/* TOKEN */
useEffect(()=>{
const loadToken = async()=>{
const t = await AsyncStorage.getItem("userToken");
setToken(t);
};
loadToken();
},[]);

/* FETCH */
useEffect(()=>{
if(token){
fetchData();
}
},[token]);

const fetchData = async()=>{
try{
const c = await axios.get(EndPoint+"/classes2/",{headers:{Authorization:`Token ${token}`}});
const t = await axios.get(EndPoint+"/teachers2/",{headers:{Authorization:`Token ${token}`}});
const s = await axios.get(EndPoint+"/subjects2/",{headers:{Authorization:`Token ${token}`}});

setClasses(c.data);
setTeachers(t.data);
setSubjects(s.data);

}catch(e){
console.log(e);
}
};

/* FORMAT TIME */
const formatTime = (date)=> date.toTimeString().slice(0,5);

/* CREATE */
const createTimetable = async()=>{

if(!classroom || !teacher || !subject || !day){
Toast.show({type:"error",text1:"Fill all fields"});
return;
}

setLoading(true);

try{

await axios.post(
EndPoint+"/create-timetable/",
{
classroom,
teacher,
subject,
day,
start_time:formatTime(startTime),
end_time:formatTime(endTime)
},
{
headers:{
Authorization:`Token ${token}`,
"Content-Type":"application/json"
}
}
);

Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

Toast.show({type:"success",text1:"Timetable Created"});

router.back();

}catch(e){
Toast.show({type:"error",text1:"Failed",text2:JSON.stringify(e.response?.data)});
}

setLoading(false);
};

return(
<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>

<Image source={{uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"}} style={styles.bg}/>

<Header title="Create Timetable" subtitle="Smart Scheduling"/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:200}}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>Create Timetable</Text>

<View style={styles.form}>

{/* CLASS */}
<Text style={styles.label}>Class</Text>
<TouchableOpacity onPress={()=>setClassModal(true)}>
<LinearGradient colors={["#1e293b","#0f172a"]} style={{padding:15,borderRadius:10}}>
<Text style={{color:"#fff"}}>
{classroom ? classes.find(i=>i.id===classroom)?.name : "Select Class"}
</Text>
</LinearGradient>
</TouchableOpacity>

{/* TEACHER */}
<Text style={styles.label}>Teacher</Text>
<TouchableOpacity onPress={()=>setTeacherModal(true)}>
<LinearGradient colors={["#1e293b","#0f172a"]} style={{padding:15,borderRadius:10}}>
<Text style={{color:"#fff"}}>
{teacher ? teachers.find(i=>i.id===teacher)?.name : "Select Teacher"}
</Text>
</LinearGradient>
</TouchableOpacity>

{/* SUBJECT */}
<Text style={styles.label}>Subject</Text>
<TouchableOpacity onPress={()=>setSubjectModal(true)}>
<LinearGradient colors={["#1e293b","#0f172a"]} style={{padding:15,borderRadius:10}}>
<Text style={{color:"#fff"}}>
{subject ? subjects.find(i=>i.id===subject)?.name : "Select Subject"}
</Text>
</LinearGradient>
</TouchableOpacity>

{/* DAY */}
<Text style={styles.label}>Day</Text>
<TouchableOpacity onPress={()=>setDayModal(true)}>
<LinearGradient colors={["#1e293b","#0f172a"]} style={{padding:15,borderRadius:10}}>
<Text style={{color:"#fff"}}>
{day ? day : "Select Day"}
</Text>
</LinearGradient>
</TouchableOpacity>

{/* TIME */}
<Text style={styles.label}>Start Time</Text>
<TouchableOpacity onPress={()=>setShowStartPicker(true)}>
<LinearGradient colors={["#1e293b","#0f172a"]} style={{padding:15,borderRadius:10}}>
<Text style={{color:"#fff"}}>{formatTime(startTime)}</Text>
</LinearGradient>
</TouchableOpacity>

<Text style={styles.label}>End Time</Text>
<TouchableOpacity onPress={()=>setShowEndPicker(true)}>
<LinearGradient colors={["#1e293b","#0f172a"]} style={{padding:15,borderRadius:10}}>
<Text style={{color:"#fff"}}>{formatTime(endTime)}</Text>
</LinearGradient>
</TouchableOpacity>

{/* BUTTON */}
<Animated.View style={{transform:[{scale:scaleAnim}],marginTop:20}}>
<TouchableOpacity onPressIn={pressIn} onPressOut={pressOut} onPress={createTimetable}>
<LinearGradient colors={["#2563eb","#38bdf8"]} style={styles.button}>
<Text style={styles.buttonText}>Create Timetable</Text>
</LinearGradient>
</TouchableOpacity>
</Animated.View>

</View>
</BlurView>
</ScrollView>

{/* CLASS MODAL */}
<Modal visible={classModal} transparent animationType="fade">
<View style={{flex:1,backgroundColor:"rgba(0,0,0,0.7)",justifyContent:"center"}}>
{classes.map(i=>(
<TouchableOpacity key={i.id} onPress={()=>{setClassroom(i.id);setClassModal(false);}}>
<LinearGradient colors={["#2563eb","#38bdf8"]} style={{padding:15,margin:5,borderRadius:10}}>
<Text style={{color:"#fff",textAlign:"center"}}>{i.name}</Text>
</LinearGradient>
</TouchableOpacity>
))}
</View>
</Modal>

{/* TEACHER MODAL */}
<Modal visible={teacherModal} transparent animationType="fade">
<View style={{flex:1,backgroundColor:"rgba(0,0,0,0.7)",justifyContent:"center"}}>
{teachers.map(i=>(
<TouchableOpacity key={i.id} onPress={()=>{setTeacher(i.id);setTeacherModal(false);}}>
<LinearGradient colors={["#22c55e","#4ade80"]} style={{padding:15,margin:5,borderRadius:10}}>
<Text style={{color:"#fff",textAlign:"center"}}>{i.name}</Text>
</LinearGradient>
</TouchableOpacity>
))}
</View>
</Modal>

{/* SUBJECT MODAL */}
<Modal visible={subjectModal} transparent animationType="fade">
<View style={{flex:1,backgroundColor:"rgba(0,0,0,0.7)",justifyContent:"center"}}>
{subjects.map(i=>(
<TouchableOpacity key={i.id} onPress={()=>{setSubject(i.id);setSubjectModal(false);}}>
<LinearGradient colors={["#f59e0b","#fbbf24"]} style={{padding:15,margin:5,borderRadius:10}}>
<Text style={{color:"#fff",textAlign:"center"}}>{i.name}</Text>
</LinearGradient>
</TouchableOpacity>
))}
</View>
</Modal>

{/* DAY MODAL */}
<Modal visible={dayModal} transparent animationType="fade">
<View style={{flex:1,backgroundColor:"rgba(0,0,0,0.7)",justifyContent:"center"}}>
{["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(d=>(
<TouchableOpacity key={d} onPress={()=>{setDay(d);setDayModal(false);}}>
<LinearGradient colors={["#9333ea","#6366f1"]} style={{padding:15,margin:5,borderRadius:10}}>
<Text style={{color:"#fff",textAlign:"center"}}>{d}</Text>
</LinearGradient>
</TouchableOpacity>
))}
</View>
</Modal>

{/* TIME PICKERS */}
{showStartPicker && (
<DateTimePicker value={startTime} mode="time" display="default"
onChange={(e,date)=>{setShowStartPicker(false);if(date)setStartTime(date);}}/>
)}

{showEndPicker && (
<DateTimePicker value={endTime} mode="time" display="default"
onChange={(e,date)=>{setShowEndPicker(false);if(date)setEndTime(date);}}/>
)}

{/* LOADER */}
{loading &&(
<View style={styles.loader}>
<View style={styles.loaderCard}>
<ActivityIndicator size="large" color="#2563eb"/>
<Text style={styles.loadingText}>Creating...</Text>
</View>
</View>
)}

<Toast/>

</LinearGradient>
)
}