import React,{useState,useEffect} from "react";

import{
View,
Text,
TouchableOpacity,
Image,
ActivityIndicator,
ScrollView,
TextInput
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {LinearGradient} from "expo-linear-gradient";
import {BlurView} from "expo-blur";

import Toast from "react-native-toast-message";

import styles from "../../components/LoginStyles";
import {EndPoint} from "../../components/links";
import Header from "../../components/Header";

import {useLocalSearchParams} from "expo-router";

export default function AttendanceDashboard(){

const {classId,streamId,className,streamName} = useLocalSearchParams();

const[token,setToken] = useState(null);
const[activeTab,setActiveTab] = useState("date");

const[loading,setLoading] = useState(false);

/* DATA */
const[data,setData] = useState([]);
const[studentHistory,setStudentHistory] = useState([]);
const[stats,setStats] = useState(null);

/* INPUTS */
const[selectedDate,setSelectedDate] = useState("");
const[studentId,setStudentId] = useState("");

/* TOKEN */
useEffect(()=>{

const loadToken = async()=>{
const t = await AsyncStorage.getItem("userToken");

if(!t){
Toast.show({type:"error",text1:"Login required"});
return;
}

setToken(t);
};

loadToken();

},[]);


/* =========================
1️⃣ FETCH BY DATE
========================= */
const fetchByDate = async()=>{

if(!selectedDate){
Toast.show({type:"error",text1:"Enter date"});
return;
}

setLoading(true);

try{

const res = await axios.get(
EndPoint + `/attendance/${classId}/${streamId}/${selectedDate}/`,
{
headers:{Authorization:`Token ${token}`}
}
);

setData(res.data);

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


/* =========================
2️⃣ STUDENT HISTORY
========================= */
const fetchHistory = async()=>{

if(!studentId){
Toast.show({type:"error",text1:"Enter student ID"});
return;
}

setLoading(true);

try{

const res = await axios.get(
EndPoint + `/student-attendance/${studentId}/`,
{
headers:{Authorization:`Token ${token}`}
}
);

setStudentHistory(res.data);

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


/* =========================
3️⃣ STATISTICS
========================= */
const fetchStats = async()=>{

if(!studentId){
Toast.show({type:"error",text1:"Enter student ID"});
return;
}

setLoading(true);

try{

const res = await axios.get(
EndPoint + `/attendance-statistics/${studentId}/`,
{
headers:{Authorization:`Token ${token}`}
}
);

setStats(res.data);

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


/* =========================
UI
========================= */
return(

<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>

<Image source={{uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"}} style={styles.bg}/>

<Header title="Attendance Dashboard" subtitle={`${className} ${streamName}`}/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:300}}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

{/* TABS */}
<View style={{flexDirection:"row",marginBottom:15}}>

<TouchableOpacity
onPress={()=>setActiveTab("date")}
style={{
flex:1,
padding:10,
backgroundColor:activeTab==="date"?"#2563eb":"#0f172a",
borderRadius:8,
marginRight:5
}}
>
<Text style={{color:"#fff",textAlign:"center"}}>By Date</Text>
</TouchableOpacity>

<TouchableOpacity
onPress={()=>setActiveTab("history")}
style={{
flex:1,
padding:10,
backgroundColor:activeTab==="history"?"#2563eb":"#0f172a",
borderRadius:8,
marginRight:5
}}
>
<Text style={{color:"#fff",textAlign:"center"}}>History</Text>
</TouchableOpacity>

<TouchableOpacity
onPress={()=>setActiveTab("stats")}
style={{
flex:1,
padding:10,
backgroundColor:activeTab==="stats"?"#2563eb":"#0f172a",
borderRadius:8
}}
>
<Text style={{color:"#fff",textAlign:"center"}}>Stats</Text>
</TouchableOpacity>

</View>


{/* =========================
TAB 1: BY DATE
========================= */}
{activeTab==="date" &&(

<View>

<TextInput
placeholder="YYYY-MM-DD"
placeholderTextColor="#94a3b8"
value={selectedDate}
onChangeText={setSelectedDate}
style={styles.input}
/>

<TouchableOpacity onPress={fetchByDate} style={styles.button}>
<Text style={styles.buttonText}>Fetch</Text>
</TouchableOpacity>

{data.map(item=>(
<View key={item.id} style={{
backgroundColor:"#1e293b",
padding:10,
borderRadius:10,
marginTop:10
}}>
<Text style={{color:"#fff"}}>
Student ID: {item.student}
</Text>
<Text style={{color:"#fff"}}>
Status: {item.status}
</Text>
</View>
))}

</View>

)}


{/* =========================
TAB 2: HISTORY
========================= */}
{activeTab==="history" &&(

<View>

<TextInput
placeholder="Student ID"
placeholderTextColor="#94a3b8"
value={studentId}
onChangeText={setStudentId}
style={styles.input}
/>

<TouchableOpacity onPress={fetchHistory} style={styles.button}>
<Text style={styles.buttonText}>Fetch History</Text>
</TouchableOpacity>

{studentHistory.map(item=>(
<View key={item.id} style={{
backgroundColor:"#1e293b",
padding:10,
borderRadius:10,
marginTop:10
}}>
<Text style={{color:"#fff"}}>
Date: {item.date}
</Text>
<Text style={{color:"#fff"}}>
Status: {item.status}
</Text>
</View>
))}

</View>

)}


{/* =========================
TAB 3: STATS
========================= */}
{activeTab==="stats" &&(

<View>

<TextInput
placeholder="Student ID"
placeholderTextColor="#94a3b8"
value={studentId}
onChangeText={setStudentId}
style={styles.input}
/>

<TouchableOpacity onPress={fetchStats} style={styles.button}>
<Text style={styles.buttonText}>Get Stats</Text>
</TouchableOpacity>

{stats &&(
<View style={{
backgroundColor:"#1e293b",
padding:15,
borderRadius:10,
marginTop:10
}}>
<Text style={{color:"#22c55e"}}>
Present: {stats.present_days}
</Text>
<Text style={{color:"#ef4444"}}>
Absent: {stats.absent_days}
</Text>
<Text style={{color:"#fff"}}>
Total: {stats.total_days}
</Text>
</View>
)}

</View>

)}

</BlurView>

</ScrollView>

{loading &&(
<View style={styles.loader}>
<View style={styles.loaderCard}>
<ActivityIndicator size="large" color="#2563eb"/>
<Text style={styles.loadingText}>Loading...</Text>
</View>
</View>
)}

<Toast/>

</LinearGradient>

)
}