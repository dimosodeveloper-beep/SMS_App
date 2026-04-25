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

export default function CreateFeePayment() {

const [students, setStudents] = useState([]);
const [filteredStudents, setFilteredStudents] = useState([]);
const [studentSearch, setStudentSearch] = useState("");

const [student, setStudent] = useState(null);

const [amountPaid, setAmountPaid] = useState("");
const [paymentDate, setPaymentDate] = useState(new Date());
const [showDatePicker, setShowDatePicker] = useState(false);

const [term, setTerm] = useState("");

const [year, setYear] = useState("");
const [showYearPicker, setShowYearPicker] = useState(false);

const [loading, setLoading] = useState(false);
const [token, setToken] = useState(null);

const scaleAnim = useRef(new Animated.Value(1)).current;

/* TOKEN */
useEffect(() => {
AsyncStorage.getItem("userToken").then(setToken);
}, []);

/* FETCH STUDENTS */
useEffect(() => {
if (token) fetchStudents(token);
}, [token]);

const fetchStudents = async (token) => {
try {
const res = await axios.get(EndPoint + "/students/", {
headers: { Authorization: `Token ${token}` }
});

setStudents(res.data);

} catch (e) {
console.log(e);
}
};

/* SEARCH (RETAINED EXACT LOGIC - IMPORTANT) */
const handleStudentSearch = (text) => {
setStudentSearch(text);

if (text.trim() === "") {
setFilteredStudents([]);
return;
}

const filtered = students.filter(s =>
`${s.first_name} ${s.last_name}`
.toLowerCase()
.includes(text.toLowerCase())
);

setFilteredStudents(filtered);
};

const selectStudent = (item) => {
setStudent(item.id);
setStudentSearch(item.first_name + " " + item.last_name);
setFilteredStudents([]);
};

/* DATE */
const onChangeDate = (event, selectedDate) => {
setShowDatePicker(Platform.OS === "ios");
if (selectedDate) setPaymentDate(selectedDate);
};

/* YEAR PICKER (KEEP SIMPLE, FIXED) */
const onChangeYear = (event, selectedDate) => {
setShowYearPicker(false);

if (selectedDate) {
setYear(selectedDate.getFullYear().toString());
}
};

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

/* CREATE */
const createFeePayment = async () => {

if (!student || !amountPaid || !paymentDate || !term || !year) {
Toast.show({ type: "error", text1: "Missing fields" });
return;
}

setLoading(true);

try {

await axios.post(EndPoint + "/create-fee-payment/", {
student,
amount_paid: amountPaid,
payment_date: paymentDate.toISOString().split("T")[0],
term,
year
}, {
headers: { Authorization: `Token ${token}` }
});

Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

Toast.show({ type: "success", text1: "Payment saved" });

setAmountPaid("");
setTerm("");
setYear("");
setStudentSearch("");
setStudent(null);
setFilteredStudents([]);

} catch (e) {
Toast.show({ type: "error", text1: "Failed to save payment" });
}

setLoading(false);
};

return (
<LinearGradient colors={["#020617", "#0f172a", "#1e293b"]} style={styles.container}>

<Image
source={{ uri: "https://images.unsplash.com/photo-1588072432836-e10032774350" }}
style={styles.bg}
/>

<Header title="Fee Payment" subtitle="Management" />

<ScrollView contentContainerStyle={{ padding: 10 }}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>Create Payment</Text>

{/* ================= STUDENT SEARCH (UNCHANGED FUNCTIONALITY) ================= */}
<TextInput
placeholderTextColor="#fff"
style={styles.input}
placeholder="Search student..."
value={studentSearch}
onChangeText={handleStudentSearch}
/>

{/* AUTO FILTER LIST (RESTORED EXACTLY) */}
{studentSearch.trim() !== "" && filteredStudents.length > 0 && (
filteredStudents.map(item => (
<TouchableOpacity
key={item.id}
onPress={() => selectStudent(item)}
>
<Text style={{ color: "#fff", padding: 10 }}>
{item.first_name} {item.last_name}
</Text>
</TouchableOpacity>
))
)}

{/* AMOUNT (NUMERIC ONLY FIXED) */}
<TextInput
placeholderTextColor="#fff"
style={styles.input}
placeholder="Amount Paid"
value={amountPaid}
onChangeText={setAmountPaid}
keyboardType="numeric"
/>

{/* DATE */}
<TouchableOpacity onPress={() => setShowDatePicker(true)}>
<View style={styles.input}>
<Text style={{ color: "#fff" }}>
{paymentDate.toDateString()}
</Text>
</View>
</TouchableOpacity>

{showDatePicker && (
<DateTimePicker
value={paymentDate}
mode="date"
display="default"
onChange={onChangeDate}
/>
)}

{/* TERM */}
<TextInput
placeholderTextColor="#fff"
style={styles.input}
placeholder="Term"
value={term}
onChangeText={setTerm}
/>

{/* YEAR PICKER (FIXED WITHOUT CHANGING DESIGN) */}
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
onPress={createFeePayment}
>
<LinearGradient colors={["#2563eb", "#38bdf8"]} style={styles.button}>
<Text style={styles.buttonText}>Save Payment</Text>
</LinearGradient>
</TouchableOpacity>
</Animated.View>

</BlurView>

</ScrollView>

{loading && (
<View style={styles.loader}>
<View style={styles.loaderCard}>
<ActivityIndicator color="#2563eb" size="large" />
<Text style={styles.loadingText}>Saving...</Text>
</View>
</View>
)}

<Toast />

</LinearGradient>
);
}