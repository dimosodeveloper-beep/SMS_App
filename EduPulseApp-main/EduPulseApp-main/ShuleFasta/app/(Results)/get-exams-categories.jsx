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

import {useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

export default function ResultsAllExamCategories(){

const router = useRouter();

const [categories,setCategories] = useState([]);
const [filteredCategories,setFilteredCategories] = useState([]);
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

/* FETCH DATA */
useEffect(()=>{
if(token){
fetchCategories(token);
}
},[token]);

const fetchCategories = async(token)=>{
setLoading(true);

try{

const response = await axios.get(
EndPoint + "/exam-categories/",
{
headers:{
Authorization:`Token ${token}`,
"Content-Type":"application/json"
}
}
);

setCategories(response.data);
setFilteredCategories(response.data);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

setLoading(false);

}catch(error){

setLoading(false);

console.log("ERROR => ",error.response?.data);

Toast.show({
type:"error",
text1:"Error fetching categories",
text2:JSON.stringify(error.response?.data)
});

}

};

/* SEARCH */
const handleSearch=(text)=>{

setSearch(text);

if(text === ""){
setFilteredCategories(categories);
return;
}

const filtered = categories.filter((item)=>
item.name.toLowerCase().includes(text.toLowerCase())
);

setFilteredCategories(filtered);

};

/* NAVIGATE */
const goToCreate = ()=>{
router.push("/(Screens)/create-exam-category");
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
Exam Categories
</Text>

<Text style={styles.subtitle}>
Available exam categories
</Text>

<View style={{marginTop:20}}>

<TextInput
value={search}
onChangeText={handleSearch}
placeholder="Search category..."
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

{filteredCategories.length === 0 && !loading &&(
<Text style={{
color:"#94a3b8",
textAlign:"center",
marginTop:30
}}>
No categories found
</Text>
)}

{filteredCategories.map((item,index)=>(

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
activeOpacity={0.9}
onPress={() => router.push({
  pathname: "/(Results)/get-all-exams",
  params: {
    categoryId: item.id,
    categoryName: item.name
  }
})}
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
{item.name}
</Text>

<Text style={{
color:"#94a3b8",
marginTop:4
}}>
Exam Category
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

))}

</View>

</BlurView>

</ScrollView>

{/* FLOATING BUTTON */}
<TouchableOpacity
onPress={goToCreate}
activeOpacity={0.9}
style={{
position:"absolute",
bottom:100,
right:20
}}
>

<LinearGradient
colors={["#2563eb","#38bdf8"]}
style={{
width:65,
height:65,
borderRadius:35,
justifyContent:"center",
alignItems:"center",
elevation:10,
shadowColor:"#000",
shadowOpacity:0.3,
shadowRadius:10
}}
>

<Ionicons name="add" size={30} color="#fff"/>

</LinearGradient>

</TouchableOpacity>

{loading &&(

<View style={styles.loader}>
<View style={styles.loaderCard}>
<ActivityIndicator size="large" color="#2563eb"/>
<Text style={styles.loadingText}>
Fetching categories...
</Text>
</View>
</View>

)}

<Toast/>

</LinearGradient>

)

}