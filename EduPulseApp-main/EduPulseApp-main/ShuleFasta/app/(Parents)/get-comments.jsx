import React,{useState,useEffect} from "react";
import{
View,
Text,
TouchableOpacity,
ScrollView,
ActivityIndicator,
Modal,
TextInput
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

import {LinearGradient} from "expo-linear-gradient";
import {BlurView} from "expo-blur";

import Header from "../../components/Header";
import {EndPoint} from "../../components/links";

import {Ionicons} from "@expo/vector-icons";

export default function ParentComments(){

const[data,setData] = useState([]);
const[loading,setLoading] = useState(false);
const[token,setToken] = useState(null);

const[modalVisible,setModalVisible] = useState(false);

const[selectedComment,setSelectedComment] = useState(null);

const[replyMessage,setReplyMessage] = useState("");

useEffect(()=>{

const load = async()=>{

const t = await AsyncStorage.getItem("userToken");

setToken(t);

if(t){
fetchData(t);
}

};

load();

},[]);

const fetchData = async(currentToken)=>{

try{

const res = await axios.get(
EndPoint+"/parent-comment/all/",
{
headers:{
Authorization:`Token ${currentToken}`
}
}
);

setData(res.data);

}catch(e){

Toast.show({
type:"error",
text1:"Failed",
text2:"Error loading comments"
});

}

};

const sendReply = async()=>{

if(!replyMessage){

Toast.show({
type:"error",
text1:"Write message first"
});

return;
}

setLoading(true);

try{

await axios.post(
EndPoint+"/parent-comment/reply/",
{
email:selectedComment.parent_email,
message:replyMessage
},
{
headers:{
Authorization:`Token ${token}`
}
}
);

Toast.show({
type:"success",
text1:"Email sent successfully"
});

setReplyMessage("");
setModalVisible(false);

}catch(e){

Toast.show({
type:"error",
text1:"Failed",
text2:"Unable to send email"
});

}

setLoading(false);
};

const formatDate = (dateString)=>{

if(!dateString) return "";

const d = new Date(dateString);

const day = String(d.getDate()).padStart(2,"0");
const month = String(d.getMonth()+1).padStart(2,"0");
const year = d.getFullYear();

return `${day}/${month}/${year}`;
};

return(
<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={{flex:1}}>

<Header title="Parent Comments" subtitle="Feedback & Suggestions"/>

<ScrollView contentContainerStyle={{padding:15,paddingBottom:100}}>

<Text style={{
color:"#94a3b8",
marginBottom:15,
fontSize:13
}}>
Parents Feedback List
</Text>

{data.map((i,index)=>(

<BlurView
key={index}
intensity={60}
tint="dark"
style={{
borderRadius:22,
overflow:"hidden",
marginBottom:18,
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)"
}}
>

<LinearGradient
colors={["rgba(15,23,42,0.95)","rgba(30,41,59,0.95)"]}
style={{
padding:16
}}
>

{/* TOP */}
<View style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
}}>

<View style={{
flexDirection:"row",
alignItems:"center",
flex:1
}}>

<View style={{
width:50,
height:50,
borderRadius:25,
backgroundColor:"rgba(56,189,248,0.15)",
justifyContent:"center",
alignItems:"center",
marginRight:10
}}>

<Ionicons
name="person"
size={24}
color="#38bdf8"
/>

</View>

<View style={{flex:1}}>

<Text style={{
color:"#fff",
fontWeight:"bold",
fontSize:15
}}>
{i.parent_name}
</Text>

<Text style={{
color:"#94a3b8",
fontSize:12,
marginTop:2
}}>
{i.parent_email}
</Text>

<Text style={{
color:"#64748b",
fontSize:11,
marginTop:3
}}>
{formatDate(i.created)}
</Text>

</View>

</View>

<TouchableOpacity
onPress={()=>{
setSelectedComment(i);
setModalVisible(true);
}}
style={{
width:45,
height:45,
borderRadius:14,
backgroundColor:"rgba(37,99,235,0.15)",
justifyContent:"center",
alignItems:"center"
}}
>

<Ionicons
name="mail-outline"
size={22}
color="#60a5fa"
/>

</TouchableOpacity>

</View>

{/* COMMENT */}
<View style={{
marginTop:15,
backgroundColor:"rgba(255,255,255,0.03)",
padding:14,
borderRadius:16,
borderWidth:1,
borderColor:"rgba(255,255,255,0.05)"
}}>

<Text style={{
color:"#e2e8f0",
lineHeight:22,
fontSize:14
}}>
{i.comment}
</Text>

</View>

</LinearGradient>

</BlurView>

))}

{data.length === 0 &&(

<View style={{
justifyContent:"center",
alignItems:"center",
marginTop:80
}}>

<Ionicons
name="chatbubble-ellipses-outline"
size={70}
color="#334155"
/>

<Text style={{
color:"#64748b",
marginTop:10,
fontSize:15
}}>
No comments available
</Text>

</View>

)}

</ScrollView>

{/* MODAL */}
<Modal
visible={modalVisible}
transparent={true}
animationType="slide"
>

<View style={{
flex:1,
backgroundColor:"rgba(0,0,0,0.7)",
justifyContent:"center",
padding:20
}}>

<BlurView
intensity={80}
tint="dark"
style={{
borderRadius:25,
overflow:"hidden",
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)"
}}
>

<LinearGradient
colors={["#0f172a","#1e293b"]}
style={{
padding:20
}}
>

<View style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
marginBottom:15
}}>

<Text style={{
color:"#fff",
fontSize:18,
fontWeight:"bold"
}}>
Reply To Parent
</Text>

<TouchableOpacity
onPress={()=>{
setModalVisible(false);
}}
>
<Ionicons
name="close"
size={28}
color="#fff"
/>
</TouchableOpacity>

</View>

{selectedComment &&(

<View style={{
marginBottom:15
}}>

<Text style={{
color:"#38bdf8",
fontWeight:"bold",
fontSize:14
}}>
{selectedComment.parent_name}
</Text>

<Text style={{
color:"#94a3b8",
fontSize:12,
marginTop:3
}}>
{selectedComment.parent_email}
</Text>

</View>

)}

<View style={{
backgroundColor:"#020617",
borderRadius:18,
padding:12,
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)"
}}>

<TextInput
placeholder="Write your reply message here..."
placeholderTextColor="#64748b"
multiline={true}
numberOfLines={7}
value={replyMessage}
onChangeText={setReplyMessage}
style={{
color:"#fff",
minHeight:160,
textAlignVertical:"top",
lineHeight:22
}}
/>

</View>

<TouchableOpacity
onPress={sendReply}
style={{
marginTop:18
}}
>

<LinearGradient
colors={["#2563eb","#38bdf8"]}
style={{
padding:15,
borderRadius:16,
flexDirection:"row",
justifyContent:"center",
alignItems:"center"
}}
>

<Ionicons
name="send"
size={18}
color="#fff"
style={{marginRight:8}}
/>

<Text style={{
color:"#fff",
fontWeight:"bold",
fontSize:15
}}>
Send Email
</Text>

</LinearGradient>

</TouchableOpacity>

</LinearGradient>

</BlurView>

</View>

</Modal>

{loading &&(
<View style={{
position:"absolute",
top:0,
left:0,
right:0,
bottom:0,
justifyContent:"center",
alignItems:"center",
backgroundColor:"rgba(0,0,0,0.5)"
}}>
<ActivityIndicator size="large" color="#38bdf8"/>

<Text style={{
color:"#fff",
marginTop:10
}}>
Sending...
</Text>

</View>
)}

<Toast/>

</LinearGradient>
);
}