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

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {LinearGradient} from "expo-linear-gradient";
import {BlurView} from "expo-blur";

import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";

import styles from "../../components/LoginStyles";
import {EndPoint} from "../../components/links";
import Header from "../../components/Header";

export default function AddResult(){

const[students,setStudents] = useState([]);
const[subjects,setSubjects] = useState([]);
const[exams,setExams] = useState([]);

const[student,setStudent] = useState(null);
const[subject,setSubject] = useState(null);
const[exam,setExam] = useState(null);

const[marks,setMarks] = useState("");

const[searchStudent,setSearchStudent] = useState("");
const[searchSubject,setSearchSubject] = useState("");
const[searchExam,setSearchExam] = useState("");

const[showStudent,setShowStudent] = useState(false);
const[showSubject,setShowSubject] = useState(false);
const[showExam,setShowExam] = useState(false);

const[loading,setLoading] = useState(false);
const[token,setToken] = useState(null);

const scaleAnim = new Animated.Value(1);

/* ANIMATION */
const pressIn=()=>{Animated.spring(scaleAnim,{toValue:0.95,useNativeDriver:true}).start();}
const pressOut=()=>{Animated.spring(scaleAnim,{toValue:1,useNativeDriver:true}).start();}

/* LOAD TOKEN */
useEffect(()=>{
const loadToken = async()=>{
const savedToken = await AsyncStorage.getItem("userToken");

if(!savedToken){
Toast.show({
type:"error",
text1:"Authentication Error",
text2:"Login again"
});
return;
}

setToken(savedToken);
};
loadToken();
},[]);

/* FETCH DATA */
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

const sub = await axios.get(EndPoint+"/subjects/",{
headers:{Authorization:`Token ${token}`}
});

const ex = await axios.get(EndPoint+"/exams/",{
headers:{Authorization:`Token ${token}`}
});

setStudents(s.data);
setSubjects(sub.data);
setExams(ex.data);

}catch(e){
console.log("FETCH ERROR => ",e.response?.data || e.message);
}
};

/* FILTER */
const filteredStudents = students.filter(x =>
(`${x.first_name} ${x.last_name}`).toLowerCase().includes(searchStudent.toLowerCase())
);

const filteredSubjects = subjects.filter(x =>
x.name.toLowerCase().includes(searchSubject.toLowerCase())
);

const filteredExams = exams.filter(x =>
x.name.toLowerCase().includes(searchExam.toLowerCase())
);

/* SUBMIT */
const createResult = async()=>{

if(!student || !subject || !exam || !marks){
Toast.show({type:"error",text1:"Fill all fields"});
return;
}

if(!token){
Toast.show({type:"error",text1:"Token missing"});
return;
}

setLoading(true);

try{

const payload = {
student:student,
subject:subject,
exam:exam,
marks:parseFloat(marks)
};

console.log("PAYLOAD => ",payload);
console.log("TOKEN => ",token);

const res = await axios.post(
EndPoint + "/add-result/",
payload,
{
headers:{
Authorization:`Token ${token}`,
"Content-Type":"application/json"
}
}
);

console.log("SUCCESS => ",res.data);

Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

Toast.show({
type:"success",
text1:"Result Saved"
});

setStudent(null);
setSubject(null);
setExam(null);
setMarks("");

setSearchStudent("");
setSearchSubject("");
setSearchExam("");

setLoading(false);

}catch(error){

setLoading(false);

console.log("ERROR => ",error.response?.data || error.message);

Toast.show({
type:"error",
text1:"Error",
text2:JSON.stringify(error.response?.data)
});

}
};

return(

<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>

<Image
source={{uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"}}
style={styles.bg}
/>

<Header title="Add Result" subtitle="School System"/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:300}}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>Add Result</Text>

<View style={styles.form}>

{/* STUDENT */}
<Text style={styles.label}>Student</Text>

<TouchableOpacity onPress={()=>setShowStudent(true)}>
<TextInput
style={styles.input}
placeholder="Select student"
value={searchStudent}
editable={false}
/>
</TouchableOpacity>

{showStudent && (
<View style={{
backgroundColor:"#0f172a",
borderRadius:12,
padding:10,
marginBottom:10,
maxHeight:200
}}>

<TextInput
placeholder="Search..."
placeholderTextColor="#94a3b8"
style={[styles.input,{marginBottom:10}]}
value={searchStudent}
onChangeText={setSearchStudent}
/>

<ScrollView>
{filteredStudents.map(item=>(
<TouchableOpacity
key={item.id}
onPress={()=>{
setStudent(item.id);
setSearchStudent(item.first_name+" "+item.last_name);
setShowStudent(false);
}}
>
<Text style={{color:"#fff",padding:8}}>
{item.first_name} {item.last_name}
</Text>
</TouchableOpacity>
))}
</ScrollView>

</View>
)}

{/* SUBJECT */}
<Text style={styles.label}>Subject</Text>

<TouchableOpacity onPress={()=>setShowSubject(true)}>
<TextInput
style={styles.input}
placeholder="Select subject"
value={searchSubject}
editable={false}
/>
</TouchableOpacity>

{showSubject && (
<View style={{
backgroundColor:"#0f172a",
borderRadius:12,
padding:10,
marginBottom:10,
maxHeight:200
}}>

<TextInput
placeholder="Search..."
placeholderTextColor="#94a3b8"
style={[styles.input,{marginBottom:10}]}
value={searchSubject}
onChangeText={setSearchSubject}
/>

<ScrollView>
{filteredSubjects.map(item=>(
<TouchableOpacity
key={item.id}
onPress={()=>{
setSubject(item.id);
setSearchSubject(item.name);
setShowSubject(false);
}}
>
<Text style={{color:"#fff",padding:8}}>
{item.name}
</Text>
</TouchableOpacity>
))}
</ScrollView>

</View>
)}

{/* EXAM */}
<Text style={styles.label}>Exam</Text>

<TouchableOpacity onPress={()=>setShowExam(true)}>
<TextInput
style={styles.input}
placeholder="Select exam"
value={searchExam}
editable={false}
/>
</TouchableOpacity>

{showExam && (
<View style={{
backgroundColor:"#0f172a",
borderRadius:12,
padding:10,
marginBottom:10,
maxHeight:200
}}>

<TextInput
placeholder="Search..."
placeholderTextColor="#94a3b8"
style={[styles.input,{marginBottom:10}]}
value={searchExam}
onChangeText={setSearchExam}
/>

<ScrollView>
{filteredExams.map(item=>(
<TouchableOpacity
key={item.id}
onPress={()=>{
setExam(item.id);
setSearchExam(item.name);
setShowExam(false);
}}
>
<Text style={{color:"#fff",padding:8}}>
{item.name}
</Text>
</TouchableOpacity>
))}
</ScrollView>

</View>
)}

{/* MARKS */}
<Text style={styles.label}>Marks</Text>

<TextInput
style={styles.input}
value={marks}
onChangeText={setMarks}
keyboardType="numeric"
/>

<Animated.View style={{transform:[{scale:scaleAnim}]}}>

<TouchableOpacity
onPressIn={pressIn}
onPressOut={pressOut}
onPress={createResult}
>

<LinearGradient colors={["#2563eb","#38bdf8"]} style={styles.button}>
<Text style={styles.buttonText}>Save Result</Text>
</LinearGradient>

</TouchableOpacity>

</Animated.View>

</View>

</BlurView>

</ScrollView>

{loading &&(
<View style={styles.loader}>
<View style={styles.loaderCard}>
<ActivityIndicator size="large" color="#2563eb"/>
<Text style={styles.loadingText}>Saving...</Text>
</View>
</View>
)}

<Toast/>

</LinearGradient>

)
}