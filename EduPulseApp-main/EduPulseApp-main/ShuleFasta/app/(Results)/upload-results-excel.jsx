import React,{useState,useEffect,useContext} from "react";

import{
View,
Text,
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

import * as DocumentPicker from "expo-document-picker";

import styles from "../../components/LoginStyles";

import {EndPoint} from "../../components/links";

import Header from "../../components/Header";

import { LanguageContext } from "../../components/LanguageContext";

import {Ionicons} from "@expo/vector-icons";


export default function UploadResultsExcel(){

const { t } = useContext(LanguageContext);

const[file,setFile] = useState(null);

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
PICK EXCEL FILE
========================= */

const pickExcelFile = async()=>{

try{

const result = await DocumentPicker.getDocumentAsync({
type:[
'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
'application/vnd.ms-excel'
],
copyToCacheDirectory:true
});

if(result.canceled === false){

setFile(result.assets[0]);

Toast.show({
type:"success",
text1:"Excel selected successfully"
});

}

}catch(error){

Toast.show({
type:"error",
text1:"Failed to pick excel file"
});

}

};



/* =========================
UPLOAD EXCEL
========================= */
const uploadExcel = async()=>{

if(!file){

Toast.show({
type:"error",
text1:"Please select excel file"
});

return;
}

if(!token){

Toast.show({
type:"error",
text1:"Authentication error"
});

return;
}

setLoading(true);

try{

const formData = new FormData();

formData.append("file",{
uri:file.uri,
name:file.name,
type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
});

const response = await axios.post(
EndPoint + "/upload-results-excel/",
formData,
{
headers:{
Authorization:`Token ${token}`,
"Content-Type":"multipart/form-data"
}
}
);

console.log("UPLOAD RESPONSE => ",response.data);

setLoading(false);

/* =========================
🔥 SMART UI LOGIC
========================= */

if(response.data.status === "success"){

Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

Toast.show({
type:"success",
text1:"Upload Successful",
text2:`${response.data.saved_count} results saved`
});

}

else if(response.data.status === "partial_success"){

Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

Toast.show({
type:"error",
text1:"Partial Upload",
text2:`Saved: ${response.data.saved_count} | Failed: ${response.data.error_count}`
});

}

else{

Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

Toast.show({
type:"error",
text1:"Upload Failed",
text2:response.data.message
});

}

setFile(null);

}catch(error){

setLoading(false);

console.log("UPLOAD ERROR => ",error.response?.data);

Toast.show({
type:"error",
text1:"Upload failed",
text2: error.response?.data?.message || "Check file format"
});

}

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
paddingBottom:500
}}
showsVerticalScrollIndicator={false}
keyboardShouldPersistTaps="handled"
>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>
Upload Results Excel
</Text>

<Text style={styles.subtitle}>
Bulk upload students results using excel
</Text>

<View style={styles.form}>


{/* PICK FILE BUTTON */}

<Animated.View style={{transform:[{scale:scaleAnim}]}}>

<TouchableOpacity
onPressIn={pressIn}
onPressOut={pressOut}
onPress={pickExcelFile}
>

<LinearGradient
colors={["#7c3aed","#a855f7"]}
style={styles.button}
>

<Ionicons
name="document-text"
size={20}
color="#fff"
style={{marginRight:10}}
/>

<Text style={styles.buttonText}>
Choose Excel File
</Text>

</LinearGradient>

</TouchableOpacity>

</Animated.View>



{/* FILE NAME */}

{file &&(

<View style={{
marginTop:20,
backgroundColor:"#0f172a",
padding:15,
borderRadius:12,
borderWidth:1,
borderColor:"#334155"
}}>

<Text style={{
color:"#fff",
fontWeight:"bold"
}}>
Selected File:
</Text>

<Text style={{
color:"#94a3b8",
marginTop:5
}}>
{file.name}
</Text>

</View>

)}



{/* UPLOAD BUTTON */}

<Animated.View
style={{
transform:[{scale:scaleAnim}],
marginTop:25
}}
>

<TouchableOpacity
onPressIn={pressIn}
onPressOut={pressOut}
onPress={uploadExcel}
>

<LinearGradient
colors={["#2563eb","#38bdf8"]}
style={styles.button}
>

<Ionicons
name="cloud-upload"
size={20}
color="#fff"
style={{marginRight:10}}
/>

<Text style={styles.buttonText}>
Upload Results
</Text>

</LinearGradient>

</TouchableOpacity>

</Animated.View>

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
Uploading results excel...
</Text>

</View>

</View>

)}

<Toast/>

</LinearGradient>

)

}