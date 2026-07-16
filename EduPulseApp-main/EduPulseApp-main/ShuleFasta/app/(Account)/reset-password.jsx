import React, { useState, useRef, useEffect } from "react";

import {
View,
Text,
TextInput,
TouchableOpacity,
ActivityIndicator,
Animated,
ScrollView,
KeyboardAvoidingView,
TouchableWithoutFeedback,
Keyboard,
Platform
} from "react-native";

import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";
import { useRouter, useLocalSearchParams } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { EndPoint } from "../../components/links";

export default function ResetPasswordScreen() {

const router = useRouter();
const { email } = useLocalSearchParams();

const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [loading, setLoading] = useState(false);

const [showNew, setShowNew] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);

const [error, setError] = useState("");

const fadeAnim = useRef(new Animated.Value(0)).current;
const slideAnim = useRef(new Animated.Value(40)).current;

useEffect(() => {
Animated.parallel([
Animated.timing(fadeAnim, {
toValue: 1,
duration: 700,
useNativeDriver: true
}),
Animated.timing(slideAnim, {
toValue: 0,
duration: 700,
useNativeDriver: true
})
]).start();
}, []);

/* =========================
VALIDATION
========================= */
const validate = () => {
if (!newPassword || !confirmPassword) {
setError("All fields are required");
return false;
}

if (newPassword.length < 8) {
setError("Password must be at least 8 characters");
return false;
}

if (newPassword !== confirmPassword) {
setError("Passwords do not match");
return false;
}

setError("");
return true;
};

/* =========================
RESET PASSWORD
========================= */
const resetPassword = async () => {

Keyboard.dismiss();

if (!validate()) {
Toast.show({
type: "error",
text1: "Validation Error",
text2: error || "Check your inputs"
});
return;
}

setLoading(true);

try {

const res = await axios.post(
EndPoint + "/reset-password/",
{
email,
new_password: newPassword
}
);

Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

Toast.show({
type: "success",
text1: "Success",
text2: res.data.message
});

router.replace("/login");

} catch (error) {

Toast.show({
type: "error",
text1: "Error",
text2: JSON.stringify(error.response?.data)
});

} finally {
setLoading(false);
}
};

return (

<LinearGradient
colors={["#020617", "#0f172a", "#1e293b"]}
style={{ flex: 1 }}
>

{/* BACK BUTTON */}
<TouchableOpacity
onPress={() => router.back()}
style={{
position: "absolute",
top: 50,
left: 20,
zIndex: 10,
backgroundColor: "rgba(255,255,255,0.08)",
padding: 10,
borderRadius: 14,
borderWidth: 1,
borderColor: "rgba(255,255,255,0.08)"
}}
>
<Ionicons name="arrow-back" size={22} color="#38bdf8" />
</TouchableOpacity>

{/* BACKGROUND GLOW */}
<View style={{
position: "absolute",
top: -120,
right: -120,
width: 250,
height: 250,
borderRadius: 200,
backgroundColor: "rgba(56,189,248,0.12)"
}} />

<View style={{
position: "absolute",
bottom: -120,
left: -120,
width: 260,
height: 260,
borderRadius: 200,
backgroundColor: "rgba(37,99,235,0.10)"
}} />

{/* KEYBOARD HANDLING */}
<KeyboardAvoidingView
style={{ flex: 1 }}
behavior={Platform.OS === "ios" ? "padding" : undefined}
>

<TouchableWithoutFeedback onPress={Keyboard.dismiss}>

<ScrollView
keyboardShouldPersistTaps="handled"
contentContainerStyle={{
flexGrow: 1,
justifyContent: "center",
alignItems: "center",
padding: 20,
paddingBottom: 120
}}
>

<Animated.View
style={{
width: "100%",
opacity: fadeAnim,
transform: [{ translateY: slideAnim }]
}}
>

<BlurView
intensity={70}
tint="dark"
style={{
borderRadius: 30,
padding: 25,
borderWidth: 1,
borderColor: "rgba(56,189,248,0.25)",
backgroundColor: "rgba(15,23,42,0.55)"
}}
>

{/* ICON */}
<View style={{ alignItems: "center", marginBottom: 15 }}>
<View style={{
width: 80,
height: 80,
borderRadius: 20,
backgroundColor: "rgba(56,189,248,0.15)",
justifyContent: "center",
alignItems: "center",
borderWidth: 1,
borderColor: "rgba(56,189,248,0.25)"
}}>
<Ionicons name="lock-open-outline" size={40} color="#38bdf8" />
</View>
</View>

{/* TITLE */}
<Text style={{
textAlign: "center",
fontSize: 26,
fontWeight: "bold",
color: "#38bdf8"
}}>
Reset Password
</Text>

<Text style={{
textAlign: "center",
color: "#94a3b8",
marginTop: 10,
fontSize: 13
}}>
Create a strong new password for your account
</Text>

{/* ERROR */}
{error ? (
<View style={{
backgroundColor: "rgba(239,68,68,0.12)",
padding: 10,
borderRadius: 12,
marginTop: 15
}}>
<Text style={{ color: "#f87171", textAlign: "center" }}>
{error}
</Text>
</View>
) : null}

{/* NEW PASSWORD */}
<View style={{ marginTop: 20 }}>

<Text style={{ color: "#94a3b8", marginBottom: 8 }}>
New Password
</Text>

<View style={inputBox}>
<Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />

<TextInput
value={newPassword}
onChangeText={setNewPassword}
secureTextEntry={!showNew}
placeholder="New password"
placeholderTextColor="#64748b"
style={inputStyle}
/>

<TouchableOpacity onPress={() => setShowNew(!showNew)}>
<Ionicons
name={showNew ? "eye-off" : "eye"}
size={20}
color="#94a3b8"
/>
</TouchableOpacity>

</View>
</View>

{/* CONFIRM PASSWORD */}
<View style={{ marginTop: 15 }}>

<Text style={{ color: "#94a3b8", marginBottom: 8 }}>
Confirm Password
</Text>

<View style={inputBox}>
<Ionicons name="checkmark-circle-outline" size={20} color="#94a3b8" />

<TextInput
value={confirmPassword}
onChangeText={setConfirmPassword}
secureTextEntry={!showConfirm}
placeholder="Confirm password"
placeholderTextColor="#64748b"
style={inputStyle}
/>

<TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
<Ionicons
name={showConfirm ? "eye-off" : "eye"}
size={20}
color="#94a3b8"
/>
</TouchableOpacity>

</View>
</View>

{/* BUTTON */}
<TouchableOpacity
onPress={resetPassword}
activeOpacity={0.85}
style={{ marginTop: 25 }}
>

<LinearGradient
colors={["#2563eb", "#38bdf8"]}
style={{
padding: 16,
borderRadius: 18,
alignItems: "center"
}}
>

{loading ? (
<ActivityIndicator color="#fff" />
) : (
<Text style={{ color: "#fff", fontWeight: "700" }}>
Reset Password
</Text>
)}

</LinearGradient>

</TouchableOpacity>

</BlurView>

</Animated.View>

</ScrollView>

</TouchableWithoutFeedback>

</KeyboardAvoidingView>

<Toast />

</LinearGradient>
);
}

/* =========================
STYLES
========================= */

const inputBox = {
flexDirection: "row",
alignItems: "center",
backgroundColor: "rgba(255,255,255,0.08)",
borderRadius: 14,
paddingHorizontal: 12,
paddingRight: 10
};

const inputStyle = {
flex: 1,
paddingVertical: 14,
paddingHorizontal: 10,
color: "#fff"
};