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

import {useRouter,useLocalSearchParams} from "expo-router";

export default function AllStudents(){

const router = useRouter();

const {streamId,streamName,className} = useLocalSearchParams();

const[students,setStudents] = useState([]);
const[filteredStudents,setFilteredStudents] = useState([]);
const[search,setSearch] = useState("");

const[loading,setLoading] = useState(false);

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


const fetchStudents = async()=>{

setLoading(true);

try{

const token = await AsyncStorage.getItem("token");

if(!token){

Toast.show({
type:"error",
text1:"Authentication Error",
text2:"Login again"
});

setLoading(false);
return;

}

const response = await axios.get(

EndPoint + "/students/stream/" + streamId + "/",

{
headers:{
Authorization:`Token ${token}`,
"Content-Type":"application/json"
}
}

);

console.log("STUDENTS => ",response.data);

setStudents(response.data);
setFilteredStudents(response.data);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

setLoading(false);

}catch(error){

setLoading(false);

console.log("ERROR => ",error.response?.data);

Toast.show({
type:"error",
text1:"Error fetching students",
text2:JSON.stringify(error.response?.data)
});

}

}


useEffect(()=>{
fetchStudents();
},[]);



const handleSearch=(text)=>{

setSearch(text);

if(text === ""){
setFilteredStudents(students);
return;
}

const filtered = students.filter((item)=>
(item.first_name + " " + item.last_name)
.toLowerCase()
.includes(text.toLowerCase())
);

setFilteredStudents(filtered);

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
paddingBottom:300
}}
showsVerticalScrollIndicator={false}
keyboardShouldPersistTaps="handled"
>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>
Students - {className} {streamName}
</Text>

<Text style={styles.subtitle}>
Students in this stream
</Text>


<View style={{marginTop:20}}>

<TextInput
value={search}
onChangeText={handleSearch}
placeholder="Search student..."
placeholderTextColor="#94a3b8"
style={{
backgroundColor:"#0f172a",
borderWidth:1,
borderColor:"#334155",
borderRadius:10,
padding:12,
color:"#fff",
marginBottom:20
}}
/>


{filteredStudents.length === 0 && !loading &&(

<Text style={{
color:"#94a3b8",
textAlign:"center",
marginTop:30
}}>
No students found
</Text>

)}


{filteredStudents.map((item,index)=>{

return(

<Animated.View
key={item.id}
style={{
transform:[{scale:scaleAnim}],
marginBottom:15
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

<View style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
}}>

<View>

<Text style={{
color:"#ffffff",
fontSize:18,
fontWeight:"bold"
}}>
{item.first_name} {item.last_name}
</Text>

<Text style={{
color:"#94a3b8",
marginTop:4
}}>
Adm: {item.admission_number}
</Text>

<Text style={{
color:"#64748b",
marginTop:2
}}>
Gender: {item.gender}
</Text>

</View>

<View style={{
backgroundColor:"#2563eb",
paddingHorizontal:12,
paddingVertical:6,
borderRadius:8
}}>

<Text style={{
color:"#ffffff",
fontWeight:"bold"
}}>
ID {item.id}
</Text>

</View>

</View>

</LinearGradient>

</TouchableOpacity>

</Animated.View>

)

})}

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
Fetching students...
</Text>

</View>

</View>

)}

<Toast/>

</LinearGradient>

)

}