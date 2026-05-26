import React,{useState,useEffect,useRef} from "react";

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

import {
useRouter,
useLocalSearchParams,
useFocusEffect
} from "expo-router";

import {useCallback} from "react";

import {
Ionicons,
MaterialIcons,
FontAwesome5
} from "@expo/vector-icons";

export default function AllStudents(){

const router = useRouter();

const {
streamId,
streamName,
className,
classId,
year
} = useLocalSearchParams();

/* =========================
🔥 DEBUG: PARAMS ZOTE HAPA
========================= */
console.log("===== ALL STUDENTS SCREEN OPENED =====");
console.log("classId =>", classId);
console.log("streamId =>", streamId);
console.log("streamName =>", streamName);
console.log("className =>", className);
console.log("year =>", year);
console.log("=======================================");

const[students,setStudents] = useState([]);
const[filteredStudents,setFilteredStudents] = useState([]);
const[search,setSearch] = useState("");

const[loading,setLoading] = useState(false);
const[token,setToken] = useState(null);

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
FETCH STUDENTS
========================= */

const fetchStudents = async(tokenParam)=>{

setLoading(true);

try{

const cleanYear = parseInt(year);

console.log("🔥 FETCHING STUDENTS API CALL");
console.log("classId =>", classId);
console.log("streamId =>", streamId);
console.log("year =>", cleanYear);

const url = EndPoint + "/students/stream/" + classId + "/" + streamId + "/" + cleanYear + "/";

console.log("REQUEST URL =>", url);

const response = await axios.get(
url,
{
headers:{
Authorization:`Token ${tokenParam}`,
"Content-Type":"application/json"
}
}
);

console.log("✅ RESPONSE COUNT =>", response.data?.count);
console.log("✅ RESULTS =>", response.data?.results);

/* 🔥 FIX ILIYOHARIBU MAP ERROR */
setStudents(response.data.results || []);
setFilteredStudents(response.data.results || []);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

setLoading(false);

}catch(error){

setLoading(false);

console.log("❌ ERROR => ",error.response?.data);

Toast.show({
type:"error",
text1:"Error fetching students",
text2:JSON.stringify(error.response?.data)
});

}

};

/* =========================
INITIAL LOAD
========================= */

useEffect(()=>{

if(token && classId && streamId && year){

console.log("🚀 TRIGGERING INITIAL FETCH");
fetchStudents(token);

}

},[token,classId,streamId,year]);

/* =========================
ON FOCUS REFRESH
========================= */

useFocusEffect(
useCallback(()=>{

console.log("🔄 SCREEN FOCUSED - REFRESHING DATA");

if(token && classId && streamId && year){
fetchStudents(token);
}

},[token,classId,streamId,year])
);

/* =========================
SEARCH
========================= */

const handleSearch=(text)=>{

setSearch(text);

if(text === ""){
setFilteredStudents(students);
return;
}

const filtered = students.filter((item)=>

(`${item.first_name} ${item.last_name}`)
.toLowerCase()
.includes(text.toLowerCase()) ||

item.admission_number
?.toLowerCase()
.includes(text.toLowerCase())

);

setFilteredStudents(filtered);

}

/* =========================
UI
========================= */

return(

<LinearGradient
colors={["#020617","#0f172a","#111827","#1e293b"]}
style={styles.container}
>

<Image
source={{
uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"
}}
style={styles.bg}
/>

<Header
title="Students"
subtitle="Students Management"
/>

<ScrollView
contentContainerStyle={{
padding:12,
paddingBottom:250
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
borderRadius:26,
overflow:"hidden",
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)",
backgroundColor:"rgba(15,23,42,0.60)"
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
width:62,
height:62,
borderRadius:100,
backgroundColor:"rgba(37,99,235,0.18)",
justifyContent:"center",
alignItems:"center",
borderWidth:1,
borderColor:"rgba(59,130,246,0.3)",
marginRight:14
}}>

<Ionicons
name="school-outline"
size={30}
color="#38bdf8"
/>

</View>

<View style={{flex:1}}>

<Text style={{
color:"#ffffff",
fontSize:21,
fontWeight:"700"
}}
numberOfLines={1}
>
{className || "Students"}
</Text>

<Text style={{
color:"#94a3b8",
fontSize:13,
marginTop:4
}}
numberOfLines={1}
>
{streamName || "Students In This Stream"}
</Text>

</View>

</View>

<View style={{
backgroundColor:"rgba(59,130,246,0.12)",
paddingHorizontal:15,
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
{filteredStudents.length} Students
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
placeholder="Search student or admission number..."
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

{filteredStudents.length === 0 && !loading &&(

<View style={{
marginTop:25,
padding:28,
borderRadius:24,
backgroundColor:"rgba(15,23,42,0.80)",
borderWidth:1,
borderColor:"#334155",
alignItems:"center"
}}>

<Ionicons
name="people-outline"
size={58}
color="#64748b"
/>

<Text style={{
color:"#e2e8f0",
fontSize:18,
fontWeight:"700",
marginTop:15
}}>
No Students Found
</Text>

<Text style={{
color:"#94a3b8",
marginTop:8,
textAlign:"center",
lineHeight:22
}}>
No students matched your current search
</Text>

</View>

)}

{/* STUDENTS LIST */}

<View style={{
marginTop:20
}}>

{filteredStudents.map((item,index)=>{

return(

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
"rgba(17,24,39,0.98)",
"rgba(15,23,42,0.98)",
"rgba(2,6,23,0.98)"
]}
start={{x:0,y:0}}
end={{x:1,y:1}}
style={{
padding:18,
borderRadius:26,
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
width:65,
height:65,
borderRadius:100,
backgroundColor:"rgba(37,99,235,0.15)",
justifyContent:"center",
alignItems:"center",
borderWidth:1,
borderColor:"rgba(59,130,246,0.25)"
}}>

<FontAwesome5
name="user-graduate"
size={24}
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
{item.first_name} {item.last_name}
</Text>

<View style={{
flexDirection:"row",
alignItems:"center",
marginTop:7
}}>

<MaterialIcons
name="badge"
size={17}
color="#94a3b8"
/>

<Text style={{
color:"#94a3b8",
fontSize:13,
marginLeft:6
}}>
Admission No: {item.admission_number}
</Text>

</View>

<View style={{
flexDirection:"row",
alignItems:"center",
marginTop:5
}}>

<Ionicons
name="male-female-outline"
size={16}
color="#94a3b8"
/>

<Text style={{
color:"#94a3b8",
fontSize:13,
marginLeft:6,
textTransform:"capitalize"
}}>
{item.gender}
</Text>

</View>

</View>

<View style={{
backgroundColor:"rgba(37,99,235,0.14)",
paddingHorizontal:12,
paddingVertical:8,
borderRadius:14,
borderWidth:1,
borderColor:"rgba(59,130,246,0.2)"
}}>

<Text style={{
color:"#38bdf8",
fontWeight:"700",
fontSize:12
}}>
ID {item.id}
</Text>

</View>

</View>

{/* DIVIDER */}

<View style={{
height:1,
backgroundColor:"rgba(148,163,184,0.10)",
marginVertical:18
}}/>

{/* DETAILS */}

<View style={{
flexDirection:"row",
justifyContent:"space-between",
flexWrap:"wrap"
}}>

<View style={{
width:"48%",
backgroundColor:"rgba(255,255,255,0.03)",
padding:12,
borderRadius:16,
marginBottom:12
}}>

<View style={{
flexDirection:"row",
alignItems:"center"
}}>

<Ionicons
name="school-outline"
size={16}
color="#38bdf8"
/>

<Text style={{
color:"#94a3b8",
fontSize:12,
marginLeft:6
}}>
Class
</Text>

</View>

<Text style={{
color:"#ffffff",
marginTop:7,
fontWeight:"700",
fontSize:14
}}>
{item.classroom}
</Text>

</View>

<View style={{
width:"48%",
backgroundColor:"rgba(255,255,255,0.03)",
padding:12,
borderRadius:16,
marginBottom:12
}}>

<View style={{
flexDirection:"row",
alignItems:"center"
}}>

<Ionicons
name="layers-outline"
size={16}
color="#4ade80"
/>

<Text style={{
color:"#94a3b8",
fontSize:12,
marginLeft:6
}}>
Stream
</Text>

</View>

<Text style={{
color:"#ffffff",
marginTop:7,
fontWeight:"700",
fontSize:14
}}>
{item.stream}
</Text>

</View>

<View style={{
width:"48%",
backgroundColor:"rgba(255,255,255,0.03)",
padding:12,
borderRadius:16
}}>

<View style={{
flexDirection:"row",
alignItems:"center"
}}>

<Ionicons
name="calendar-outline"
size={16}
color="#f59e0b"
/>

<Text style={{
color:"#94a3b8",
fontSize:12,
marginLeft:6
}}>
Academic Year
</Text>

</View>

<Text style={{
color:"#ffffff",
marginTop:7,
fontWeight:"700",
fontSize:14
}}>
{item.year}
</Text>

</View>

<View style={{
width:"48%",
backgroundColor:"rgba(255,255,255,0.03)",
padding:12,
borderRadius:16
}}>

<View style={{
flexDirection:"row",
alignItems:"center"
}}>

<Ionicons
name="people-outline"
size={16}
color="#c084fc"
/>

<Text style={{
color:"#94a3b8",
fontSize:12,
marginLeft:6
}}>
Status
</Text>

</View>

<Text style={{
color:"#22c55e",
marginTop:7,
fontWeight:"700",
fontSize:14
}}>
Active Student
</Text>

</View>

</View>

</LinearGradient>

</TouchableOpacity>

</Animated.View>

)

})}

</View>

</ScrollView>

{/* LOADER */}

{loading &&(

<View style={styles.loader}>

<View style={{
backgroundColor:"#0f172a",
padding:30,
borderRadius:24,
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
Fetching students...
</Text>

</View>

</View>

)}

<Toast/>

</LinearGradient>

)

}