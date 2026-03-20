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
import {Ionicons} from "@expo/vector-icons";

export default function AllExams(){

const router = useRouter();

const [exams,setExams] = useState([]);
const [filteredExams,setFilteredExams] = useState([]);
const [search,setSearch] = useState("");
const [loading,setLoading] = useState(false);
const [token,setToken] = useState(null);

const scaleAnim = new Animated.Value(1);

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
const savedToken = await AsyncStorage.getItem("userToken");
setToken(savedToken);
};
loadToken();
},[]);

/* FETCH EXAMS */
useEffect(()=>{
if(token){
fetchExams(token);
}
},[token]);

const fetchExams = async(token)=>{
setLoading(true);

try{

const response = await axios.get(
EndPoint + "/exams/",
{
headers:{
Authorization:`Token ${token}`,
"Content-Type":"application/json"
}
}
);

setExams(response.data);
setFilteredExams(response.data);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

setLoading(false);

}catch(error){

setLoading(false);

Toast.show({
type:"error",
text1:"Error fetching exams",
text2:JSON.stringify(error.response?.data)
});

}

};

/* SEARCH */
const handleSearch=(text)=>{

setSearch(text);

if(text === ""){
setFilteredExams(exams);
return;
}

const filtered = exams.filter((item)=>
item.name.toLowerCase().includes(text.toLowerCase())
);

setFilteredExams(filtered);

};

/* NAVIGATE */
const goToCreate = ()=>{
router.push("/(Screens)/create-exam");
};

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
title="Exams"
subtitle="School Management System"
/>

<ScrollView
contentContainerStyle={{
padding:10,
paddingBottom:300
}}
>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>All Exams</Text>

<TextInput
value={search}
onChangeText={handleSearch}
placeholder="Search exam..."
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

{filteredExams.map(item=>(

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

<Text style={{color:"#fff",fontSize:18,fontWeight:"bold"}}>
{item.name}
</Text>

<Text style={{color:"#94a3b8"}}>
Date: {item.date}
</Text>

</LinearGradient>

</TouchableOpacity>

</Animated.View>

))}

</BlurView>

</ScrollView>

{/* FLOAT BUTTON */}
<TouchableOpacity
onPress={goToCreate}
style={{
position:"absolute",
bottom:30,
right:20
}}
>

<LinearGradient
colors={["#2563eb","#38bdf8"]}
style={{
width:65,
height:65,
borderRadius:35,
justifyContent:"center",
alignItems:"center"
}}
>

<Ionicons name="add" size={30} color="#fff"/>

</LinearGradient>

</TouchableOpacity>

{loading &&(
<View style={styles.loader}>
<ActivityIndicator size="large" color="#2563eb"/>
</View>
)}

<Toast/>

</LinearGradient>

)

}