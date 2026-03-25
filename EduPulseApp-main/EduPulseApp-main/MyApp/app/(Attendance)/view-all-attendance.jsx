import React,{useState,useEffect} from "react";

import{
View,
Text,
TouchableOpacity,
Image,
ActivityIndicator,
ScrollView,
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

import DateTimePicker from "@react-native-community/datetimepicker";

export default function AttendanceDashboard(){

const router = useRouter();

const {classId,streamId,className,streamName} = useLocalSearchParams();

const[token,setToken] = useState(null);
const[loading,setLoading] = useState(false);
const[data,setData] = useState([]);

const[selectedDate,setSelectedDate] = useState(new Date());
const[showPicker,setShowPicker] = useState(false);

const[activeTab,setActiveTab] = useState("present");
const[modalVisible,setModalVisible] = useState(false);

/* FORMAT DATE */
const formatDate = (date)=> date.toISOString().split("T")[0];

/* TOKEN */
useEffect(()=>{
const loadToken = async()=>{
const t = await AsyncStorage.getItem("userToken");
if(!t){
Toast.show({type:"error",text1:"Login required"});
return;
}
setToken(t);
};
loadToken();
},[]);

/* FETCH */
useEffect(()=>{
if(token){
fetchAttendance("present");
}
},[token]);

const fetchAttendance = async(status)=>{
setLoading(true);
try{

const res = await axios.get(
EndPoint + `/attendance/${classId}/${streamId}/`,
{
params:{
date: formatDate(selectedDate),
status: status
},
headers:{Authorization:`Token ${token}`}
}
);

setData(res.data);

}catch(e){
Toast.show({type:"error",text1:"Error",text2:JSON.stringify(e.response?.data)});
}
setLoading(false);
};

const handleTab=(t)=>{
setActiveTab(t);
fetchAttendance(t);
};

const onChangeDate=(e,d)=>{
setShowPicker(false);
if(d) setSelectedDate(d);
};

return(

<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>

<Image source={{uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"}} style={styles.bg}/>

<Header title="Attendance" subtitle={`${className} ${streamName}`}/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:200}}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>Attendance List</Text>

<Text style={{color:"#94a3b8",marginBottom:10}}>
Date: {formatDate(selectedDate)}
</Text>

<View style={{flexDirection:"row",marginBottom:15}}>

<TouchableOpacity onPress={()=>handleTab("present")} style={{
flex:1,padding:12,
backgroundColor:activeTab==="present"?"#16a34a":"#0f172a",
borderRadius:10,marginRight:5
}}>
<Text style={{color:"#fff",textAlign:"center",fontWeight:"bold"}}>Present</Text>
</TouchableOpacity>

<TouchableOpacity onPress={()=>handleTab("absent")} style={{
flex:1,padding:12,
backgroundColor:activeTab==="absent"?"#dc2626":"#0f172a",
borderRadius:10
}}>
<Text style={{color:"#fff",textAlign:"center",fontWeight:"bold"}}>Absent</Text>
</TouchableOpacity>

</View>

<TouchableOpacity onPress={()=>setShowPicker(true)} style={{
backgroundColor:"#0f172a",
padding:14,borderRadius:10,
borderWidth:1,borderColor:"#334155",
marginBottom:10
}}>
<Text style={{color:"#fff"}}>
Select Date: {formatDate(selectedDate)}
</Text>
</TouchableOpacity>

{showPicker &&(
<DateTimePicker value={selectedDate} mode="date" display="default" onChange={onChangeDate}/>
)}

<TouchableOpacity onPress={()=>fetchAttendance(activeTab)}>

<LinearGradient colors={["#2563eb","#38bdf8"]} style={{
padding:14,borderRadius:10,alignItems:"center",marginBottom:10
}}>
<Text style={{color:"#fff",fontWeight:"bold"}}>Search Attendance</Text>
</LinearGradient>

</TouchableOpacity>

{data.map(item=>(

<View key={item.id} style={{
backgroundColor:"#1e293b",
padding:15,
borderRadius:12,
marginTop:10,
borderWidth:1,
borderColor:"#334155",
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
}}>

<View>
<Text style={{color:"#fff",fontWeight:"bold",fontSize:16}}>
{item.name}
</Text>

<Text style={{color:"#94a3b8"}}>
Adm: {item.admission_number}
</Text>

<Text style={{
color:item.status==="present"?"#22c55e":"#ef4444",
marginTop:5,fontWeight:"bold"
}}>
{item.status.toUpperCase()}
</Text>
</View>

<Image
source={{uri:"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}}
style={{width:50,height:50,borderRadius:50}}
/>

</View>

))}

</BlurView>

</ScrollView>


{/* FLOATING BUTTON */}
<TouchableOpacity
onPress={()=>setModalVisible(true)}
style={{
position:"absolute",
bottom:100,
right:20
}}
>

<LinearGradient
colors={["#9333ea","#6366f1"]}
style={{
width:60,
height:60,
borderRadius:30,
justifyContent:"center",
alignItems:"center",
elevation:5
}}
>
<Text style={{color:"#fff",fontSize:24}}>≡</Text>
</LinearGradient>

</TouchableOpacity>


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
router.push({
pathname:"/(Attendance)/view-attendance-history",
params:{classId,streamId,className,streamName}
});
}}
>

<LinearGradient colors={["#2563eb","#38bdf8"]} style={{
padding:12,borderRadius:10,marginBottom:10
}}>
<Text style={{color:"#fff",textAlign:"center"}}>
📊 Attendance History
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
padding:12,borderRadius:10,marginBottom:10
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

{loading &&(
<View style={styles.loader}>
<View style={styles.loaderCard}>
<ActivityIndicator size="large" color="#2563eb"/>
<Text style={styles.loadingText}>Loading...</Text>
</View>
</View>
)}

<Toast/>

</LinearGradient>

)
}