import React,{useState,useEffect} from "react";

import{
View,
Text,
TouchableOpacity,
Image,
ActivityIndicator,
ScrollView,
Animated,
Modal
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

import {useLocalSearchParams,useRouter} from "expo-router";

export default function StudentResults(){

const router = useRouter();

const {studentId,categoryId} = useLocalSearchParams();

const[token,setToken] = useState(null);
const[loading,setLoading] = useState(false);
const[results,setResults] = useState([]);

const[modalVisible,setModalVisible] = useState(false);

const scaleAnim = new Animated.Value(1);

/* ================= GRADE FUNCTION ================= */
const getGrade = (marks)=>{
if(marks >= 80) return "A";
if(marks >= 70) return "B";
if(marks >= 50) return "C";
if(marks >= 40) return "D";
if(marks >= 30) return "E";
return "F";
}

/* ================= GRADE COLOR ================= */
const getGradeColor = (grade)=>{
switch(grade){
case "A": return "#22c55e"; // green
case "B": return "#4ade80";
case "C": return "#facc15"; // yellow
case "D": return "#fb923c"; // orange
case "E": return "#f87171"; // light red
default: return "#ef4444"; // red
}
}

/* Animation */
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

/* LOAD TOKEN */
useEffect(()=>{
const loadToken = async()=>{
const t = await AsyncStorage.getItem("userToken");
setToken(t);
};
loadToken();
},[]);

/* FETCH RESULTS */
useEffect(()=>{
if(token){
fetchResults();
}
},[token]);

const fetchResults = async()=>{

setLoading(true);

try{

const res = await axios.get(
EndPoint + `/student_results/${studentId}/?category_id=${categoryId}`,
{
headers:{Authorization:`Token ${token}`}
}
);

setResults(res.data);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

}catch(e){

console.log("ERROR => ",e.response?.data);

Toast.show({
type:"error",
text1:"Error fetching results",
text2:JSON.stringify(e.response?.data)
});

}

setLoading(false);
};

return(

<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>

<Image
source={{uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"}}
style={styles.bg}
/>

<Header title="Student Results" subtitle="Detailed performance"/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:200}}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>
Subjects Performance
</Text>

<Text style={{color:"#94a3b8",marginBottom:10}}>
Marks per subject and exam
</Text>

{results.length === 0 && !loading &&(
<Text style={{
color:"#94a3b8",
textAlign:"center",
marginTop:30
}}>
No results found
</Text>
)}

{results.map((item,index)=>{

const grade = getGrade(item.marks);
const gradeColor = getGradeColor(grade);

return(

<Animated.View
key={index}
style={{
transform:[{scale:scaleAnim}],
marginTop:15
}}
>

<TouchableOpacity
onPressIn={pressIn}
onPressOut={pressOut}
activeOpacity={0.9}
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

{/* HEADER */}
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
backgroundColor:"#2563eb",
paddingHorizontal:10,
paddingVertical:4,
borderRadius:8
}}>
<Text style={{color:"#fff",fontWeight:"bold"}}>
Marks
</Text>
</View>

</View>

{/* DETAILS */}
<View style={{marginTop:10}}>

<Text style={{
color:gradeColor,
fontSize:22,
fontWeight:"bold"
}}>
{item.marks}
</Text>

{/* ================= GRADE DISPLAY ================= */}
<View style={{
marginTop:6,
flexDirection:"row",
alignItems:"center"
}}>

<Text style={{
color:"#94a3b8",
marginRight:5
}}>
Grade:
</Text>

<View style={{
backgroundColor:gradeColor,
paddingHorizontal:10,
paddingVertical:3,
borderRadius:6
}}>
<Text style={{
color:"#000",
fontWeight:"bold"
}}>
{grade}
</Text>
</View>

</View>

</View>

</LinearGradient>

</TouchableOpacity>

</Animated.View>

)

})}

</BlurView>

</ScrollView>



{/* MODAL */}
<Modal visible={modalVisible} transparent animationType="fade">

<View style={{
flex:1,
backgroundColor:"rgba(0,0,0,0.7)",
justifyContent:"center",
alignItems:"center"
}}>

<View style={{
width:"85%",
backgroundColor:"#1e293b",
borderRadius:15,
padding:20
}}>

<Text style={{
color:"#fff",
fontSize:18,
fontWeight:"bold",
marginBottom:15,
textAlign:"center"
}}>
Options
</Text>

<TouchableOpacity
onPress={()=>{
setModalVisible(false);
router.push("/(Results)/results-summary");
}}
>

<LinearGradient colors={["#2563eb","#38bdf8"]} style={{
padding:12,
borderRadius:10,
marginBottom:10
}}>
<Text style={{color:"#fff",textAlign:"center"}}>
📊 Results Summary
</Text>
</LinearGradient>

</TouchableOpacity>

<TouchableOpacity
onPress={()=>{
setModalVisible(false);
router.push("/home");
}}
>

<LinearGradient colors={["#22c55e","#16a34a"]} style={{
padding:12,
borderRadius:10,
marginBottom:10
}}>
<Text style={{color:"#fff",textAlign:"center"}}>
🏠 Go Home
</Text>
</LinearGradient>

</TouchableOpacity>

<TouchableOpacity onPress={()=>setModalVisible(false)}>
<Text style={{color:"#ef4444",textAlign:"center",marginTop:10}}>
Close
</Text>
</TouchableOpacity>

</View>

</View>

</Modal>

{/* LOADING */}
{loading &&(
<View style={styles.loader}>
<View style={styles.loaderCard}>
<ActivityIndicator size="large" color="#2563eb"/>
<Text style={styles.loadingText}>Loading results...</Text>
</View>
</View>
)}

<Toast/>

</LinearGradient>

)

}