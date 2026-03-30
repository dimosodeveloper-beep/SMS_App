import React,{useState,useEffect} from "react";
import{
View,
Text,
TouchableOpacity,
Image,
ActivityIndicator,
Animated,
ScrollView,
Modal,
TextInput
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

import {useLocalSearchParams} from "expo-router";

export default function TakeAttendance(){

const {streamId,streamName,classId,className} = useLocalSearchParams();

const[students,setStudents] = useState([]);
const[attendance,setAttendance] = useState([]);
const[loading,setLoading] = useState(false);
const[token,setToken] = useState(null);

const[modalVisible,setModalVisible] = useState(false);
const[selectedIndex,setSelectedIndex] = useState(null);
const[noteText,setNoteText] = useState("");

const scaleAnim = new Animated.Value(1);

/* ANIMATION */
const pressIn=()=>{Animated.spring(scaleAnim,{toValue:0.95,useNativeDriver:true}).start();}
const pressOut=()=>{Animated.spring(scaleAnim,{toValue:1,useNativeDriver:true}).start();}

/* LOAD TOKEN */
useEffect(()=>{
const loadToken = async()=>{
try{
const savedToken = await AsyncStorage.getItem("userToken");
if(!savedToken){
Toast.show({type:"error",text1:"Authentication Error",text2:"Login again"});
return;
}
console.log("TOKEN => ",savedToken);
setToken(savedToken);
}catch(e){
console.log("TOKEN ERROR => ",e);
}
};
loadToken();
},[]);

/* FETCH STUDENTS */
useEffect(()=>{
if(token) fetchStudents();
},[token]);

const fetchStudents = async()=>{
setLoading(true);
try{
const res = await axios.get(
EndPoint + "/students/stream/" + streamId + "/",
{
headers:{Authorization:`Token ${token}`,"Content-Type":"application/json"}
}
);
console.log("STUDENTS => ",res.data);
setStudents(res.data);

/* DEFAULT ATTENDANCE */
const defaultAttendance = res.data.map(st=>({
student:st.id,
classroom:parseInt(classId),
stream:parseInt(streamId),
status:"present",
reason:""   // <=== default empty reason
}));
setAttendance(defaultAttendance);

setLoading(false);
}catch(e){
setLoading(false);
console.log("FETCH ERROR => ",e.response?.data);
Toast.show({type:"error",text1:"Error fetching students",text2:JSON.stringify(e.response?.data)});
}
};

/* TOGGLE STATUS */
const toggleStatus = (index,status)=>{
const data = [...attendance];
data[index].status = status;
setAttendance(data);
};

/* OPEN NOTE MODAL */
const openNoteModal = (index)=>{
setSelectedIndex(index);
setNoteText(attendance[index].reason || "");
setModalVisible(true);
};

/* SAVE NOTE */
const saveNote = ()=>{
if(selectedIndex !== null){
const data = [...attendance];
data[selectedIndex].reason = noteText;
setAttendance(data);
}
setModalVisible(false);
};

/* SUBMIT ATTENDANCE */
const submitAttendance = async()=>{
if(!token){
Toast.show({type:"error",text1:"Authentication Error",text2:"Login again"});
return;
}
if(attendance.length === 0){
Toast.show({type:"error",text1:"No students found"});
return;
}
setLoading(true);
try{
const todayDate = new Date();
const today = `${todayDate.getFullYear()}-${String(todayDate.getMonth()+1).padStart(2,'0')}-${String(todayDate.getDate()).padStart(2,'0')}`;

const payload = attendance.map(item=>({
student:item.student,
classroom:item.classroom,
stream:item.stream,
status:item.status,
reason:item.reason,
date:today
}));

console.log("ATTENDANCE PAYLOAD => ",payload);

const res = await axios.post(
EndPoint + "/bulk-attendance/",
payload,
{
headers:{Authorization:`Token ${token}`,"Content-Type":"application/json"}
}
);

console.log("SUCCESS => ",res.data);
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
Toast.show({type:"success",text1:"Success",text2:"Attendance saved successfully"});
setLoading(false);
}catch(e){
setLoading(false);
console.log("ERROR => ",e.response?.data);
Toast.show({type:"error",text1:"Error",text2:JSON.stringify(e.response?.data)});
}
};

/* =========================
UI
========================= */
return(

<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>

<Image source={{uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"}} style={styles.bg}/>

<Header title="Take Attendance" subtitle={`${className} ${streamName}`}/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:300}}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>Attendance</Text>

{students.map((st,index)=>{

const isPresent = attendance[index]?.status === "present";

return(
<View key={st.id} style={{
backgroundColor:"#1e293b",
padding:15,
borderRadius:12,
marginBottom:10,
borderWidth:1,
borderColor:"#334155"
}}>

<Text style={{color:"#fff",fontWeight:"bold",fontSize:16}}>
{st.first_name} {st.last_name}
</Text>

<Text style={{color:"#94a3b8"}}>
Adm: {st.admission_number}
</Text>

<View style={{flexDirection:"row",marginTop:10}}>

<TouchableOpacity
onPress={()=>toggleStatus(index,"present")}
style={{
flex:1,
padding:10,
borderRadius:8,
backgroundColor:isPresent ? "#16a34a" : "#0f172a",
marginRight:5,
alignItems:"center"
}}
>
<Text style={{color:"#fff"}}>Present</Text>
</TouchableOpacity>

<TouchableOpacity
onPress={()=>toggleStatus(index,"absent")}
style={{
flex:1,
padding:10,
borderRadius:8,
backgroundColor:!isPresent ? "#dc2626" : "#0f172a",
marginLeft:5,
alignItems:"center"
}}
>
<Text style={{color:"#fff"}}>Absent</Text>
</TouchableOpacity>

</View>

{/* ======== NOTE ICON ======== */}
<TouchableOpacity
onPress={()=>openNoteModal(index)}
style={{
marginTop:10,
padding:6,
backgroundColor:"#2563eb",
borderRadius:8,
alignSelf:"flex-start"
}}
>
<Text style={{color:"#fff"}}>Add Reason / Note</Text>
</TouchableOpacity>

</View>
)
})}

<Animated.View style={{transform:[{scale:scaleAnim}]}}>
<TouchableOpacity
onPressIn={pressIn}
onPressOut={pressOut}
onPress={submitAttendance}
>
<LinearGradient colors={["#2563eb","#38bdf8"]} style={styles.button}>
<Text style={styles.buttonText}>Submit Attendance</Text>
</LinearGradient>
</TouchableOpacity>
</Animated.View>

</BlurView>
</ScrollView>

{/* ======== NOTE MODAL ======== */}
<Modal visible={modalVisible} transparent animationType="fade">
<View style={{flex:1,backgroundColor:"rgba(0,0,0,0.7)",justifyContent:"center",alignItems:"center"}}>
<View style={{width:"85%",backgroundColor:"#1e293b",borderRadius:15,padding:20}}>

<Text style={{color:"#fff",fontSize:18,fontWeight:"bold",marginBottom:15,textAlign:"center"}}>
Add Reason / Note
</Text>

<TextInput
value={noteText}
onChangeText={setNoteText}
placeholder="Type reason here..."
placeholderTextColor="#94a3b8"
style={{
backgroundColor:"#0f172a",
color:"#fff",
padding:12,
borderRadius:10,
height:120,
textAlignVertical:"top"
}}
multiline
/>

<TouchableOpacity onPress={saveNote} style={{marginTop:15}}>
<LinearGradient colors={["#22c55e","#16a34a"]} style={{padding:12,borderRadius:10}}>
<Text style={{color:"#fff",textAlign:"center"}}>Save Reason</Text>
</LinearGradient>
</TouchableOpacity>

<TouchableOpacity onPress={()=>setModalVisible(false)} style={{marginTop:10}}>
<Text style={{color:"#ef4444",textAlign:"center"}}>Cancel</Text>
</TouchableOpacity>

</View>
</View>
</Modal>

{loading &&(
<View style={styles.loader}>
<View style={styles.loaderCard}>
<ActivityIndicator size="large" color="#2563eb"/>
<Text style={styles.loadingText}>Saving attendance...</Text>
</View>
</View>
)}

<Toast/>
</LinearGradient>
)
}