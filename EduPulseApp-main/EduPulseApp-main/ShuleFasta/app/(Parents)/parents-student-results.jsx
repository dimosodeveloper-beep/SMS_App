import React,{useState,useEffect} from "react";
import{
View,
Text,
Image,
ActivityIndicator,
ScrollView,
Animated
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

export default function ChildResults(){

const {examId,categoryName} = useLocalSearchParams();

const[token,setToken] = useState(null);
const[loading,setLoading] = useState(false);
const[data,setData] = useState(null);
const[noData,setNoData] = useState(false);

const scaleAnim = new Animated.Value(1);

/* ================= GRADE COLOR ================= */
const getGradeColor = (grade)=>{
switch(grade){
case "A": return "#22c55e";
case "B": return "#4ade80";
case "C": return "#facc15";
case "D": return "#fb923c";
case "E": return "#f87171";
default: return "#ef4444";
}
};

/* ================= TOKEN ================= */
useEffect(()=>{
const loadToken = async()=>{
const savedToken = await AsyncStorage.getItem("userToken");

if(!savedToken){
Toast.show({ type:"error", text1:"Login required" });
return;
}

setToken(savedToken);
};

loadToken();
},[]);

/* ================= FETCH ================= */
useEffect(()=>{
if(token) fetchResults(token);
},[token]);

const fetchResults = async(token)=>{

setLoading(true);
setNoData(false);
setData(null);

try{

const childRes = await axios.get(
EndPoint + "/parent-children/",
{
headers:{Authorization:`Token ${token}`}
}
);

const studentId = childRes.data[0]?.id;

if(!studentId){
setNoData(true);
setLoading(false);
return;
}

const res = await axios.get(
EndPoint + `/parent-child-results/${studentId}/${examId}/`,
{
headers:{Authorization:`Token ${token}`}
}
);

// 🔥 FIX: empty safe check
if(!res.data || !res.data.details || res.data.details.length === 0){
setNoData(true);
setLoading(false);
return;
}

setData(res.data);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

}catch(e){

console.log("ERROR => ",e.response?.data);

Toast.show({
type:"error",
text1:"Error",
text2:"No results found"
});

setNoData(true);

}

setLoading(false);
};

/* ================= LOADING ================= */
if(loading){
return(
<View style={[styles.container,{justifyContent:"center",alignItems:"center"}]}>
<ActivityIndicator size="large" color="#2563eb"/>
<Text style={{color:"#fff",marginTop:10}}>
Loading results...
</Text>
</View>
);
}

/* ================= NO DATA ================= */
if(noData){
return(
<View style={[styles.container,{justifyContent:"center",alignItems:"center",padding:20}]}>
<Text style={{color:"#fff",fontSize:18,fontWeight:"bold",textAlign:"center"}}>
Hakuna matokeo yaliyopatikana
</Text>

<Text style={{color:"#94a3b8",marginTop:10,textAlign:"center"}}>
Mtoto hana matokeo kwa mtihani huu kwa sasa.
</Text>
</View>
);
}

/* ================= SAFETY CHECK ================= */
if(!data){
return(
<View style={[styles.container,{justifyContent:"center",alignItems:"center"}]}>
<ActivityIndicator size="large" color="#2563eb"/>
<Text style={{color:"#fff",marginTop:10}}>
Preparing data...
</Text>
</View>
);
}

return(

<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>

<Image
source={{uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"}}
style={styles.bg}
/>

<Header title="Child Results" subtitle={categoryName}/>

<ScrollView contentContainerStyle={{padding:15,paddingBottom:200}}>

{/* ================= SUMMARY ================= */}
<BlurView intensity={40} tint="dark" style={[styles.blur,{padding:20}]}>

<Text style={styles.title}>
{data?.name}
</Text>

<View style={{flexDirection:"row",justifyContent:"space-between",marginTop:15}}>

<View style={{
flex:1,
backgroundColor:"#0f172a",
marginRight:8,
padding:15,
borderRadius:12,
alignItems:"center"
}}>
<Text style={{color:"#94a3b8"}}>Average</Text>
<Text style={{color:"#22c55e",fontSize:20,fontWeight:"bold"}}>
{data?.average}
</Text>
</View>

<View style={{
flex:1,
backgroundColor:"#0f172a",
marginHorizontal:4,
padding:15,
borderRadius:12,
alignItems:"center"
}}>
<Text style={{color:"#94a3b8"}}>Grade</Text>
<Text style={{
color:getGradeColor(data?.grade),
fontSize:20,
fontWeight:"bold"
}}>
{data?.grade}
</Text>
</View>

<View style={{
flex:1,
backgroundColor:"#0f172a",
marginLeft:8,
padding:15,
borderRadius:12,
alignItems:"center"
}}>
<Text style={{color:"#94a3b8"}}>Total</Text>
<Text style={{color:"#38bdf8",fontSize:20,fontWeight:"bold"}}>
{data?.total_marks}
</Text>
</View>

</View>

<View style={{marginTop:20}}>
<Text style={{color:"#94a3b8",marginBottom:5}}>
Performance Level
</Text>

<View style={{
height:10,
backgroundColor:"#334155",
borderRadius:10,
overflow:"hidden"
}}>

<View style={{
width:`${data?.average || 0}%`,
height:"100%",
backgroundColor:"#22c55e"
}}/>

</View>

</View>

</BlurView>

{/* ================= SUBJECTS ================= */}
<BlurView intensity={40} tint="dark" style={[styles.blur,{marginTop:15}]}>
<Text style={styles.title}>Subjects</Text>

{data?.details?.map((item,index)=>{

const gradeColor = getGradeColor(item.grade);

return(

<Animated.View
key={index}
style={{
transform:[{scale:scaleAnim}],
marginTop:15
}}
>

<LinearGradient
colors={["#1e293b","#0f172a"]}
style={{
padding:18,
borderRadius:14,
borderWidth:1,
borderColor:"#334155"
}}
>

<View style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
}}>

<View>
<Text style={{
color:"#fff",
fontWeight:"bold",
fontSize:16
}}>
{item.subject}
</Text>

<Text style={{color:"#94a3b8"}}>
{item.exam}
</Text>
</View>

<View style={{
backgroundColor:gradeColor,
paddingHorizontal:12,
paddingVertical:5,
borderRadius:8
}}>
<Text style={{
color:"#000",
fontWeight:"bold"
}}>
{item.grade}
</Text>
</View>

</View>

<View style={{marginTop:10}}>

<Text style={{
color:"#fff",
fontSize:22,
fontWeight:"bold"
}}>
{item.marks} Marks
</Text>

<Text style={{
color:"#64748b",
marginTop:4
}}>
📅 {item.exam_date}
</Text>

</View>

</LinearGradient>

</Animated.View>

);

})}

</BlurView>

</ScrollView>

<Toast/>

</LinearGradient>

);
}