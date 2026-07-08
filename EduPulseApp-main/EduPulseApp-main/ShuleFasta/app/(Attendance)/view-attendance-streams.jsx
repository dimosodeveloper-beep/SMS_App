import React,{useState,useEffect,useRef,useContext} from "react";

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

import {useLocalSearchParams,useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

import { LanguageContext } from "../../components/LanguageContext";

export default function ViewAttandanceStreams(){

const router = useRouter();

const { language } = useContext(LanguageContext);

const {classId,className} = useLocalSearchParams();

const[streams,setStreams] = useState([]);
const[filteredStreams,setFilteredStreams] = useState([]);
const[search,setSearch] = useState("");

const[loading,setLoading] = useState(false);
const[token,setToken] = useState(null);

const fadeAnim = useRef(new Animated.Value(0)).current;
const slideAnim = useRef(new Animated.Value(40)).current;

const scaleAnims = useRef({}).current;

/* =========================
ANIMATION
========================= */

useEffect(()=>{

Animated.parallel([

Animated.timing(fadeAnim,{
toValue:1,
duration:800,
useNativeDriver:true
}),

Animated.spring(slideAnim,{
toValue:0,
friction:7,
tension:40,
useNativeDriver:true
})

]).start();

},[]);

const getScaleAnim=(id)=>{

if(!scaleAnims[id]){
scaleAnims[id] = new Animated.Value(1);
}

return scaleAnims[id];

};

const pressIn=(id)=>{

Animated.spring(getScaleAnim(id),{
toValue:0.96,
useNativeDriver:true
}).start();

};

const pressOut=(id)=>{

Animated.spring(getScaleAnim(id),{
toValue:1,
friction:4,
useNativeDriver:true
}).start();

};

/* =========================
LOAD TOKEN
========================= */

useEffect(()=>{

const loadToken = async()=>{

const savedToken = await AsyncStorage.getItem("userToken");

setToken(savedToken);

};

loadToken();

},[]);

/* =========================
FETCH STREAMS
========================= */

useEffect(()=>{

if(token){

fetchStreams(token);

}

},[token]);

const fetchStreams = async(token)=>{

setLoading(true);

try{

console.log("TOKEN => ",token);

const response = await axios.get(

EndPoint + "/streams/" + classId + "/",

{
headers:{
Authorization:`Token ${token}`,
"Content-Type":"application/json"
}
}

);

console.log("STREAMS => ",response.data);

setStreams(response.data);
setFilteredStreams(response.data);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

setLoading(false);

}catch(error){

setLoading(false);

console.log("ERROR => ",error.response?.data);

Toast.show({
type:"error",
text1:
language === "sw"
? "Hitilafu kupata mikondo"
: "Error fetching streams",
text2:JSON.stringify(error.response?.data)
});

}

}

/* =========================
SEARCH
========================= */

const handleSearch=(text)=>{

setSearch(text);

if(text === ""){
setFilteredStreams(streams);
return;
}

const filtered = streams.filter((item)=>
item.name.toLowerCase().includes(text.toLowerCase())
);

setFilteredStreams(filtered);

}

/* =========================
OPEN STUDENTS
========================= */

const openStudents=(item)=>{

router.push({
pathname:"/(Attendance)/view-all-attendance",
params:{
streamId:item.id,
streamName:item.name,
classId:classId,
className:className
}
});

}

return(

<LinearGradient
colors={["#020617","#0f172a","#111827","#1e293b"]}
style={styles.container}
>

<Image
source={{
uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"
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
top:-120,
right:-100,
width:260,
height:260,
borderRadius:200,
backgroundColor:"rgba(59,130,246,0.15)"
}}/>

<View style={{
position:"absolute",
bottom:-140,
left:-100,
width:280,
height:280,
borderRadius:200,
backgroundColor:"rgba(14,165,233,0.12)"
}}/>

<Header
title={
language === "sw"
? "Dashibodi ya Shule"
: "School Dashboard"
}
subtitle={
language === "sw"
? "Mfumo wa Usimamizi"
: "Management System"
}
/>

<Animated.ScrollView
contentContainerStyle={{
padding:14,
paddingBottom:320
}}
showsVerticalScrollIndicator={false}
keyboardShouldPersistTaps="handled"
style={{
opacity:fadeAnim,
transform:[{translateY:slideAnim}]
}}
>

{/* =========================
TOP CARD
========================= */}

<LinearGradient
colors={["rgba(37,99,235,0.30)","rgba(15,23,42,0.92)"]}
start={{x:0,y:0}}
end={{x:1,y:1}}
style={{
borderRadius:28,
padding:24,
marginBottom:24,
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)",
overflow:"hidden"
}}
>

<View style={{
position:"absolute",
top:-30,
right:-30,
width:120,
height:120,
borderRadius:100,
backgroundColor:"rgba(96,165,250,0.15)"
}}/>

<View style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
}}>

<View style={{flex:1,paddingRight:10}}>

<Text style={{
fontSize:29,
fontWeight:"900",
color:"#ffffff",
letterSpacing:0.5
}}>
{
language === "sw"
? `Mikondo ya ${className}`
: `Streams ${className}`
}
</Text>

<Text style={{
fontSize:15,
color:"#cbd5e1",
marginTop:10,
lineHeight:22
}}>
{
language === "sw"
? "Angalia na usimamie mikondo yote inayopatikana kwenye sehemu hii ya mahudhurio ya darasa."
: "View and manage all streams available in this classroom attendance section."
}
</Text>

<View style={{
flexDirection:"row",
alignItems:"center",
marginTop:18
}}>

<View style={{
backgroundColor:"rgba(59,130,246,0.18)",
paddingHorizontal:14,
paddingVertical:8,
borderRadius:14,
marginRight:10,
borderWidth:1,
borderColor:"rgba(96,165,250,0.25)"
}}>

<Text style={{
color:"#dbeafe",
fontWeight:"700",
fontSize:13
}}>
{
language === "sw"
? `Jumla: ${filteredStreams.length}`
: `Total: ${filteredStreams.length}`
}
</Text>

</View>

<View style={{
backgroundColor:"rgba(16,185,129,0.15)",
paddingHorizontal:14,
paddingVertical:8,
borderRadius:14,
borderWidth:1,
borderColor:"rgba(16,185,129,0.25)"
}}>

<Text style={{
color:"#bbf7d0",
fontWeight:"700",
fontSize:13
}}>
{
language === "sw"
? "Kumbukumbu za Mahudhurio"
: "Attendance Records"
}
</Text>

</View>

</View>

</View>

<View style={{
width:78,
height:78,
borderRadius:24,
backgroundColor:"rgba(255,255,255,0.08)",
justifyContent:"center",
alignItems:"center",
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)"
}}>

<Ionicons
name="layers-outline"
size={38}
color="#60a5fa"
/>

</View>

</View>

</LinearGradient>

{/* =========================
SEARCH AREA
========================= */}

<BlurView
intensity={60}
tint="dark"
style={{
borderRadius:24,
padding:18,
marginBottom:20,
overflow:"hidden",
borderWidth:1,
borderColor:"rgba(255,255,255,0.06)",
backgroundColor:"rgba(15,23,42,0.45)"
}}
>

<View style={{
flexDirection:"row",
alignItems:"center",
backgroundColor:"rgba(2,6,23,0.75)",
borderRadius:18,
paddingHorizontal:16,
borderWidth:1,
borderColor:"rgba(148,163,184,0.15)"
}}>

<Ionicons
name="search"
size={22}
color="#94a3b8"
style={{marginRight:10}}
/>

<TextInput
value={search}
onChangeText={handleSearch}
placeholder={
language === "sw"
? "Tafuta mkondo..."
: "Search stream..."
}
placeholderTextColor="#94a3b8"
style={{
flex:1,
paddingVertical:16,
fontSize:15,
color:"#ffffff"
}}
/>

{search !== "" &&(

<TouchableOpacity onPress={()=>handleSearch("")}>

<Ionicons
name="close-circle"
size={22}
color="#64748b"
/>

</TouchableOpacity>

)}

</View>

</BlurView>

{/* =========================
EMPTY STATE
========================= */}

{filteredStreams.length === 0 && !loading &&(

<BlurView
intensity={50}
tint="dark"
style={{
padding:30,
borderRadius:24,
alignItems:"center",
backgroundColor:"rgba(15,23,42,0.45)",
borderWidth:1,
borderColor:"rgba(255,255,255,0.05)"
}}
>

<Ionicons
name="albums-outline"
size={60}
color="#475569"
/>

<Text style={{
color:"#e2e8f0",
fontSize:18,
fontWeight:"700",
marginTop:15
}}>
{
language === "sw"
? "Hakuna Mikondo Iliyopatikana"
: "No Streams Found"
}
</Text>

<Text style={{
color:"#94a3b8",
textAlign:"center",
marginTop:8,
lineHeight:22
}}>
{
language === "sw"
? "Jaribu kutafuta kwa neno lingine muhimu au angalia mikondo ya darasa inayopatikana."
: "Try searching using another keyword or check available classroom streams."
}
</Text>

</BlurView>

)}

{/* =========================
STREAMS LIST
========================= */}

{filteredStreams.map((item,index)=>{

return(

<Animated.View
key={item.id}
style={{
transform:[{scale:getScaleAnim(item.id)}],
marginBottom:18
}}
>

<TouchableOpacity
activeOpacity={0.9}
onPressIn={()=>pressIn(item.id)}
onPressOut={()=>pressOut(item.id)}
onPress={()=>openStudents(item)}
>

<LinearGradient
colors={[
"rgba(30,41,59,0.98)",
"rgba(15,23,42,0.97)",
"rgba(2,6,23,0.98)"
]}
start={{x:0,y:0}}
end={{x:1,y:1}}
style={{
borderRadius:26,
padding:20,
borderWidth:1,
borderColor:"rgba(148,163,184,0.10)",
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
justifyContent:"space-between",
alignItems:"center"
}}>

<View style={{
flexDirection:"row",
alignItems:"center",
flex:1
}}>

<View style={{
width:62,
height:62,
borderRadius:20,
justifyContent:"center",
alignItems:"center",
backgroundColor:"rgba(37,99,235,0.18)",
borderWidth:1,
borderColor:"rgba(96,165,250,0.18)",
marginRight:16
}}
>

<Ionicons
name="people-outline"
size={28}
color="#60a5fa"
/>

</View>

<View style={{flex:1}}>

<Text style={{
color:"#ffffff",
fontSize:19,
fontWeight:"800",
letterSpacing:0.3
}}>
{
language === "sw"
? `Mkondo ${item.name}`
: `Stream ${item.name}`
}
</Text>

<Text style={{
color:"#94a3b8",
marginTop:6,
fontSize:14
}}>
{
language === "sw"
? `Darasa ${className}`
: `Class ${className}`
}
</Text>

<View style={{
flexDirection:"row",
alignItems:"center",
marginTop:12
}}>

<View style={{
backgroundColor:"rgba(16,185,129,0.14)",
paddingHorizontal:10,
paddingVertical:5,
borderRadius:10,
marginRight:10
}}>

<Text style={{
color:"#bbf7d0",
fontSize:12,
fontWeight:"700"
}}>
{
language === "sw"
? "Inapatikana"
: "Available"
}
</Text>

</View>

<View style={{
backgroundColor:"rgba(245,158,11,0.14)",
paddingHorizontal:10,
paddingVertical:5,
borderRadius:10
}}>

<Text style={{
color:"#fde68a",
fontSize:12,
fontWeight:"700"
}}>
#{index + 1}
</Text>

</View>

</View>

</View>

</View>

<View style={{
alignItems:"center"
}}>

<View style={{
backgroundColor:"#2563eb",
paddingHorizontal:14,
paddingVertical:8,
borderRadius:14,
marginBottom:10
}}>

<Text style={{
color:"#ffffff",
fontWeight:"800",
fontSize:13
}}>
ID {item.id}
</Text>

</View>

<Ionicons
name="chevron-forward-circle"
size={28}
color="#60a5fa"
/>

</View>

</View>

</LinearGradient>

</TouchableOpacity>

</Animated.View>

)

})}

</Animated.ScrollView>

{/* =========================
LOADING
========================= */}

{loading &&(

<View style={styles.loader}>

<BlurView
intensity={80}
tint="dark"
style={{
padding:28,
borderRadius:24,
alignItems:"center",
overflow:"hidden",
backgroundColor:"rgba(15,23,42,0.8)"
}}
>

<ActivityIndicator
size="large"
color="#38bdf8"
/>

<Text style={{
color:"#ffffff",
fontSize:16,
fontWeight:"700",
marginTop:16
}}>
{
language === "sw"
? "Tunapata mikondo..."
: "Fetching streams..."
}
</Text>

<Text style={{
color:"#94a3b8",
marginTop:6,
fontSize:13
}}>
{
language === "sw"
? "Tafadhali subiri kidogo"
: "Please wait a moment"
}
</Text>

</BlurView>

</View>

)}

<Toast/>

</LinearGradient>

)

}