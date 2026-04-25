import React, { useState, useEffect, useRef } from "react";
import {
View,
Text,
TextInput,
TouchableOpacity,
Image,
ActivityIndicator,
Animated,
ScrollView,
Platform
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";

import DateTimePicker from "@react-native-community/datetimepicker";

import styles from "../../components/LoginStyles";
import { EndPoint } from "../../components/links";
import Header from "../../components/Header";

export default function CreateFeeStructure() {

const [classrooms, setClassrooms] = useState([]);
const [filteredClassrooms, setFilteredClassrooms] = useState([]);
const [classSearch, setClassSearch] = useState("");

const [classroom, setClassroom] = useState(null);

const [amount, setAmount] = useState("");
const [term, setTerm] = useState("");

const [year, setYear] = useState("");
const [showYearPicker, setShowYearPicker] = useState(false);

const [loading, setLoading] = useState(false);
const [token, setToken] = useState(null);

const scaleAnim = useRef(new Animated.Value(1)).current;

/* ANIMATION */
const pressIn = () => {
Animated.spring(scaleAnim, {
toValue: 0.95,
useNativeDriver: true
}).start();
};

const pressOut = () => {
Animated.spring(scaleAnim, {
toValue: 1,
useNativeDriver: true
}).start();
};

/* TOKEN */
useEffect(() => {
const loadToken = async () => {
const savedToken = await AsyncStorage.getItem("userToken");
setToken(savedToken);
};
loadToken();
}, []);

/* FETCH CLASSROOMS */
useEffect(() => {
if (token) fetchClassrooms(token);
}, [token]);

const fetchClassrooms = async (token) => {
try {
const res = await axios.get(EndPoint + "/classes/", {
headers: { Authorization: `Token ${token}` }
});

setClassrooms(res.data);
setFilteredClassrooms([]);

} catch (e) {
console.log(e);
}
};

/* SEARCH CLASSROOM */
const handleClassSearch = (text) => {
setClassSearch(text);

if (text.trim() === "") {
setFilteredClassrooms([]);
return;
}

const filtered = classrooms.filter(item =>
item.name.toLowerCase().includes(text.toLowerCase())
);

setFilteredClassrooms(filtered);
};

const selectClassroom = (item) => {
setClassroom(item.id);
setClassSearch(item.name);
setFilteredClassrooms([]);
};

/* YEAR PICKER (FIXED LIKE CREATE FEE PAYMENT) */
const onChangeYear = (event, selectedDate) => {
setShowYearPicker(Platform.OS === "ios");

if (selectedDate) {
setYear(selectedDate.getFullYear().toString());
}
};

/* CREATE */
const createFeeStructure = async () => {

if (!classroom || !amount || !term || !year) {
Toast.show({
type: "error",
text1: "Missing fields",
text2: "Please fill all fields"
});
return;
}

setLoading(true);

try {

await axios.post(
EndPoint + "/create-fee-structure/",
{
classroom: classroom,
amount: amount,
term: term,
year: year
},
{
headers: { Authorization: `Token ${token}` }
}
);

Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

Toast.show({
type: "success",
text1: "Success",
text2: "Fee structure created"
});

setAmount("");
setTerm("");
setYear("");
setClassSearch("");
setClassroom(null);

} catch (error) {

Toast.show({
type: "error",
text1: "Error",
text2: JSON.stringify(error.response?.data)
});

}

setLoading(false);
};

return (
<LinearGradient colors={["#020617", "#0f172a", "#1e293b"]} style={styles.container}>

<Image
source={{ uri: "https://images.unsplash.com/photo-1588072432836-e10032774350" }}
style={styles.bg}
/>

<Header title="School Dashboard" subtitle="Fee Management" />

<ScrollView contentContainerStyle={{ padding: 10, paddingBottom: 300 }}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>Create Fee Structure</Text>

<View style={styles.form}>

{/* CLASSROOM SEARCH (UNCHANGED) */}
<Text style={styles.label}>Search Classroom</Text>

<TextInput
style={styles.input}
value={classSearch}
onChangeText={handleClassSearch}
placeholder="Type classroom name..."
placeholderTextColor="#94a3b8"
/>

{classSearch.trim() !== "" && filteredClassrooms.length > 0 && (
<View style={{
backgroundColor: "#0f172a",
borderColor: "#334155",
borderWidth: 1,
borderRadius: 10
}}>

{filteredClassrooms.map(item => (
<TouchableOpacity
key={item.id}
onPress={() => selectClassroom(item)}
style={{
padding: 12,
borderBottomWidth: 1,
borderBottomColor: "#1e293b"
}}
>
<Text style={{ color: "#fff" }}>{item.name}</Text>
</TouchableOpacity>
))}

</View>
)}

{/* AMOUNT */}
<Text style={styles.label}>Amount</Text>
<TextInput
style={styles.input}
value={amount}
onChangeText={setAmount}
placeholderTextColor="#fff"
keyboardType="numeric"
/>

{/* TERM */}
<Text style={styles.label}>Term</Text>
<TextInput
style={styles.input}
value={term}
onChangeText={setTerm}
placeholderTextColor="#fff"
/>

{/* YEAR PICKER (NEW - SAME STYLE AS PAYMENT PAGE) */}
<Text style={styles.label}>Year</Text>

<TouchableOpacity onPress={() => setShowYearPicker(true)}>
<View style={styles.input}>
<Text style={{ color: "#fff" }}>
{year || "Select Year"}
</Text>
</View>
</TouchableOpacity>

{showYearPicker && (
<DateTimePicker
value={new Date()}
mode="date"
display="default"
onChange={onChangeYear}
/>
)}

{/* BUTTON */}
<Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
<TouchableOpacity
onPressIn={pressIn}
onPressOut={pressOut}
onPress={createFeeStructure}
>
<LinearGradient colors={["#2563eb", "#38bdf8"]} style={styles.button}>
<Text style={styles.buttonText}>Create Fee Structure</Text>
</LinearGradient>
</TouchableOpacity>
</Animated.View>

</View>

</BlurView>

</ScrollView>

{loading && (
<View style={styles.loader}>
<View style={styles.loaderCard}>
<ActivityIndicator size="large" color="#2563eb" />
<Text style={styles.loadingText}>Processing...</Text>
</View>
</View>
)}

<Toast />

</LinearGradient>
);
}