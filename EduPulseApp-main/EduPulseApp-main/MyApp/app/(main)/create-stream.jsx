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

import {Picker} from "@react-native-picker/picker";

import {LinearGradient} from "expo-linear-gradient";
import {BlurView} from "expo-blur";

import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";

import styles from "../../components/LoginStyles";
import {EndPoint} from "../../components/links";
import Header from "../../components/Header";


export default function CreateStream(){

const[classrooms,setClassrooms] = useState([]);

const[selectedClass,setSelectedClass] = useState("");

const[name,setName] = useState("");

const[loading,setLoading] = useState(false);

const scaleAnim = new Animated.Value(1);



useEffect(()=>{

fetchClasses();

},[]);



const fetchClasses = async()=>{

try{

const token = await AsyncStorage.getItem("token");

const response = await axios.get(

EndPoint + "/classes/",

{
headers:{
Authorization:`Token ${token}`
}
}

);

setClassrooms(response.data);

}catch(error){

console.log("Error loading classes",error);

}

};



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



const createStream = async()=>{

if(!selectedClass || !name){

Toast.show({
type:"error",
text1:"Missing Fields",
text2:"Fill all fields"
});

return;
}

setLoading(true);

try{

const token = await AsyncStorage.getItem("token");

await axios.post(

EndPoint + "/create-stream/",

{
classroom:selectedClass,
name:name
},

{
headers:{
Authorization:`Token ${token}`,
"Content-Type":"application/json"
}
}

);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

setLoading(false);

Toast.show({
type:"success",
text1:"Stream Created",
text2:"Stream added successfully"
});

setName("");
setSelectedClass("");

}catch(error){

setLoading(false);

console.log(error.response?.data);

Toast.show({
type:"error",
text1:"Failed",
text2:"Could not create stream"
});

}

};



return(

<LinearGradient
colors={["#020617","#0f172a","#1e293b"]}
style={{flex:1}}
>

<Image
source={{
uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"
}}
style={styles.bg}
/>

<Header/>

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
Create Stream
</Text>

<Text style={styles.subtitle}>
School Management System
</Text>

<View style={styles.form}>

<Text style={styles.label}>
Select Class
</Text>

<Picker
selectedValue={selectedClass}
onValueChange={(itemValue)=>setSelectedClass(itemValue)}
style={{color:"white"}}
>

<Picker.Item label="Select Class" value="" />

{classrooms.map((item)=>(
<Picker.Item
key={item.id}
label={item.name}
value={item.id}
/>
))}

</Picker>



<Text style={styles.label}>
Stream Name
</Text>

<TextInput
style={styles.input}
value={name}
onChangeText={setName}
placeholder="Example: A"
placeholderTextColor="#94a3b8"
/>



<Animated.View style={{transform:[{scale:scaleAnim}]}}>

<TouchableOpacity
onPressIn={pressIn}
onPressOut={pressOut}
onPress={createStream}
>

<LinearGradient
colors={["#2563eb","#38bdf8"]}
style={styles.button}
>

<Text style={styles.buttonText}>
Create Stream
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

<ActivityIndicator size="large" color="#2563eb"/>

<Text style={styles.loadingText}>
Creating stream...
</Text>

</View>

</View>

)}



<Toast/>

</LinearGradient>

)

}