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
//classname
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

export default function ChooseYear(){

const router = useRouter();

const {
streamId,
streamName,
className,
classId
} = useLocalSearchParams();


const [years,setYears] = useState([]);
const [filteredYears,setFilteredYears] = useState([]);
const [search,setSearch] = useState("");
const [loading,setLoading] = useState(false);
const [token,setToken] = useState(null);

const scaleAnim = new Animated.Value(1);

/* Animation */
const pressIn=()=>{
Animated.spring(scaleAnim,{
toValue:0.95,
useNativeDriver:true
}).start();
}

const pressOut=()=>{
Animated.spring(scaleAnim,{
toValue:1,
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
router.push({
pathname:"/(Screens)/all-stream-students",
params:{
streamId:streamId,
streamName:streamName,
year:item.year,
classId:classId,
className:className
}
});
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
title="Choose Year"
subtitle="Academic Years"
/>

<ScrollView
contentContainerStyle={{
padding:10,
paddingBottom:300
}}
showsVerticalScrollIndicator={false}
keyboardShouldPersistTaps="handled"
>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>
Select Academic Year
</Text>

<Text style={styles.subtitle}>
Choose year to continue
</Text>

<View style={{marginTop:20}}>

<TextInput
value={search}
onChangeText={handleSearch}
placeholder="Search year..."
placeholderTextColor="#94a3b8"
style={{
backgroundColor:"#0f172a",
borderWidth:1,
borderColor:"#334155",
borderRadius:10,
padding:12,
color:"#fff",
marginBottom:20
}}
/>

{filteredYears.length === 0 && !loading &&(
<Text style={{
color:"#94a3b8",
textAlign:"center",
marginTop:30
}}>
No years found
</Text>
)}

{filteredYears.map((item,index)=>(

<Animated.View
key={item.id}
style={{
transform:[{scale:scaleAnim}],
marginBottom:15
}}
>

<TouchableOpacity
onPressIn={pressIn}
onPressOut={pressOut}
onPress={()=>goToResults(item)}
activeOpacity={0.9}
>

<LinearGradient
colors={["#1e293b","#0f172a"]}
style={{
padding:18,
borderRadius:14,
borderWidth:1,
borderColor:"#334155"
}}
>

<View style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
}}>

<View>

<Text style={{
color:"#ffffff",
fontSize:18,
fontWeight:"bold"
}}>
{item.year}
</Text>

<Text style={{
color:"#94a3b8",
marginTop:4
}}>
Academic Year
</Text>

</View>

<View style={{
backgroundColor:"#2563eb",
paddingHorizontal:12,
paddingVertical:6,
borderRadius:8
}}>

<Text style={{
color:"#ffffff",
fontWeight:"bold"
}}>
YEAR
</Text>

</View>

</View>

</LinearGradient>

</TouchableOpacity>

</Animated.View>

))}

</View>

</BlurView>

</ScrollView>

{loading &&(

<View style={styles.loader}>
<View style={styles.loaderCard}>
<ActivityIndicator size="large" color="#2563eb"/>
<Text style={styles.loadingText}>
Fetching years...
</Text>
</View>
</View>

)}

<Toast/>

</LinearGradient>

)

}