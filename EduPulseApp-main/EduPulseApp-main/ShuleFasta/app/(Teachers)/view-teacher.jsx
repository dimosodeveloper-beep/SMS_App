import React,{useState,useEffect,useRef,useContext} from "react";
import{
View,
Text,
Image,
ActivityIndicator,
ScrollView,
Animated,
TouchableOpacity
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {LinearGradient} from "expo-linear-gradient";
import {BlurView} from "expo-blur";

import {Ionicons,MaterialIcons,FontAwesome5} from "@expo/vector-icons";

import styles from "../../components/LoginStyles";
import {EndPoint} from "../../components/links";
import Header from "../../components/Header";

import {useLocalSearchParams} from "expo-router";

import { LanguageContext } from "../../components/LanguageContext";

export default function TeacherView(){

const {id} = useLocalSearchParams();

const { language } = useContext(LanguageContext);

const[token,setToken] = useState(null);
const[data,setData] = useState(null);
const[loading,setLoading] = useState(false);

const fadeAnim = useRef(new Animated.Value(0)).current;
const slideAnim = useRef(new Animated.Value(40)).current;
const scaleAnim = useRef(new Animated.Value(1)).current;

useEffect(()=>{

Animated.parallel([
Animated.timing(fadeAnim,{
toValue:1,
duration:800,
useNativeDriver:true
}),
Animated.timing(slideAnim,{
toValue:0,
duration:800,
useNativeDriver:true
})
]).start();

},[]);

const pressIn=()=>{
Animated.spring(scaleAnim,{
toValue:0.97,
useNativeDriver:true
}).start();
};

const pressOut=()=>{
Animated.spring(scaleAnim,{
toValue:1,
friction:3,
tension:40,
useNativeDriver:true
}).start();
};

useEffect(()=>{
const load = async()=>{
const t = await AsyncStorage.getItem("userToken");
setToken(t);
};
load();
},[]);

useEffect(()=>{
if(token) fetchTeacher();
},[token]);

const fetchTeacher = async()=>{

setLoading(true);

try{

const res = await axios.get(
EndPoint + `/teacher/${id}/`,
{
headers:{
Authorization:`Token ${token}`
}
}
);

setData(res.data);

}catch(e){

console.log(e);

}

setLoading(false);

};

if(loading || !data){

return(

<LinearGradient
colors={["#020617","#0f172a","#1e293b","#111827"]}
style={[
styles.container,
{
justifyContent:"center",
alignItems:"center"
}
]}
>

<View style={{
backgroundColor:"rgba(15,23,42,0.9)",
padding:30,
borderRadius:25,
alignItems:"center",
borderWidth:1,
borderColor:"rgba(59,130,246,0.2)"
}}>

<ActivityIndicator
size="large"
color="#38bdf8"
/>

<Text style={{
color:"#fff",
marginTop:15,
fontSize:16,
fontWeight:"600"
}}>
{
language === "sw"
? "Inapakia Wasifu wa Mwalimu..."
: "Loading Teacher Profile..."
}
</Text>

</View>

</LinearGradient>

);

}

return(

<LinearGradient
colors={["#020617","#0f172a","#1e293b","#111827"]}
style={styles.container}
>

<Image
source={{
uri:"https://images.unsplash.com/photo-1577896851231-70ef18881754"
}}
style={[
styles.bg,
{
opacity:0.18
}
]}
/>

<View style={{
position:"absolute",
top:120,
right:-40,
width:180,
height:180,
borderRadius:100,
backgroundColor:"rgba(59,130,246,0.15)"
}}/>

<View style={{
position:"absolute",
bottom:100,
left:-60,
width:220,
height:220,
borderRadius:120,
backgroundColor:"rgba(14,165,233,0.08)"
}}/>

<Header
title={
language === "sw"
? "Wasifu wa Mwalimu"
: "Teacher Profile"
}
subtitle={data.user_name}
/>

<Animated.View
style={{
flex:1,
opacity:fadeAnim,
transform:[{translateY:slideAnim}]
}}
>

<ScrollView
contentContainerStyle={{
padding:15,
paddingBottom:120
}}
showsVerticalScrollIndicator={false}
>

<BlurView
intensity={60}
tint="dark"
style={[
styles.blur,
{
backgroundColor:"rgba(15,23,42,0.55)",
borderWidth:1,
borderColor:"rgba(148,163,184,0.15)"
}
]}
>

<View style={{
alignItems:"center",
marginBottom:30
}}>

<LinearGradient
colors={["rgba(37,99,235,0.25)","rgba(14,165,233,0.1)"]}
style={{
width:120,
height:120,
borderRadius:35,
justifyContent:"center",
alignItems:"center",
borderWidth:1,
borderColor:"rgba(59,130,246,0.3)"
}}
>

<FontAwesome5
name="chalkboard-teacher"
size={50}
color="#38bdf8"
/>

</LinearGradient>

<Text style={{
color:"#ffffff",
fontSize:28,
fontWeight:"bold",
marginTop:20,
textAlign:"center"
}}>
{data.user_name}
</Text>

<View style={{
flexDirection:"row",
alignItems:"center",
marginTop:12,
backgroundColor:"rgba(15,23,42,0.8)",
paddingHorizontal:16,
paddingVertical:10,
borderRadius:16,
borderWidth:1,
borderColor:"rgba(148,163,184,0.12)"
}}>

<Ionicons
name="call-outline"
size={18}
color="#22c55e"
/>

<Text style={{
color:"#e2e8f0",
marginLeft:8,
fontSize:15
}}>
{data.phone}
</Text>

</View>

</View>

<View style={{
flexDirection:"row",
justifyContent:"space-between",
marginBottom:25
}}>

<LinearGradient
colors={["rgba(37,99,235,0.22)","rgba(15,23,42,0.3)"]}
style={{
flex:1,
marginRight:8,
padding:18,
borderRadius:20,
borderWidth:1,
borderColor:"rgba(59,130,246,0.2)"
}}
>

<Text style={{
color:"#38bdf8",
fontSize:12,
fontWeight:"700"
}}>
{
language === "sw"
? "JUMLA YA MASOMO"
: "TOTAL SUBJECTS"
}
</Text>

<Text style={{
color:"#fff",
fontSize:28,
fontWeight:"bold",
marginTop:8
}}>
{data.subjects.length}
</Text>

</LinearGradient>

<LinearGradient
colors={["rgba(34,197,94,0.2)","rgba(15,23,42,0.3)"]}
style={{
flex:1,
marginLeft:8,
padding:18,
borderRadius:20,
borderWidth:1,
borderColor:"rgba(34,197,94,0.2)"
}}
>

<Text style={{
color:"#22c55e",
fontSize:12,
fontWeight:"700"
}}>
{
language === "sw"
? "HALI"
: "STATUS"
}
</Text>

<Text style={{
color:"#fff",
fontSize:22,
fontWeight:"bold",
marginTop:10
}}>
{
language === "sw"
? "ANAENDELEA"
: "ACTIVE"
}
</Text>

</LinearGradient>

</View>

<View style={{
flexDirection:"row",
alignItems:"center",
justifyContent:"space-between",
marginBottom:18
}}>

<View style={{
flexDirection:"row",
alignItems:"center"
}}>

<View style={{
width:45,
height:45,
borderRadius:15,
backgroundColor:"rgba(14,165,233,0.12)",
justifyContent:"center",
alignItems:"center",
marginRight:12
}}>

<Ionicons
name="book-outline"
size={22}
color="#38bdf8"
/>

</View>

<View>

<Text style={{
color:"#ffffff",
fontSize:20,
fontWeight:"bold"
}}>
{
language === "sw"
? "Masomo Anayofundisha"
: "Subjects Teaching"
}
</Text>

<Text style={{
color:"#94a3b8",
marginTop:4
}}>
{
language === "sw"
? "Masomo ya kitaaluma anayofundisha"
: "Academic teaching subjects"
}
</Text>

</View>

</View>

<View style={{
backgroundColor:"rgba(37,99,235,0.15)",
paddingHorizontal:12,
paddingVertical:8,
borderRadius:14,
borderWidth:1,
borderColor:"rgba(59,130,246,0.2)"
}}>

<Text style={{
color:"#38bdf8",
fontWeight:"bold"
}}>
{data.subjects.length} {
language === "sw"
? "Masomo"
: "Subjects"
}
</Text>

</View>

</View>

{data.subjects.map((item,index)=>(

<Animated.View
key={index}
style={{
transform:[{scale:scaleAnim}],
marginBottom:15
}}
>

<TouchableOpacity
activeOpacity={0.9}
onPressIn={pressIn}
onPressOut={pressOut}
>

<LinearGradient
colors={[
"rgba(30,41,59,0.95)",
"rgba(15,23,42,0.95)",
"rgba(2,6,23,0.95)"
]}
start={{x:0,y:0}}
end={{x:1,y:1}}
style={{
padding:18,
borderRadius:22,
borderWidth:1,
borderColor:"rgba(148,163,184,0.12)",
overflow:"hidden"
}}
>

<View style={{
position:"absolute",
top:-10,
right:-10,
width:90,
height:90,
borderRadius:50,
backgroundColor:"rgba(59,130,246,0.06)"
}}/>

<View style={{
flexDirection:"row",
alignItems:"center",
justifyContent:"space-between"
}}>

<View style={{
flexDirection:"row",
alignItems:"center",
flex:1
}}>

<View style={{
width:58,
height:58,
borderRadius:18,
backgroundColor:"rgba(37,99,235,0.14)",
justifyContent:"center",
alignItems:"center",
borderWidth:1,
borderColor:"rgba(59,130,246,0.2)"
}}>

<MaterialIcons
name="menu-book"
size={28}
color="#38bdf8"
/>

</View>

<View style={{
marginLeft:15,
flex:1
}}>

<Text style={{
color:"#ffffff",
fontSize:18,
fontWeight:"bold"
}}>
{
language === "sw"
? (item.name_SW || item.name)
: item.name
}
</Text>

<Text style={{
color:"#94a3b8",
marginTop:5,
fontSize:13
}}>
{
language === "sw"
? "Somo Analofundisha"
: "Teaching Subject"
}
</Text>

</View>

</View>

<View style={{
width:42,
height:42,
borderRadius:14,
backgroundColor:"rgba(34,197,94,0.12)",
justifyContent:"center",
alignItems:"center"
}}>

<Ionicons
name="checkmark-circle"
size={24}
color="#22c55e"
/>

</View>

</View>

</LinearGradient>

</TouchableOpacity>

</Animated.View>

))}

<View style={{
marginTop:15,
padding:20,
borderRadius:22,
backgroundColor:"rgba(15,23,42,0.7)",
borderWidth:1,
borderColor:"rgba(148,163,184,0.12)"
}}>

<View style={{
flexDirection:"row",
alignItems:"center"
}}>

<Ionicons
name="information-circle-outline"
size={24}
color="#38bdf8"
/>

<Text style={{
color:"#ffffff",
fontSize:17,
fontWeight:"bold",
marginLeft:10
}}>
{
language === "sw"
? "Muhtasari wa Mwalimu"
: "Teacher Summary"
}
</Text>

</View>

<Text style={{
color:"#cbd5e1",
marginTop:12,
lineHeight:24,
fontSize:14
}}>
{
language === "sw"
? `Mwalimu huyu kwa sasa anafundisha somo${data.subjects.length > 1 ? " mbalimbali" : ""} ${data.subjects.length} ndani ya mfumo wa kitaaluma wa shule.`
: `This teacher is currently assigned to teach ${data.subjects.length} subject${data.subjects.length > 1 ? "s" : ""} within the school academic system.`
}
</Text>

</View>

</BlurView>

</ScrollView>

</Animated.View>

</LinearGradient>

)

}