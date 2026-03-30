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

import {useLocalSearchParams,useRouter} from "expo-router";

export default function ViewAttandanceStreams(){

const router = useRouter();

const {classId,className} = useLocalSearchParams();

const[streams,setStreams] = useState([]);
const[filteredStreams,setFilteredStreams] = useState([]);
const[search,setSearch] = useState("");

const[loading,setLoading] = useState(false);
const[token,setToken] = useState(null);

const scaleAnim = new Animated.Value(1);

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

useEffect(()=>{

const loadToken = async()=>{

const savedToken = await AsyncStorage.getItem("userToken");

setToken(savedToken);

};

loadToken();

},[]);

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
text1:"Error fetching streams",
text2:JSON.stringify(error.response?.data)
});

}

}


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
title="School Dashboard"
subtitle="Management System"
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
Streams {className}
</Text>

<Text style={styles.subtitle}>
Available streams for this classroom
</Text>


<View style={{marginTop:20}}>

<TextInput
value={search}
onChangeText={handleSearch}
placeholder="Search stream..."
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


{filteredStreams.length === 0 && !loading &&(

<Text style={{
color:"#94a3b8",
textAlign:"center",
marginTop:30
}}>
No streams found
</Text>

)}


{filteredStreams.map((item,index)=>{

return(

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
onPress={()=>openStudents(item)}
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
Stream {item.name}
</Text>

<Text style={{
color:"#94a3b8",
marginTop:4
}}>
Class {className}
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
ID {item.id}
</Text>

</View>

</View>

</LinearGradient>

</TouchableOpacity>

</Animated.View>

)

})}

</View>

</BlurView>

</ScrollView>


{loading &&(

<View style={styles.loader}>

<View style={styles.loaderCard}>

<ActivityIndicator
size="large"
color="#2563eb"
/>

<Text style={styles.loadingText}>
Fetching streams...
</Text>

</View>

</View>

)}

<Toast/>

</LinearGradient>

)

}