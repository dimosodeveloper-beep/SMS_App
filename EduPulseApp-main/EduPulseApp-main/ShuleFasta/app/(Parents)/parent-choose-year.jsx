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

import {useRouter,useLocalSearchParams} from "expo-router";

import {
Ionicons,
MaterialCommunityIcons
} from "@expo/vector-icons";

export default function ChooseYear(){

const router = useRouter();

const  {examId,categoryName} = useLocalSearchParams();

const [years,setYears] = useState([]);
const [filteredYears,setFilteredYears] = useState([]);
const [search,setSearch] = useState("");
const [loading,setLoading] = useState(false);
const [token,setToken] = useState(null);

const fadeAnim = useRef(new Animated.Value(0)).current;
const slideAnim = useRef(new Animated.Value(40)).current;
const scaleAnim = useRef(new Animated.Value(1)).current;

/* SCREEN ANIMATION */
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

/* Animation */
const pressIn=()=>{

Animated.spring(scaleAnim,{
toValue:0.96,
useNativeDriver:true
}).start();

Haptics.impactAsync(
Haptics.ImpactFeedbackStyle.Light
);

}

const pressOut=()=>{

Animated.spring(scaleAnim,{
toValue:1,
friction:4,
useNativeDriver:true
}).start();

}

/* LOAD TOKEN */
useEffect(()=>{

const loadToken = async()=>{

const savedToken = await AsyncStorage.getItem("userToken");
setToken(savedToken);

};

loadToken();

},[]);

/* FETCH YEARS */
useEffect(()=>{

if(token){
fetchYears(token);
}

},[token]);

const fetchYears = async(token)=>{

setLoading(true);

try{

const response = await axios.get(
EndPoint + `/academic-years/`,
{
headers:{
Authorization:`Token ${token}`,
"Content-Type":"application/json"
}
}
);

setYears(response.data);
setFilteredYears(response.data);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

setLoading(false);

}catch(error){

setLoading(false);

Toast.show({
type:"error",
text1:"Error fetching years",
text2:JSON.stringify(error.response?.data)
});

}

};

/* SEARCH */
const handleSearch=(text)=>{

setSearch(text);

if(text === ""){
setFilteredYears(years);
return;
}

const filtered = years.filter((item)=>
String(item.year).includes(text)
);

setFilteredYears(filtered);

};

/* NAVIGATE */
const goToResults=(item)=>{

Haptics.impactAsync(
Haptics.ImpactFeedbackStyle.Medium
);

router.push({
pathname:"/(Parents)/parents-student-results",
params:{
examId:examId,
year:item.year,
categoryName:categoryName
}
});

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
width:260,
height:260,
borderRadius:200,
backgroundColor:"rgba(59,130,246,0.18)"
}}/>

<View style={{
position:"absolute",
bottom:-140,
left:-100,
width:260,
height:260,
borderRadius:200,
backgroundColor:"rgba(14,165,233,0.12)"
}}/>

<Header
title="Choose Year"
subtitle="Academic Years"
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
transform:[
{
translateY:slideAnim
}
]
}}
>

<BlurView
intensity={60}
tint="dark"
style={[
styles.blur,
{
overflow:"hidden",
borderRadius:28,
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)",
backgroundColor:"rgba(15,23,42,0.72)",
padding:18
}
]}
>

{/* TOP HEADER */}
<View style={{
marginBottom:25
}}>

<View style={{
width:75,
height:75,
borderRadius:24,
justifyContent:"center",
alignItems:"center",
alignSelf:"center",
marginBottom:18,
backgroundColor:"rgba(37,99,235,0.15)",
borderWidth:1,
borderColor:"rgba(96,165,250,0.3)"
}}>

<LinearGradient
colors={["#2563eb","#38bdf8"]}
style={{
width:58,
height:58,
borderRadius:18,
justifyContent:"center",
alignItems:"center"
}}
>

<Ionicons
name="calendar"
size={28}
color="#fff"
/>

</LinearGradient>

</View>

<Text style={{
color:"#ffffff",
fontSize:28,
fontWeight:"bold",
textAlign:"center",
letterSpacing:0.5
}}>
Select Academic Year
</Text>

<Text style={{
color:"#94a3b8",
textAlign:"center",
marginTop:10,
fontSize:15,
lineHeight:22
}}>
Choose academic year to continue viewing student results
</Text>

</View>

{/* SEARCH BOX */}
<View style={{
marginBottom:25
}}>

<View style={{
flexDirection:"row",
alignItems:"center",
backgroundColor:"rgba(15,23,42,0.92)",
borderWidth:1,
borderColor:"rgba(148,163,184,0.15)",
borderRadius:18,
paddingHorizontal:14,
height:58
}}>

<Ionicons
name="search"
size={22}
color="#64748b"
/>

<TextInput
value={search}
onChangeText={handleSearch}
placeholder="Search academic year..."
placeholderTextColor="#64748b"
style={{
flex:1,
color:"#fff",
fontSize:15,
marginLeft:10
}}
/>

{search !== "" &&(

<TouchableOpacity
onPress={()=>handleSearch("")}
>

<Ionicons
name="close-circle"
size={22}
color="#64748b"
/>

</TouchableOpacity>

)}

</View>

</View>

{/* EMPTY */}
{filteredYears.length === 0 && !loading &&(

<View style={{
paddingVertical:50,
alignItems:"center"
}}>

<MaterialCommunityIcons
name="calendar-remove"
size={60}
color="#475569"
/>

<Text style={{
color:"#94a3b8",
marginTop:15,
fontSize:16
}}>
No years found
</Text>

</View>

)}

{/* YEARS */}
{filteredYears.map((item,index)=>(

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
onPress={()=>goToResults(item)}
activeOpacity={0.9}
>

<LinearGradient
colors={[
"rgba(30,41,59,0.95)",
"rgba(15,23,42,0.98)",
"rgba(2,6,23,1)"
]}
start={{x:0,y:0}}
end={{x:1,y:1}}
style={{
borderRadius:24,
padding:18,
borderWidth:1,
borderColor:"rgba(148,163,184,0.12)",
overflow:"hidden"
}}
>

<View style={{
position:"absolute",
top:-20,
right:-20,
width:90,
height:90,
borderRadius:60,
backgroundColor:"rgba(59,130,246,0.10)"
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
width:58,
height:58,
borderRadius:18,
justifyContent:"center",
alignItems:"center",
backgroundColor:"rgba(37,99,235,0.15)",
borderWidth:1,
borderColor:"rgba(96,165,250,0.25)"
}}>

<Ionicons
name="calendar-outline"
size={26}
color="#60a5fa"
/>

</View>

<View style={{
marginLeft:15,
flex:1
}}>

<Text style={{
color:"#ffffff",
fontSize:20,
fontWeight:"bold",
letterSpacing:0.3
}}>
{item.year}
</Text>

<Text style={{
color:"#94a3b8",
marginTop:5,
fontSize:13
}}>
Academic Year
</Text>

<View style={{
flexDirection:"row",
alignItems:"center",
marginTop:8
}}>

<View style={{
backgroundColor:"rgba(34,197,94,0.15)",
paddingHorizontal:10,
paddingVertical:4,
borderRadius:20,
flexDirection:"row",
alignItems:"center"
}}>

<Ionicons
name="checkmark-circle"
size={14}
color="#22c55e"
/>

<Text style={{
color:"#22c55e",
fontSize:11,
fontWeight:"bold",
marginLeft:5
}}>
AVAILABLE
</Text>

</View>

</View>

</View>

</View>

<View style={{
alignItems:"center"
}}>

<View style={{
width:44,
height:44,
borderRadius:14,
justifyContent:"center",
alignItems:"center",
backgroundColor:"rgba(59,130,246,0.12)"
}}>

<Ionicons
name="arrow-forward"
size={22}
color="#60a5fa"
/>

</View>

</View>

</View>

</LinearGradient>

</TouchableOpacity>

</Animated.View>

))}

</BlurView>

</Animated.ScrollView>

{/* LOADING */}
{loading &&(

<View style={styles.loader}>

<View style={[
styles.loaderCard,
{
backgroundColor:"#0f172a",
borderWidth:1,
borderColor:"rgba(148,163,184,0.15)",
borderRadius:24
}
]}>

<ActivityIndicator
size="large"
color="#3b82f6"
/>

<Text style={{
color:"#ffffff",
marginTop:15,
fontSize:16,
fontWeight:"600"
}}>
Fetching years...
</Text>

<Text style={{
color:"#94a3b8",
marginTop:5,
fontSize:13
}}>
Please wait a moment
</Text>

</View>

</View>

)}

<Toast/>

</LinearGradient>

)

}