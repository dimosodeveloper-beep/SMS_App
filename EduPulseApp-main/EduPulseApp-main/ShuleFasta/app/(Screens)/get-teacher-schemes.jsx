import React,{useState,useEffect,useRef} from "react";
import{
View,
Text,
Image,
ActivityIndicator,
ScrollView,
TouchableOpacity,
TextInput,
Keyboard
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

import {
MaterialCommunityIcons,
Ionicons
} from "@expo/vector-icons";

export default function TeacherSchemes(){

const {teacherId} = useLocalSearchParams();

const [token,setToken] = useState(null);
const [data,setData] = useState([]);
const [loading,setLoading] = useState(false);

const [teachers,setTeachers] = useState([]);

const [teacherFilter,setTeacherFilter] = useState("");
const [selectedTeacher,setSelectedTeacher] = useState(null);

const [showTeacherOptions,setShowTeacherOptions] = useState(false);

const [termFilter,setTermFilter] = useState("");

/* TERMS */
const terms = ["term1","term2","term3","term4"];

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
if(token){
fetchTeachers();
fetchData();
}
},[token,teacherId,selectedTeacher,termFilter]);

const fetchTeachers = async()=>{

try{

const res = await axios.get(
EndPoint + `/GetTeachersSelectedField/`,
{
headers:{Authorization:`Token ${token}`}
}
);

setTeachers(res.data);

}catch(e){
console.log(e);
}

};

const fetchData = async()=>{

setLoading(true);

try{

let url = EndPoint+`/teacher-scheme/all/?`;

if(selectedTeacher){
url += `teacher=${selectedTeacher.id}&`;
}

if(termFilter){
url += `term=${termFilter}&`;
}

const res = await axios.get(
url,
{
headers:{Authorization:`Token ${token}`}
}
);

const sortedData = res.data.sort((a,b)=>{

const dateA = new Date(a.from_date);
const dateB = new Date(b.from_date);

return dateA - dateB;

});

setData(sortedData);

}catch(e){

Toast.show({
type:"error",
text1:"Failed",
text2:"Error loading teacher schemes"
});

}

setLoading(false);
};

/* FILTERED TEACHERS */
const filteredTeachers = teachers.filter(i =>
i.username.toLowerCase().includes(
teacherFilter.toLowerCase()
)
);

/* FORMAT DATE */
const formatDate = (dateString)=>{

if(!dateString) return "";

const d = new Date(dateString);

const day = String(d.getDate()).padStart(2,"0");
const month = String(d.getMonth()+1).padStart(2,"0");
const year = d.getFullYear();

return `${day}/${month}/${year}`;
};

/* TERM DATA */
const getTermData = (term)=>{

return data
.filter(item => item.term === term)
.sort((a,b)=>{

const dateA = new Date(a.from_date);
const dateB = new Date(b.from_date);

return dateA - dateB;

});

};

/* EXPORT PDF */
const exportPDF = async()=>{

let html = `
<h1>Teacher Scheme</h1>

<table border="1" style="width:100%;border-collapse:collapse;">
<tr>
${terms.map(t=>`<th>${t}</th>`).join("")}
</tr>

<tr>
${terms.map(term=>`

<td valign="top">

${getTermData(term).map(item=>`

<div style="
margin-bottom:20px;
padding:10px;
border:1px solid #ccc;
border-radius:10px;
">

<b>${item.subject_name}</b>
<br/>

${item.classroom_name} - ${item.stream_name}

<br/><br/>

Topic : ${item.topic}

<br/><br/>

Teacher : ${item.teacher_name}

<br/><br/>

Week : ${item.week}

<br/><br/>

From : ${formatDate(item.from_date)}

<br/>

To : ${formatDate(item.to_date)}

</div>

`).join("")}

</td>

`).join("")}
</tr>

</table>
`;

const {uri} = await Print.printToFileAsync({html});
await Sharing.shareAsync(uri);
};

return(
<LinearGradient colors={["#020617","#020617","#0a0f2c","#020617"]} style={styles.container}>

<Image
source={{uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"}}
style={styles.bg}
/>

<Header title="Teacher Scheme" subtitle="Lesson Planning Grid"/>

{/* FILTERS */}
<View style={{paddingHorizontal:10,marginTop:10,zIndex:999}}>

<Text style={{color:"#fff",marginBottom:5,fontWeight:"bold"}}>
Filter By Teacher
</Text>

<View>

<TextInput
placeholder="Search teacher..."
placeholderTextColor="#94a3b8"
value={teacherFilter}
onChangeText={(text)=>{
setTeacherFilter(text);
setSelectedTeacher(null);
setShowTeacherOptions(true);
}}
onFocus={()=>setShowTeacherOptions(true)}
style={{
backgroundColor:"#0f172a",
borderWidth:1,
borderColor:"rgba(255,255,255,0.1)",
padding:12,
borderRadius:12,
color:"#fff"
}}
/>

{showTeacherOptions && teacherFilter !== "" && (

<View
style={{
backgroundColor:"#020617",
borderRadius:12,
marginTop:5,
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)",
maxHeight:220,
overflow:"hidden"
}}
>

<ScrollView
nestedScrollEnabled
keyboardShouldPersistTaps="always"
>

{filteredTeachers.length > 0 ? (

filteredTeachers.map((item,index)=>(
<TouchableOpacity
key={index}
activeOpacity={0.7}
onPress={()=>{

setTeacherFilter(item.username);

setSelectedTeacher(item);

setShowTeacherOptions(false);

Keyboard.dismiss();

}}
style={{
padding:14,
borderBottomWidth:1,
borderBottomColor:"rgba(255,255,255,0.05)"
}}
>

<Text style={{color:"#fff"}}>
{item.username}
</Text>

</TouchableOpacity>
))

):(

<View style={{padding:15}}>
<Text style={{color:"#94a3b8"}}>
No teacher found
</Text>
</View>

)}

</ScrollView>

</View>

)}

</View>

<Text style={{color:"#fff",marginBottom:5,fontWeight:"bold",marginTop:15}}>
Filter By Term
</Text>

<View style={{flexDirection:"row",flexWrap:"wrap"}}>

{terms.map((t,index)=>(
<TouchableOpacity
key={index}
onPress={()=>setTermFilter(t)}
style={{
backgroundColor:termFilter === t ? "#2563eb" : "#0f172a",
paddingVertical:10,
paddingHorizontal:15,
borderRadius:10,
marginRight:8,
marginBottom:8,
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)"
}}
>
<Text style={{color:"#fff"}}>
{t}
</Text>
</TouchableOpacity>
))}

<TouchableOpacity
onPress={()=>{
setTermFilter("");
setTeacherFilter("");
setSelectedTeacher(null);
}}
style={{
backgroundColor:"#dc2626",
paddingVertical:10,
paddingHorizontal:15,
borderRadius:10,
marginBottom:8
}}
>
<Text style={{color:"#fff"}}>
Clear
</Text>
</TouchableOpacity>

</View>

</View>

<TouchableOpacity
onPress={exportPDF}
style={{
backgroundColor:"#22c55e",
padding:10,
margin:10,
borderRadius:12,
alignItems:"center"
}}>
<Text style={{color:"#fff",fontWeight:"bold"}}>
Export PDF
</Text>
</TouchableOpacity>

<ScrollView
horizontal
showsHorizontalScrollIndicator={false}
keyboardShouldPersistTaps="always"
contentContainerStyle={{
paddingBottom:120,
paddingHorizontal:4
}}
>

<View style={{
flexDirection:"row",
alignItems:"flex-start"
}}>

{terms.map((term,index)=>(

<View
key={index}
style={{
width:300,
marginHorizontal:5
}}
>

<LinearGradient
colors={["#111827","#0f172a","#020617"]}
start={{x:0,y:0}}
end={{x:1,y:1}}
style={{
paddingVertical:10,
paddingHorizontal:14,
borderRadius:14,
marginBottom:10,
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)",
flexDirection:"row",
alignItems:"center"
}}
>

<View style={{
width:34,
height:34,
borderRadius:17,
backgroundColor:"rgba(255,255,255,0.08)",
justifyContent:"center",
alignItems:"center",
marginRight:10
}}>

<MaterialCommunityIcons
name="book-education"
size={18}
color="#38bdf8"
/>

</View>

<Text style={{
color:"#fff",
fontWeight:"700",
fontSize:14,
letterSpacing:0.5
}}>
{term.toUpperCase()}
</Text>

</LinearGradient>

<ScrollView
nestedScrollEnabled={true}
showsVerticalScrollIndicator={false}
keyboardShouldPersistTaps="always"
contentContainerStyle={{
paddingBottom:140
}}
>

{getTermData(term).length > 0 ? (

getTermData(term).map((cell,i)=>(

<TouchableOpacity
key={i}
activeOpacity={0.9}
style={{
marginBottom:12,
borderRadius:18,
overflow:"hidden",
borderWidth:1,
borderColor:"rgba(255,255,255,0.06)"
}}
>

<LinearGradient
colors={["#000000","#111827","#020617"]}
start={{x:0,y:0}}
end={{x:1,y:1}}
style={{
padding:15
}}
>

<View style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
marginBottom:10
}}>

<Text style={{
color:"#ffffff",
fontWeight:"bold",
fontSize:16,
flex:1
}}>
{cell.subject_name}
</Text>

<View style={{
backgroundColor:"rgba(255,255,255,0.08)",
paddingHorizontal:10,
paddingVertical:5,
borderRadius:30,
flexDirection:"row",
alignItems:"center"
}}>

<Ionicons
name="calendar-outline"
size={12}
color="#facc15"
/>

<Text style={{
color:"#fff",
fontSize:11,
fontWeight:"bold",
marginLeft:4
}}>
Week {cell.week}
</Text>

</View>

</View>

<View style={{
flexDirection:"row",
alignItems:"center",
marginBottom:8
}}>

<Ionicons
name="school-outline"
size={15}
color="#38bdf8"
/>

<Text style={{
color:"#cbd5e1",
marginLeft:6,
fontSize:13
}}>
{cell.classroom_name} - {cell.stream_name}
</Text>

</View>

<View style={{
backgroundColor:"rgba(255,255,255,0.04)",
padding:10,
borderRadius:12,
marginTop:5
}}>

<Text style={{
color:"#f8fafc",
fontSize:13,
lineHeight:22
}}>
📌 {cell.topic}
</Text>

</View>

<View style={{
flexDirection:"row",
alignItems:"center",
marginTop:12
}}>

<Ionicons
name="person-outline"
size={15}
color="#4ade80"
/>

<Text style={{
color:"#cbd5e1",
fontSize:12,
marginLeft:6
}}>
{cell.teacher_name}
</Text>

</View>

<View style={{
marginTop:14,
paddingTop:12,
borderTopWidth:1,
borderTopColor:"rgba(255,255,255,0.08)"
}}>

<View style={{
flexDirection:"row",
alignItems:"center",
marginBottom:6
}}>

<Ionicons
name="time-outline"
size={14}
color="#facc15"
/>

<Text style={{
color:"#facc15",
fontSize:12,
marginLeft:6
}}>
From : {formatDate(cell.from_date)}
</Text>

</View>

<View style={{
flexDirection:"row",
alignItems:"center"
}}>

<Ionicons
name="checkmark-circle-outline"
size={14}
color="#4ade80"
/>

<Text style={{
color:"#86efac",
fontSize:12,
marginLeft:6
}}>
To : {formatDate(cell.to_date)}
</Text>

</View>

</View>

</LinearGradient>

</TouchableOpacity>

))

):( 

<LinearGradient
colors={["rgba(255,255,255,0.03)","rgba(255,255,255,0.01)"]}
style={{
padding:30,
borderRadius:16,
alignItems:"center",
justifyContent:"center",
borderWidth:1,
borderColor:"rgba(255,255,255,0.05)"
}}
>

<MaterialCommunityIcons
name="book-remove-outline"
size={35}
color="#475569"
/>

<Text style={{
color:"#64748b",
marginTop:10
}}>
No schemes available
</Text>

</LinearGradient>

)}

</ScrollView>

</View>

))}

</View>

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
);
}