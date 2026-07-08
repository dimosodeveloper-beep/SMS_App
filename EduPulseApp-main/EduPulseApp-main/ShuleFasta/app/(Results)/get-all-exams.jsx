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

import {useRouter,useLocalSearchParams} from "expo-router";

import {
Ionicons,
MaterialIcons,
FontAwesome5
} from "@expo/vector-icons";

import { LanguageContext } from "../../components/LanguageContext";

export default function ResultsAllExams(){

const router = useRouter();

const {
categoryId,
categoryName
} = useLocalSearchParams();

const { language } = useContext(LanguageContext);

const [exams,setExams] = useState([]);
const [filteredExams,setFilteredExams] = useState([]);
const [search,setSearch] = useState("");

const [loading,setLoading] = useState(false);
const [token,setToken] = useState(null);

const scaleAnim = useRef(new Animated.Value(1)).current;

/* =========================
ANIMATION
========================= */

const pressIn=()=>{

Animated.spring(scaleAnim,{
toValue:0.97,
useNativeDriver:true
}).start();

}

const pressOut=()=>{

Animated.spring(scaleAnim,{
toValue:1,
useNativeDriver:true
}).start();

}

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
FETCH EXAMS
========================= */

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

/* =========================
SEARCH
========================= */

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

/* =========================
NAVIGATE
========================= */

const openExam=(item)=>{

router.push({
pathname:"/(Results)/get-exam-classes",
params:{
examId:item.id,
categoryId:categoryId,
categoryName:categoryName
}
});

};

const goToCreate = ()=>{

router.push("/(Screens)/create-exam");

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
title={categoryName || (language === "sw" ? "Mitihani" : "Exams")}
subtitle={
language === "sw"
? "Imechujwa kulingana na kundi"
: "Filtered by category"
}
/>

<ScrollView
contentContainerStyle={{
padding:12,
paddingBottom:260
}}
showsVerticalScrollIndicator={false}
keyboardShouldPersistTaps="handled"
>

{/* TOP CARD */}

<BlurView
intensity={50}
tint="dark"
style={{
padding:20,
borderRadius:24,
overflow:"hidden",
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)",
backgroundColor:"rgba(15,23,42,0.55)"
}}
>

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
borderRadius:100,
backgroundColor:"#2563eb",
justifyContent:"center",
alignItems:"center",
marginRight:14
}}>

<Ionicons
name="document-text-outline"
size={28}
color="#fff"
/>

</View>

<View style={{flex:1}}>

<Text style={{
color:"#ffffff",
fontSize:20,
fontWeight:"700"
}}
numberOfLines={1}
>
{
language === "sw"
? "Mitihani Yote"
: "All Exams"
}
</Text>

<Text style={{
color:"#94a3b8",
fontSize:13,
marginTop:4
}}
numberOfLines={1}
>
{categoryName || (language === "sw" ? "Matokeo ya Mitihani" : "Exam Results")}
</Text>

</View>

</View>

<View style={{
backgroundColor:"rgba(37,99,235,0.15)",
paddingHorizontal:14,
paddingVertical:10,
borderRadius:16,
borderWidth:1,
borderColor:"rgba(59,130,246,0.25)"
}}>

<Text style={{
color:"#38bdf8",
fontWeight:"700",
fontSize:13
}}>
{filteredExams.length} {language === "sw" ? "Mitihani" : "Exams"}
</Text>

</View>

</View>

{/* SEARCH */}

<View style={{
marginTop:22
}}>

<View style={{
flexDirection:"row",
alignItems:"center",
backgroundColor:"rgba(15,23,42,0.95)",
borderRadius:18,
paddingHorizontal:15,
borderWidth:1,
borderColor:"#334155"
}}>

<Ionicons
name="search"
size={20}
color="#94a3b8"
/>

<TextInput
value={search}
onChangeText={handleSearch}
placeholder={
language === "sw"
? "Tafuta mtihani..."
: "Search exam..."
}
placeholderTextColor="#94a3b8"
style={{
flex:1,
paddingVertical:15,
paddingHorizontal:10,
color:"#fff",
fontSize:15
}}
/>

</View>

</View>

</BlurView>

{/* EMPTY */}

{filteredExams.length === 0 && !loading &&(

<View style={{
marginTop:25,
padding:25,
borderRadius:22,
backgroundColor:"rgba(15,23,42,0.75)",
borderWidth:1,
borderColor:"#334155",
alignItems:"center"
}}>

<Ionicons
name="documents-outline"
size={55}
color="#64748b"
/>

<Text style={{
color:"#e2e8f0",
fontSize:17,
fontWeight:"700",
marginTop:15
}}>
{
language === "sw"
? "Hakuna Mitihani Iliyopatikana"
: "No Exams Found"
}
</Text>

<Text style={{
color:"#94a3b8",
marginTop:8,
textAlign:"center",
lineHeight:22
}}>
{
language === "sw"
? "Hakuna mitihani iliyolingana na utafutaji wako"
: "No exams matched your current search"
}
</Text>

</View>

)}

{/* EXAMS LIST */}

<View style={{
marginTop:20
}}>

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
onPress={()=>openExam(item)}
activeOpacity={0.92}
>

<LinearGradient
colors={[
"rgba(30,41,59,0.97)",
"rgba(15,23,42,0.97)"
]}
style={{
padding:18,
borderRadius:24,
borderWidth:1,
borderColor:"rgba(148,163,184,0.12)"
}}
>

{/* TOP SECTION */}

<View style={{
flexDirection:"row",
alignItems:"center"
}}>

<View style={{
width:62,
height:62,
borderRadius:100,
backgroundColor:"rgba(37,99,235,0.18)",
justifyContent:"center",
alignItems:"center",
borderWidth:1,
borderColor:"rgba(59,130,246,0.3)"
}}>

<FontAwesome5
name="file-alt"
size={23}
color="#38bdf8"
/>

</View>

<View style={{
flex:1,
marginLeft:15
}}>

<Text style={{
color:"#ffffff",
fontSize:17,
fontWeight:"700"
}}
numberOfLines={1}
>
{item.name}
</Text>

<View style={{
flexDirection:"row",
alignItems:"center",
marginTop:7
}}>

<Ionicons
name="calendar-outline"
size={16}
color="#94a3b8"
/>

<Text style={{
color:"#94a3b8",
fontSize:13,
marginLeft:6
}}>
{item.date}
</Text>

</View>

<View style={{
flexDirection:"row",
alignItems:"center",
marginTop:5
}}>

<MaterialIcons
name="category"
size={16}
color="#94a3b8"
/>

<Text style={{
color:"#94a3b8",
fontSize:13,
marginLeft:6
}}>
{item.category?.name || item.category}
</Text>

</View>

</View>

</View>

{/* INFO CARDS */}

<View style={{
flexDirection:"row",
marginTop:18
}}>

<View style={{
flex:1,
backgroundColor:"rgba(255,255,255,0.04)",
padding:12,
borderRadius:16,
marginRight:8,
borderWidth:1,
borderColor:"rgba(255,255,255,0.05)"
}}>

<Text style={{
color:"#64748b",
fontSize:12,
marginBottom:5
}}>
{
language === "sw"
? "DARASA"
: "CLASS"
}
</Text>

<Text style={{
color:"#ffffff",
fontWeight:"700",
fontSize:13
}}
numberOfLines={1}
>
{item.classroom?.name || item.classroom}
</Text>

</View>

<View style={{
flex:1,
backgroundColor:"rgba(255,255,255,0.04)",
padding:12,
borderRadius:16,
marginLeft:8,
borderWidth:1,
borderColor:"rgba(255,255,255,0.05)"
}}>

<Text style={{
color:"#64748b",
fontSize:12,
marginBottom:5
}}>
{
language === "sw"
? "NAMBA YA MTIHANI"
: "EXAM ID"
}
</Text>

<Text style={{
color:"#38bdf8",
fontWeight:"700",
fontSize:13
}}>
#{item.id}
</Text>

</View>

</View>

{/* DIVIDER */}

<View style={{
height:1,
backgroundColor:"rgba(148,163,184,0.12)",
marginVertical:18
}}/>

{/* ACTION SECTION */}

<View style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
}}>

<View style={{
flexDirection:"row",
alignItems:"center"
}}>

<View style={{
width:38,
height:38,
borderRadius:100,
backgroundColor:"rgba(59,130,246,0.15)",
justifyContent:"center",
alignItems:"center"
}}>

<Ionicons
name="bar-chart-outline"
size={20}
color="#38bdf8"
/>

</View>

<View style={{
marginLeft:10
}}>

<Text style={{
color:"#ffffff",
fontWeight:"700",
fontSize:14
}}>
{
language === "sw"
? "Tazama Matokeo"
: "View Results"
}
</Text>

<Text style={{
color:"#94a3b8",
fontSize:12,
marginTop:2
}}>
{
language === "sw"
? "Fungua matokeo ya ufaulu wa darasa"
: "Open class performance results"
}
</Text>

</View>

</View>

<TouchableOpacity
onPress={()=>openExam(item)}
activeOpacity={0.85}
>

<LinearGradient
colors={["#2563eb","#38bdf8"]}
style={{
paddingHorizontal:18,
paddingVertical:12,
borderRadius:14,
flexDirection:"row",
alignItems:"center"
}}
>

<Text style={{
color:"#fff",
fontWeight:"700",
marginRight:8,
fontSize:13
}}>
{
language === "sw"
? "Fungua"
: "Open"
}
</Text>

<Ionicons
name="arrow-forward"
size={18}
color="#fff"
/>

</LinearGradient>

</TouchableOpacity>

</View>

</LinearGradient>

</TouchableOpacity>

</Animated.View>

))}

</View>

</ScrollView>

{/* FLOATING BUTTON */}

<TouchableOpacity
onPress={goToCreate}
activeOpacity={0.9}
style={{
position:"absolute",
bottom:35,
right:20
}}
>

<LinearGradient
colors={["#2563eb","#38bdf8"]}
style={{
width:68,
height:68,
borderRadius:100,
justifyContent:"center",
alignItems:"center",
shadowColor:"#38bdf8",
shadowOffset:{
width:0,
height:8
},
shadowOpacity:0.35,
shadowRadius:10,
elevation:10
}}
>

<Ionicons
name="add"
size={34}
color="#fff"
/>

</LinearGradient>

</TouchableOpacity>

{/* LOADER */}

{loading &&(

<View style={styles.loader}>

<View style={{
backgroundColor:"#0f172a",
padding:30,
borderRadius:22,
alignItems:"center",
borderWidth:1,
borderColor:"#334155"
}}>

<ActivityIndicator
size="large"
color="#2563eb"
/>

<Text style={{
color:"#fff",
marginTop:15,
fontSize:15,
fontWeight:"600"
}}>
{
language === "sw"
? "Inapakia mitihani..."
: "Fetching exams..."
}
</Text>

</View>

</View>

)}

<Toast/>

</LinearGradient>

)

}