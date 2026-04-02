import React,{useState,useEffect,useRef} from "react";
import{
View,Text,Image,ActivityIndicator,ScrollView,TouchableOpacity
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {LinearGradient} from "expo-linear-gradient";
import {BlurView} from "expo-blur";

import Toast from "react-native-toast-message";

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import styles from "../../components/LoginStyles";
import {EndPoint} from "../../components/links";
import Header from "../../components/Header";

import {useLocalSearchParams} from "expo-router";

export default function ClassTimetable(){

const {classId} = useLocalSearchParams();

const[token,setToken] = useState(null);
const[data,setData] = useState([]);
const[loading,setLoading] = useState(false);
const[dragItem,setDragItem] = useState(null);

/* DAYS */
const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];

/* SUBJECT COLORS */
const getColor = (subject)=>{
if(!subject) return ["#1e293b","#0f172a"];

const s = subject.toLowerCase();

if(s.includes("math")) return ["#00c6ff","#0072ff"];
if(s.includes("eng")) return ["#00ff87","#60efff"];
if(s.includes("sci")) return ["#f7971e","#ffd200"];
if(s.includes("hist")) return ["#ff416c","#ff4b2b"];

return ["#7f00ff","#e100ff"];
};

/* LOAD TOKEN */
useEffect(()=>{
const load = async()=>{
const t = await AsyncStorage.getItem("userToken");
setToken(t);
};
load();
},[]);

/* FETCH */
useEffect(()=>{
if(token && classId){
fetchData();
}
},[token,classId]);

const fetchData = async()=>{

setLoading(true);

try{

const res = await axios.get(
EndPoint+`/class-timetable/${classId}/`,
{
headers:{Authorization:`Token ${token}`}
}
);

setData(res.data);

}catch(e){

Toast.show({
type:"error",
text1:"Failed",
text2:"Error loading timetable"
});

}

setLoading(false);
};

/* TIME SLOTS */
const timeSlots = [...new Set(
data.map(item=>item.start_time+"-"+item.end_time)
)];

/* FIND CELL */
const getCell = (day,time)=>{
return data.find(
i => i.day === day && (i.start_time+"-"+i.end_time) === time
);
};

/* DRAG START */
const startDrag = (item)=>{
setDragItem(item);
};

/* DROP */
const onDrop = (day,time)=>{
if(!dragItem) return;

const updated = data.map(i=>{
if(i.id === dragItem.id){
return{
...i,
day:day,
start_time:time.split("-")[0],
end_time:time.split("-")[1]
};
}
return i;
});

setData(updated);
setDragItem(null);

Toast.show({
type:"success",
text1:"Moved successfully"
});
};

/* EXPORT PDF */
const exportPDF = async()=>{

let html = `
<h1>Class Timetable</h1>
<table border="1" style="width:100%;border-collapse:collapse;">
<tr>
<th>Time</th>
${days.map(d=>`<th>${d}</th>`).join("")}
</tr>
`;

timeSlots.forEach(time=>{
html += `<tr><td>${time}</td>`;

days.forEach(d=>{
const cell = getCell(d,time);
html += `<td>${
cell 
? cell.subject_name+" ("+cell.teacher_name+") - "+cell.stream_name 
: "-"
}</td>`;
});

html += `</tr>`;
});

html += `</table>`;

const {uri} = await Print.printToFileAsync({html});
await Sharing.shareAsync(uri);
};

return(
<LinearGradient colors={["#020617","#020617","#0a0f2c","#020617"]} style={styles.container}>

<Image
source={{uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"}}
style={styles.bg}
/>

<Header title="Timetable" subtitle="Advanced Grid"/>

<TouchableOpacity
onPress={exportPDF}
style={{
backgroundColor:"#22c55e",
padding:10,
margin:10,
borderRadius:12,
alignItems:"center",
shadowColor:"#22c55e",
shadowOpacity:0.6,
shadowRadius:10
}}>
<Text style={{color:"#fff",fontWeight:"bold"}}>
Export PDF
</Text>
</TouchableOpacity>

<ScrollView horizontal>
<ScrollView contentContainerStyle={{padding:10,paddingBottom:200}}>

<BlurView intensity={60} tint="dark" style={[styles.blur,{
borderRadius:20,
overflow:"hidden",
borderWidth:1,
borderColor:"rgba(255,255,255,0.1)"
}]}>

<LinearGradient
colors={["rgba(255,255,255,0.05)","rgba(255,255,255,0.02)"]}
style={{padding:15}}
>

<Text style={[styles.title,{color:"#e0f2fe"}]}>
Class Timetable
</Text>

{/* HEADER */}
<View style={{flexDirection:"row",marginTop:20}}>

<View style={{width:100}}/>

{days.map((d,index)=>(
<LinearGradient
key={index}
colors={["#0ea5e9","#2563eb"]}
style={{
width:120,
padding:10,
borderWidth:1,
borderColor:"rgba(255,255,255,0.1)",
borderRadius:8,
margin:2
}}>
<Text style={{color:"#fff",fontWeight:"bold",textAlign:"center"}}>
{d}
</Text>
</LinearGradient>
))}

</View>

{/* GRID */}
{timeSlots.map((time,index)=>(
<View key={index} style={{flexDirection:"row"}}>

<LinearGradient
colors={["#0f172a","#1e293b"]}
style={{
width:100,
padding:10,
borderWidth:1,
borderColor:"rgba(255,255,255,0.1)",
borderRadius:8,
margin:2
}}>
<Text style={{color:"#22c55e"}}>
{time}
</Text>
</LinearGradient>

{days.map((d,i)=>{

const cell = getCell(d,time);

return(
<TouchableOpacity
key={i}
onLongPress={()=>cell && startDrag(cell)}
onPress={()=>onDrop(d,time)}
style={{
width:120,
minHeight:80,
margin:2,
borderRadius:10,
overflow:"hidden",
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)"
}}
>

{cell ? (
<LinearGradient
colors={getColor(cell.subject_name)}
style={{
padding:8,
flex:1,
justifyContent:"center",
borderRadius:10,
shadowColor:"#000",
shadowOpacity:0.5,
shadowRadius:8
}}
>

<Text style={{color:"#fff",fontWeight:"bold"}}>
{cell.subject_name}
</Text>

<Text style={{color:"#e2e8f0"}}>
{cell.teacher_name}
</Text>

<Text style={{color:"#cbd5f5",fontSize:12}}>
📚 {cell.stream_name}
</Text>

</LinearGradient>
):(
<LinearGradient
colors={["rgba(255,255,255,0.03)","rgba(255,255,255,0.01)"]}
style={{
flex:1,
justifyContent:"center",
alignItems:"center"
}}>
<Text style={{color:"#64748b"}}>
{dragItem ? "Drop Here" : "-"}
</Text>
</LinearGradient>
)}

</TouchableOpacity>
)

})}

</View>
))}

{data.length === 0 && !loading &&(
<Text style={{color:"#94a3b8",textAlign:"center",marginTop:30}}>
No timetable available
</Text>
)}

</LinearGradient>

</BlurView>

</ScrollView>
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