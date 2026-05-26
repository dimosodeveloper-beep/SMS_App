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

import {useRouter} from "expo-router";

import {
Ionicons,
MaterialCommunityIcons
} from "@expo/vector-icons";

export default function CreateGrading(){

const router = useRouter();

/* STATES */
const[grade,setGrade] = useState("");
const[minScore,setMinScore] = useState("");
const[maxScore,setMaxScore] = useState("");
const[remark,setRemark] = useState("");

const[token,setToken] = useState(null);
const[loading,setLoading] = useState(false);

/* ANIMATION */
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

/* TOKEN */
useEffect(()=>{
const loadToken = async()=>{
const t = await AsyncStorage.getItem("userToken");
setToken(t);
};
loadToken();
},[]);

/* CREATE */
const createGrading = async()=>{

if(!grade || !minScore || !maxScore || !remark){
Toast.show({type:"error",text1:"Fill all fields"});
return;
}

setLoading(true);

try{

await axios.post(
EndPoint+"/create-grading-system/",
{
grade,
min_score:parseInt(minScore),
max_score:parseInt(maxScore),
remark
},
{
headers:{
Authorization:`Token ${token}`,
"Content-Type":"application/json"
}
}
);

Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

Toast.show({type:"success",text1:"Grading Created"});

setGrade("");
setMinScore("");
setMaxScore("");
setRemark("");

router.back();

}catch(e){

Toast.show({
type:"error",
text1:"Error",
text2:JSON.stringify(e.response?.data)
});

}

setLoading(false);
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
title="Create Grading"
subtitle="Smart Grading System"
/>

<Animated.ScrollView
contentContainerStyle={{
padding:14,
paddingBottom:250
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
padding:20
}
]}
>

{/* TOP HEADER */}
<View style={{
alignItems:"center",
marginBottom:28
}}>

<View style={{
width:82,
height:82,
borderRadius:26,
justifyContent:"center",
alignItems:"center",
backgroundColor:"rgba(37,99,235,0.15)",
borderWidth:1,
borderColor:"rgba(96,165,250,0.3)",
marginBottom:18
}}>

<LinearGradient
colors={["#2563eb","#38bdf8"]}
style={{
width:64,
height:64,
borderRadius:22,
justifyContent:"center",
alignItems:"center"
}}
>

<MaterialCommunityIcons
name="chart-bar"
size={32}
color="#fff"
/>

</LinearGradient>

</View>

<Text style={{
color:"#ffffff",
fontSize:30,
fontWeight:"bold",
textAlign:"center",
letterSpacing:0.5
}}>
Create Grading
</Text>

<Text style={{
color:"#94a3b8",
textAlign:"center",
marginTop:10,
fontSize:15,
lineHeight:22
}}>
Configure smart grading system and score performance levels
</Text>

</View>

<View style={styles.form}>

{/* GRADE */}
<Text style={{
color:"#e2e8f0",
fontSize:15,
fontWeight:"600",
marginBottom:10,
marginLeft:4
}}>
Grade
</Text>

<View style={{
flexDirection:"row",
alignItems:"center",
backgroundColor:"rgba(15,23,42,0.92)",
borderWidth:1,
borderColor:"rgba(148,163,184,0.15)",
borderRadius:18,
paddingHorizontal:15,
height:58,
marginBottom:18
}}>

<Ionicons
name="ribbon-outline"
size={22}
color="#64748b"
/>

<TextInput
style={{
flex:1,
color:"#fff",
fontSize:16,
marginLeft:12
}}
value={grade}
onChangeText={setGrade}
placeholder="A"
placeholderTextColor="#64748b"
/>

</View>

{/* MIN SCORE */}
<Text style={{
color:"#e2e8f0",
fontSize:15,
fontWeight:"600",
marginBottom:10,
marginLeft:4
}}>
Minimum Score
</Text>

<View style={{
flexDirection:"row",
alignItems:"center",
backgroundColor:"rgba(15,23,42,0.92)",
borderWidth:1,
borderColor:"rgba(148,163,184,0.15)",
borderRadius:18,
paddingHorizontal:15,
height:58,
marginBottom:18
}}>

<Ionicons
name="stats-chart-outline"
size={22}
color="#64748b"
/>

<TextInput
style={{
flex:1,
color:"#fff",
fontSize:16,
marginLeft:12
}}
value={minScore}
onChangeText={setMinScore}
keyboardType="numeric"
placeholder="70"
placeholderTextColor="#64748b"
/>

</View>

{/* MAX SCORE */}
<Text style={{
color:"#e2e8f0",
fontSize:15,
fontWeight:"600",
marginBottom:10,
marginLeft:4
}}>
Maximum Score
</Text>

<View style={{
flexDirection:"row",
alignItems:"center",
backgroundColor:"rgba(15,23,42,0.92)",
borderWidth:1,
borderColor:"rgba(148,163,184,0.15)",
borderRadius:18,
paddingHorizontal:15,
height:58,
marginBottom:18
}}>

<Ionicons
name="trending-up-outline"
size={22}
color="#64748b"
/>

<TextInput
style={{
flex:1,
color:"#fff",
fontSize:16,
marginLeft:12
}}
value={maxScore}
onChangeText={setMaxScore}
keyboardType="numeric"
placeholder="100"
placeholderTextColor="#64748b"
/>

</View>

{/* REMARK */}
<Text style={{
color:"#e2e8f0",
fontSize:15,
fontWeight:"600",
marginBottom:10,
marginLeft:4
}}>
Remark
</Text>

<View style={{
flexDirection:"row",
alignItems:"center",
backgroundColor:"rgba(15,23,42,0.92)",
borderWidth:1,
borderColor:"rgba(148,163,184,0.15)",
borderRadius:18,
paddingHorizontal:15,
height:58,
marginBottom:22
}}>

<Ionicons
name="chatbubble-ellipses-outline"
size={22}
color="#64748b"
/>

<TextInput
style={{
flex:1,
color:"#fff",
fontSize:16,
marginLeft:12
}}
value={remark}
onChangeText={setRemark}
placeholder="Excellent"
placeholderTextColor="#64748b"
/>

</View>

{/* INFO CARD */}
<View style={{
backgroundColor:"rgba(30,41,59,0.7)",
borderRadius:20,
padding:16,
borderWidth:1,
borderColor:"rgba(148,163,184,0.1)",
marginBottom:25
}}>

<View style={{
flexDirection:"row",
alignItems:"center"
}}>

<View style={{
width:42,
height:42,
borderRadius:14,
justifyContent:"center",
alignItems:"center",
backgroundColor:"rgba(34,197,94,0.15)"
}}>

<MaterialCommunityIcons
name="school-outline"
size={22}
color="#22c55e"
/>

</View>

<View style={{
marginLeft:12,
flex:1
}}>

<Text style={{
color:"#ffffff",
fontWeight:"bold",
fontSize:15
}}>
Grading Information
</Text>

<Text style={{
color:"#94a3b8",
marginTop:4,
fontSize:13,
lineHeight:20
}}>
Create clear grading ranges to improve academic performance tracking.
</Text>

</View>

</View>

</View>

{/* BUTTON */}
<Animated.View
style={{
transform:[{scale:scaleAnim}],
marginTop:5
}}
>

<TouchableOpacity
onPressIn={pressIn}
onPressOut={pressOut}
onPress={createGrading}
activeOpacity={0.9}
>

<LinearGradient
colors={["#2563eb","#38bdf8","#0ea5e9"]}
start={{x:0,y:0}}
end={{x:1,y:1}}
style={{
height:60,
borderRadius:20,
justifyContent:"center",
alignItems:"center",
flexDirection:"row",
shadowColor:"#2563eb",
shadowOpacity:0.35,
shadowRadius:12,
elevation:8
}}
>

<Ionicons
name="add-circle-outline"
size={24}
color="#fff"
/>

<Text style={{
color:"#ffffff",
fontWeight:"bold",
fontSize:17,
marginLeft:10,
letterSpacing:0.3
}}>
Create Grading
</Text>

</LinearGradient>

</TouchableOpacity>

</Animated.View>

</View>

</BlurView>

</Animated.ScrollView>

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
Creating...
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