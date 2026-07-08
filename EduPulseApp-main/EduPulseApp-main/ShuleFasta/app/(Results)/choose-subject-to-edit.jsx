import React,{useState,useEffect,useContext} from "react";

import{
View,
Text,
TextInput,
TouchableOpacity,
Image,
ActivityIndicator,
Animated,
ScrollView,
Alert
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

import { LanguageContext } from "../../components/LanguageContext";

export default function ChooseSubjectToEdit(){

const router = useRouter();
const {studentId,examId} = useLocalSearchParams();

const { language } = useContext(LanguageContext);

const[subjects,setSubjects] = useState([]);
const[filteredSubjects,setFilteredSubjects] = useState([]);
const[search,setSearch] = useState("");
const[loading,setLoading] = useState(false);
const[token,setToken] = useState(null);

const scaleAnim = new Animated.Value(1);

/* ANIMATION */
const pressIn=()=>{Animated.spring(scaleAnim,{toValue:0.95,useNativeDriver:true}).start();}
const pressOut=()=>{Animated.spring(scaleAnim,{toValue:1,useNativeDriver:true}).start();}

/* LOAD TOKEN */
useEffect(()=>{
const loadToken = async()=>{
const savedToken = await AsyncStorage.getItem("userToken");
setToken(savedToken);
};
loadToken();
},[]);

/* FETCH SUBJECTS ZA MWANAFUNZI */
useEffect(()=>{
if(token){
fetchSubjects();
}
},[token]);

const fetchSubjects = async()=>{
setLoading(true);
try{

const res = await axios.get(
EndPoint + `/student-subject-results/?student_id=${studentId}&exam_id=${examId}`,
{
headers:{Authorization:`Token ${token}`}
}
);

setSubjects(res.data);
setFilteredSubjects(res.data);

Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

}catch(e){
Toast.show({
type:"error",
text1:
language === "sw"
? "Hitilafu"
: "Error",
text2:JSON.stringify(e.response?.data)
});
}
setLoading(false);
};

/* DELETE SUBJECT RESULT */
const deleteResult = (resultId)=>{
Alert.alert(
language === "sw" ? "Futa Alama" : "Delete Result",
language === "sw" ? "Je, una uhakika unataka kufuta alama za somo hili?" : "Are you sure you want to delete this subject result?",
[
{ text: language === "sw" ? "Ghairi" : "Cancel" },
{
text: language === "sw" ? "Futa" : "Delete",
onPress: async()=>{
try{

await axios.delete(
EndPoint + `/update-delete-result/${resultId}/`,
{
headers:{Authorization:`Token ${token}`}
}
);

Toast.show({
type:"success",
text1:
language === "sw"
? "Imefutwa kwa mafanikio"
: "Deleted successfully"
});

fetchSubjects();

}catch(e){
Toast.show({
type:"error",
text1:
language === "sw"
? "Hitilafu"
: "Error",
text2:JSON.stringify(e.response?.data)
});
}
}
}
]
);
};

/* SEARCH */
const handleSearch=(text)=>{
setSearch(text);

if(text===""){
setFilteredSubjects(subjects);
return;
}

const filtered = subjects.filter((item)=>{
const sName = language === "sw" ? (item.subject_name_SW || item.subject_name) : item.subject_name;
return sName.toLowerCase().includes(text.toLowerCase());
});

setFilteredSubjects(filtered);
};

/* OPEN SUBJECT */
const openSubject=(item)=>{
router.push({
pathname:"/(Results)/edit-result",
params:{
resultId:item.result_id,
currentMarks:item.marks
}
});
};

return(

<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>

<Image
source={{uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"}}
style={styles.bg}
/>

<Header 
title={
language === "sw"
? "Chagua Somo"
: "Choose Subject"
} 
subtitle={
language === "sw"
? "Hariri Alama"
: "Edit Marks"
}
/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:300}}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>
{
language === "sw"
? "Chagua Somo"
: "Select Subject"
}
</Text>

<TextInput
value={search}
onChangeText={handleSearch}
placeholder={
language === "sw"
? "Tafuta somo..."
: "Search subject..."
}
placeholderTextColor="#94a3b8"
style={styles.input}
/>

{filteredSubjects.map((item,index)=>(

<Animated.View key={index} style={{transform:[{scale:scaleAnim}],marginTop:15}}>

<TouchableOpacity
onPressIn={pressIn}
onPressOut={pressOut}
onPress={()=>openSubject(item)}
>

<LinearGradient colors={["#1e293b","#0f172a"]} style={{padding:18,borderRadius:14}}>

<View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>

<View>
<Text style={{color:"#fff",fontSize:16,fontWeight:"bold"}}>
{
language === "sw"
? (item.subject_name_SW || item.subject_name)
: item.subject_name
}
</Text>

<Text style={{color:"#22c55e",marginTop:5}}>
{language === "sw" ? "Alama" : "Marks"}: {item.marks}
</Text>
</View>

{/* DELETE BUTTON */}
<TouchableOpacity onPress={()=>deleteResult(item.result_id)}>
<Text style={{color:"#ef4444",fontSize:18}}>🗑️</Text>
</TouchableOpacity>

</View>

</LinearGradient>

</TouchableOpacity>

</Animated.View>

))}

</BlurView>

</ScrollView>

{loading &&(
<View style={styles.loader}>
<View style={styles.loaderCard}>
<ActivityIndicator size="large" color="#2563eb"/>
<Text style={styles.loadingText}>
{
language === "sw"
? "Inapakia..."
: "Loading..."
}
</Text>
</View>
</View>
)}

<Toast/>

</LinearGradient>

)
}