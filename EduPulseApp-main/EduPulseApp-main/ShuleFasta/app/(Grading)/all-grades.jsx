import React,{useState,useEffect,useRef} from "react";

import{
View,
Text,
TouchableOpacity,
Image,
ActivityIndicator,
Animated,
ScrollView,
Modal
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

export default function AllGradings(){

const router = useRouter();

const[gradings,setGradings] = useState([]);
const[loading,setLoading] = useState(false);
const[token,setToken] = useState(null);

const[deleteModal,setDeleteModal] = useState(false);
const[selectedId,setSelectedId] = useState(null);

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

useEffect(()=>{
if(token){
fetchGradings();
}
},[token]);

const fetchGradings = async()=>{
setLoading(true);
try{
const res = await axios.get(
EndPoint+"/grading-system/",
{headers:{Authorization:`Token ${token}`}}
);
setGradings(res.data);
}catch(e){
Toast.show({type:"error",text1:"Error fetching grading"});
}
setLoading(false);
};

/* DELETE */
const confirmDelete = (id)=>{
setSelectedId(id);
setDeleteModal(true);
};

const deleteGrading = async()=>{
try{

await axios.delete(
EndPoint+`/grading-system/${selectedId}/`,
{headers:{Authorization:`Token ${token}`}}
);

Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

Toast.show({type:"success",text1:"Deleted"});

setDeleteModal(false);
fetchGradings();

}catch(e){
Toast.show({type:"error",text1:"Delete failed"});
}
};

/* EDIT NAV */
const goToEdit = (item)=>{
router.push({
pathname:"/(Grading)/edit-grade",
params:item
});
};

return(

<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>

<Image source={{uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"}} style={styles.bg}/>

<Header title="Grading System" subtitle="All Grades Table"/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:300}}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>Grading Table</Text>

<View style={{flexDirection:"row",padding:12}}>
<Text style={{color:"#38bdf8",flex:1}}>Grade</Text>
<Text style={{color:"#38bdf8",flex:1}}>Min</Text>
<Text style={{color:"#38bdf8",flex:1}}>Max</Text>
<Text style={{color:"#38bdf8",flex:1}}>Action</Text>
</View>

{gradings.map((item,index)=>(

<Animated.View key={item.id} style={{transform:[{scale:scaleAnim}],marginBottom:10}}>

<LinearGradient colors={["#1e293b","#0f172a"]} style={{
flexDirection:"row",
padding:12,
borderRadius:10
}}>

<Text style={{color:"#fff",flex:1}}>{item.grade}</Text>
<Text style={{color:"#94a3b8",flex:1}}>{item.min_score}</Text>
<Text style={{color:"#94a3b8",flex:1}}>{item.max_score}</Text>

<View style={{flexDirection:"row",flex:1}}>

<TouchableOpacity onPress={()=>goToEdit(item)}>
<Ionicons name="create" size={20} color="#38bdf8"/>
</TouchableOpacity>

<TouchableOpacity onPress={()=>confirmDelete(item.id)} style={{marginLeft:15}}>
<Ionicons name="trash" size={20} color="#ef4444"/>
</TouchableOpacity>

</View>

</LinearGradient>

</Animated.View>

))}

</BlurView>
</ScrollView>

{/* DELETE MODAL */}
<Modal visible={deleteModal} transparent animationType="fade">
<View style={{
flex:1,
backgroundColor:"rgba(0,0,0,0.7)",
justifyContent:"center",
padding:20
}}>
<View style={{
backgroundColor:"#020617",
padding:20,
borderRadius:15
}}>
<Text style={{color:"#fff",marginBottom:20}}>
Are you sure you want to delete this grading?
</Text>

<View style={{flexDirection:"row",justifyContent:"space-between"}}>

<TouchableOpacity onPress={()=>setDeleteModal(false)}>
<Text style={{color:"#94a3b8"}}>Cancel</Text>
</TouchableOpacity>

<TouchableOpacity onPress={deleteGrading}>
<Text style={{color:"#ef4444",fontWeight:"bold"}}>Delete</Text>
</TouchableOpacity>

</View>

</View>
</View>
</Modal>

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