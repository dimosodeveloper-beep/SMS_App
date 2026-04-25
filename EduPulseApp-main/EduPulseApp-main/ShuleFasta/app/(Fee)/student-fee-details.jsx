import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import Toast from "react-native-toast-message";

import { EndPoint } from "../../components/links";
import Header from "../../components/Header";

export default function StudentFeeDetails() {

const { studentId, year } = useLocalSearchParams();

const [data, setData] = useState({});
const [loading, setLoading] = useState(false);
const [feeStructure, setFeeStructure] = useState([]);

useEffect(() => {
const load = async () => {

setLoading(true);

try {
const token = await AsyncStorage.getItem("userToken");

/* ===============================
   1. GET PAYMENTS
================================*/
const res = await axios.get(
EndPoint + `/student-year-payments/${studentId}/${year}/`,
{
headers: { Authorization: `Token ${token}` }
}
);

setData(res.data);

/* ===============================
   2. GET FEE STRUCTURE (FOR DEBT)
================================*/
const feeRes = await axios.get(
EndPoint + `/fee-structures/`,
{
headers: { Authorization: `Token ${token}` }
}
);

setFeeStructure(feeRes.data);

} catch (e) {

Toast.show({
type: "error",
text1: "Failed to load fee details"
});

}

setLoading(false);
};

load();
}, [studentId, year]);

const terms = Object.values(data || {});

/* ===============================
   GET EXPECTED FEE
================================*/
const getExpectedFee = (term) => {
const match = feeStructure.find(
f => String(f.year) === String(year)
);

return match ? Number(match.amount) : 0;
};

/* ===============================
   TOTAL DEBT CALCULATION
================================*/
let totalDebt = 0;

return (
<LinearGradient
colors={["#020617", "#0f172a", "#1e293b"]}
style={{ flex: 1 }}
>

<Header
title="Fee Breakdown"
subtitle={`Academic Year ${year}`}
/>

<ScrollView
contentContainerStyle={{ padding: 15, paddingBottom: 100 }}
showsVerticalScrollIndicator={false}
>

{/* LOADING */}
{loading && (
<View style={{
marginTop: 40,
alignItems: "center"
}}>
<ActivityIndicator size="large" color="#38bdf8" />
<Text style={{ color: "#94a3b8", marginTop: 10 }}>
Loading fee details...
</Text>
</View>
)}

{/* EMPTY */}
{!loading && terms.length === 0 && (
<Text style={{
color: "#94a3b8",
textAlign: "center",
marginTop: 40
}}>
No fee payments found
</Text>
)}

{/* ================= TOTAL DEBT CARD ================= */}
{!loading && terms.length > 0 && (
<LinearGradient
colors={["#0f172a", "#1e293b"]}
style={{
padding: 15,
borderRadius: 16,
borderWidth: 1,
borderColor: "#334155",
marginBottom: 20
}}
>

<Text style={{
color: "#fff",
fontSize: 16,
fontWeight: "bold"
}}>
Financial Summary
</Text>

{terms.map((t) => {

const expected = getExpectedFee(t.term);
const debt = expected - t.total_paid;

if (debt > 0) totalDebt += debt;

return null;
})}

<Text style={{
color: "#ef4444",
marginTop: 10,
fontSize: 16,
fontWeight: "bold"
}}>
Total Debt: TZS {totalDebt}
</Text>

</LinearGradient>
)}

{/* TERMS */}
{terms.map((t, index) => {

const expected = getExpectedFee(t.term);
const debt = expected - t.total_paid;

return (

<LinearGradient
key={index}
colors={["#0f172a", "#1e293b"]}
style={{
marginBottom: 18,
borderRadius: 18,
borderWidth: 1,
borderColor: "#334155",
overflow: "hidden"
}}
>

{/* TERM HEADER */}
<LinearGradient
colors={["#2563eb", "#38bdf8"]}
style={{
padding: 14
}}
>

<Text style={{
color: "#fff",
fontSize: 18,
fontWeight: "bold"
}}>
{t.term}
</Text>

<Text style={{
color: "#e0f2fe",
marginTop: 3
}}>
Academic Year: {year}
</Text>

</LinearGradient>

{/* BODY */}
<View style={{ padding: 14 }}>

{/* SUMMARY */}
<View style={{
flexDirection: "row",
justifyContent: "space-between",
marginBottom: 10
}}>

<Text style={{ color: "#94a3b8" }}>
Total Paid
</Text>

<Text style={{
color: "#22c55e",
fontWeight: "bold"
}}>
TZS {t.total_paid}
</Text>

</View>

{/* EXPECTED */}
<View style={{
flexDirection: "row",
justifyContent: "space-between",
marginBottom: 10
}}>

<Text style={{ color: "#94a3b8" }}>
Expected Fee
</Text>

<Text style={{
color: "#38bdf8",
fontWeight: "bold"
}}>
TZS {expected}
</Text>

</View>

{/* DEBT */}
<View style={{
flexDirection: "row",
justifyContent: "space-between",
marginBottom: 10
}}>

<Text style={{ color: "#94a3b8" }}>
Debt
</Text>

<Text style={{
color: debt > 0 ? "#ef4444" : "#22c55e",
fontWeight: "bold"
}}>
TZS {debt > 0 ? debt : 0}
</Text>

</View>

{/* PAYMENTS LIST */}
{t.payments.map((p) => (

<View
key={p.id}
style={{
backgroundColor: "#0b1220",
padding: 12,
borderRadius: 12,
borderWidth: 1,
borderColor: "#1e293b",
marginBottom: 10
}}
>

<View style={{
flexDirection: "row",
justifyContent: "space-between"
}}>

<Text style={{ color: "#fff" }}>
TZS {p.amount_paid}
</Text>

<Text style={{ color: "#94a3b8" }}>
{p.payment_date}
</Text>

</View>

<Text style={{
color: "#38bdf8",
marginTop: 5,
fontSize: 12
}}>
Term Record
</Text>

</View>

))}

</View>

</LinearGradient>

);

})}

</ScrollView>

<Toast />

</LinearGradient>
);
}