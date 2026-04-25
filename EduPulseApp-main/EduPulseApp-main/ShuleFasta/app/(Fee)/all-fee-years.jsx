// app/(Fee)/all-fee-years.jsx

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
import { useRouter } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";

import { Ionicons } from "@expo/vector-icons";

import { EndPoint } from "../../components/links";
import Header from "../../components/Header";
import styles from "../../components/LoginStyles";

export default function AllFeeYears() {

const [years, setYears] = useState([]);
const [classMap, setClassMap] = useState({});
const [loading, setLoading] = useState(false);
const [token, setToken] = useState(null);
const [search, setSearch] = useState("");

const router = useRouter();

/* LOAD TOKEN */
useEffect(() => {
AsyncStorage.getItem("userToken").then(setToken);
}, []);

/* FETCH DATA */
useEffect(() => {
if (token) {
fetchYears(token);
fetchClasses(token);
}
}, [token]);

/* YEARS */
const fetchYears = async (token) => {
setLoading(true);

try {
const res = await axios.get(EndPoint + "/fee-years/", {
headers: { Authorization: `Token ${token}` }
});

setYears(res.data);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

} catch (e) {
Toast.show({ type: "error", text1: "Failed to load years" });
}

setLoading(false);
};

/* CLASSES */
const fetchClasses = async (token) => {
try {
const res = await axios.get(EndPoint + "/fee-structures/", {
headers: { Authorization: `Token ${token}` }
});

const map = {};

res.data.forEach(item => {
if (!map[item.year]) map[item.year] = new Set();
map[item.year].add(item.classroom_name);
});

Object.keys(map).forEach(y => {
map[y] = Array.from(map[y]);
});

setClassMap(map);

} catch (e) {
console.log(e);
}
};

/* FILTER */
const filteredYears = years.filter(y =>
String(y).toLowerCase().includes(search.toLowerCase())
);

/* helpers */
const getClassCount = (y) => classMap[y]?.length || 0;

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

<Header
title="Fee Management"
subtitle="Academic Year Dashboard"
/>

<ScrollView
contentContainerStyle={{ padding: 15, paddingBottom: 120 }}
showsVerticalScrollIndicator={false}
>

<BlurView intensity={45} tint="dark" style={styles.blur}>

{/* SEARCH */}
<TextInput
value={search}
onChangeText={setSearch}
placeholder="Search academic year e.g 2026..."
placeholderTextColor="#64748b"
style={{
backgroundColor: "#0f172a",
borderWidth: 1,
borderColor: "#334155",
padding: 12,
borderRadius: 12,
color: "#fff",
marginBottom: 15
}}
/>

<Text style={{
color: "#fff",
fontSize: 22,
fontWeight: "bold",
textAlign: "center"
}}>
Academic Year Overview
</Text>

<Text style={{
color: "#94a3b8",
textAlign: "center",
marginTop: 5,
marginBottom: 20
}}>
Select year to view financial structure
</Text>

{/* GRID CARDS */}
<View style={{
flexDirection: "row",
flexWrap: "wrap",
justifyContent: "space-between"
}}>

{filteredYears.map((y) => {

const classCount = getClassCount(y);

return (

<View
key={y}
style={{
width: "48%",
marginBottom: 15
}}
>

<TouchableOpacity
activeOpacity={0.9}
onPress={() =>
router.push({
pathname: "/(Fee)/all-fee-students",
params: { year: y }
})
}
>

<LinearGradient
colors={["#0f172a", "#1e293b", "#0b1220"]}
style={{
padding: 18,
borderRadius: 20,
borderWidth: 1,
borderColor: "#334155",
minHeight: 170,
justifyContent: "space-between"
}}
>

{/* YEAR HEADER */}
<View>
<Text style={{
color: "#38bdf8",
fontSize: 12,
fontWeight: "bold"
}}>
ACADEMIC YEAR
</Text>

<Text style={{
color: "#fff",
fontSize: 24,
fontWeight: "bold",
marginTop: 5
}}>
{y}
</Text>
</View>

{/* STATS */}
<View style={{ marginTop: 10 }}>

<View style={{
flexDirection: "row",
justifyContent: "space-between"
}}>

<Text style={{ color: "#94a3b8", fontSize: 11 }}>
Classes
</Text>

<Text style={{ color: "#22c55e", fontSize: 11 }}>
{classCount}
</Text>

</View>

<Text style={{
color: "#22c55e",
marginTop: 6,
fontSize: 12
}}>
{classMap[y]?.length
? classMap[y].join(", ")
: "No classes assigned"}
</Text>

</View>

{/* FOOTER ICON */}
<View style={{
alignItems: "flex-end",
marginTop: 10
}}>
<Ionicons
name="chevron-forward-circle"
size={26}
color="#38bdf8"
/>
</View>

</LinearGradient>

</TouchableOpacity>

</View>

);
})}

</View>

{/* EMPTY */}
{filteredYears.length === 0 && !loading && (
<Text style={{
color: "#94a3b8",
textAlign: "center",
marginTop: 30
}}>
No academic years found
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
Loading academic years...
</Text>
</View>
</View>
)}

<Toast />

</LinearGradient>
);
}