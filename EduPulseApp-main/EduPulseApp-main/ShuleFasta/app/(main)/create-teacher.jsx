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

import {useRouter} from "expo-router";


export default function CreateTeacher(){

const router = useRouter();

const[user,setUser] = useState(null);
const[phone,setPhone] = useState("");
const[subjectsSelected,setSubjectsSelected] = useState([]);

const[users,setUsers] = useState([]);
const[subjects,setSubjects] = useState([]);

const[showUsers,setShowUsers] = useState(false);

const[loading,setLoading] = useState(false);
const[token,setToken] = useState(null);

const scaleAnim = new Animated.Value(1);

const pressIn=()=>{
Animated.spring(scaleAnim,{toValue:0.95,useNativeDriver:true}).start();
}

const pressOut=()=>{
Animated.spring(scaleAnim,{toValue:1,useNativeDriver:true}).start();
}

useEffect(()=>{
const loadToken = async()=>{
const savedToken = await AsyncStorage.getItem("userToken");
setToken(savedToken);
};
loadToken();
},[]);

useEffect(()=>{
if(token){
fetchUsers(token);
fetchSubjects(token);
}
},[token]);

const fetchUsers = async(token)=>{
try{
const response = await axios.get(
EndPoint + "/teacher-users/",
{
headers:{ Authorization:`Token ${token}` }
}
);
setUsers(response.data);
}catch(error){
console.log(error);
}
}

const fetchSubjects = async(token)=>{
try{
const response = await axios.get(
EndPoint + "/subjects/",
{
headers:{ Authorization:`Token ${token}` }
}
);
setSubjects(response.data);
}catch(error){
console.log(error);
}
}

const toggleSubject = (id)=>{
if(subjectsSelected.includes(id)){
setSubjectsSelected(subjectsSelected.filter(item=>item !== id));
}else{
setSubjectsSelected([...subjectsSelected,id]);
}
}

const createTeacher = async()=>{

if(!user || !phone || subjectsSelected.length === 0){
Toast.show({
type:"error",
text1:"Missing Fields",
text2:"Fill all required fields"
});
return;
}

setLoading(true);

try{

await axios.post(
EndPoint + "/create-teacher/",
{
user:user,
phone:phone,
subject:subjectsSelected
},
{
headers:{
Authorization:`Token ${token}`,
"Content-Type":"application/json"
}
}
);

Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

setLoading(false);

Toast.show({
type:"success",
text1:"Teacher Created"
});

router.back();

}catch(error){

setLoading(false);

Toast.show({
type:"error",
text1:"Failed"
});

}

}

return(

<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>

<Image
source={{uri:"https://images.unsplash.com/photo-1577896851231-70ef18881754"}}
style={[styles.bg,{opacity:0.25}]}
/>

<Header title="School Dashboard" subtitle="Management System"/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:500}}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>Register Teacher</Text>

<View style={styles.form}>

<Text style={styles.label}>Select User</Text>

<TouchableOpacity
onPress={()=>setShowUsers(!showUsers)}
style={{
backgroundColor:"#0f172a",
padding:12,
borderRadius:10,
borderWidth:1,
borderColor:"#334155",
marginBottom:10
}}
>
<Text style={{color:"#fff"}}>
{user ? users.find(u=>u.id===user)?.username : "Click to select user"}
</Text>
</TouchableOpacity>

{showUsers && (
<LinearGradient
colors={["#1e293b","#020617"]}
style={{
borderRadius:10,
padding:10,
marginBottom:15
}}
>
{users.map((item)=>(
<TouchableOpacity
key={item.id}
onPress={()=>{
setUser(item.id);
setShowUsers(false);
}}
style={{
padding:10,
borderBottomWidth:1,
borderBottomColor:"#334155"
}}
>
<Text style={{color:"#fff"}}>{item.username}</Text>
</TouchableOpacity>
))}
</LinearGradient>
)}

<Text style={styles.label}>Phone</Text>

<TextInput
style={styles.input}
value={phone}
onChangeText={setPhone}
placeholder="Phone"
placeholderTextColor="#94a3b8"
/>

<Text style={styles.label}>Select Subjects</Text>

{subjects.map((item)=>(
<TouchableOpacity
key={item.id}
onPress={()=>toggleSubject(item.id)}
style={{flexDirection:"row",alignItems:"center",marginBottom:10}}
>
<Text style={{color:"#fff",fontSize:18}}>
{subjectsSelected.includes(item.id) ? "☑":"☐"}
</Text>
<Text style={{color:"#fff",marginLeft:10}}>
{item.name}
</Text>
</TouchableOpacity>
))}

<Animated.View style={{transform:[{scale:scaleAnim}]}}>

<TouchableOpacity onPressIn={pressIn} onPressOut={pressOut} onPress={createTeacher}>

<LinearGradient colors={["#2563eb","#38bdf8"]} style={styles.button}>
<Text style={styles.buttonText}>Create Teacher</Text>
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
<Text style={styles.loadingText}>Creating teacher...</Text>
</View>
</View>
)}

<Toast/>

</LinearGradient>

)

}