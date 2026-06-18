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

import {useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

import { LanguageContext } from "../../components/LanguageContext";

export default function AllExams(){

const { language } = useContext(LanguageContext);

const router = useRouter();

const [exams,setExams] = useState([]);
const [filteredExams,setFilteredExams] = useState([]);
const [search,setSearch] = useState("");
const [loading,setLoading] = useState(false);
const [token,setToken] = useState(null);

const fadeAnim = useRef(new Animated.Value(0)).current;
const slideAnim = useRef(new Animated.Value(40)).current;

const scaleAnim = useRef(new Animated.Value(1)).current;

/* Animation */
const pressIn=()=>{
Animated.spring(scaleAnim,{
toValue:0.96,
friction:4,
useNativeDriver:true
}).start();
}

const pressOut=()=>{
Animated.spring(scaleAnim,{
toValue:1,
friction:4,
useNativeDriver:true
}).start();
}

/* PAGE ANIMATION */
useEffect(()=>{

Animated.parallel([

Animated.timing(fadeAnim,{
toValue:1,
duration:900,
useNativeDriver:true
}),

Animated.timing(slideAnim,{
toValue:0,
duration:900,
useNativeDriver:true
})

]).start();

},[]);

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
text1:
language === "sw"
? "Hitilafu kupata mitihani"
: "Error fetching exams",
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

const filtered = exams.filter((item)=>{

const examName =
language === "sw"
? (item.name_SW || item.name)
: item.name;

return examName
.toLowerCase()
.includes(text.toLowerCase());

});

setFilteredExams(filtered);

};

/* NAVIGATE */
const goToCreate = ()=>{
router.push("/(Screens)/create-exam");
};

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
width:250,
height:250,
borderRadius:200,
backgroundColor:"rgba(37,99,235,0.18)"
}}/>

<View style={{
position:"absolute",
bottom:-100,
left:-80,
width:220,
height:220,
borderRadius:200,
backgroundColor:"rgba(56,189,248,0.12)"
}}/>

<Header
title={
language === "sw"
? "Mitihani"
: "Exams"
}
subtitle={
language === "sw"
? "Mfumo wa Usimamizi wa Shule"
: "School Management System"
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
padding:14,
paddingBottom:320
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
borderRadius:30,
padding:20,
backgroundColor:"rgba(15,23,42,0.55)",
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)",
overflow:"hidden"
}
]}
>

<View style={{
marginBottom:25
}}>

<Text style={{
fontSize:30,
fontWeight:"900",
color:"#ffffff",
letterSpacing:0.5
}}>
{
language === "sw"
? "Mitihani Yote"
: "All Exams"
}
</Text>

<Text style={{
color:"#94a3b8",
fontSize:15,
marginTop:8,
lineHeight:22
}}>
{
language === "sw"
? "Simamia mitihani yote katika shule yako"
: "Manage all exams in your school"
}
</Text>

</View>

<View style={{
marginBottom:25
}}>

<View style={{
flexDirection:"row",
alignItems:"center",
backgroundColor:"rgba(15,23,42,0.9)",
borderRadius:18,
borderWidth:1,
borderColor:"rgba(148,163,184,0.18)",
paddingHorizontal:15,
height:58
}}>

<Ionicons
name="search"
size={20}
color="#94a3b8"
style={{marginRight:10}}
/>

<TextInput
value={search}
onChangeText={handleSearch}
placeholder={
language === "sw"
? "Tafuta mtihani..."
: "Search exam..."
}
placeholderTextColor="#64748b"
style={{
flex:1,
color:"#ffffff",
fontSize:16,
fontWeight:"600"
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

</View>

<View style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
marginBottom:20
}}>

<View style={{
backgroundColor:"rgba(37,99,235,0.18)",
paddingHorizontal:14,
paddingVertical:8,
borderRadius:14,
borderWidth:1,
borderColor:"rgba(59,130,246,0.25)"
}}>

<Text style={{
color:"#bfdbfe",
fontWeight:"700",
fontSize:13
}}>
{
language === "sw"
? `JUMLA YA MITIHANI : ${filteredExams.length}`
: `TOTAL EXAMS : ${filteredExams.length}`
}
</Text>

</View>

<View style={{
flexDirection:"row",
alignItems:"center"
}}>

<View style={{
width:10,
height:10,
borderRadius:20,
backgroundColor:"#22c55e",
marginRight:6
}}/>

<Text style={{
color:"#86efac",
fontSize:13,
fontWeight:"700"
}}>
{
language === "sw"
? "Inaendelea"
: "Active"
}
</Text>

</View>

</View>

{filteredExams.length === 0 && !loading &&(

<View style={{
paddingVertical:50,
alignItems:"center",
justifyContent:"center"
}}>

<Ionicons
name="document-text-outline"
size={65}
color="#475569"
/>

<Text style={{
color:"#94a3b8",
textAlign:"center",
marginTop:15,
fontSize:17,
fontWeight:"700"
}}>
{
language === "sw"
? "Hakuna mitihani iliyopatikana"
: "No exams found"
}
</Text>

<Text style={{
color:"#64748b",
textAlign:"center",
marginTop:6
}}>
{
language === "sw"
? "Jaribu kutafuta kwa jina lingine"
: "Try searching with another keyword"
}
</Text>

</View>

)}

{filteredExams.map((item,index)=>(

<Animated.View
key={item.id}
style={{
transform:[{scale:scaleAnim}],
marginBottom:18
}}
>

<TouchableOpacity
onPressIn={pressIn}
onPressOut={pressOut}
activeOpacity={0.92}
>

<LinearGradient
colors={[
"rgba(30,41,59,0.98)",
"rgba(15,23,42,0.98)"
]}
start={{x:0,y:0}}
end={{x:1,y:1}}
style={{
padding:20,
borderRadius:24,
borderWidth:1,
borderColor:"rgba(148,163,184,0.12)",
overflow:"hidden",
shadowColor:"#000",
shadowOpacity:0.25,
shadowRadius:14,
elevation:8
}}
>

<View style={{
position:"absolute",
top:-30,
right:-30,
width:110,
height:110,
borderRadius:100,
backgroundColor:"rgba(37,99,235,0.12)"
}}/>

<View style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"flex-start"
}}>

<View style={{flex:1,paddingRight:10}}>

<Text style={{
color:"#ffffff",
fontSize:20,
fontWeight:"900",
lineHeight:28
}}>
{
language === "sw"
? (item.name_SW || item.name)
: item.name
}
</Text>

<Text style={{
color:"#38bdf8",
fontSize:14,
marginTop:6,
fontWeight:"700"
}}>
{
language === "sw"
? (item.classroom?.name_SW || item.classroom?.name || item.classroom)
: (item.classroom?.name || item.classroom)
}
</Text>

</View>

<View style={{
backgroundColor:"rgba(37,99,235,0.2)",
paddingHorizontal:14,
paddingVertical:8,
borderRadius:14,
borderWidth:1,
borderColor:"rgba(59,130,246,0.35)"
}}>

<Text style={{
color:"#dbeafe",
fontWeight:"800",
fontSize:13
}}>
ID {item.id}
</Text>

</View>

</View>

<View style={{
marginTop:20,
borderTopWidth:1,
borderTopColor:"rgba(148,163,184,0.08)",
paddingTop:18
}}>

<View style={{
flexDirection:"row",
alignItems:"center",
marginBottom:12
}}>

<View style={{
width:38,
height:38,
borderRadius:12,
backgroundColor:"rgba(245,158,11,0.15)",
justifyContent:"center",
alignItems:"center",
marginRight:12
}}>

<Ionicons
name="calendar-outline"
size={20}
color="#f59e0b"
/>

</View>

<View>

<Text style={{
color:"#64748b",
fontSize:12,
fontWeight:"700"
}}>
{
language === "sw"
? "TAREHE YA MTIHANI"
: "EXAM DATE"
}
</Text>

<Text style={{
color:"#e2e8f0",
fontSize:15,
fontWeight:"700",
marginTop:2
}}>
{item.date}
</Text>

</View>

</View>

<View style={{
flexDirection:"row",
alignItems:"center",
marginBottom:12
}}>

<View style={{
width:38,
height:38,
borderRadius:12,
backgroundColor:"rgba(34,197,94,0.15)",
justifyContent:"center",
alignItems:"center",
marginRight:12
}}>

<Ionicons
name="school-outline"
size={20}
color="#22c55e"
/>

</View>

<View>

<Text style={{
color:"#64748b",
fontSize:12,
fontWeight:"700"
}}>
{
language === "sw"
? "DARASA"
: "CLASSROOM"
}
</Text>

<Text style={{
color:"#e2e8f0",
fontSize:15,
fontWeight:"700",
marginTop:2
}}>
{
language === "sw"
? (item.classroom?.name_SW || item.classroom?.name || item.classroom)
: (item.classroom?.name || item.classroom)
}
</Text>

</View>

</View>

<View style={{
flexDirection:"row",
alignItems:"center"
}}>

<View style={{
width:38,
height:38,
borderRadius:12,
backgroundColor:"rgba(168,85,247,0.15)",
justifyContent:"center",
alignItems:"center",
marginRight:12
}}>

<Ionicons
name="book-outline"
size={20}
color="#a855f7"
/>

</View>

<View>

<Text style={{
color:"#64748b",
fontSize:12,
fontWeight:"700"
}}>
{
language === "sw"
? "CATEGORY"
: "CATEGORY"
}
</Text>

<Text style={{
color:"#e2e8f0",
fontSize:15,
fontWeight:"700",
marginTop:2
}}>
{
language === "sw"
? (item.category?.name_SW || item.category?.name || item.category)
: (item.category?.name || item.category)
}
</Text>

</View>

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

<View style={[
styles.loader,
{
backgroundColor:"rgba(2,6,23,0.55)"
}
]}>

<BlurView
intensity={80}
tint="dark"
style={[
styles.loaderCard,
{
borderRadius:24,
padding:30,
backgroundColor:"rgba(15,23,42,0.8)",
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)"
}
]}
>

<ActivityIndicator
size="large"
color="#38bdf8"
/>

<Text style={[
styles.loadingText,
{
marginTop:18,
fontSize:16,
fontWeight:"700",
color:"#e2e8f0"
}
]}>
{
language === "sw"
? "Inapakua mitihani..."
: "Fetching exams..."
}
</Text>

</BlurView>

</View>

)}

<Toast/>

</LinearGradient>

)

}