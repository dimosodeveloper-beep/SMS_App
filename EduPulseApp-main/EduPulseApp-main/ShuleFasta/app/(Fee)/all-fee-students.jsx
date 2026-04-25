import React, { useEffect, useState } from "react";
import {
View,
Text,
TouchableOpacity,
ScrollView,
ActivityIndicator,
Image,
TextInput
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";

import { Ionicons } from "@expo/vector-icons";

import { EndPoint } from "../../components/links";
import Header from "../../components/Header";
import styles from "../../components/LoginStyles";

export default function AllFeeStudents() {

const { year } = useLocalSearchParams();

const [students, setStudents] = useState([]);
const [filteredStudents, setFilteredStudents] = useState([]);
const [search, setSearch] = useState("");

const [loading, setLoading] = useState(false);
const [token, setToken] = useState(null);

const router = useRouter();

/* LOAD TOKEN */
useEffect(() => {
AsyncStorage.getItem("userToken").then(setToken);
}, []);

/* FETCH STUDENTS */
useEffect(() => {
if (token && year) fetchStudents(token, year);
}, [token, year]);

const fetchStudents = async (token, year) => {

setLoading(true);

try {
const res = await axios.get(
EndPoint + `/fee-students/${year}/`,
{
headers: { Authorization: `Token ${token}` }
}
);

setStudents(res.data);
setFilteredStudents(res.data);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

} catch (e) {

Toast.show({
type: "error",
text1: "Failed to load students"
});

}

setLoading(false);
};

/* SEARCH */
const handleSearch = (text) => {
setSearch(text);

if (text.trim() === "") {
setFilteredStudents(students);
return;
}

const filtered = students.filter((s) =>
s.name?.toLowerCase().includes(text.toLowerCase())
);

setFilteredStudents(filtered);
};

return (
<LinearGradient
colors={["#020617", "#0f172a", "#1e293b"]}
style={{ flex: 1 }}
>

<Image
source={{
uri: "https://images.unsplash.com/photo-1588072432836-e10032774350"
}}
style={styles.bg}
/>

{/* HEADER */}
<Header
title="Fee Management"
subtitle={`Students - ${year}`}
/>

<ScrollView
contentContainerStyle={{
padding: 15,
paddingBottom: 100
}}
showsVerticalScrollIndicator={false}
>

<BlurView intensity={40} tint="dark" style={styles.blur}>

{/* TITLE */}
<Text style={{
color: "#fff",
fontSize: 20,
fontWeight: "bold",
textAlign: "center"
}}>
Students List
</Text>

<Text style={{
color: "#94a3b8",
textAlign: "center",
marginTop: 5,
marginBottom: 15
}}>
Search and select student
</Text>

{/* SEARCH FIELD */}
<TextInput
value={search}
onChangeText={handleSearch}
placeholder="Search student name..."
placeholderTextColor="#94a3b8"
style={{
backgroundColor: "#0f172a",
borderWidth: 1,
borderColor: "#334155",
borderRadius: 12,
padding: 12,
color: "#fff",
marginBottom: 20
}}
/>

{/* STUDENTS */}
{filteredStudents.map((s) => (

<TouchableOpacity
key={s.id}
activeOpacity={0.85}
onPress={() =>
router.push({
pathname: "/(Fee)/student-fee-details",
params: { studentId: s.id, year }
})
}
>

<LinearGradient
colors={["#0f172a", "#1e293b"]}
style={{
padding: 14,
borderRadius: 16,
borderWidth: 1,
borderColor: "#334155",
marginBottom: 12,
flexDirection: "row",
alignItems: "center"
}}
>

{/* IMAGE */}
<Image
source={{
uri: `https://ui-avatars.com/api/?name=${s.name}&background=2563eb&color=fff`
}}
style={{
width: 45,
height: 45,
borderRadius: 25,
marginRight: 12
}}
/>

{/* INFO */}
<View style={{ flex: 1 }}>

<Text style={{
color: "#fff",
fontSize: 16,
fontWeight: "bold"
}}>
{s.name}
</Text>

<Text style={{
color: "#94a3b8",
marginTop: 3
}}>
{s.classroom} • {s.stream}
</Text>

</View>

{/* ICON */}
<Ionicons
name="chevron-forward-circle"
size={26}
color="#38bdf8"
/>

</LinearGradient>

</TouchableOpacity>

))}

{/* EMPTY STATE */}
{filteredStudents.length === 0 && !loading && (
<Text style={{
color: "#94a3b8",
textAlign: "center",
marginTop: 30
}}>
No students found
</Text>
)}

</BlurView>

</ScrollView>

{/* LOADING */}
{loading && (
<View style={styles.loader}>
<View style={styles.loaderCard}>
<ActivityIndicator size="large" color="#2563eb" />
<Text style={styles.loadingText}>
Loading students...
</Text>
</View>
</View>
)}

<Toast />

</LinearGradient>
);
}