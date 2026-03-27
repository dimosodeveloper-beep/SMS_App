import React,{useState,useEffect} from "react";

import{
View,
Text,
TouchableOpacity,
Image,
ActivityIndicator,
ScrollView,
Animated
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

import {useLocalSearchParams} from "expo-router";

export default function ResultsSummary(){

const {classId,categoryId} = useLocalSearchParams();

const[data,setData] = useState(null);
const[loading,setLoading] = useState(false);

const[activeTab,setActiveTab] = useState("top");

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

/* LOAD DATA */
useEffect(()=>{
load();
},[]);

const load = async()=>{

setLoading(true);

try{

const token = await AsyncStorage.getItem("userToken");

const res = await axios.get(
EndPoint + `/results_summary/?class_id=${classId}&category_id=${categoryId}`,
{ headers:{Authorization:`Token ${token}`} }
);

setData(res.data);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

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

<Image
source={{uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"}}
style={styles.bg}
/>

<Header title="Results Summary" subtitle="Performance Overview"/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:200}}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>
Results Summary Dashboard
</Text>

<Text style={{color:"#94a3b8",marginBottom:10}}>
Overview of class performance
</Text>

{/* ===== TABS ===== */}
<View style={{flexDirection:"row",marginBottom:15}}>

<TouchableOpacity
onPress={()=>setActiveTab("top")}
style={{
flex:1,
padding:12,
backgroundColor:activeTab==="top"?"#16a34a":"#0f172a",
borderRadius:10,
marginRight:5
}}>
<Text style={{color:"#fff",textAlign:"center",fontWeight:"bold"}}>
Top 10
</Text>
</TouchableOpacity>

<TouchableOpacity
onPress={()=>setActiveTab("last")}
style={{
flex:1,
padding:12,
backgroundColor:activeTab==="last"?"#dc2626":"#0f172a",
borderRadius:10,
marginRight:5
}}>
<Text style={{color:"#fff",textAlign:"center",fontWeight:"bold"}}>
Last 10
</Text>
</TouchableOpacity>

<TouchableOpacity
onPress={()=>setActiveTab("grades")}
style={{
flex:1,
padding:12,
backgroundColor:activeTab==="grades"?"#2563eb":"#0f172a",
borderRadius:10
}}>
<Text style={{color:"#fff",textAlign:"center",fontWeight:"bold"}}>
Grades
</Text>
</TouchableOpacity>

</View>

{/* ===== CONTENT ===== */}
{activeTab === "top" && data?.top_10.map((item,index)=>(

<Animated.View
key={index}
style={{
transform:[{scale:scaleAnim}],
marginTop:10
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
padding:15,
borderRadius:12,
borderWidth:1,
borderColor:"#334155"
}}
>

<Text style={{color:"#22c55e",fontWeight:"bold"}}>
#{index+1} {item.name}
</Text>

<Text style={{color:"#fff"}}>
Average: {item.average}
</Text>

</LinearGradient>

</TouchableOpacity>

</Animated.View>

))}

{activeTab === "last" && data?.last_10.map((item,index)=>(

<Animated.View key={index} style={{marginTop:10}}>

<LinearGradient
colors={["#1e293b","#0f172a"]}
style={{
padding:15,
borderRadius:12,
borderWidth:1,
borderColor:"#334155"
}}
>

<Text style={{color:"#ef4444",fontWeight:"bold"}}>
{item.name}
</Text>

<Text style={{color:"#fff"}}>
Average: {item.average}
</Text>

</LinearGradient>

</Animated.View>

))}

{activeTab === "grades" && Object.entries(data?.grades || {}).map(([g,v])=>(

<View key={g} style={{
backgroundColor:"#1e293b",
padding:15,
borderRadius:10,
marginTop:10,
borderWidth:1,
borderColor:"#334155"
}}>

<Text style={{color:"#38bdf8",fontWeight:"bold"}}>
Grade {g}
</Text>

<Text style={{color:"#fff"}}>
Students: {v}
</Text>

</View>

))}

</BlurView>

</ScrollView>

{/* LOADING */}
{loading &&(
<View style={styles.loader}>
<View style={styles.loaderCard}>
<ActivityIndicator size="large" color="#2563eb"/>
<Text style={styles.loadingText}>
Loading summary...
</Text>
</View>
</View>
)}

<Toast/>

</LinearGradient>

)
}