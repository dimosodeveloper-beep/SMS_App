import React, { useState, useEffect } from "react";
import {
View,
Text,
TouchableOpacity,
ScrollView,
ActivityIndicator,
Modal,
Alert,
ImageBackground
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { EndPoint } from "../../components/links";
import Header from "../../components/Header";
import { useLocalSearchParams } from "expo-router";

export default function AllReportCards(){

const {classId,examId,categoryName} = useLocalSearchParams();

const[token,setToken] = useState(null);
const[loading,setLoading] = useState(false);
const[students,setStudents] = useState([]);
const[summary,setSummary] = useState({});
const[modalVisible,setModalVisible] = useState(false);

/* ================= TOKEN ================= */
useEffect(()=>{
const loadToken = async()=>{
const t = await AsyncStorage.getItem("userToken");
setToken(t);
};
loadToken();
},[]);

/* ================= FETCH ================= */
useEffect(()=>{
if(token) fetchReportCards();
},[token]);

const fetchReportCards = async()=>{
setLoading(true);
try{
const res = await axios.get(
`${EndPoint}/all_report_cards/?class_id=${classId}&exam_id=${examId}`,
{ headers:{Authorization:`Token ${token}`} }
);

setStudents(res.data.students);
setSummary(res.data.summary);

}catch(e){
console.log(e);
Alert.alert("Error","Failed to load reports");
}
setLoading(false);
};

/* ================= SEND REPORTS ================= */
const sendReports = async()=>{
setModalVisible(false);
try{
const studentIds = students.map(s=>s.student_id);

const res = await axios.post(
`${EndPoint}/send_report_cards/`,
{student_ids:studentIds,exam_id:examId},
{headers:{Authorization:`Token ${token}`}}
);

Alert.alert("Success",res.data.message);

}catch(e){
console.log(e);
Alert.alert("Error sending reports");
}
};

/* ================= LOADING ================= */
if(loading){
return(
<View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"#020617"}}>
<ActivityIndicator size="large" color="#2563eb"/>
<Text style={{color:"#fff",marginTop:10}}>Loading Report Cards...</Text>
</View>
);
}

return(

<ImageBackground
source={{uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"}}
style={{flex:1}}
blurRadius={3}
>

<LinearGradient
colors={["rgba(2,6,23,0.95)","rgba(15,23,42,0.95)"]}
style={{flex:1}}
>

<Header title="Report Cards" subtitle={categoryName}/>

{/* ================= SUMMARY ================= */}
<BlurView intensity={40} tint="dark" style={{margin:15,padding:15,borderRadius:15}}>

<Text style={{color:"#fff",fontSize:18,fontWeight:"bold"}}>
Class Performance Summary
</Text>

<View style={{flexDirection:"row",flexWrap:"wrap",marginTop:15}}>

<View style={{width:"50%",padding:5}}>
<View style={{backgroundColor:"#0f172a",padding:15,borderRadius:12}}>
<Text style={{color:"#94a3b8"}}>Total Students</Text>
<Text style={{color:"#22c55e",fontSize:20,fontWeight:"bold"}}>
{summary.total_students || 0}
</Text>
</View>
</View>

{summary.grades_count && Object.keys(summary.grades_count).map((g,index)=>(
<View key={index} style={{width:"50%",padding:5}}>
<View style={{backgroundColor:"#0f172a",padding:15,borderRadius:12}}>
<Text style={{color:"#94a3b8"}}>Grade {g}</Text>
<Text style={{color:"#facc15",fontSize:18,fontWeight:"bold"}}>
{summary.grades_count[g]}
</Text>
</View>
</View>
))}

</View>

</BlurView>

{/* ================= REPORT CARDS ================= */}
<ScrollView contentContainerStyle={{padding:10,paddingBottom:120}}>

{students.map((item,index)=>{

let badgeColor="#334155";
if(index===0) badgeColor="#facc15";
if(index===1) badgeColor="#94a3b8";
if(index===2) badgeColor="#f97316";

return(

<View key={index} style={{marginBottom:15}}>

<LinearGradient
colors={["#1e293b","#020617"]}
style={{
borderRadius:18,
padding:18,
borderWidth:1,
borderColor:"#334155"
}}
>

{/* HEADER */}
<View style={{flexDirection:"row",justifyContent:"space-between"}}>

<View style={{flexDirection:"row",alignItems:"center"}}>

<View style={{
width:40,
height:40,
borderRadius:20,
backgroundColor:badgeColor,
justifyContent:"center",
alignItems:"center",
marginRight:10
}}>
<Text style={{fontWeight:"bold"}}>{index+1}</Text>
</View>

<View>
<Text style={{color:"#fff",fontWeight:"bold",fontSize:16}}>
{item.name}
</Text>
<Text style={{color:"#94a3b8"}}>
{item.class} - {item.stream}
</Text>
</View>

</View>

<View style={{alignItems:"flex-end"}}>
<Text style={{color:"#22c55e",fontWeight:"bold"}}>
Avg {item.average}
</Text>
<Text style={{color:"#facc15"}}>
Grade {item.grade}
</Text>
</View>

</View>

{/* DIVIDER */}
<View style={{height:1,backgroundColor:"#334155",marginVertical:10}}/>

{/* BODY */}
<View style={{flexDirection:"row",justifyContent:"space-between"}}>

<View>
<Text style={{color:"#94a3b8"}}>Total Marks</Text>
<Text style={{color:"#38bdf8",fontWeight:"bold"}}>
{item.total_marks}
</Text>
</View>

<View>
<Text style={{color:"#94a3b8"}}>Exams</Text>
<Text style={{color:"#fff",fontWeight:"bold"}}>
{item.exams_count}
</Text>
</View>

<View>
<Text style={{color:"#94a3b8"}}>Position</Text>
<Text style={{color:"#fff",fontWeight:"bold"}}>
{index+1}/{students.length}
</Text>
</View>

</View>

</LinearGradient>

</View>

);

})}

</ScrollView>

{/* ================= FLOAT BUTTON ================= */}
<TouchableOpacity
onPress={()=>setModalVisible(true)}
style={{
position:"absolute",
bottom:150,
right:20
}}
>

<LinearGradient
colors={["#2563eb","#38bdf8"]}
style={{
padding:18,
borderRadius:50
}}
>
<Text style={{color:"#fff",fontWeight:"bold"}}>
Send Reports
</Text>
</LinearGradient>

</TouchableOpacity>

{/* ================= MODAL ================= */}
<Modal visible={modalVisible} transparent animationType="fade">

<View style={{
flex:1,
backgroundColor:"rgba(0,0,0,0.7)",
justifyContent:"center",
alignItems:"center"
}}>

<View style={{
width:"85%",
backgroundColor:"#020617",
padding:20,
borderRadius:15
}}>

<Text style={{
color:"#fff",
fontSize:18,
fontWeight:"bold",
textAlign:"center",
marginBottom:20
}}>
Send reports to {students.length} parents?
</Text>

<TouchableOpacity onPress={sendReports}>
<LinearGradient
colors={["#22c55e","#4ade80"]}
style={{padding:12,borderRadius:10,marginBottom:10}}
>
<Text style={{color:"#000",textAlign:"center",fontWeight:"bold"}}>
Confirm Send
</Text>
</LinearGradient>
</TouchableOpacity>

<TouchableOpacity onPress={()=>setModalVisible(false)}>
<Text style={{color:"#ef4444",textAlign:"center"}}>
Cancel
</Text>
</TouchableOpacity>

</View>

</View>

</Modal>

</LinearGradient>
</ImageBackground>

);

}