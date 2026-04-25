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
const res = await axios.get(EndPoint + "/fee-structures/", {
headers: { Authorization: `Token ${token}` }
});

setFees(res.data);
setFilteredFees(res.data);

} catch (e) {
Toast.show({ type: "error", text1: "Error fetching data" });
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

/* OPEN EDIT */
const openEdit = (item) => {
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
headers: { Authorization: `Token ${token}` }
}
);

Toast.show({ type: "success", text1: "Updated successfully" });

setModalVisible(false);
fetchFeeStructures(token);

} catch (e) {
Toast.show({ type: "error", text1: "Update failed" });
}
};

/* DELETE */
const deleteFee = async (id) => {

try {
await axios.delete(
EndPoint + `/fee-structures/${id}/`,
{
headers: { Authorization: `Token ${token}` }
}
);

Toast.show({ type: "success", text1: "Deleted successfully" });

fetchFeeStructures(token);

} catch (e) {
Toast.show({ type: "error", text1: "Delete failed" });
}
};

return (
<LinearGradient colors={["#020617", "#0f172a", "#1e293b"]} style={styles.container}>

<Image
source={{ uri: "https://images.unsplash.com/photo-1588072432836-e10032774350" }}
style={styles.bg}
/>

<Header title="Fee Admin Panel" subtitle="Manage Fee Structures" />

<ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 300 }}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={{
color: "#fff",
fontSize: 22,
fontWeight: "bold",
textAlign: "center"
}}>
Fee Structures
</Text>

{/* SEARCH */}
<TextInput
value={search}
onChangeText={handleSearch}
placeholder="Search classroom..."
placeholderTextColor="#94a3b8"
style={{
backgroundColor: "#0f172a",
borderWidth: 1,
borderColor: "#334155",
borderRadius: 12,
padding: 12,
color: "#fff",
marginTop: 20,
marginBottom: 20
}}
/>

{/* LIST */}
{filteredFees.map((item) => (

<View
key={item.id}
style={{
backgroundColor: "#0f172a",
padding: 16,
borderRadius: 16,
borderWidth: 1,
borderColor: "#334155",
marginBottom: 12
}}
>

{/* HEADER */}
<Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
{item.classroom_name}
</Text>

<Text style={{ color: "#94a3b8", marginTop: 5 }}>
Term: {item.term} | Year: {item.year}
</Text>

<Text style={{ color: "#22c55e", marginTop: 8, fontSize: 18 }}>
TZS {item.amount}
</Text>

{/* ACTIONS */}
<View style={{
flexDirection: "row",
justifyContent: "space-between",
marginTop: 15
}}>

<TouchableOpacity
onPress={() => openEdit(item)}
style={{
flexDirection: "row",
alignItems: "center"
}}
>
<Ionicons name="create-outline" size={20} color="#38bdf8" />
<Text style={{ color: "#38bdf8", marginLeft: 5 }}>
Edit
</Text>
</TouchableOpacity>

<TouchableOpacity
onPress={() => deleteFee(item.id)}
style={{
flexDirection: "row",
alignItems: "center"
}}
>
<Ionicons name="trash-outline" size={20} color="#ef4444" />
<Text style={{ color: "#ef4444", marginLeft: 5 }}>
Delete
</Text>
</TouchableOpacity>

</View>

</View>

))}

</BlurView>

</ScrollView>

{/* EDIT MODAL */}
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
borderRadius: 16,
borderWidth: 1,
borderColor: "#334155"
}}>

<Text style={{ color: "#fff", fontSize: 18, marginBottom: 10 }}>
Edit Fee Structure
</Text>

<TextInput
value={editAmount}
onChangeText={setEditAmount}
placeholder="Amount"
placeholderTextColor="#94a3b8"
style={styles.input}
/>

<TextInput
value={editTerm}
onChangeText={setEditTerm}
placeholder="Term"
placeholderTextColor="#94a3b8"
style={styles.input}
/>

<TextInput
value={editYear}
onChangeText={setEditYear}
placeholder="Year"
placeholderTextColor="#94a3b8"
style={styles.input}
/>

<TouchableOpacity onPress={updateFee}>
<LinearGradient colors={["#2563eb", "#38bdf8"]} style={styles.button}>
<Text style={styles.buttonText}>Update</Text>
</LinearGradient>
</TouchableOpacity>

<TouchableOpacity onPress={() => setModalVisible(false)}>
<Text style={{ color: "#94a3b8", textAlign: "center", marginTop: 10 }}>
Cancel
</Text>
</TouchableOpacity>

</View>

</View>

</Modal>

{loading && (
<View style={styles.loader}>
<View style={styles.loaderCard}>
<ActivityIndicator size="large" color="#2563eb" />
<Text style={styles.loadingText}>Loading...</Text>
</View>
</View>
)}

<Toast />

</LinearGradient>
);
}