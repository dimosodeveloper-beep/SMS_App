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
Toast.show({type:"error",text1:"Error"});
}

setLoading(false);
};

return(

<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>

<Header title="Attendance History" subtitle={`${className} ${streamName}`}/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:200}}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

{data.map(item=>(

<View key={item.id} style={{
backgroundColor:"#1e293b",
padding:15,
borderRadius:12,
marginBottom:10,
borderWidth:1,
borderColor:"#334155"
}}>

<View style={{flexDirection:"row",justifyContent:"space-between"}}>

<View>

<Text style={{color:"#fff",fontWeight:"bold"}}>
{item.name}
</Text>

<Text style={{color:"#94a3b8"}}>
Adm: {item.admission_number}
</Text>

{/* <Text style={{color:"#64748b",fontSize:12}}>
From {item.created.split("T")[0]} to Today
</Text> */}

</View>

<Image
source={{uri:"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}}
style={{width:50,height:50,borderRadius:50}}
/>

</View>

<View style={{flexDirection:"row",marginTop:10}}>

<View style={{
flex:1,
backgroundColor:"#16a34a",
padding:8,
borderRadius:8,
marginRight:5
}}>
<Text style={{color:"#fff",textAlign:"center"}}>
{item.present}
</Text>
</View>

<View style={{
flex:1,
backgroundColor:"#dc2626",
padding:8,
borderRadius:8
}}>
<Text style={{color:"#fff",textAlign:"center"}}>
{item.absent}
</Text>
</View>

</View>

{/* ICON BUTTON */}
<TouchableOpacity
onPress={()=>router.push({
pathname:"/(Attendance)/view-attendance-statistics",
params:{
studentId:item.id
}
})}
style={{
marginTop:10,
alignItems:"flex-end"
}}
>

<Image
source={{uri:"https://cdn-icons-png.flaticon.com/512/709/709612.png"}}
style={{width:28,height:28,tintColor:"#38bdf8"}}
/>

</TouchableOpacity>

</View>

))}

</BlurView>

</ScrollView>

{loading &&(
<ActivityIndicator size="large" color="#2563eb"/>
)}

<Toast/>

</LinearGradient>

)
}