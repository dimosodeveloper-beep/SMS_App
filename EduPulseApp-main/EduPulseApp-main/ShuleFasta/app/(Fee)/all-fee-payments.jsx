// app/(Screens)/all-fee-payments.jsx

import React,{useState,useEffect} from "react";
import{
View,
Text,
TextInput,
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

export default function AllFeePayments(){

const [payments,setPayments] = useState([]);
const [filtered,setFiltered] = useState([]);
const [search,setSearch] = useState("");
const [loading,setLoading] = useState(false);
const [token,setToken] = useState(null);

const scaleAnim = new Animated.Value(1);

useEffect(()=>{
const loadToken = async()=>{
const savedToken = await AsyncStorage.getItem("userToken");
setToken(savedToken);
};
loadToken();
},[]);

useEffect(()=>{
if(token){
fetchPayments(token);
}
},[token]);

const fetchPayments = async(token)=>{
setLoading(true);

try{

const res = await axios.get(
EndPoint + "/fee-payments/",
{
headers:{
Authorization:`Token ${token}`
}
}
);

setPayments(res.data);
setFiltered(res.data);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

}catch(error){

Toast.show({
type:"error",
text1:"Error",
text2:JSON.stringify(error.response?.data)
});

}

setLoading(false);
};

const handleSearch=(text)=>{
setSearch(text);

if(text === ""){
setFiltered(payments);
return;
}

const filteredData = payments.filter((item)=>
item.student_name?.toLowerCase().includes(text.toLowerCase())
);

setFiltered(filteredData);
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
title="School Dashboard"
subtitle="Fee Payments"
/>

<ScrollView
contentContainerStyle={{
padding:10,
paddingBottom:300
}}
>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>
All Fee Payments
</Text>

<Text style={styles.subtitle}>
Student payment records
</Text>

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
marginTop:20,
marginBottom:20
}}
/>

{filtered.length === 0 && !loading &&(
<Text style={{
color:"#94a3b8",
textAlign:"center",
marginTop:30
}}>
No payments found
</Text>
)}

{filtered.map((item,index)=>(

<Animated.View
key={item.id}
style={{
transform:[{scale:scaleAnim}],
marginBottom:15
}}
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

<Text style={{
color:"#fff",
fontSize:18,
fontWeight:"bold"
}}>
{item.student_name}
</Text>

<Text style={{color:"#94a3b8",marginTop:6}}>
Class: {item.classroom_name}
</Text>

<Text style={{color:"#94a3b8"}}>
Stream: {item.stream_name}
</Text>

<Text style={{
color:"#22c55e",
fontSize:18,
fontWeight:"bold",
marginTop:10
}}>
Paid: TZS {item.amount_paid}
</Text>

<Text style={{
color:"#94a3b8",
marginTop:5
}}>
Date: {item.payment_date}
</Text>

</LinearGradient>

</Animated.View>

))}

</BlurView>
</ScrollView>

{loading &&(
<View style={styles.loader}>
<View style={styles.loaderCard}>
<ActivityIndicator size="large" color="#2563eb"/>
<Text style={styles.loadingText}>
Loading payments...
</Text>
</View>
</View>
)}

<Toast/>

</LinearGradient>
);
}