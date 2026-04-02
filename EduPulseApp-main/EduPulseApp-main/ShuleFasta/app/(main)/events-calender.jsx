import React,{useEffect,useState} from "react";
import {
View,Text,TouchableOpacity,ActivityIndicator
} from "react-native";

import {Calendar} from "react-native-calendars";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {LinearGradient} from "expo-linear-gradient";

import Toast from "react-native-toast-message";

import {EndPoint} from "../../components/links";

export default function EventsScreen(){

const[token,setToken] = useState(null);
const[events,setEvents] = useState([]);
const[markedDates,setMarkedDates] = useState({});
const[loading,setLoading] = useState(false);

/* LOAD TOKEN */
useEffect(()=>{
const load = async()=>{
const t = await AsyncStorage.getItem("userToken");
setToken(t);
};
load();
},[]);

/* FETCH EVENTS */
useEffect(()=>{
if(token){
fetchEvents();
}
},[token]);

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

formatCalendar(res.data);

}catch(e){

Toast.show({
type:"error",
text1:"Error",
text2:"Failed to load events"
});

}

setLoading(false);
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
dotColor:getColor(e.event_type),
selected:true,
selectedColor:getColor(e.event_type)
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

return(
<LinearGradient
colors={["#020617","#0f172a","#1e293b"]}
style={{flex:1,paddingTop:50}}
>

<Text style={{
color:"#fff",
fontSize:22,
fontWeight:"bold",
textAlign:"center",
marginBottom:10
}}>
School Events Calendar
</Text>

{loading ? (
<ActivityIndicator size="large" color="#22c55e"/>
):(

<Calendar
markedDates={markedDates}
theme={{
calendarBackground:"transparent",
dayTextColor:"#fff",
monthTextColor:"#38bdf8",
textDisabledColor:"#475569",
todayTextColor:"#22c55e",
arrowColor:"#38bdf8"
}}
/>

)}

<Toast/>

</LinearGradient>
);
}