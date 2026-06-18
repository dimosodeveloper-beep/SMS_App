import React,{useState,useEffect,useRef,useContext} from "react";
import{
View,
Text,
TouchableOpacity,
Image,
ActivityIndicator,
ScrollView,
Animated,
TextInput
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {LinearGradient} from "expo-linear-gradient";
import {BlurView} from "expo-blur";

import Toast from "react-native-toast-message";

import * as Haptics from "expo-haptics";

import {Ionicons,MaterialIcons,FontAwesome5} from "@expo/vector-icons";

import styles from "../../components/LoginStyles";
import {EndPoint} from "../../components/links";
import Header from "../../components/Header";

import {useRouter} from "expo-router";

import { LanguageContext } from "../../components/LanguageContext";

export default function AllTeachers(){

const router = useRouter();

const { language } = useContext(LanguageContext);

const[token,setToken] = useState(null);
const[teachers,setTeachers] = useState([]);
const[filtered,setFiltered] = useState([]);
const[search,setSearch] = useState("");
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
toValue:0.96,
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
if(token) fetchTeachers();
},[token]);

const fetchTeachers = async()=>{
setLoading(true);

try{

const res = await axios.get(
EndPoint + "/teachers/",
{
headers:{
Authorization:`Token ${token}`
}
}
);

setTeachers(res.data);
setFiltered(res.data);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

}catch(e){

console.log(e);

Toast.show({
type:"error",
text1:
language === "sw"
? "Hitilafu kupata walimu"
: "Error fetching teachers",
text2:
language === "sw"
? "Imeshindikana kupakia orodha ya walimu"
: "Failed to load teachers list"
});

}

setLoading(false);
};

const handleSearch=(text)=>{

setSearch(text);

if(text===""){
setFiltered(teachers);
return;
}

const f = teachers.filter(item=>
item.user_name.toLowerCase().includes(text.toLowerCase())
);

setFiltered(f);

};

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
bottom:120,
left:-50,
width:220,
height:220,
borderRadius:120,
backgroundColor:"rgba(14,165,233,0.08)"
}}/>

<Header
title={
language === "sw"
? "Walimu"
: "Teachers"
}
subtitle={
language === "sw"
? "Walimu Wote"
: "All Teachers"
}
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
padding:12,
paddingBottom:220
}}
showsVerticalScrollIndicator={false}
keyboardShouldPersistTaps="handled"
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
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
marginBottom:20
}}>

<View>

<Text style={{
color:"#ffffff",
fontSize:28,
fontWeight:"bold",
letterSpacing:0.5
}}>
{
language === "sw"
? "Orodha ya Walimu"
: "Teachers List"
}
</Text>

<Text style={{
color:"#94a3b8",
marginTop:6,
fontSize:14
}}>
{
language === "sw"
? "Simamia walimu wote wa shule yako"
: "Manage all teachers in your school"
}
</Text>

</View>

<View style={{
width:55,
height:55,
borderRadius:18,
backgroundColor:"rgba(37,99,235,0.15)",
justifyContent:"center",
alignItems:"center",
borderWidth:1,
borderColor:"rgba(59,130,246,0.3)"
}}>

<FontAwesome5
name="chalkboard-teacher"
size={22}
color="#38bdf8"
/>

</View>

</View>

<View style={{
flexDirection:"row",
alignItems:"center",
backgroundColor:"rgba(15,23,42,0.9)",
borderRadius:18,
paddingHorizontal:15,
borderWidth:1,
borderColor:"rgba(148,163,184,0.15)",
marginBottom:25,
height:58
}}>

<Ionicons
name="search"
size={22}
color="#38bdf8"
/>

<TextInput
value={search}
onChangeText={handleSearch}
placeholder={
language === "sw"
? "Tafuta mwalimu..."
: "Search teacher..."
}
placeholderTextColor="#64748b"
style={{
flex:1,
color:"#fff",
marginLeft:10,
fontSize:15
}}
/>

{search !== "" &&(

<TouchableOpacity onPress={()=>handleSearch("")}>

<Ionicons
name="close-circle"
size={20}
color="#94a3b8"
/>

</TouchableOpacity>

)}

</View>

<View style={{
flexDirection:"row",
justifyContent:"space-between",
marginBottom:20
}}>

<LinearGradient
colors={["rgba(37,99,235,0.25)","rgba(14,165,233,0.1)"]}
style={{
flex:1,
marginRight:8,
padding:15,
borderRadius:18,
borderWidth:1,
borderColor:"rgba(59,130,246,0.25)"
}}
>

<Text style={{
color:"#38bdf8",
fontSize:13,
fontWeight:"600"
}}>
{
language === "sw"
? "JUMLA YA WALIMU"
: "TOTAL TEACHERS"
}
</Text>

<Text style={{
color:"#fff",
fontSize:26,
fontWeight:"bold",
marginTop:6
}}>
{teachers.length}
</Text>

</LinearGradient>

<LinearGradient
colors={["rgba(34,197,94,0.2)","rgba(15,23,42,0.3)"]}
style={{
flex:1,
marginLeft:8,
padding:15,
borderRadius:18,
borderWidth:1,
borderColor:"rgba(34,197,94,0.25)"
}}
>

<Text style={{
color:"#22c55e",
fontSize:13,
fontWeight:"600"
}}>
{
language === "sw"
? "WALIMU HAI"
: "ACTIVE STAFF"
}
</Text>

<Text style={{
color:"#fff",
fontSize:26,
fontWeight:"bold",
marginTop:6
}}>
{filtered.length}
</Text>

</LinearGradient>

</View>

{filtered.length === 0 && !loading &&(

<View style={{
paddingVertical:50,
alignItems:"center"
}}>

<Ionicons
name="people-outline"
size={60}
color="#475569"
/>

<Text style={{
color:"#94a3b8",
marginTop:15,
fontSize:16
}}>
{
language === "sw"
? "Hakuna walimu waliopatikana"
: "No teachers found"
}
</Text>

</View>

)}

{filtered.map((item,index)=>(

<Animated.View
key={index}
style={{
transform:[{scale:scaleAnim}],
marginBottom:18
}}
>

<TouchableOpacity
activeOpacity={0.9}
onPressIn={pressIn}
onPressOut={pressOut}
onPress={()=>
router.push({
pathname:"/view-teacher",
params:{id:item.id}
})
}
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
borderRadius:24,
borderWidth:1,
borderColor:"rgba(148,163,184,0.12)",
overflow:"hidden"
}}
>

<View style={{
position:"absolute",
top:-20,
right:-20,
width:100,
height:100,
borderRadius:60,
backgroundColor:"rgba(59,130,246,0.08)"
}}/>

<View style={{
flexDirection:"row",
alignItems:"center"
}}>

<View style={{
width:70,
height:70,
borderRadius:22,
backgroundColor:"rgba(37,99,235,0.15)",
justifyContent:"center",
alignItems:"center",
borderWidth:1,
borderColor:"rgba(59,130,246,0.25)"
}}>

<MaterialIcons
name="person"
size={36}
color="#38bdf8"
/>

</View>

<View style={{
flex:1,
marginLeft:15
}}>

<Text style={{
color:"#ffffff",
fontWeight:"bold",
fontSize:19
}}>
{item.user_name}
</Text>

<View style={{
flexDirection:"row",
alignItems:"center",
marginTop:8
}}>

<Ionicons
name="call-outline"
size={16}
color="#22c55e"
/>

<Text style={{
color:"#cbd5e1",
marginLeft:6,
fontSize:14
}}>
{item.phone}
</Text>

</View>

</View>

<View style={{
backgroundColor:"rgba(37,99,235,0.18)",
paddingHorizontal:12,
paddingVertical:8,
borderRadius:14,
borderWidth:1,
borderColor:"rgba(59,130,246,0.2)"
}}>

<Text style={{
color:"#38bdf8",
fontWeight:"bold",
fontSize:12
}}>
ID {item.id}
</Text>

</View>

</View>

<View style={{
height:1,
backgroundColor:"rgba(148,163,184,0.12)",
marginVertical:16
}}/>

<View style={{
flexDirection:"row",
alignItems:"flex-start"
}}>

<View style={{
width:36,
height:36,
borderRadius:12,
backgroundColor:"rgba(14,165,233,0.12)",
justifyContent:"center",
alignItems:"center",
marginRight:12
}}>

<Ionicons
name="book-outline"
size={18}
color="#38bdf8"
/>

</View>

<View style={{flex:1}}>

<Text style={{
color:"#94a3b8",
fontSize:12,
marginBottom:5,
fontWeight:"600"
}}>
{
language === "sw"
? "MASOMO"
: "SUBJECTS"
}
</Text>

<Text style={{
color:"#e2e8f0",
lineHeight:22,
fontSize:14
}}>
{
item.subjects
.map(s=>
language === "sw"
? (s.name_SW || s.name)
: s.name
)
.join(", ")
}
</Text>

</View>

</View>

<View style={{
flexDirection:"row",
justifyContent:"flex-end",
marginTop:18
}}>

<View style={{
flexDirection:"row",
alignItems:"center",
backgroundColor:"rgba(34,197,94,0.12)",
paddingHorizontal:12,
paddingVertical:8,
borderRadius:12
}}>

<Text style={{
color:"#22c55e",
fontWeight:"600",
marginRight:6
}}>
{
language === "sw"
? "Tazama Wasifu"
: "View Profile"
}
</Text>

<Ionicons
name="arrow-forward"
size={16}
color="#22c55e"
/>

</View>

</View>

</LinearGradient>

</TouchableOpacity>

</Animated.View>

))}

</BlurView>

</ScrollView>

</Animated.View>

{loading &&(

<View style={styles.loader}>

<View style={[
styles.loaderCard,
{
backgroundColor:"#0f172a",
borderWidth:1,
borderColor:"#334155"
}
]}>

<ActivityIndicator
size="large"
color="#38bdf8"
/>

<Text style={[
styles.loadingText,
{
marginTop:12,
color:"#fff"
}
]}>
{
language === "sw"
? "Inapakia walimu..."
: "Loading teachers..."
}
</Text>

</View>

</View>

)}

<Toast/>

</LinearGradient>

)
}