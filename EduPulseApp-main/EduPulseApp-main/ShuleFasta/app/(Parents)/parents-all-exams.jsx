import React,{useState,useEffect,useRef,useContext} from "react";
//classname
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

import {useRouter,useLocalSearchParams} from "expo-router";
import {Ionicons,MaterialIcons,FontAwesome5} from "@expo/vector-icons";

import { LanguageContext } from "../../components/LanguageContext";

export default function ResultsAllExams(){

const router = useRouter();
const {categoryId,categoryName} = useLocalSearchParams();

const { language } = useContext(LanguageContext);

const [exams,setExams] = useState([]);
const [filteredExams,setFilteredExams] = useState([]);
const [search,setSearch] = useState("");
const [loading,setLoading] = useState(false);
const [token,setToken] = useState(null);

const fadeAnim = useRef(new Animated.Value(0)).current;
const translateAnim = useRef(new Animated.Value(40)).current;
const scaleAnim = useRef(new Animated.Value(1)).current;

/* Animation */
const pressIn=()=>{
Animated.spring(scaleAnim,{
toValue:0.96,
useNativeDriver:true
}).start();
}

const pressOut=()=>{
Animated.spring(scaleAnim,{
toValue:1,
friction:4,
tension:80,
useNativeDriver:true
}).start();
}

/* ENTRY ANIMATION */
useEffect(()=>{

Animated.parallel([

Animated.timing(fadeAnim,{
toValue:1,
duration:800,
useNativeDriver:true
}),

Animated.spring(translateAnim,{
toValue:0,
friction:6,
tension:60,
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
EndPoint + `/exams_results/?category_id=${categoryId}`,
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
colors={["#020617","#0f172a","#111827","#1e293b"]}
style={[styles.container,{flex:1}]}
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
right:-80,
width:250,
height:250,
borderRadius:200,
backgroundColor:"rgba(59,130,246,0.15)"
}}/>

<View style={{
position:"absolute",
bottom:-100,
left:-60,
width:220,
height:220,
borderRadius:200,
backgroundColor:"rgba(14,165,233,0.10)"
}}/>

<Header
title={categoryName || (language === "sw" ? "Mitihani" : "Exams")}
subtitle={
language === "sw"
? "Imechujwa kwa kundi"
: "Filtered by category"
}
/>

<Animated.ScrollView
contentContainerStyle={{
padding:14,
paddingBottom:300
}}
showsVerticalScrollIndicator={false}
style={{
opacity:fadeAnim,
transform:[{
translateY:translateAnim
}]
}}
>

{/* TOP CARD */}
<BlurView
intensity={60}
tint="dark"
style={{
padding:22,
borderRadius:28,
overflow:"hidden",
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)",
backgroundColor:"rgba(15,23,42,0.55)",
marginBottom:20
}}
>

<View style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
}}>

<View style={{flex:1}}>

<View style={{
flexDirection:"row",
alignItems:"center"
}}>

<View style={{
width:55,
height:55,
borderRadius:18,
justifyContent:"center",
alignItems:"center",
backgroundColor:"rgba(37,99,235,0.18)",
marginRight:14
}}>

<FontAwesome5
name="file-alt"
size={22}
color="#38bdf8"
/>

</View>

<View style={{flex:1}}>

<Text style={{
color:"#ffffff",
fontSize:24,
fontWeight:"bold"
}}>
{
language === "sw"
? "Mitihani Yote"
: "All Exams"
}
</Text>

<Text style={{
color:"#94a3b8",
marginTop:4,
fontSize:13
}}>
{
language === "sw"
? `Inaonesha mitihani ya: ${categoryName}`
: `Showing exams for: ${categoryName}`
}
</Text>

</View>

</View>

</View>

<View style={{
paddingHorizontal:14,
paddingVertical:10,
borderRadius:16,
backgroundColor:"rgba(59,130,246,0.18)",
borderWidth:1,
borderColor:"rgba(96,165,250,0.25)"
}}>

<Text style={{
color:"#38bdf8",
fontWeight:"bold",
fontSize:16
}}>
{filteredExams.length}
</Text>

<Text style={{
color:"#cbd5e1",
fontSize:11
}}>
{
language === "sw"
? "Mitihani"
: "Exams"
}
</Text>

</View>

</View>

{/* SEARCH */}
<View style={{
marginTop:24,
flexDirection:"row",
alignItems:"center",
backgroundColor:"rgba(15,23,42,0.9)",
borderRadius:18,
borderWidth:1,
borderColor:"rgba(148,163,184,0.15)",
paddingHorizontal:15,
height:58
}}>

<Ionicons
name="search"
size={20}
color="#38bdf8"
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
color:"#fff",
marginLeft:12,
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

{/* SMALL STATS */}
<View style={{
flexDirection:"row",
justifyContent:"space-between",
marginTop:18
}}>

<View style={{
flex:1,
marginRight:8,
backgroundColor:"rgba(15,23,42,0.65)",
padding:15,
borderRadius:18,
borderWidth:1,
borderColor:"rgba(148,163,184,0.08)"
}}>

<Text style={{
color:"#38bdf8",
fontSize:12,
fontWeight:"bold"
}}>
{
language === "sw"
? "KUNDI"
: "CATEGORY"
}
</Text>

<Text style={{
color:"#fff",
marginTop:8,
fontWeight:"600"
}}>
{categoryName}
</Text>

</View>

<View style={{
flex:1,
marginLeft:8,
backgroundColor:"rgba(15,23,42,0.65)",
padding:15,
borderRadius:18,
borderWidth:1,
borderColor:"rgba(148,163,184,0.08)"
}}>

<Text style={{
color:"#22c55e",
fontSize:12,
fontWeight:"bold"
}}>
{
language === "sw"
? "JUMLA YA MITIHANI"
: "TOTAL EXAMS"
}
</Text>

<Text style={{
color:"#fff",
marginTop:8,
fontWeight:"600"
}}>
{
language === "sw"
? `${filteredExams.length} Inapatikana`
: `${filteredExams.length} Available`
}
</Text>

</View>

</View>

</BlurView>

{/* EMPTY */}
{filteredExams.length === 0 && !loading &&(

<BlurView
intensity={50}
tint="dark"
style={{
padding:35,
borderRadius:24,
alignItems:"center",
borderWidth:1,
borderColor:"rgba(255,255,255,0.06)",
backgroundColor:"rgba(15,23,42,0.55)"
}}
>

<View style={{
width:80,
height:80,
borderRadius:40,
justifyContent:"center",
alignItems:"center",
backgroundColor:"rgba(239,68,68,0.15)",
marginBottom:15
}}>

<MaterialIcons
name="search-off"
size={38}
color="#f87171"
/>

</View>

<Text style={{
color:"#ffffff",
fontSize:18,
fontWeight:"bold"
}}>
{
language === "sw"
? "Hakuna Mitihani Iliyopatikana"
: "No Exams Found"
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
? "Hakuna mitihani inayolingana na neno ulilotafuta"
: "No exams match your current search keyword"
}
</Text>

</BlurView>

)}

{/* EXAMS */}
{filteredExams.map((item,index)=>(

<Animated.View
key={item.id}
style={{
transform:[{scale:scaleAnim}],
marginBottom:18
}}
>

<TouchableOpacity
activeOpacity={0.9}
onPressIn={pressIn}
onPressOut={pressOut}
onPress={()=>{
router.push({
pathname:"/(Parents)/parent-choose-year",
params:{
examId:item.id,
categoryName:categoryName
}
})
}}
>

<LinearGradient
colors={[
"rgba(30,41,59,0.98)",
"rgba(15,23,42,0.98)",
"rgba(2,6,23,0.98)"
]}
start={{x:0,y:0}}
end={{x:1,y:1}}
style={{
padding:20,
borderRadius:24,
borderWidth:1,
borderColor:"rgba(148,163,184,0.12)",
overflow:"hidden"
}}
>

<View style={{
position:"absolute",
top:-30,
right:-30,
width:120,
height:120,
borderRadius:60,
backgroundColor:"rgba(59,130,246,0.10)"
}}/>

{/* HEADER */}
<View style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"flex-start"
}}>

<View style={{flex:1,paddingRight:10}}>

<View style={{
flexDirection:"row",
alignItems:"center"
}}>

<View style={{
width:52,
height:52,
borderRadius:16,
justifyContent:"center",
alignItems:"center",
backgroundColor:"rgba(37,99,235,0.18)",
marginRight:14
}}>

<Ionicons
name="document-text-outline"
size={24}
color="#38bdf8"
/>

</View>

<View style={{flex:1}}>

<Text style={{
color:"#ffffff",
fontSize:19,
fontWeight:"bold"
}}>
{item.name}
</Text>

<Text style={{
color:"#94a3b8",
marginTop:5,
fontSize:13
}}>
{
language === "sw"
? "Mtihani wa Shule"
: "School Examination"
}
</Text>

</View>

</View>

</View>

<View style={{
backgroundColor:"rgba(37,99,235,0.18)",
paddingHorizontal:12,
paddingVertical:8,
borderRadius:14,
borderWidth:1,
borderColor:"rgba(96,165,250,0.20)"
}}>

<Text style={{
color:"#60a5fa",
fontWeight:"bold",
fontSize:12
}}>
EXAM #{item.id}
</Text>

</View>

</View>

{/* DETAILS */}
<View style={{
marginTop:20
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
justifyContent:"center",
alignItems:"center",
backgroundColor:"rgba(34,197,94,0.15)",
marginRight:12
}}>

<Ionicons
name="calendar-outline"
size={18}
color="#22c55e"
/>

</View>

<View style={{flex:1}}>

<Text style={{
color:"#64748b",
fontSize:11,
fontWeight:"bold"
}}>
{
language === "sw"
? "TAREHE YA MTIHANI"
: "EXAM DATE"
}
</Text>

<Text style={{
color:"#ffffff",
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
justifyContent:"center",
alignItems:"center",
backgroundColor:"rgba(168,85,247,0.15)",
marginRight:12
}}>

<Ionicons
name="school-outline"
size={18}
color="#c084fc"
/>

</View>

<View style={{flex:1}}>

<Text style={{
color:"#64748b",
fontSize:11,
fontWeight:"bold"
}}>
{
language === "sw"
? "DARASA"
: "CLASSROOM"
}
</Text>

<Text style={{
color:"#ffffff",
marginTop:2
}}>
{item.classroom?.name || item.classroom}
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
justifyContent:"center",
alignItems:"center",
backgroundColor:"rgba(245,158,11,0.15)",
marginRight:12
}}>

<Ionicons
name="layers-outline"
size={18}
color="#f59e0b"
/>

</View>

<View style={{flex:1}}>

<Text style={{
color:"#64748b",
fontSize:11,
fontWeight:"bold"
}}>
{
language === "sw"
? "KUNDI"
: "CATEGORY"
}
</Text>

<Text style={{
color:"#ffffff",
marginTop:2
}}>
{item.category?.name || item.category}
</Text>

</View>

</View>

</View>

{/* FOOTER */}
<View style={{
marginTop:22,
paddingTop:18,
borderTopWidth:1,
borderTopColor:"rgba(148,163,184,0.08)",
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
}}>

<View style={{
flexDirection:"row",
alignItems:"center"
}}>

<View style={{
width:10,
height:10,
borderRadius:5,
backgroundColor:"#22c55e",
marginRight:8
}}/>

<Text style={{
color:"#22c55e",
fontWeight:"600",
fontSize:13
}}>
{
language === "sw"
? "Matokeo Yapo"
: "Results Available"
}
</Text>

</View>

<View style={{
flexDirection:"row",
alignItems:"center"
}}>

<Text style={{
color:"#38bdf8",
fontWeight:"bold",
marginRight:6
}}>
{
language === "sw"
? "Tazama Ripoti"
: "View Reports"
}
</Text>

<Ionicons
name="arrow-forward-circle"
size={24}
color="#38bdf8"
/>

</View>

</View>

</LinearGradient>

</TouchableOpacity>

</Animated.View>

))}

</Animated.ScrollView>

{/* FLOATING BUTTON */}
<TouchableOpacity
onPress={goToCreate}
activeOpacity={0.9}
style={{
position:"absolute",
bottom:35,
right:22
}}
>

<LinearGradient
colors={["#2563eb","#38bdf8","#0ea5e9"]}
style={{
width:72,
height:72,
borderRadius:40,
justifyContent:"center",
alignItems:"center",
elevation:10,
shadowColor:"#38bdf8",
shadowOpacity:0.4,
shadowRadius:12,
shadowOffset:{
width:0,
height:6
}
}}
>

<Ionicons name="add" size={34} color="#fff"/>

</LinearGradient>

</TouchableOpacity>

{/* LOADING */}
{loading &&(

<View style={styles.loader}>

<BlurView
intensity={70}
tint="dark"
style={{
padding:28,
borderRadius:24,
alignItems:"center",
overflow:"hidden",
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)"
}}
>

<ActivityIndicator size="large" color="#38bdf8"/>

<Text style={{
color:"#ffffff",
marginTop:16,
fontSize:16,
fontWeight:"600"
}}>
{
language === "sw"
? "Inapakia mitihani..."
: "Fetching exams..."
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