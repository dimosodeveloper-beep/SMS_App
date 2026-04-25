// app/(Fee)/fee-reports.jsx

import React, { useEffect, useState, useRef } from "react";
import {
View,
Text,
ScrollView,
TouchableOpacity,
ActivityIndicator,
Animated,
Modal,
TextInput
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import Header from "../../components/Header";
import { EndPoint } from "../../components/links";

import { Ionicons } from "@expo/vector-icons";

export default function FeeReports() {

const [token, setToken] = useState(null);
const [payments, setPayments] = useState([]);
const [loading, setLoading] = useState(false);

/* FILTER STATES */
const [yearFilter, setYearFilter] = useState("");
const [termFilter, setTermFilter] = useState("");
const [classFilter, setClassFilter] = useState("");

/* MODAL */
const [modalVisible, setModalVisible] = useState(false);

/* ANIMATION */
const scale = useRef(new Animated.Value(1)).current;

/* TOKEN */
useEffect(() => {
AsyncStorage.getItem("userToken").then(setToken);
}, []);

/* FETCH */
useEffect(() => {
if (token) fetchPayments();
}, [token]);

const fetchPayments = async () => {
setLoading(true);

try {
const res = await axios.get(
EndPoint + "/fee-payments/",
{
headers: { Authorization: `Token ${token}` }
}
);

setPayments(res.data);

} catch (e) {
console.log(e);
}

setLoading(false);
};

/* FILTER LOGIC (multi-filter smart) */
const filtered = payments.filter(p => {

const matchYear = !yearFilter || p.year == yearFilter;
const matchTerm = !termFilter || p.term == termFilter;
const matchClass = !classFilter || p.classroom_name == classFilter;

return matchYear && matchTerm && matchClass;
});

/* ================= FINANCIAL CALCULATIONS ================= */

/* TOTAL COLLECTED */
const totalCollected = filtered.reduce((sum, p) => sum + p.amount_paid, 0);

/* EXPECTED FEES (from structure logic approximation) */
const totalExpected = filtered.length * 100000; // fallback logic (unaweza kuboresha backend)

/* BALANCE / DEBT */
const totalDebt = totalExpected - totalCollected;

/* ================= UI ================= */

const pressIn = () => {
Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
};

const pressOut = () => {
Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
};

return (
<LinearGradient colors={["#020617", "#0f172a", "#1e293b"]} style={{ flex: 1 }}>

<Header title="Fee Reports" subtitle="Advanced Financial Dashboard" />

<ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 90 }}>

<BlurView intensity={50} tint="dark" style={{ padding: 15, borderRadius: 20 }}>

{/* ================= DASHBOARD CARDS ================= */}
<View style={{ flexDirection: "row", gap: 10, marginBottom: 15 }}>

<View style={cardStyle("#22c55e")}>
<Text style={label}>Collected</Text>
<Text style={value}>TZS {totalCollected}</Text>
</View>

<View style={cardStyle("#38bdf8")}>
<Text style={label}>Expected</Text>
<Text style={value}>TZS {totalExpected}</Text>
</View>

<View style={cardStyle("#ef4444")}>
<Text style={label}>Debt</Text>
<Text style={value}>TZS {totalDebt}</Text>
</View>

</View>

{/* ================= FILTER BUTTON ================= */}
<TouchableOpacity
onPress={() => setModalVisible(true)}
style={{
backgroundColor: "#1e293b",
padding: 12,
borderRadius: 12,
flexDirection: "row",
justifyContent: "center",
alignItems: "center",
marginBottom: 15,
borderWidth: 1,
borderColor: "#334155"
}}
>
<Ionicons name="filter" size={18} color="#fff" />
<Text style={{ color: "#fff", marginLeft: 8 }}>Open Filters</Text>
</TouchableOpacity>

{/* ACTIVE FILTERS */}
<Text style={{ color: "#94a3b8", marginBottom: 10 }}>
Active Filters:
{yearFilter || termFilter || classFilter ? " Yes" : " None"}
</Text>

{/* ================= LIST ================= */}
{filtered.map((p, index) => (

<Animated.View key={index} style={{ transform: [{ scale }] }}>

<TouchableOpacity onPressIn={pressIn} onPressOut={pressOut}>

<LinearGradient
colors={["#0f172a", "#1e293b"]}
style={{
padding: 15,
borderRadius: 16,
marginBottom: 10,
borderWidth: 1,
borderColor: "#334155"
}}
>

<Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
{p.student_name}
</Text>

<Text style={{ color: "#94a3b8", marginTop: 5 }}>
Class: {p.classroom_name} | Term: {p.term} | Year: {p.year}
</Text>

<Text style={{ color: "#22c55e", marginTop: 8, fontSize: 18 }}>
TZS {p.amount_paid}
</Text>

<Text style={{ color: "#94a3b8", marginTop: 3 }}>
{p.payment_date}
</Text>

</LinearGradient>

</TouchableOpacity>

</Animated.View>

))}

</BlurView>

</ScrollView>

{/* ================= FILTER MODAL ================= */}
<Modal visible={modalVisible} transparent animationType="slide">

<View style={{
flex: 1,
backgroundColor: "rgba(0,0,0,0.7)",
justifyContent: "center",
padding: 20
}}>

<View style={{
backgroundColor: "#0f172a",
padding: 20,
borderRadius: 20,
borderWidth: 1,
borderColor: "#334155"
}}>

<Text style={{ color: "#fff", fontSize: 18, marginBottom: 15 }}>
Filter Reports
</Text>

{/* YEAR */}
<TextInput
placeholder="Year e.g 2026"
placeholderTextColor="#94a3b8"
value={yearFilter}
onChangeText={setYearFilter}
style={input}
/>

{/* TERM */}
<TextInput
placeholder="Term e.g Term 1"
placeholderTextColor="#94a3b8"
value={termFilter}
onChangeText={setTermFilter}
style={input}
/>

{/* CLASS */}
<TextInput
placeholder="Class name"
placeholderTextColor="#94a3b8"
value={classFilter}
onChangeText={setClassFilter}
style={input}
/>

{/* ACTIONS */}
<TouchableOpacity onPress={() => setModalVisible(false)}>
<View style={{
backgroundColor: "#22c55e",
padding: 12,
borderRadius: 10,
marginTop: 10
}}>
<Text style={{ color: "#fff", textAlign: "center" }}>
Apply Filters
</Text>
</View>
</TouchableOpacity>

<TouchableOpacity onPress={() => {
setYearFilter("");
setTermFilter("");
setClassFilter("");
}}>
<Text style={{ color: "#ef4444", textAlign: "center", marginTop: 10 }}>
Clear All Filters
</Text>
</TouchableOpacity>

</View>

</View>

</Modal>

{/* LOADING */}
{loading && (
<View style={{
position: "absolute",
top: "50%",
alignSelf: "center"
}}>
<ActivityIndicator size="large" color="#38bdf8" />
</View>
)}

</LinearGradient>
);
}

/* ================= STYLES HELPERS ================= */

const cardStyle = (color) => ({
flex: 1,
backgroundColor: "#0f172a",
padding: 15,
borderRadius: 15,
borderWidth: 1,
borderColor: "#1e293b",
borderLeftWidth: 3,
borderLeftColor: color
});

const label = {
color: "#94a3b8",
fontSize: 11
};

const value = {
color: "#fff",
fontSize: 16,
fontWeight: "bold",
marginTop: 5
};

const input = {
backgroundColor: "#1e293b",
padding: 12,
borderRadius: 10,
marginBottom: 10,
color: "#fff",
borderWidth: 1,
borderColor: "#334155"
};