// app/(Fee)/all-fee-years.jsx

import React, { useEffect, useState, useRef, useContext } from "react";
import {
View,
Text,
TouchableOpacity,
ScrollView,
ActivityIndicator,
Image,
TextInput,
Animated
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";

import {
Ionicons,
MaterialCommunityIcons
} from "@expo/vector-icons";

import { EndPoint } from "../../components/links";
import Header from "../../components/Header";
import styles from "../../components/LoginStyles";

import { LanguageContext } from "../../components/LanguageContext";

export default function AllFeeYears() {

const [years, setYears] = useState([]);
const [classMap, setClassMap] = useState({});
const [loading, setLoading] = useState(false);
const [token, setToken] = useState(null);
const [search, setSearch] = useState("");

const router = useRouter();

const { language } = useContext(LanguageContext);

const scaleAnim = useRef(new Animated.Value(1)).current;

/* LOAD TOKEN */
useEffect(() => {
AsyncStorage.getItem("userToken").then(setToken);
}, []);

/* FETCH DATA */
useEffect(() => {
if (token) {
fetchYears(token);
fetchClasses(token);
}
}, [token]);

/* YEARS */
const fetchYears = async (token) => {

setLoading(true);

try {

const res = await axios.get(
EndPoint + "/fee-years/",
{
headers: {
Authorization: `Token ${token}`
}
}
);

setYears(res.data);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

} catch (e) {

Toast.show({
type: "error",
text1:
language === "sw"
? "Imeshindikana kupakia miaka"
: "Failed to load years"
});

}

setLoading(false);
};

/* CLASSES */
const fetchClasses = async (token) => {

try {

const res = await axios.get(
EndPoint + "/fee-structures/",
{
headers: {
Authorization: `Token ${token}`
}
}
);

const map = {};

res.data.forEach(item => {

if (!map[item.year]) {
map[item.year] = new Set();
}

// Map standard classroom name or Swahili variation if available
const name = language === "sw" ? (item.classroom_name_SW || item.classroom_name) : item.classroom_name;
map[item.year].add(name);

});

Object.keys(map).forEach(y => {
map[y] = Array.from(map[y]);
});

setClassMap(map);

} catch (e) {

console.log(e);

}
};

/* FILTER */
const filteredYears = years.filter(y =>
String(y).toLowerCase().includes(search.toLowerCase())
);

/* HELPERS */
const getClassCount = (y) => classMap[y]?.length || 0;

/* ANIMATION */
const pressIn = () => {
Animated.spring(scaleAnim,{
toValue:0.96,
useNativeDriver:true
}).start();
};

const pressOut = () => {
Animated.spring(scaleAnim,{
toValue:1,
friction:4,
useNativeDriver:true
}).start();
};

return (

<LinearGradient
colors={["#020617", "#0f172a", "#1e293b"]}
style={styles.container}
>

<Image
source={{
uri: "https://images.unsplash.com/photo-1588072432836-e10032774350"
}}
style={styles.bg}
/>

<View style={{
position:"absolute",
top:0,
left:0,
right:0,
bottom:0,
backgroundColor:"rgba(2,6,23,0.75)"
}}/>

<Header
title={
language === "sw"
? "Usimamizi wa Ada"
: "Fee Management"
}
subtitle={
language === "sw"
? "Dashibodi ya Mwaka wa Masomo"
: "Academic Year Dashboard"
}
/>

<ScrollView
contentContainerStyle={{
padding:15,
paddingBottom:140
}}
showsVerticalScrollIndicator={false}
keyboardShouldPersistTaps="handled"
>

<BlurView
intensity={45}
tint="dark"
style={[
styles.blur,
{
borderRadius:30,
overflow:"hidden",
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)",
backgroundColor:"rgba(15,23,42,0.45)"
}
]}
>

{/* TOP CARD */}
<LinearGradient
colors={[
"rgba(37,99,235,0.25)",
"rgba(14,165,233,0.05)"
]}
start={{x:0,y:0}}
end={{x:1,y:1}}
style={{
padding:24,
borderRadius:26,
marginBottom:25,
borderWidth:1,
borderColor:"rgba(96,165,250,0.15)"
}}
>

<View style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
}}>

<View style={{flex:1,paddingRight:10}}>

<Text style={{
color:"#ffffff",
fontSize:28,
fontWeight:"900",
letterSpacing:0.5
}}>
{
language === "sw"
? "Miaka ya Masomo"
: "Academic Years"
}
</Text>

<Text style={{
color:"#cbd5e1",
marginTop:8,
lineHeight:22,
fontSize:14
}}>
{
language === "sw"
? "Tazama miaka yote ya masomo na usimamie muundo wa ada kwa kila darasa kwa urahisi."
: "View all academic years and manage fee structures for every classroom easily."
}
</Text>

</View>

<View style={{
width:72,
height:72,
borderRadius:22,
justifyContent:"center",
alignItems:"center",
backgroundColor:"rgba(255,255,255,0.08)",
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)"
}}
>

<MaterialCommunityIcons
name="calendar-multiple-check"
size={34}
color="#38bdf8"
/>

</View>

</View>

</LinearGradient>

{/* SEARCH */}
<View style={{
marginBottom:25
}}>

<Text style={{
color:"#e2e8f0",
fontWeight:"700",
fontSize:15,
marginBottom:12
}}>
{
language === "sw"
? "Tafuta Mwaka wa Masomo"
: "Search Academic Year"
}
</Text>

<View style={{
flexDirection:"row",
alignItems:"center",
backgroundColor:"rgba(15,23,42,0.9)",
borderRadius:18,
paddingHorizontal:16,
borderWidth:1,
borderColor:"rgba(148,163,184,0.2)",
height:58
}}>

<Ionicons
name="search"
size={22}
color="#94a3b8"
/>

<TextInput
value={search}
onChangeText={setSearch}
placeholder={
language === "sw"
? "Tafuta mwaka wa masomo mf. 2026..."
: "Search academic year e.g 2026..."
}
placeholderTextColor="#64748b"
style={{
flex:1,
height:"100%",
color:"#fff",
paddingHorizontal:12,
fontSize:16
}}
/>

{search !== "" && (

<TouchableOpacity
onPress={() => setSearch("")}
>

<Ionicons
name="close-circle"
size={22}
color="#94a3b8"
/>

</TouchableOpacity>

)}

</View>

</View>

{/* TITLE */}
<View style={{
marginBottom:20
}}>

<Text style={{
color:"#ffffff",
fontSize:22,
fontWeight:"900",
textAlign:"center"
}}>
{
language === "sw"
? "Muhtasari wa Mwaka wa Masomo"
: "Academic Year Overview"
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
? "Chagua mwaka hapo chini ili kuchunguza muundo wa ada na data za kifedha za wanafunzi"
: "Select a year below to explore fee structures and student financial data"
}
</Text>

</View>

{/* GRID */}
<View style={{
flexDirection:"row",
flexWrap:"wrap",
justifyContent:"space-between"
}}>

{filteredYears.map((y,index) => {

const classCount = getClassCount(y);

return (

<Animated.View
key={y}
style={{
width:"48%",
marginBottom:18,
transform:[{scale:scaleAnim}]
}}
>

<TouchableOpacity
activeOpacity={0.92}
onPressIn={pressIn}
onPressOut={pressOut}
onPress={() => {

Haptics.selectionAsync();

router.push({
pathname: "/(Fee)/all-fee-students",
params: { year: y }
});

}}
>

<LinearGradient
colors={[
"rgba(15,23,42,0.95)",
"rgba(30,41,59,0.98)",
"rgba(11,18,32,1)"
]}
style={{
padding:18,
borderRadius:24,
borderWidth:1,
borderColor:"rgba(148,163,184,0.12)",
minHeight:220,
justifyContent:"space-between",
overflow:"hidden"
}}
>

{/* GLOW */}
<View style={{
position:"absolute",
top:-30,
right:-20,
width:100,
height:100,
borderRadius:100,
backgroundColor:"rgba(56,189,248,0.08)"
}}/>

{/* HEADER */}
<View>

<View style={{
width:54,
height:54,
borderRadius:18,
justifyContent:"center",
alignItems:"center",
backgroundColor:"rgba(37,99,235,0.16)",
borderWidth:1,
borderColor:"rgba(59,130,246,0.18)"
}}
>

<MaterialCommunityIcons
name="calendar-star"
size={28}
color="#38bdf8"
/>

</View>

<Text style={{
color:"#38bdf8",
fontSize:11,
fontWeight:"800",
marginTop:16,
letterSpacing:1
}}>
{
language === "sw"
? "MWAKA WA MASOMO"
: "ACADEMIC YEAR"
}
</Text>

<Text style={{
color:"#ffffff",
fontSize:28,
fontWeight:"900",
marginTop:6
}}>
{y}
</Text>

</View>

{/* STATS */}
<View style={{
marginTop:20
}}>

<View style={{
backgroundColor:"rgba(15,23,42,0.65)",
borderRadius:16,
padding:14,
borderWidth:1,
borderColor:"rgba(148,163,184,0.08)"
}}
>

<View style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
}}>

<Text style={{
color:"#94a3b8",
fontSize:12,
fontWeight:"600"
}}>
{
language === "sw"
? "Madarasa Yaliyopangwa"
: "Assigned Classes"
}
</Text>

<View style={{
backgroundColor:"rgba(34,197,94,0.15)",
paddingHorizontal:10,
paddingVertical:4,
borderRadius:10
}}
>

<Text style={{
color:"#22c55e",
fontWeight:"800",
fontSize:12
}}>
{classCount}
</Text>

</View>

</View>

<Text style={{
color:"#cbd5e1",
marginTop:12,
fontSize:12,
lineHeight:20
}}
numberOfLines={4}
>

{classMap[y]?.length
? classMap[y].join(", ")
: language === "sw" ? "Hakuna madarasa yaliyopangwa" : "No classes assigned"}

</Text>

</View>

</View>

{/* FOOTER */}
<View style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
marginTop:18
}}>

<Text style={{
color:"#38bdf8",
fontSize:13,
fontWeight:"700"
}}>
{
language === "sw"
? "Fungua Dashibodi"
: "Open Dashboard"
}
</Text>

<Ionicons
name="chevron-forward-circle"
size={28}
color="#38bdf8"
/>

</View>

</LinearGradient>

</TouchableOpacity>

</Animated.View>

);

})}

</View>

{/* EMPTY */}
{filteredYears.length === 0 && !loading && (

<View style={{
paddingVertical:60,
alignItems:"center"
}}>

<MaterialCommunityIcons
name="database-remove-outline"
size={60}
color="#475569"
/>

<Text style={{
color:"#94a3b8",
textAlign:"center",
marginTop:15,
fontSize:16,
fontWeight:"600"
}}>
{
language === "sw"
? "Hakuna miaka ya masomo iliyopatikana"
: "No academic years found"
}
</Text>

</View>

)}

</BlurView>

</ScrollView>

{/* LOADING */}
{loading && (

<View style={styles.loader}>

<View style={[
styles.loaderCard,
{
backgroundColor:"#0f172a",
borderWidth:1,
borderColor:"rgba(148,163,184,0.15)"
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
marginTop:12,
color:"#e2e8f0"
}
]}
>
{
language === "sw"
? "Inapakia miaka ya masomo..."
: "Loading academic years..."
}
</Text>

</View>

</View>

)}

<Toast />

</LinearGradient>

);
}