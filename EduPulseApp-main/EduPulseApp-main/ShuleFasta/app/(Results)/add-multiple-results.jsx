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

export default function BulkResultUpload(){

const[students,setStudents] = useState([]);
const[subjects,setSubjects] = useState([]);
const[exams,setExams] = useState([]);

const[results,setResults] = useState([
{student:null,subject:null,exam:null,marks:"",searchStudent:"",searchSubject:"",searchExam:"",showStudent:false,showSubject:false,showExam:false}
]);

const[loading,setLoading] = useState(false);
const[token,setToken] = useState(null);

const scaleAnim = new Animated.Value(1);

const pressIn=()=>{Animated.spring(scaleAnim,{toValue:0.95,useNativeDriver:true}).start();}
const pressOut=()=>{Animated.spring(scaleAnim,{toValue:1,useNativeDriver:true}).start();}

/* LOAD TOKEN */
useEffect(()=>{
const loadToken = async()=>{
const savedToken = await AsyncStorage.getItem("userToken");
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
const filterStudents = (text)=>{
return students.filter(x =>
(`${x.first_name} ${x.last_name}`).toLowerCase().includes(text.toLowerCase())
);
};

const filterSubjects = (text)=>{
return subjects.filter(x =>
x.name.toLowerCase().includes(text.toLowerCase())
);
};

const filterExams = (text)=>{
return exams.filter(x =>
x.name.toLowerCase().includes(text.toLowerCase())
);
};

/* UPDATE */
const updateField = (index,key,value)=>{
const data = [...results];
data[index][key] = value;
setResults(data);
};

/* ADD ROW */
const addRow = ()=>{
setResults([
...results,
{student:null,subject:null,exam:null,marks:"",searchStudent:"",searchSubject:"",searchExam:"",showStudent:false,showSubject:false,showExam:false}
]);
};

/* VALIDATION */
const validateForm = ()=>{

for(let i=0;i<results.length;i++){

const row = results[i];

if(!row.student){
Toast.show({
type:"error",
text1:`Row ${i+1}`,
text2:"Select student"
});
return false;
}

if(!row.subject){
Toast.show({
type:"error",
text1:`Row ${i+1}`,
text2:"Select subject"
});
return false;
}

if(!row.exam){
Toast.show({
type:"error",
text1:`Row ${i+1}`,
text2:"Select exam"
});
return false;
}

if(!row.marks){
Toast.show({
type:"error",
text1:`Row ${i+1}`,
text2:"Enter marks"
});
return false;
}

if(isNaN(row.marks)){
Toast.show({
type:"error",
text1:`Row ${i+1}`,
text2:"Marks must be number"
});
return false;
}

}

return true;
};

/* SUBMIT */
const uploadResults = async()=>{

if(!token){
Toast.show({type:"error",text1:"Login required"});
return;
}

/* 🔥 VALIDATION FIRST */
const isValid = validateForm();
if(!isValid){
return;
}

setLoading(true);

try{

const payload = results.map(item=>({
student:item.student,
subject:item.subject,
exam:item.exam,
marks:parseFloat(item.marks)
}));

console.log("BULK PAYLOAD => ",payload);

const res = await axios.post(
EndPoint + "/bulk-results/",
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
text1:"Success",
text2:"All results saved"
});

setResults([
{student:null,subject:null,exam:null,marks:"",searchStudent:"",searchSubject:"",searchExam:"",showStudent:false,showSubject:false,showExam:false}
]);

setLoading(false);

}catch(error){

setLoading(false);

console.log("ERROR => ",error.response?.data);

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

<Header title="Bulk Results" subtitle="Upload Multiple"/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:500}}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>Bulk Upload</Text>

{results.map((item,index)=>(

<View key={index} style={{
backgroundColor:"#1e293b",
padding:10,
borderRadius:12,
marginBottom:15,
borderWidth:1,
borderColor:"#334155"
}}>

<Text style={{color:"#38bdf8",marginBottom:5}}>Student</Text>

<TextInput
style={styles.input}
placeholder="Search student..."
value={item.searchStudent}
onFocus={()=>updateField(index,"showStudent",true)}
onChangeText={(t)=>{
updateField(index,"searchStudent",t);
updateField(index,"showStudent",true);
}}
/>

{item.showStudent && filterStudents(item.searchStudent).slice(0,5).map(st=>(
<TouchableOpacity
key={st.id}
style={{backgroundColor:"#020617",padding:10,marginVertical:3,borderRadius:8}}
onPress={()=>{
updateField(index,"student",st.id);
updateField(index,"searchStudent",st.first_name+" "+st.last_name);
updateField(index,"showStudent",false);
}}
>
<Text style={{color:"#fff"}}>{st.first_name} {st.last_name}</Text>
</TouchableOpacity>
))}

<Text style={{color:"#38bdf8",marginTop:10}}>Subject</Text>

<TextInput
style={styles.input}
placeholder="Search subject..."
value={item.searchSubject}
onFocus={()=>updateField(index,"showSubject",true)}
onChangeText={(t)=>{
updateField(index,"searchSubject",t);
updateField(index,"showSubject",true);
}}
/>

{item.showSubject && filterSubjects(item.searchSubject).slice(0,5).map(sub=>(
<TouchableOpacity
key={sub.id}
style={{backgroundColor:"#020617",padding:10,marginVertical:3,borderRadius:8}}
onPress={()=>{
updateField(index,"subject",sub.id);
updateField(index,"searchSubject",sub.name);
updateField(index,"showSubject",false);
}}
>
<Text style={{color:"#fff"}}>{sub.name}</Text>
</TouchableOpacity>
))}

<Text style={{color:"#38bdf8",marginTop:10}}>Exam</Text>

<TextInput
style={styles.input}
placeholder="Search exam..."
value={item.searchExam}
onFocus={()=>updateField(index,"showExam",true)}
onChangeText={(t)=>{
updateField(index,"searchExam",t);
updateField(index,"showExam",true);
}}
/>

{item.showExam && filterExams(item.searchExam).slice(0,5).map(ex=>(
<TouchableOpacity
key={ex.id}
style={{backgroundColor:"#020617",padding:10,marginVertical:3,borderRadius:8}}
onPress={()=>{
updateField(index,"exam",ex.id);
updateField(index,"searchExam",ex.name);
updateField(index,"showExam",false);
}}
>
<Text style={{color:"#fff"}}>{ex.name}</Text>
</TouchableOpacity>
))}

<Text style={{color:"#38bdf8",marginTop:10}}>Marks</Text>

<TextInput
style={styles.input}
value={item.marks}
onChangeText={(v)=>updateField(index,"marks",v)}
keyboardType="numeric"
/>

</View>

))}

<TouchableOpacity onPress={addRow}>
<Text style={{color:"#38bdf8",marginBottom:15}}>+ Add Another Student</Text>
</TouchableOpacity>

<Animated.View style={{transform:[{scale:scaleAnim}]}}>

<TouchableOpacity onPressIn={pressIn} onPressOut={pressOut} onPress={uploadResults}>

<LinearGradient colors={["#2563eb","#38bdf8"]} style={styles.button}>
<Text style={styles.buttonText}>Upload Results</Text>
</LinearGradient>

</TouchableOpacity>

</Animated.View>

</BlurView>

</ScrollView>

{loading &&(
<View style={styles.loader}>
<View style={styles.loaderCard}>
<ActivityIndicator size="large" color="#2563eb"/>
<Text style={styles.loadingText}>Uploading...</Text>
</View>
</View>
)}

<Toast/>

</LinearGradient>

)
}