// app/(Screens)/all-fee-structure.jsx

import React, { useState, useEffect, useRef } from "react";
import {
View,
Text,
TextInput,
Image,
ActivityIndicator,
Animated,
ScrollView,
TouchableOpacity,
Modal
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import styles from "../../components/LoginStyles";
import { EndPoint } from "../../components/links";
import Header from "../../components/Header";

export default function AllFeeStructure() {

const [fees, setFees] = useState([]);
const [filteredFees, setFilteredFees] = useState([]);
const [search, setSearch] = useState("");
const [loading, setLoading] = useState(false);
const [token, setToken] = useState(null);

/* EDIT MODAL */
const [modalVisible, setModalVisible] = useState(false);
const [selectedFee, setSelectedFee] = useState(null);

const [editAmount, setEditAmount] = useState("");
const [editTerm, setEditTerm] = useState("");
const [editYear, setEditYear] = useState("");

const scaleAnim = useRef(new Animated.Value(1)).current;

/* LOAD TOKEN */
useEffect(() => {
AsyncStorage.getItem("userToken").then(setToken);
}, []);

useEffect(() => {
if (token) fetchFeeStructures(token);
}, [token]);

/* FETCH */
const fetchFeeStructures = async (token) => {
setLoading(true);

try {

const res = await axios.get(
EndPoint + "/fee-structures/",
{
headers: {
Authorization: `Token ${token}`
}
}
);

setFees(res.data);
setFilteredFees(res.data);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

} catch (e) {

Toast.show({
type: "error",
text1: "Error fetching data"
});

}

setLoading(false);
};

/* SEARCH */
const handleSearch = (text) => {

setSearch(text);

if (text.trim() === "") {
setFilteredFees(fees);
return;
}

const filtered = fees.filter((item) =>
item.classroom_name?.toLowerCase().includes(text.toLowerCase())
);

setFilteredFees(filtered);
};

/* ANIMATION */
const pressIn = () => {
Animated.spring(scaleAnim,{
toValue:0.96,
useNativeDriver:true
}).start();
};

const pressOut = () => {
Animated.spring(scaleAnim,{
toValue:1,
friction:4,
useNativeDriver:true
}).start();
};

/* OPEN EDIT */
const openEdit = (item) => {

Haptics.selectionAsync();

setSelectedFee(item);
setEditAmount(String(item.amount));
setEditTerm(item.term);
setEditYear(String(item.year));

setModalVisible(true);
};

/* UPDATE */
const updateFee = async () => {

try {

await axios.put(
EndPoint + `/fee-structures/${selectedFee.id}/`,
{
amount: editAmount,
term: editTerm,
year: editYear
},
{
headers: {
Authorization: `Token ${token}`
}
}
);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

Toast.show({
type: "success",
text1: "Updated successfully"
});

setModalVisible(false);

fetchFeeStructures(token);

} catch (e) {

Toast.show({
type: "error",
text1: "Update failed"
});

}
};

/* DELETE */
const deleteFee = async (id) => {

try {

await axios.delete(
EndPoint + `/fee-structures/${id}/`,
{
headers: {
Authorization: `Token ${token}`
}
}
);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Warning
);

Toast.show({
type: "success",
text1: "Deleted successfully"
});

fetchFeeStructures(token);

} catch (e) {

Toast.show({
type: "error",
text1: "Delete failed"
});

}
};

return (

<LinearGradient
colors={["#020617", "#0f172a", "#1e293b"]}
style={styles.container}
>

<Image
source={{
uri: "https://images.unsplash.com/photo-1588072432836-e10032774350"
}}
style={styles.bg}
/>

<View style={{
position:"absolute",
top:0,
left:0,
right:0,
bottom:0,
backgroundColor:"rgba(2,6,23,0.72)"
}}/>

<Header
title="Fee Admin Panel"
subtitle="Manage Fee Structures"
/>

<ScrollView
contentContainerStyle={{
padding:15,
paddingBottom:300
}}
showsVerticalScrollIndicator={false}
keyboardShouldPersistTaps="handled"
>

<BlurView
intensity={45}
tint="dark"
style={[
styles.blur,
{
borderRadius:30,
overflow:"hidden",
borderWidth:1,
borderColor:"rgba(255,255,255,0.08)",
backgroundColor:"rgba(15,23,42,0.45)"
}
]}
>

{/* TOP HEADER */}
<LinearGradient
colors={["rgba(37,99,235,0.28)","rgba(14,165,233,0.05)"]}
start={{x:0,y:0}}
end={{x:1,y:1}}
style={{
padding:22,
borderRadius:24,
marginBottom:25,
borderWidth:1,
borderColor:"rgba(96,165,250,0.15)"
}}
>

<View style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
}}>

<View style={{flex:1}}>

<Text style={{
color:"#ffffff",
fontSize:28,
fontWeight:"900",
letterSpacing:0.5
}}>
Fee Structures
</Text>

<Text style={{
color:"#cbd5e1",
fontSize:14,
marginTop:8,
lineHeight:22
}}>
Manage classroom fee structures, update amounts and organize academic payments easily.
</Text>

</View>

<View style={{
width:70,
height:70,
borderRadius:22,
justifyContent:"center",
alignItems:"center",
backgroundColor:"rgba(255,255,255,0.08)",
borderWidth:1,
borderColor:"rgba(255,255,255,0.1)"
}}
>

<MaterialCommunityIcons
name="cash-multiple"
size={34}
color="#38bdf8"
/>

</View>

</View>

</LinearGradient>

{/* SEARCH */}
<View style={{
marginBottom:20
}}>

<Text style={{
color:"#e2e8f0",
fontSize:15,
fontWeight:"700",
marginBottom:12
}}>
Search Classroom
</Text>

<View style={{
flexDirection:"row",
alignItems:"center",
backgroundColor:"rgba(15,23,42,0.9)",
borderRadius:18,
paddingHorizontal:16,
borderWidth:1,
borderColor:"rgba(148,163,184,0.2)",
height:58
}}>

<Ionicons
name="search"
size={22}
color="#94a3b8"
/>

<TextInput
value={search}
onChangeText={handleSearch}
placeholder="Search classroom..."
placeholderTextColor="#94a3b8"
style={{
flex:1,
height:"100%",
color:"#ffffff",
paddingHorizontal:12,
fontSize:16
}}
/>

{search !== "" && (

<TouchableOpacity
onPress={() => handleSearch("")}
>

<Ionicons
name="close-circle"
size={22}
color="#94a3b8"
/>

</TouchableOpacity>

)}

</View>

</View>

{/* EMPTY */}
{filteredFees.length === 0 && !loading && (

<View style={{
paddingVertical:50,
alignItems:"center"
}}>

<MaterialCommunityIcons
name="database-remove-outline"
size={60}
color="#475569"
/>

<Text style={{
color:"#94a3b8",
marginTop:15,
fontSize:16,
fontWeight:"600"
}}>
No fee structures found
</Text>

</View>

)}

{/* LIST */}
{filteredFees.map((item,index) => (

<Animated.View
key={item.id}
style={{
transform:[{scale:scaleAnim}],
marginBottom:18
}}
>

<TouchableOpacity
activeOpacity={0.92}
onPressIn={pressIn}
onPressOut={pressOut}
>

<LinearGradient
colors={["rgba(30,41,59,0.95)","rgba(15,23,42,0.98)"]}
style={{
padding:20,
borderRadius:24,
borderWidth:1,
borderColor:"rgba(148,163,184,0.14)",
overflow:"hidden"
}}
>

{/* Glow */}
<View style={{
position:"absolute",
top:-30,
right:-20,
width:120,
height:120,
borderRadius:100,
backgroundColor:"rgba(56,189,248,0.08)"
}}/>

{/* TOP */}
<View style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
}}>

<View style={{flex:1,paddingRight:10}}>

<View style={{
flexDirection:"row",
alignItems:"center"
}}>

<View style={{
width:52,
height:52,
borderRadius:16,
justifyContent:"center",
alignItems:"center",
backgroundColor:"rgba(37,99,235,0.15)",
marginRight:14
}}
>

<MaterialCommunityIcons
name="school-outline"
size={26}
color="#38bdf8"
/>

</View>

<View style={{flex:1}}>

<Text style={{
color:"#ffffff",
fontSize:20,
fontWeight:"800"
}}>
{item.classroom_name}
</Text>

<Text style={{
color:"#94a3b8",
marginTop:4,
fontSize:13
}}>
Fee Structure
</Text>

</View>

</View>

</View>

<View style={{
backgroundColor:"rgba(37,99,235,0.18)",
paddingHorizontal:14,
paddingVertical:8,
borderRadius:14,
borderWidth:1,
borderColor:"rgba(59,130,246,0.25)"
}}
>

<Text style={{
color:"#60a5fa",
fontWeight:"800",
fontSize:12
}}>
ID {item.id}
</Text>

</View>

</View>

{/* DETAILS */}
<View style={{
marginTop:20,
backgroundColor:"rgba(15,23,42,0.6)",
borderRadius:18,
padding:16,
borderWidth:1,
borderColor:"rgba(148,163,184,0.08)"
}}
>

<View style={{
flexDirection:"row",
justifyContent:"space-between",
marginBottom:12
}}>

<View style={{
flexDirection:"row",
alignItems:"center"
}}>

<Ionicons
name="calendar-outline"
size={18}
color="#38bdf8"
/>

<Text style={{
color:"#cbd5e1",
marginLeft:8,
fontSize:14
}}>
Term: {item.term}
</Text>

</View>

<View style={{
flexDirection:"row",
alignItems:"center"
}}>

<Ionicons
name="time-outline"
size={18}
color="#38bdf8"
/>

<Text style={{
color:"#cbd5e1",
marginLeft:8,
fontSize:14
}}>
Year: {item.year}
</Text>

</View>

</View>

<View style={{
flexDirection:"row",
alignItems:"center"
}}>

<View style={{
width:46,
height:46,
borderRadius:14,
justifyContent:"center",
alignItems:"center",
backgroundColor:"rgba(34,197,94,0.15)",
marginRight:12
}}
>

<Ionicons
name="cash-outline"
size={24}
color="#22c55e"
/>

</View>

<View>

<Text style={{
color:"#94a3b8",
fontSize:13
}}>
Amount
</Text>

<Text style={{
color:"#22c55e",
fontSize:24,
fontWeight:"900",
marginTop:2
}}>
TZS {item.amount}
</Text>

</View>

</View>

</View>

{/* ACTIONS */}
<View style={{
flexDirection:"row",
justifyContent:"space-between",
marginTop:20
}}>

<TouchableOpacity
onPress={() => openEdit(item)}
activeOpacity={0.9}
style={{
flex:1,
marginRight:10
}}
>

<LinearGradient
colors={["#2563eb","#38bdf8"]}
style={{
height:52,
borderRadius:16,
justifyContent:"center",
alignItems:"center",
flexDirection:"row"
}}
>

<Ionicons
name="create-outline"
size={20}
color="#ffffff"
/>

<Text style={{
color:"#ffffff",
fontWeight:"800",
marginLeft:8,
fontSize:15
}}>
Edit
</Text>

</LinearGradient>

</TouchableOpacity>

<TouchableOpacity
onPress={() => deleteFee(item.id)}
activeOpacity={0.9}
style={{
flex:1
}}
>

<LinearGradient
colors={["#dc2626","#ef4444"]}
style={{
height:52,
borderRadius:16,
justifyContent:"center",
alignItems:"center",
flexDirection:"row"
}}
>

<Ionicons
name="trash-outline"
size={20}
color="#ffffff"
/>

<Text style={{
color:"#ffffff",
fontWeight:"800",
marginLeft:8,
fontSize:15
}}>
Delete
</Text>

</LinearGradient>

</TouchableOpacity>

</View>

</LinearGradient>

</TouchableOpacity>

</Animated.View>

))}

</BlurView>

</ScrollView>

{/* EDIT MODAL */}
<Modal
visible={modalVisible}
transparent
animationType="fade"
>

<View style={{
flex:1,
backgroundColor:"rgba(2,6,23,0.85)",
justifyContent:"center",
padding:20
}}>

<BlurView
intensity={50}
tint="dark"
style={{
borderRadius:28,
overflow:"hidden",
borderWidth:1,
borderColor:"rgba(148,163,184,0.15)"
}}
>

<LinearGradient
colors={["#111827","#0f172a"]}
style={{
padding:24
}}
>

<View style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
marginBottom:20
}}>

<Text style={{
color:"#ffffff",
fontSize:24,
fontWeight:"900"
}}>
Edit Fee
</Text>

<TouchableOpacity
onPress={() => setModalVisible(false)}
>

<Ionicons
name="close"
size={28}
color="#94a3b8"
/>

</TouchableOpacity>

</View>

<Text style={{
color:"#94a3b8",
marginBottom:20,
lineHeight:22
}}>
Update fee amount, term and academic year information.
</Text>

{/* AMOUNT */}
<Text style={{
color:"#e2e8f0",
fontWeight:"700",
marginBottom:8
}}>
Amount
</Text>

<TextInput
value={editAmount}
onChangeText={setEditAmount}
placeholder="Amount"
placeholderTextColor="#94a3b8"
keyboardType="numeric"
style={{
backgroundColor:"rgba(15,23,42,0.9)",
borderWidth:1,
borderColor:"rgba(148,163,184,0.15)",
borderRadius:16,
paddingHorizontal:16,
height:58,
color:"#ffffff",
marginBottom:18,
fontSize:16
}}
/>

{/* TERM */}
<Text style={{
color:"#e2e8f0",
fontWeight:"700",
marginBottom:8
}}>
Term
</Text>

<TextInput
value={editTerm}
onChangeText={setEditTerm}
placeholder="Term"
placeholderTextColor="#94a3b8"
style={{
backgroundColor:"rgba(15,23,42,0.9)",
borderWidth:1,
borderColor:"rgba(148,163,184,0.15)",
borderRadius:16,
paddingHorizontal:16,
height:58,
color:"#ffffff",
marginBottom:18,
fontSize:16
}}
/>

{/* YEAR */}
<Text style={{
color:"#e2e8f0",
fontWeight:"700",
marginBottom:8
}}>
Year
</Text>

<TextInput
value={editYear}
onChangeText={setEditYear}
placeholder="Year"
placeholderTextColor="#94a3b8"
keyboardType="numeric"
style={{
backgroundColor:"rgba(15,23,42,0.9)",
borderWidth:1,
borderColor:"rgba(148,163,184,0.15)",
borderRadius:16,
paddingHorizontal:16,
height:58,
color:"#ffffff",
marginBottom:25,
fontSize:16
}}
/>

{/* BUTTONS */}
<TouchableOpacity
onPress={updateFee}
activeOpacity={0.9}
>

<LinearGradient
colors={["#2563eb","#38bdf8"]}
style={{
height:58,
borderRadius:18,
justifyContent:"center",
alignItems:"center",
marginBottom:14
}}
>

<Text style={{
color:"#ffffff",
fontSize:17,
fontWeight:"900"
}}>
Update Fee Structure
</Text>

</LinearGradient>

</TouchableOpacity>

<TouchableOpacity
onPress={() => setModalVisible(false)}
activeOpacity={0.8}
style={{
height:54,
borderRadius:16,
justifyContent:"center",
alignItems:"center",
borderWidth:1,
borderColor:"rgba(148,163,184,0.2)",
backgroundColor:"rgba(15,23,42,0.5)"
}}
>

<Text style={{
color:"#cbd5e1",
fontWeight:"700",
fontSize:15
}}>
Cancel
</Text>

</TouchableOpacity>

</LinearGradient>

</BlurView>

</View>

</Modal>

{/* LOADING */}
{loading && (

<View style={styles.loader}>

<View style={[
styles.loaderCard,
{
backgroundColor:"#0f172a",
borderWidth:1,
borderColor:"rgba(148,163,184,0.15)"
}
]}
>

<ActivityIndicator
size="large"
color="#38bdf8"
/>

<Text style={[
styles.loadingText,
{
marginTop:12,
color:"#e2e8f0"
}
]}
>
Loading fee structures...
</Text>

</View>

</View>

)}

<Toast />

</LinearGradient>
);
}