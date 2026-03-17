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

import {Picker} from "@react-native-picker/picker";

import styles from "../../components/LoginStyles";
import {EndPoint} from "../../components/links";
import Header from "../../components/Header";

import {useRouter} from "expo-router";


export default function CreateStudent(){

const router = useRouter();

const[firstName,setFirstName] = useState("");
const[lastName,setLastName] = useState("");

const[classroom,setClassroom] = useState(null);
const[stream,setStream] = useState(null);

const[parent,setParent] = useState(null);
const[parentSearch,setParentSearch] = useState("");

const[admission,setAdmission] = useState("");
const[gender,setGender] = useState("");

const[classrooms,setClassrooms] = useState([]);
const[streams,setStreams] = useState([]);
const[parents,setParents] = useState([]);
const[filteredParents,setFilteredParents] = useState([]);

const[loading,setLoading] = useState(false);
const[token,setToken] = useState(null);

const scaleAnim = new Animated.Value(1);



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


/* =========================
LOAD TOKEN
========================= */

useEffect(()=>{

const loadToken = async()=>{

const savedToken = await AsyncStorage.getItem("userToken");

setToken(savedToken);

};

loadToken();

},[]);


/* =========================
FETCH DATA AFTER TOKEN
========================= */

useEffect(()=>{

if(token){

fetchClassrooms(token);
fetchParents(token);

}

},[token]);



const fetchClassrooms = async(token)=>{

try{

console.log("TOKEN => ",token);

const response = await axios.get(

EndPoint + "/classes/",

{
headers:{
Authorization:`Token ${token}`
}
}

);

setClassrooms(response.data);

}catch(error){

console.log("CLASSROOM ERROR",error.response?.data);

}

}



const fetchStreams = async(classId)=>{

try{

const response = await axios.get(

EndPoint + "/streams/" + classId + "/",

{
headers:{
Authorization:`Token ${token}`
}
}

);

setStreams(response.data);

}catch(error){

console.log("STREAM ERROR",error.response?.data);

}

}



const fetchParents = async(token)=>{

try{

const response = await axios.get(

EndPoint + "/parents/",

{
headers:{
Authorization:`Token ${token}`
}
}

);

setParents(response.data);
setFilteredParents(response.data);

}catch(error){

console.log("PARENTS ERROR",error.response?.data);

}

}



const handleClassChange = (value)=>{

setClassroom(value);

setStream(null);

if(value){

fetchStreams(value);

}

};



const handleParentSearch = (text)=>{

setParentSearch(text);

const filtered = parents.filter((item)=>
item.username.toLowerCase().includes(text.toLowerCase())
);

setFilteredParents(filtered);

};



const selectParent = (item)=>{

setParent(item.id);

setParentSearch(item.username);

setFilteredParents([]);

};



const createStudent = async()=>{

if(!firstName || !lastName || !classroom || !stream || !admission || !gender){

Toast.show({
type:"error",
text1:"Missing Fields",
text2:"Fill all required fields"
});

return;

}

if(!token){

Toast.show({
type:"error",
text1:"Authentication Error",
text2:"Login again"
});

return;

}

setLoading(true);

try{

console.log("TOKEN => ",token);

await axios.post(

EndPoint + "/create-student/",

{
first_name:firstName,
last_name:lastName,
classroom:classroom,
stream:stream,
parent:parent,
admission_number:admission,
gender:gender
},

{
headers:{
Authorization:`Token ${token}`,
"Content-Type":"application/json"
}
}

);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

setLoading(false);

Toast.show({
type:"success",
text1:"Student Created",
text2:"Student registered successfully"
});

router.back();

}catch(error){

setLoading(false);

console.log("CREATE STUDENT ERROR => ",error.response?.data);

Toast.show({
type:"error",
text1:"Failed",
text2:"Could not create student"
});

}

}



return(

<LinearGradient
colors={["#020617","#0f172a","#1e293b"]}
style={styles.container}
>

<Image
source={{
uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"
}}
style={styles.bg}
/>

<Header
title="School Dashboard"
subtitle="Management System"
/>

<ScrollView
contentContainerStyle={{
padding:10,
paddingBottom:500
}}
showsVerticalScrollIndicator={false}
keyboardShouldPersistTaps="handled"
>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>Register Student</Text>
<Text style={styles.subtitle}>School Management System</Text>

<View style={styles.form}>

<Text style={styles.label}>First Name</Text>

<TextInput
style={styles.input}
value={firstName}
onChangeText={setFirstName}
placeholder="First name"
placeholderTextColor="#94a3b8"
/>


<Text style={styles.label}>Last Name</Text>

<TextInput
style={styles.input}
value={lastName}
onChangeText={setLastName}
placeholder="Last name"
placeholderTextColor="#94a3b8"
/>



<Text style={styles.label}>Select Classroom</Text>

<View style={{
borderWidth:1,
borderColor:"#334155",
borderRadius:10,
marginBottom:20
}}>

<Picker
selectedValue={classroom}
onValueChange={(value)=>handleClassChange(value)}
style={{color:"#fff"}}
>

<Picker.Item label="Select Classroom" value={null}/>

{classrooms.map((item)=>(
<Picker.Item
key={item.id}
label={item.name}
value={item.id}
/>
))}

</Picker>

</View>



<Text style={styles.label}>Select Stream</Text>

<View style={{
borderWidth:1,
borderColor:"#334155",
borderRadius:10,
marginBottom:20
}}>

<Picker
selectedValue={stream}
onValueChange={(itemValue)=>setStream(itemValue)}
style={{color:"#fff"}}
>

<Picker.Item label="Select Stream" value={null}/>

{streams.map((item)=>(
<Picker.Item
key={item.id}
label={item.name}
value={item.id}
/>
))}

</Picker>

</View>



<Text style={styles.label}>Search Parent</Text>

<TextInput
style={styles.input}
value={parentSearch}
onChangeText={handleParentSearch}
placeholder="Search parent..."
placeholderTextColor="#94a3b8"
/>

{filteredParents.map((item)=>{

return(

<TouchableOpacity
key={item.id}
onPress={()=>selectParent(item)}
style={{
padding:10,
borderBottomWidth:1,
borderBottomColor:"#334155"
}}
>

<Text style={{color:"#fff"}}>
{item.username}
</Text>

</TouchableOpacity>

)

})}



<Text style={styles.label}>Admission Number</Text>

<TextInput
style={styles.input}
value={admission}
onChangeText={setAdmission}
placeholder="Admission number"
placeholderTextColor="#94a3b8"
/>



<Text style={styles.label}>Gender</Text>

<TextInput
style={styles.input}
value={gender}
onChangeText={setGender}
placeholder="Male or Female"
placeholderTextColor="#94a3b8"
/>



<Animated.View style={{transform:[{scale:scaleAnim}]}}

>

<TouchableOpacity
onPressIn={pressIn}
onPressOut={pressOut}
onPress={createStudent}
>

<LinearGradient
colors={["#2563eb","#38bdf8"]}
style={styles.button}
>

<Text style={styles.buttonText}>
Create Student
</Text>

</LinearGradient>

</TouchableOpacity>

</Animated.View>

</View>

</BlurView>

</ScrollView>



{loading &&(

<View style={styles.loader}>

<View style={styles.loaderCard}>

<ActivityIndicator
size="large"
color="#2563eb"
/>

<Text style={styles.loadingText}>
Creating student...
</Text>

</View>

</View>

)}

<Toast/>

</LinearGradient>

)

}