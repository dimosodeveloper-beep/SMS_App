import React,{useEffect,useState,useRef} from "react";

import{
View,
Text,
TouchableOpacity,
ActivityIndicator,
Image,
ScrollView,
Modal,
Animated
} from "react-native";

import {Calendar} from "react-native-calendars";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {LinearGradient} from "expo-linear-gradient";
import {BlurView} from "expo-blur";

import Toast from "react-native-toast-message";

import styles from "../../components/LoginStyles";
import {EndPoint} from "../../components/links";
import Header from "../../components/Header";

import {Ionicons} from "@expo/vector-icons";
import {useFocusEffect} from "expo-router";

export default function EventsScreen(){

const[token,setToken] = useState(null);
const[events,setEvents] = useState([]);
const[filteredEvents,setFilteredEvents] = useState([]);
const[markedDates,setMarkedDates] = useState({});
const[loading,setLoading] = useState(false);

const[selectedDate,setSelectedDate] = useState(null);
const[selectedEvents,setSelectedEvents] = useState([]);
const[modalVisible,setModalVisible] = useState(false);

const[selectedFilter,setSelectedFilter] = useState("all");

/* ANIMATION */
const fadeAnim = useRef(new Animated.Value(0)).current;
const scaleAnim = useRef(new Animated.Value(1)).current;

/* LOAD TOKEN */
useEffect(()=>{
const loadToken = async()=>{
const savedToken = await AsyncStorage.getItem("userToken");
setToken(savedToken);
};
loadToken();
},[]);

/* AUTO REFRESH WHEN SCREEN FOCUS */
useFocusEffect(
React.useCallback(()=>{
if(token){
fetchEvents();
}
},[token])
);

/* FETCH EVENTS */
const fetchEvents = async()=>{

setLoading(true);

try{

const res = await axios.get(
EndPoint+"/events/",
{
headers:{Authorization:`Token ${token}`}
}
);

setEvents(res.data);
applyFilter(res.data,selectedFilter);

/* ANIMATION */
Animated.timing(fadeAnim,{
toValue:1,
duration:800,
useNativeDriver:true
}).start();

}catch(e){

Toast.show({
type:"error",
text1:"Error",
text2:"Failed to load events"
});

}

setLoading(false);
};

/* FILTER */
const applyFilter = (data,filter)=>{

let filtered = data;

if(filter !== "all"){
filtered = data.filter(e=>e.event_type === filter);
}

setFilteredEvents(filtered);
formatCalendar(filtered);
};

/* FORMAT CALENDAR */
const formatCalendar = (data)=>{

let marks = {};

data.forEach(e=>{

let current = new Date(e.start_date);
let end = new Date(e.end_date);

while(current <= end){

let date = current.toISOString().split("T")[0];

marks[date] = {
marked:true,
dots:[{color:getColor(e.event_type)}],
selected:false
};

current.setDate(current.getDate()+1);
}

});

setMarkedDates(marks);
};

/* COLOR */
const getColor = (type)=>{
if(type === "exam") return "#ef4444";
if(type === "holiday") return "#22c55e";
if(type === "meeting") return "#3b82f6";
return "#a855f7";
};

/* DATE CLICK */
const onDayPress = (day)=>{

const selected = filteredEvents.filter(e=>{
return day.dateString >= e.start_date && day.dateString <= e.end_date;
});

if(selected.length > 0){
setSelectedEvents(selected);
setSelectedDate(day.dateString);
setModalVisible(true);
}else{
Toast.show({
type:"info",
text1:"No Event",
text2:"No events for this date"
});
}

};

/* FILTER BUTTON PRESS */
const onFilterPress = (type)=>{

Animated.sequence([
Animated.spring(scaleAnim,{toValue:0.9,useNativeDriver:true}),
Animated.spring(scaleAnim,{toValue:1,useNativeDriver:true})
]).start();

setSelectedFilter(type);
applyFilter(events,type);
};

return(

<LinearGradient
colors={["#020617","#0f172a","#1e293b"]}
style={styles.container}
>

<Image
source={{uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"}}
style={styles.bg}
/>

<Header title="Events Calendar" subtitle="School Activities"/>

<ScrollView contentContainerStyle={{padding:10,paddingBottom:300}}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>School Calendar</Text>

{/* FILTER BUTTONS */}
<ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:10}}>

{["all","exam","holiday","meeting","activity"].map((type,index)=>(

<Animated.View key={index} style={{transform:[{scale:scaleAnim}]}}>

<TouchableOpacity
onPress={()=>onFilterPress(type)}
style={{
backgroundColor:selectedFilter===type ? "#2563eb" : "#1e293b",
paddingHorizontal:15,
paddingVertical:8,
borderRadius:20,
marginRight:10
}}
>
<Text style={{color:"#fff",fontWeight:"bold"}}>
{type.toUpperCase()}
</Text>
</TouchableOpacity>

</Animated.View>

))}

</ScrollView>

<Animated.View style={{opacity:fadeAnim}}>

<View style={{
backgroundColor:"rgba(255,255,255,0.05)",
borderRadius:15,
padding:10
}}>

<Calendar
markingType={"multi-dot"}
markedDates={markedDates}
onDayPress={onDayPress}
theme={{
calendarBackground:"transparent",
dayTextColor:"#ffffff",
monthTextColor:"#38bdf8",
textDisabledColor:"#475569",
todayTextColor:"#22c55e",
arrowColor:"#38bdf8",
selectedDayBackgroundColor:"#2563eb",
textDayFontWeight:"bold",
textMonthFontWeight:"bold"
}}
/>

</View>

</Animated.View>

</BlurView>

</ScrollView>

{/* MODAL */}
<Modal visible={modalVisible} transparent animationType="slide">

<View style={{
flex:1,
backgroundColor:"rgba(0,0,0,0.7)",
justifyContent:"center",
padding:20
}}>

<View style={{
backgroundColor:"#0f172a",
borderRadius:20,
padding:20,
borderWidth:1,
borderColor:"#334155"
}}>

<View style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
marginBottom:10
}}>

<Text style={{
color:"#38bdf8",
fontSize:18,
fontWeight:"bold"
}}>
Events on {selectedDate}
</Text>

<TouchableOpacity onPress={()=>setModalVisible(false)}>
<Ionicons name="close" size={24} color="#fff"/>
</TouchableOpacity>

</View>

{selectedEvents.map((item,index)=>(

<View key={index} style={{
backgroundColor:"#1e293b",
padding:15,
borderRadius:12,
marginBottom:10
}}>

<Text style={{
color:"#fff",
fontWeight:"bold",
fontSize:16
}}>
{item.title}
</Text>

<Text style={{color:"#94a3b8",marginTop:5}}>
{item.description || "No description"}
</Text>

<Text style={{
color:getColor(item.event_type),
marginTop:5,
fontWeight:"bold"
}}>
{item.event_type.toUpperCase()}
</Text>

</View>

))}

</View>

</View>

</Modal>

{loading &&(
<View style={styles.loader}>
<View style={styles.loaderCard}>
<ActivityIndicator size="large" color="#2563eb"/>
<Text style={styles.loadingText}>
Loading events...
</Text>
</View>
</View>
)}

<Toast/>

</LinearGradient>

)
}