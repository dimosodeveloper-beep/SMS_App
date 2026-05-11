import React,{useState,useEffect} from "react";

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

import {Ionicons} from "@expo/vector-icons";

export default function StudentBehaviourHistory(){

const router = useRouter();

const {studentId,studentName} = useLocalSearchParams();

const [behaviours,setBehaviours] = useState([]);

const [filteredBehaviours,setFilteredBehaviours] = useState([]);

const [search,setSearch] = useState("");

const [loading,setLoading] = useState(false);

const [token,setToken] = useState(null);

const scaleAnim = new Animated.Value(1);



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
FORMAT DATE
========================= */

const formatDate=(dateValue)=>{

if(!dateValue) return "";

const date = new Date(dateValue);

const day = String(date.getDate()).padStart(2,"0");

const month = String(date.getMonth()+1).padStart(2,"0");

const year = date.getFullYear();

return `${day}-${month}-${year}`;

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
FETCH BEHAVIOURS
========================= */

useEffect(()=>{

if(token){

fetchBehaviours(token);

}

},[token]);



const fetchBehaviours = async(token)=>{

setLoading(true);

try{

console.log("TOKEN => ",token);

const response = await axios.get(

EndPoint + `/student-behaviour-history/${studentId}/`,

{
headers:{
Authorization:`Token ${token}`,
"Content-Type":"application/json"
}
}

);

console.log("BEHAVIOURS => ",response.data);

setBehaviours(response.data);

setFilteredBehaviours(response.data);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

setLoading(false);

}catch(error){

setLoading(false);

console.log("ERROR => ",error.response?.data);

Toast.show({
type:"error",
text1:"Error fetching behaviours",
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

setFilteredBehaviours(behaviours);

return;

}

const filtered = behaviours.filter((item)=>

item.title.toLowerCase().includes(text.toLowerCase()) ||

item.status.toLowerCase().includes(text.toLowerCase())

);

setFilteredBehaviours(filtered);

}



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
title="Student Behaviour"
subtitle="Behaviour Management"
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
borderRadius:24,
overflow:"hidden",
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)",
backgroundColor:"rgba(15,23,42,0.55)"
}}
>

<View style={{
flexDirection:"row",
alignItems:"center"
}}>

<View style={{
width:55,
height:55,
borderRadius:100,
backgroundColor:"#2563eb",
justifyContent:"center",
alignItems:"center",
marginRight:15
}}>

<Ionicons
name="person"
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
{studentName}
</Text>

<Text style={{
color:"#94a3b8",
fontSize:13,
marginTop:4
}}>
Behaviour History Records
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
borderRadius:16,
paddingHorizontal:14,
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
placeholder="Search behaviour..."
placeholderTextColor="#94a3b8"
style={{
flex:1,
paddingVertical:14,
paddingHorizontal:10,
color:"#fff",
fontSize:15
}}
/>

</View>

</View>

</BlurView>



{/* EMPTY */}

{filteredBehaviours.length === 0 && !loading &&(

<View style={{
marginTop:25,
padding:25,
borderRadius:20,
backgroundColor:"rgba(15,23,42,0.75)",
borderWidth:1,
borderColor:"#334155",
alignItems:"center"
}}>

<Ionicons
name="document-text-outline"
size={50}
color="#64748b"
/>

<Text style={{
color:"#cbd5e1",
fontSize:16,
fontWeight:"600",
marginTop:15
}}>
No Behaviour Records
</Text>

<Text style={{
color:"#94a3b8",
marginTop:6,
textAlign:"center",
lineHeight:22
}}>
This student does not have any saved behaviour history yet
</Text>

</View>

)}



{/* LIST */}

<View style={{
marginTop:20
}}>

{filteredBehaviours.map((item,index)=>(

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
activeOpacity={0.9}
>

<LinearGradient
colors={[
"rgba(30,41,59,0.95)",
"rgba(15,23,42,0.95)"
]}
style={{
padding:18,
borderRadius:22,
borderWidth:1,
borderColor:"rgba(148,163,184,0.15)"
}}
>

{/* TOP */}

<View style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"flex-start"
}}>

<View style={{flex:1,paddingRight:10}}>

<Text style={{
color:"#ffffff",
fontSize:16,
fontWeight:"700",
lineHeight:24
}}>
{item.title}
</Text>

</View>

<View style={{
backgroundColor:"#1d4ed8",
paddingHorizontal:12,
paddingVertical:6,
borderRadius:30
}}>

<Text style={{
color:"#fff",
fontSize:12,
fontWeight:"700"
}}>
{item.status}
</Text>

</View>

</View>



{/* DESCRIPTION */}

<View style={{
marginTop:14,
backgroundColor:"rgba(15,23,42,0.65)",
padding:14,
borderRadius:16
}}>

<Text style={{
color:"#cbd5e1",
fontSize:14,
lineHeight:24
}}>
{item.description}
</Text>

</View>



{/* FOOTER */}

<View style={{
marginTop:16,
flexDirection:"row",
alignItems:"center",
justifyContent:"space-between"
}}>

<View style={{
flexDirection:"row",
alignItems:"center"
}}>

<View style={{
width:34,
height:34,
borderRadius:100,
backgroundColor:"rgba(59,130,246,0.15)",
justifyContent:"center",
alignItems:"center"
}}>

<Ionicons
name="calendar-outline"
size={18}
color="#38bdf8"
/>

</View>

<Text style={{
color:"#94a3b8",
marginLeft:10,
fontSize:12
}}>
Occurred on
</Text>

</View>

<Text style={{
color:"#e2e8f0",
fontSize:12,
fontWeight:"600"
}}>
{formatDate(item.created)}
</Text>

</View>

</LinearGradient>

</TouchableOpacity>

</Animated.View>

))}

</View>

</ScrollView>

{loading &&(

<View style={styles.loader}>

<View style={{
backgroundColor:"#0f172a",
padding:30,
borderRadius:20,
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
Fetching student behaviours...
</Text>

</View>

</View>

)}

<Toast/>

</LinearGradient>

)

}