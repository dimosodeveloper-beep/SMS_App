import React,{useState,useEffect} from "react";

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

export default function ChooseSubjectToEdit(){

const router = useRouter();
const {studentId,examId} = useLocalSearchParams();

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
text1:"Error",
text2:JSON.stringify(e.response?.data)
});
}
setLoading(false);
};

/* DELETE SUBJECT RESULT */
const deleteResult = (resultId)=>{
Alert.alert(
"Delete Result",
"Are you sure you want to delete this subject result?",
[
{ text:"Cancel" },
{
text:"Delete",
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
text1:"Deleted successfully"
});

fetchSubjects();

}catch(e){
Toast.show({
type:"error",
text1:"Error",
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

const filtered = subjects.filter((item)=>
item.subject_name.toLowerCase().includes(text.toLowerCase())
);

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

<Header title="Choose Subject" subtitle="Edit Marks"/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:300}}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>Select Subject</Text>

<TextInput
value={search}
onChangeText={handleSearch}
placeholder="Search subject..."
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
{item.subject_name}
</Text>

<Text style={{color:"#22c55e",marginTop:5}}>
Marks: {item.marks}
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
<Text style={styles.loadingText}>Loading...</Text>
</View>
</View>
)}

<Toast/>

</LinearGradient>

)
}