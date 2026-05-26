import React, { useState, useEffect, useRef } from "react";

import {
View,
Text,
TouchableOpacity,
Image,
ActivityIndicator,
Animated,
ScrollView,
Modal,
TextInput,
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

import { useRouter } from "expo-router";

export default function CreateTeacherScheme() {

const router = useRouter();

const [classroom, setClassroom] = useState(null);
const [stream, setStream] = useState(null);
const [teacher, setTeacher] = useState(null);
const [subject, setSubject] = useState(null);
const [term, setTerm] = useState(null);

const [topic, setTopic] = useState("");
const [content, setContent] = useState("");
const [week, setWeek] = useState("");

const [fromDate, setFromDate] = useState(new Date());
const [toDate, setToDate] = useState(new Date());

const [showFromDatePicker, setShowFromDatePicker] = useState(false);
const [showToDatePicker, setShowToDatePicker] = useState(false);

const [successModal, setSuccessModal] = useState(false);

const [classes, setClasses] = useState([]);
const [streams, setStreams] = useState([]);
const [teachers, setTeachers] = useState([]);
const [subjects, setSubjects] = useState([]);

const [token, setToken] = useState(null);
const [loading, setLoading] = useState(false);

const [classModal, setClassModal] = useState(false);
const [streamModal, setStreamModal] = useState(false);
const [teacherModal, setTeacherModal] = useState(false);
const [subjectModal, setSubjectModal] = useState(false);
const [termModal, setTermModal] = useState(false);

const scaleAnim = useRef(new Animated.Value(1)).current;

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

useEffect(() => {
const loadToken = async () => {
const t = await AsyncStorage.getItem("userToken");
setToken(t);
};
loadToken();
}, []);

useEffect(() => {
if (token) {
fetchData();
}
}, [token]);

const fetchData = async () => {
try {

const c = await axios.get(
EndPoint + "/classes2/",
{ headers: { Authorization: `Token ${token}` } }
);

const t = await axios.get(
EndPoint + "/GetTeachersSelectedField/",
{ headers: { Authorization: `Token ${token}` } }
);

const s = await axios.get(
EndPoint + "/subjects2/",
{ headers: { Authorization: `Token ${token}` } }
);

setClasses(c.data);
setTeachers(t.data);
setSubjects(s.data);

} catch (e) {
console.log("FETCH ERROR =====>", e.response?.data || e);
}
};

const fetchStreams = async (classId) => {
try {
const res = await axios.get(
EndPoint + "/streams/" + classId + "/",
{ headers: { Authorization: `Token ${token}` } }
);

setStreams(res.data);

} catch (e) {
console.log("STREAM ERROR =====>", e.response?.data);
}
};

const selectClass = (id) => {
setClassroom(id);
setStream(null);
fetchStreams(id);
setClassModal(false);
};

const formatDate = (date) => {
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, "0");
const day = String(date.getDate()).padStart(2, "0");

return `${year}-${month}-${day}`;
};

const resetForm = () => {
setClassroom(null);
setStream(null);
setTeacher(null);
setSubject(null);
setTerm(null);

setTopic("");
setContent("");
setWeek("");

setFromDate(new Date());
setToDate(new Date());
};

const createScheme = async () => {

if (!classroom || !stream || !teacher || !subject || !term || !topic || !content || !week) {
Toast.show({
type: "error",
text1: "Fill all fields"
});
return;
}

if (toDate < fromDate) {
Toast.show({
type: "error",
text1: "Invalid Date Range",
text2: "To Date cannot be behind From Date"
});

return;
}

setLoading(true);

try {

await axios.post(
EndPoint + "/teacher-scheme/create/",
{
classroom,
stream,
teacher,
subject,
term,
topic,
content,
week,
from_date: formatDate(fromDate),
to_date: formatDate(toDate)
},
{
headers: {
Authorization: `Token ${token}`,
"Content-Type": "application/json"
}
}
);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

Toast.show({
type: "success",
text1: "Scheme Created Successfully"
});

setSuccessModal(true);

resetForm();

} catch (e) {
console.log("CREATE ERROR =====>", e.response?.data || e);

Toast.show({
type: "error",
text1: "Failed to create scheme"
});
}

setLoading(false);
};

return (
<LinearGradient colors={["#020617", "#0f172a", "#1e293b"]} style={{ flex: 1 }}>

<Image
source={{ uri: "https://images.unsplash.com/photo-1588072432836-e10032774350" }}
style={{
position: "absolute",
width: "100%",
height: "100%",
opacity: 0.15
}}
/>

<Header title="Teacher Scheme" subtitle="Lesson Planning System" />

<ScrollView contentContainerStyle={{ padding: 10, paddingBottom: 200 }}>

<BlurView intensity={40} tint="dark" style={styles.blur}>

<Text style={styles.title}>Create Teacher Scheme</Text>

<View style={styles.form}>

{/* CLASS */}
<Text style={styles.label}>Class</Text>
<TouchableOpacity onPress={() => setClassModal(true)}>
<LinearGradient colors={["#1e293b", "#0f172a"]} style={{ padding: 15, borderRadius: 10 }}>
<Text style={{ color: "#fff" }}>
{classroom ? classes.find(i => i.id === classroom)?.name : "Select Class"}
</Text>
</LinearGradient>
</TouchableOpacity>

{/* STREAM */}
<Text style={styles.label}>Stream</Text>
<TouchableOpacity onPress={() => setStreamModal(true)}>
<LinearGradient colors={["#1e293b", "#0f172a"]} style={{ padding: 15, borderRadius: 10 }}>
<Text style={{ color: "#fff" }}>
{stream ? streams.find(i => i.id === stream)?.name : "Select Stream"}
</Text>
</LinearGradient>
</TouchableOpacity>

{/* TEACHER FIXED */}
<Text style={styles.label}>Teacher</Text>
<TouchableOpacity onPress={() => setTeacherModal(true)}>
<LinearGradient colors={["#1e293b", "#0f172a"]} style={{ padding: 15, borderRadius: 10 }}>
<Text style={{ color: "#fff" }}>
{teacher ? teachers.find(i => i.id === teacher)?.username : "Select Teacher"}
</Text>
</LinearGradient>
</TouchableOpacity>

{/* SUBJECT */}
<Text style={styles.label}>Subject</Text>
<TouchableOpacity onPress={() => setSubjectModal(true)}>
<LinearGradient colors={["#1e293b", "#0f172a"]} style={{ padding: 15, borderRadius: 10 }}>
<Text style={{ color: "#fff" }}>
{subject ? subjects.find(i => i.id === subject)?.name : "Select Subject"}
</Text>
</LinearGradient>
</TouchableOpacity>

{/* TERM */}
<Text style={styles.label}>Term</Text>
<TouchableOpacity onPress={() => setTermModal(true)}>
<LinearGradient colors={["#1e293b", "#0f172a"]} style={{ padding: 15, borderRadius: 10 }}>
<Text style={{ color: "#fff" }}>{term ? term : "Select Term"}</Text>
</LinearGradient>
</TouchableOpacity>

{/* FROM DATE */}
<Text style={styles.label}>From Date</Text>

<TouchableOpacity onPress={() => setShowFromDatePicker(true)}>
<LinearGradient
colors={["#1e293b", "#0f172a"]}
style={{
padding: 15,
borderRadius: 10
}}
>
<Text style={{ color: "#fff" }}>
{formatDate(fromDate)}
</Text>
</LinearGradient>
</TouchableOpacity>

{showFromDatePicker && (
<DateTimePicker
value={fromDate}
mode="date"
display={Platform.OS === "ios" ? "spinner" : "default"}
onChange={(event, selectedDate) => {

setShowFromDatePicker(Platform.OS === "ios");

if (selectedDate) {
setFromDate(selectedDate);
}
}}
/>
)}

{/* TO DATE */}
<Text style={styles.label}>To Date</Text>

<TouchableOpacity onPress={() => setShowToDatePicker(true)}>
<LinearGradient
colors={["#1e293b", "#0f172a"]}
style={{
padding: 15,
borderRadius: 10
}}
>
<Text style={{ color: "#fff" }}>
{formatDate(toDate)}
</Text>
</LinearGradient>
</TouchableOpacity>

{showToDatePicker && (
<DateTimePicker
value={toDate}
mode="date"
display={Platform.OS === "ios" ? "spinner" : "default"}
onChange={(event, selectedDate) => {

setShowToDatePicker(Platform.OS === "ios");

if (selectedDate) {
setToDate(selectedDate);
}
}}
/>
)}

{/* TOPIC */}
<Text style={styles.label}>Topic</Text>
<TextInput
value={topic}
onChangeText={setTopic}
placeholder="Enter topic"
placeholderTextColor="#94a3b8"
style={{ backgroundColor: "#1e293b", padding: 12, borderRadius: 10, color: "#fff" }}
/>

{/* CONTENT */}
<Text style={styles.label}>Content</Text>
<TextInput
value={content}
onChangeText={setContent}
placeholder="Write scheme content..."
placeholderTextColor="#94a3b8"
multiline
numberOfLines={5}
style={{
backgroundColor: "#1e293b",
padding: 12,
borderRadius: 10,
color: "#fff",
height: 120,
textAlignVertical: "top"
}}
/>

{/* WEEK */}
<Text style={styles.label}>Week</Text>
<TextInput
value={week}
onChangeText={setWeek}
placeholder="e.g 1"
keyboardType="numeric"
placeholderTextColor="#94a3b8"
style={{ backgroundColor: "#1e293b", padding: 12, borderRadius: 10, color: "#fff" }}
/>

{/* BUTTON */}
<Animated.View style={{ transform: [{ scale: scaleAnim }], marginTop: 20 }}>
<TouchableOpacity onPressIn={pressIn} onPressOut={pressOut} onPress={createScheme}>
<LinearGradient colors={["#2563eb", "#38bdf8"]} style={styles.button}>
<Text style={styles.buttonText}>Create Scheme</Text>
</LinearGradient>
</TouchableOpacity>
</Animated.View>

</View>
</BlurView>
</ScrollView>

{/* CLASS MODAL */}
<Modal visible={classModal} transparent>
<View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", padding: 20 }}>
<View style={{ backgroundColor: "#020617", borderRadius: 15, padding: 10 }}>
{classes.map(i => (
<TouchableOpacity key={i.id} onPress={() => selectClass(i.id)} style={{ padding: 12 }}>
<Text style={{ color: "#fff" }}>{i.name}</Text>
</TouchableOpacity>
))}
</View>
</View>
</Modal>

{/* STREAM MODAL */}
<Modal visible={streamModal} transparent>
<View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", padding: 20 }}>
<View style={{ backgroundColor: "#020617", borderRadius: 15, padding: 10 }}>
{streams.map(i => (
<TouchableOpacity key={i.id} onPress={() => { setStream(i.id); setStreamModal(false); }} style={{ padding: 12 }}>
<Text style={{ color: "#fff" }}>{i.name}</Text>
</TouchableOpacity>
))}
</View>
</View>
</Modal>

{/* TEACHER MODAL FIXED */}
<Modal visible={teacherModal} transparent>
<View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", padding: 20 }}>
<View style={{ backgroundColor: "#020617", borderRadius: 15, padding: 10 }}>
{teachers.map(i => (
<TouchableOpacity
key={i.id}
onPress={() => {
setTeacher(i.id);
setTeacherModal(false);
}}
style={{ padding: 12 }}
>
<Text style={{ color: "#fff" }}>{i.username}</Text>
</TouchableOpacity>
))}
</View>
</View>
</Modal>

{/* SUBJECT MODAL */}
<Modal visible={subjectModal} transparent>
<View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", padding: 20 }}>
<View style={{ backgroundColor: "#020617", borderRadius: 15, padding: 10 }}>
{subjects.map(i => (
<TouchableOpacity key={i.id} onPress={() => { setSubject(i.id); setSubjectModal(false); }} style={{ padding: 12 }}>
<Text style={{ color: "#fff" }}>{i.name}</Text>
</TouchableOpacity>
))}
</View>
</View>
</Modal>

{/* TERM MODAL */}
<Modal visible={termModal} transparent>
<View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", padding: 20 }}>
<View style={{ backgroundColor: "#020617", borderRadius: 15, padding: 10 }}>
{["term1", "term2", "term3", "term4"].map(t => (
<TouchableOpacity key={t} onPress={() => { setTerm(t); setTermModal(false); }} style={{ padding: 12 }}>
<Text style={{ color: "#fff" }}>{t}</Text>
</TouchableOpacity>
))}
</View>
</View>
</Modal>

{/* SUCCESS MODAL */}
<Modal visible={successModal} transparent animationType="fade">
<View
style={{
flex: 1,
backgroundColor: "rgba(0,0,0,0.75)",
justifyContent: "center",
alignItems: "center",
padding: 20
}}
>

<View
style={{
backgroundColor: "#0f172a",
width: "100%",
borderRadius: 25,
padding: 25,
alignItems: "center",
borderWidth: 1,
borderColor: "#38bdf8"
}}
>

<LinearGradient
colors={["#2563eb", "#38bdf8"]}
style={{
width: 90,
height: 90,
borderRadius: 45,
justifyContent: "center",
alignItems: "center",
marginBottom: 20
}}
>
<Text
style={{
fontSize: 40,
color: "#fff",
fontWeight: "bold"
}}
>
✓
</Text>
</LinearGradient>

<Text
style={{
color: "#fff",
fontSize: 24,
fontWeight: "bold",
marginBottom: 10
}}
>
Success
</Text>

<Text
style={{
color: "#cbd5e1",
fontSize: 16,
textAlign: "center",
lineHeight: 24
}}
>
Teacher Scheme has been created successfully.
</Text>

<TouchableOpacity
onPress={() => setSuccessModal(false)}
style={{ width: "100%", marginTop: 25 }}
>
<LinearGradient
colors={["#2563eb", "#38bdf8"]}
style={{
paddingVertical: 14,
borderRadius: 14,
alignItems: "center"
}}
>
<Text
style={{
color: "#fff",
fontWeight: "bold",
fontSize: 16
}}
>
Continue
</Text>
</LinearGradient>
</TouchableOpacity>

</View>
</View>
</Modal>

{/* LOADING */}
{loading && (
<View style={{
position: "absolute",
top: 0,
left: 0,
right: 0,
bottom: 0,
justifyContent: "center",
alignItems: "center",
backgroundColor: "rgba(0,0,0,0.6)"
}}>
<ActivityIndicator size="large" color="#2563eb" />
<Text style={{ color: "#fff", marginTop: 10 }}>Creating Scheme...</Text>
</View>
)}

<Toast />

</LinearGradient>
);
}