import React,{useState,useEffect} from "react";
import{
View,
Text,
TouchableOpacity,
Image,
ActivityIndicator,
ScrollView,
Animated,
Modal,
TextInput
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

export default function AllStudentsResults(){

const router = useRouter();
const {classId,examId,categoryName} = useLocalSearchParams();

const[token,setToken] = useState(null);
const[loading,setLoading] = useState(false);
const[students,setStudents] = useState([]);
const[filteredStudents,setFilteredStudents] = useState([]);
const[search,setSearch] = useState("");
const[modalVisible,setModalVisible] = useState(false);
const scaleAnim = new Animated.Value(1);

/* Animation */
const pressIn=()=>{
  Animated.spring(scaleAnim,{toValue:0.95,useNativeDriver:true}).start();
}
const pressOut=()=>{
  Animated.spring(scaleAnim,{toValue:1,useNativeDriver:true}).start();
}

/* LOAD TOKEN */
useEffect(()=>{
  const loadToken = async()=>{
    const t = await AsyncStorage.getItem("userToken");
    setToken(t);
  };
  loadToken();
},[]);

/* FETCH RESULTS */
useEffect(()=>{
  if(token){
    fetchResults();
  }
},[token]);

const fetchResults = async()=>{
  setLoading(true);
  try{
    const res = await axios.get(
      EndPoint + `/students_results/?class_id=${classId}&exam_id=${examId}`,
      { headers:{Authorization:`Token ${token}`} }
    );

    setStudents(res.data);
    setFilteredStudents(res.data);

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

/* ================= SEARCH ================= */
const handleSearch=(text)=>{
  setSearch(text);
  if(text === ""){
    setFilteredStudents(students);
    return;
  }
  const filtered = students.filter((item)=>item.name.toLowerCase().includes(text.toLowerCase()));
  setFilteredStudents(filtered);
};

return(
<LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>
<Image
source={{uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"}}
style={styles.bg}
/>

<Header title="Results" subtitle={categoryName}/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:200}}>
<BlurView intensity={40} tint="dark" style={styles.blur}>
<Text style={styles.title}>Class Results Ranking</Text>
<Text style={{color:"#94a3b8",marginBottom:10}}>Top to lowest performance</Text>

<TextInput
value={search}
onChangeText={handleSearch}
placeholder="Search student..."
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

{filteredStudents.map((item,index)=>{
  let rankColor = "#334155";
  if(index === 0) rankColor = "#facc15";
  if(index === 1) rankColor = "#94a3b8";
  if(index === 2) rankColor = "#f97316";

  return(
  <Animated.View key={index} style={{transform:[{scale:scaleAnim}],marginTop:15}}>
  <TouchableOpacity onPressIn={pressIn} onPressOut={pressOut} activeOpacity={0.9}>
  <LinearGradient colors={["#1e293b","#0f172a"]} style={{padding:18,borderRadius:14,borderWidth:1,borderColor:"#334155"}}>
  
  <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
  <View style={{flexDirection:"row",alignItems:"center"}}>
  <View style={{backgroundColor:rankColor,width:35,height:35,borderRadius:20,justifyContent:"center",alignItems:"center",marginRight:10}}>
    <Text style={{color:"#000",fontWeight:"bold"}}>{index+1}</Text>
  </View>
  <View>
    <Text style={{color:"#fff",fontWeight:"bold",fontSize:16}}>{item.name}</Text>
    <Text style={{color:"#94a3b8"}}>Student</Text>
  </View>
  </View>

  <View style={{backgroundColor:"#2563eb",paddingHorizontal:10,paddingVertical:4,borderRadius:8}}>
    <Text style={{color:"#fff",fontWeight:"bold"}}>Avg {item.average.toFixed(1)}</Text>
  </View>
  </View>

  <View style={{marginTop:10}}>
    <Text style={{color:"#94a3b8"}}>📊 Total Marks: {item.total_marks}</Text>
    <Text style={{color:"#94a3b8"}}>📝 Exams Done: {item.exams_count}</Text>
    <Text style={{color:"#22c55e",marginTop:5,fontWeight:"bold"}}>Average: {item.average.toFixed(2)}</Text>
    <Text style={{color:"#facc15",marginTop:5,fontWeight:"bold"}}>🎓 Grade: {item.grade}</Text>
  </View>

  <TouchableOpacity onPress={()=>router.push({pathname:"/(Results)/student-results",params:{studentId:item.student_id,examId:examId}})} style={{marginTop:10}}>
    <LinearGradient colors={["#2563eb","#38bdf8"]} style={{padding:10,borderRadius:8,alignItems:"center"}}>
      <Text style={{color:"#fff",fontWeight:"bold"}}>View Results</Text>
    </LinearGradient>
  </TouchableOpacity>

  </LinearGradient>
  </TouchableOpacity>
  </Animated.View>
  )
})}

</BlurView>
</ScrollView>

{/* FLOAT BUTTON */}
<TouchableOpacity onPress={()=>setModalVisible(true)} style={{position:"absolute",bottom:100,right:20}}>
<LinearGradient colors={["#9333ea","#6366f1"]} style={{width:60,height:60,borderRadius:30,justifyContent:"center",alignItems:"center"}}>
<Text style={{color:"#fff",fontSize:24}}>≡</Text>
</LinearGradient>
</TouchableOpacity>

{/* MODAL */}
<Modal visible={modalVisible} transparent animationType="fade">
<View style={{flex:1,backgroundColor:"rgba(0,0,0,0.7)",justifyContent:"center",alignItems:"center"}}>
<View style={{width:"85%",backgroundColor:"#1e293b",borderRadius:15,padding:20}}>
<Text style={{color:"#fff",fontSize:18,fontWeight:"bold",marginBottom:15,textAlign:"center"}}>Options</Text>

<TouchableOpacity onPress={()=>{
  setModalVisible(false);
  router.push({pathname: "/(Results)/results-summary", params: { classId: classId, examId: examId }});
}}>
<LinearGradient colors={["#2563eb","#38bdf8"]} style={{padding:12,borderRadius:10,marginBottom:10}}>
<Text style={{color:"#fff",textAlign:"center"}}>📊 Results Summary</Text>
</LinearGradient>
</TouchableOpacity>

<TouchableOpacity onPress={()=>setModalVisible(false)}>
<Text style={{color:"#ef4444",textAlign:"center",marginTop:10}}>Close</Text>
</TouchableOpacity>

</View>
</View>
</Modal>

{/* LOADING */}
{loading &&(
<View style={styles.loader}>
<View style={styles.loaderCard}>
<ActivityIndicator size="large" color="#2563eb"/>
<Text style={styles.loadingText}>Loading results...</Text>
</View>
</View>
)}

<Toast/>
</LinearGradient>
)
}