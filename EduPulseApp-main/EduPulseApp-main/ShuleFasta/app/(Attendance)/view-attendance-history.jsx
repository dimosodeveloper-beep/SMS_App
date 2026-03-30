import React,{useState,useEffect} from "react";

import{
View,
Text,
TouchableOpacity,
Image,
ActivityIndicator,
ScrollView
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {LinearGradient} from "expo-linear-gradient";
import {BlurView} from "expo-blur";

import Toast from "react-native-toast-message";

import styles from "../../components/LoginStyles";
import {EndPoint} from "../../components/links";
import Header from "../../components/Header";

import {useLocalSearchParams,useRouter} from "expo-router";

export default function AttendanceHistory(){

const router = useRouter();

const {streamId,className,streamName} = useLocalSearchParams();

const[token,setToken] = useState(null);
const[data,setData] = useState([]);
const[loading,setLoading] = useState(false);

useEffect(()=>{
const loadToken = async()=>{
const t = await AsyncStorage.getItem("userToken");
setToken(t);
};
loadToken();
},[]);

useEffect(()=>{
if(token){
fetchData();
}
},[token]);

const fetchData = async()=>{
setLoading(true);

try{

const res = await axios.get(
EndPoint + `/stream-attendance-stats/${streamId}/`,
{
headers:{Authorization:`Token ${token}`}
}
);

setData(res.data);

}catch(e){
Toast.show({type:"error",text1:"Error loading data"});
}

setLoading(false);
};

return(

<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>

<Header title="Attendance History" subtitle={`${className} ${streamName}`}/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:200}}>

{data.map(item=>(

<BlurView key={item.id} intensity={40} tint="dark" style={{
padding:15,
borderRadius:15,
marginBottom:12,
borderWidth:1,
borderColor:"#334155"
}}>

<View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>

<View>

<Text style={{color:"#fff",fontWeight:"bold",fontSize:16}}>
{item.name}
</Text>

<Text style={{color:"#94a3b8"}}>
Adm: {item.admission_number}
</Text>

</View>

<Image
source={{uri:"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}}
style={{width:45,height:45,borderRadius:50}}
/>

</View>

{/* STATS */}
<View style={{flexDirection:"row",marginTop:12}}>

<View style={{
flex:1,
backgroundColor:"#16a34a",
padding:10,
borderRadius:10,
marginRight:5
}}>
<Text style={{color:"#fff",textAlign:"center"}}>
Present: {item.present}
</Text>
</View>

<View style={{
flex:1,
backgroundColor:"#dc2626",
padding:10,
borderRadius:10
}}>
<Text style={{color:"#fff",textAlign:"center"}}>
Absent: {item.absent}
</Text>
</View>

</View>

{/* PERCENTAGE */}
<View style={{
marginTop:10,
backgroundColor:"#0f172a",
padding:8,
borderRadius:8
}}>
<Text style={{color:"#38bdf8",textAlign:"center"}}>
Attendance: {item.percentage}%
</Text>
</View>

{/* BUTTON */}
<TouchableOpacity
onPress={()=>router.push({
pathname:"/(Attendance)/view-attendance-statistics",
params:{studentId:item.id}
})}
style={{marginTop:12}}
>

<LinearGradient colors={["#2563eb","#38bdf8"]} style={{
padding:10,
borderRadius:10,
alignItems:"center"
}}>
<Text style={{color:"#fff"}}>View Full Statistics</Text>
</LinearGradient>

</TouchableOpacity>

</BlurView>

))}

</ScrollView>

{loading &&(
<ActivityIndicator size="large" color="#2563eb"/>
)}

<Toast/>

</LinearGradient>

)
}