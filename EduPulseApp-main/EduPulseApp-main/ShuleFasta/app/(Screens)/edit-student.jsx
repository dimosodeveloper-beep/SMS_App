import React,{useState,useEffect,useRef} from "react";

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

import {useRouter,useLocalSearchParams} from "expo-router";

export default function EditStudent(){

const router = useRouter();
const params = useLocalSearchParams();

/* PREFILL DATA */
const[firstName,setFirstName] = useState(params.first_name);
const[lastName,setLastName] = useState(params.last_name);

const[classroom,setClassroom] = useState(params.classroom);
const[stream,setStream] = useState(params.stream);

const[parent,setParent] = useState(params.parent);
const[parentSearch,setParentSearch] = useState("");

const[admission,setAdmission] = useState(params.admission_number);
const[gender,setGender] = useState(params.gender);

const[classrooms,setClassrooms] = useState([]);
const[streams,setStreams] = useState([]);
const[parents,setParents] = useState([]);
const[filteredParents,setFilteredParents] = useState([]);

const[token,setToken] = useState(null);
const[loading,setLoading] = useState(false);

const scaleAnim = useRef(new Animated.Value(1)).current;

const pressIn=()=>{ Animated.spring(scaleAnim,{toValue:0.95,useNativeDriver:true}).start(); }
const pressOut=()=>{ Animated.spring(scaleAnim,{toValue:1,useNativeDriver:true}).start(); }

/* LOAD TOKEN */
useEffect(()=>{
const loadToken = async()=>{
const t = await AsyncStorage.getItem("userToken");
setToken(t);
};
loadToken();
},[]);

/* FETCH DATA */
useEffect(()=>{
if(token){
fetchClassrooms();
fetchParents();
if(classroom){
fetchStreams(classroom);
}
}
},[token]);

const fetchClassrooms = async()=>{
try{
const res = await axios.get(
EndPoint+"/classes/",
{headers:{Authorization:`Token ${token}`}}
);
setClassrooms(res.data);
}catch(e){}
};

const fetchStreams = async(classId)=>{
try{
const res = await axios.get(
EndPoint+"/streams/"+classId+"/",
{headers:{Authorization:`Token ${token}`}}
);
setStreams(res.data);
}catch(e){}
};

const fetchParents = async()=>{
try{
const res = await axios.get(
EndPoint+"/parents/",
{headers:{Authorization:`Token ${token}`}}
);
setParents(res.data);
}catch(e){}
};

/* CLASS CHANGE */
const handleClassChange = (value)=>{
setClassroom(value);
setStream(null);
if(value){
fetchStreams(value);
}
};

/* SEARCH PARENT */
const handleParentSearch = (text)=>{
setParentSearch(text);

if(text.trim()===""){
setFilteredParents([]);
return;
}

const filtered = parents.filter((item)=>
item.username.toLowerCase().includes(text.toLowerCase())
).slice(0,6);

setFilteredParents(filtered);
};

const selectParent = (item)=>{
setParent(item.id);
setParentSearch(item.username);
setFilteredParents([]);
};

/* UPDATE */
const updateStudent = async()=>{

if(!firstName || !lastName || !classroom || !stream || !admission || !gender){
Toast.show({type:"error",text1:"Fill all fields"});
return;
}

setLoading(true);

try{

await axios.put(
EndPoint+`/update-delete-student/${params.id}/`,
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
headers:{Authorization:`Token ${token}`}
}
);

Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

Toast.show({type:"success",text1:"Updated Successfully"});

router.back();

}catch(e){

Toast.show({
type:"error",
text1:"Error",
text2:JSON.stringify(e.response?.data)
});

}

setLoading(false);
};

return(
<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>

<Image source={{uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"}} style={styles.bg}/>

<Header title="Edit Student" subtitle="Update Student"/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:300}}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>Edit Student</Text>

<View style={styles.form}>

<Text style={styles.label}>First Name</Text>
<TextInput style={styles.input} value={firstName} onChangeText={setFirstName}/>

<Text style={styles.label}>Last Name</Text>
<TextInput style={styles.input} value={lastName} onChangeText={setLastName}/>

<Text style={styles.label}>Select Classroom</Text>
<View style={{borderWidth:1,borderColor:"#334155",borderRadius:10,marginBottom:20}}>
<Picker
selectedValue={classroom}
onValueChange={(value)=>handleClassChange(value)}
style={{color:"#fff"}}
>
<Picker.Item label="Select Classroom" value={null}/>
{classrooms.map((item)=>(
<Picker.Item key={item.id} label={item.name} value={item.id}/>
))}
</Picker>
</View>

<Text style={styles.label}>Select Stream</Text>
<View style={{borderWidth:1,borderColor:"#334155",borderRadius:10,marginBottom:20}}>
<Picker
selectedValue={stream}
onValueChange={(val)=>setStream(val)}
style={{color:"#fff"}}
>
<Picker.Item label="Select Stream" value={null}/>
{streams.map((item)=>(
<Picker.Item key={item.id} label={item.name} value={item.id}/>
))}
</Picker>
</View>

<Text style={styles.label}>Search Parent</Text>
<TextInput
style={styles.input}
value={parentSearch}
onChangeText={handleParentSearch}
placeholder="Type parent username..."
placeholderTextColor="#94a3b8"
/>

{filteredParents.length>0 &&(
<View style={{
backgroundColor:"#0f172a",
borderWidth:1,
borderColor:"#334155",
borderRadius:10,
marginTop:-10,
marginBottom:20
}}>
{filteredParents.map((item)=>(
<TouchableOpacity
key={item.id}
onPress={()=>selectParent(item)}
style={{padding:12,borderBottomWidth:1,borderBottomColor:"#1e293b"}}
>
<Text style={{color:"#fff"}}>{item.username}</Text>
</TouchableOpacity>
))}
</View>
)}

<Text style={styles.label}>Admission Number</Text>
<TextInput style={styles.input} value={admission} onChangeText={setAdmission}/>

<Text style={styles.label}>Gender</Text>
<TextInput style={styles.input} value={gender} onChangeText={setGender}/>

<Animated.View style={{transform:[{scale:scaleAnim}],marginTop:20}}>
<TouchableOpacity onPressIn={pressIn} onPressOut={pressOut} onPress={updateStudent}>
<LinearGradient colors={["#2563eb","#38bdf8"]} style={styles.button}>
<Text style={styles.buttonText}>Update Student</Text>
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
<Text style={styles.loadingText}>Updating...</Text>
</View>
</View>
)}

<Toast/>

</LinearGradient>
)
}