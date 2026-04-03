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

export default function EditGrading(){

const router = useRouter();
const params = useLocalSearchParams();

const[grade,setGrade] = useState(params.grade);
const[minScore,setMinScore] = useState(String(params.min_score));
const[maxScore,setMaxScore] = useState(String(params.max_score));
const[remark,setRemark] = useState(params.remark);

const[token,setToken] = useState(null);
const[loading,setLoading] = useState(false);

const scaleAnim = useRef(new Animated.Value(1)).current;

const pressIn=()=>{ Animated.spring(scaleAnim,{toValue:0.95,useNativeDriver:true}).start(); }
const pressOut=()=>{ Animated.spring(scaleAnim,{toValue:1,useNativeDriver:true}).start(); }

useEffect(()=>{
const loadToken = async()=>{
const t = await AsyncStorage.getItem("userToken");
setToken(t);
};
loadToken();
},[]);

const updateGrading = async()=>{

if(!grade || !minScore || !maxScore || !remark){
Toast.show({type:"error",text1:"Fill all fields"});
return;
}

setLoading(true);

try{

await axios.put(
EndPoint+`/grading-system/${params.id}/`,
{
grade,
min_score:parseInt(minScore),
max_score:parseInt(maxScore),
remark
},
{
headers:{
Authorization:`Token ${token}`
}
}
);

Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

Toast.show({type:"success",text1:"Updated Successfully"});

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
<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>

<Image source={{uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"}} style={styles.bg}/>

<Header title="Edit Grading" subtitle="Update Grade"/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:200}}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>Edit Grading</Text>

<View style={styles.form}>

<Text style={styles.label}>Grade</Text>
<TextInput style={styles.input} value={grade} onChangeText={setGrade}/>

<Text style={styles.label}>Minimum Score</Text>
<TextInput style={styles.input} value={minScore} onChangeText={setMinScore} keyboardType="numeric"/>

<Text style={styles.label}>Maximum Score</Text>
<TextInput style={styles.input} value={maxScore} onChangeText={setMaxScore} keyboardType="numeric"/>

<Text style={styles.label}>Remark</Text>
<TextInput style={styles.input} value={remark} onChangeText={setRemark}/>

<Animated.View style={{transform:[{scale:scaleAnim}],marginTop:20}}>
<TouchableOpacity onPressIn={pressIn} onPressOut={pressOut} onPress={updateGrading}>
<LinearGradient colors={["#2563eb","#38bdf8"]} style={styles.button}>
<Text style={styles.buttonText}>Update</Text>
</LinearGradient>
</TouchableOpacity>
</Animated.View>

</View>
</BlurView>
</ScrollView>

{loading &&(
<View style={styles.loader}>
<View style={styles.loaderCard}>
<ActivityIndicator size="large" color="#2563eb"/>
<Text style={styles.loadingText}>Updating...</Text>
</View>
</View>
)}

<Toast/>

</LinearGradient>
)
}