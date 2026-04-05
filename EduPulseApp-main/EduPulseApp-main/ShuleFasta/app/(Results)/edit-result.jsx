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

export default function EditResult(){

const router = useRouter();
const {resultId,currentMarks} = useLocalSearchParams();

const[marks,setMarks] = useState(currentMarks || "");

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

if(!savedToken){
Toast.show({
type:"error",
text1:"Authentication Error",
text2:"Login again"
});
return;
}

setToken(savedToken);
};
loadToken();
},[]);

/* UPDATE RESULT */
const updateResult = async()=>{

if(!marks){
Toast.show({type:"error",text1:"Enter marks"});
return;
}

if(!token){
Toast.show({type:"error",text1:"Token missing"});
return;
}

setLoading(true);

try{

const payload = {
marks:parseFloat(marks)
};

console.log("UPDATE PAYLOAD => ",payload);

const res = await axios.put(
EndPoint + `/update-delete-result/${resultId}/`,
payload,
{
headers:{
Authorization:`Token ${token}`,
"Content-Type":"application/json"
}
}
);

console.log("SUCCESS => ",res.data);

Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

Toast.show({
type:"success",
text1:"Result Updated"
});

setLoading(false);

router.back();

}catch(error){

setLoading(false);

console.log("ERROR => ",error.response?.data || error.message);

Toast.show({
type:"error",
text1:"Error",
text2:JSON.stringify(error.response?.data)
});

}
};

return(

<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>

<Image
source={{uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"}}
style={styles.bg}
/>

<Header title="Edit Result" subtitle="Update student marks"/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:300}}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>Edit Result</Text>

<View style={styles.form}>

{/* MARKS */}
<Text style={styles.label}>Marks</Text>

<TextInput
style={styles.input}
value={marks}
onChangeText={setMarks}
keyboardType="numeric"
/>

<Animated.View style={{transform:[{scale:scaleAnim}]}}>

<TouchableOpacity
onPressIn={pressIn}
onPressOut={pressOut}
onPress={updateResult}
>

<LinearGradient colors={["#22c55e","#16a34a"]} style={styles.button}>
<Text style={styles.buttonText}>Update Result</Text>
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