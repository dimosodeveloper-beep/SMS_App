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

export default function VerifyOtpScreen() {

const router = useRouter();
const { email } = useLocalSearchParams();

const [otp, setOtp] = useState("");
const [loading, setLoading] = useState(false);

const fadeAnim = useRef(new Animated.Value(0)).current;
const slideAnim = useRef(new Animated.Value(40)).current;

/* =========================
ANIMATION
========================= */
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
VERIFY OTP (FIXED DOUBLE CLICK + KEYBOARD)
========================= */
const verifyOTP = async () => {

Keyboard.dismiss();

if (loading) return; // 🔥 prevent double click

if (!otp || otp.length < 4) {
Toast.show({
type: "error",
text1: "Invalid OTP",
text2: "Please enter valid code"
});
return;
}

setLoading(true);

try {

const res = await axios.post(
EndPoint + "/verify-otp/",
{
email,
otp
}
);

Haptics.notificationAsync(
Haptics.NotificationFeedbackType.Success
);

Toast.show({
type: "success",
text1: "Verified",
text2: res.data.message
});

/* go to reset password */
router.push({
pathname: "/(Account)/reset-password",
params: { email }
});

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

{/* KEYBOARD SAFE AREA */}
<KeyboardAvoidingView
style={{ flex: 1 }}
behavior={Platform.OS === "ios" ? "padding" : "height"}
>

<TouchableWithoutFeedback onPress={Keyboard.dismiss}>

<ScrollView
keyboardShouldPersistTaps="handled"
contentContainerStyle={{
flexGrow: 1,
justifyContent: "center",
alignItems: "center",
padding: 20,
paddingBottom: 140 // 🔥 prevents keyboard overlap
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
<Ionicons name="keypad-outline" size={40} color="#38bdf8" />
</View>
</View>

{/* TITLE */}
<Text style={{
textAlign: "center",
fontSize: 26,
fontWeight: "bold",
color: "#38bdf8"
}}>
Verify OTP
</Text>

<Text style={{
textAlign: "center",
color: "#94a3b8",
marginTop: 10,
fontSize: 13,
lineHeight: 20
}}>
Enter the code sent to your email
</Text>

<Text style={{
textAlign: "center",
marginTop: 10,
color: "#60a5fa",
fontSize: 13
}}>
{email}
</Text>

{/* INPUT */}
<View style={{ marginTop: 25 }}>

<Text style={{
color: "#94a3b8",
marginBottom: 8
}}>
OTP Code
</Text>

<View style={{
flexDirection: "row",
alignItems: "center",
backgroundColor: "rgba(255,255,255,0.08)",
borderRadius: 14,
paddingHorizontal: 12
}}>

<Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />

<TextInput
value={otp}
onChangeText={setOtp}
placeholder="Enter OTP"
placeholderTextColor="#64748b"
keyboardType="number-pad"
maxLength={6}
style={{
flex: 1,
paddingVertical: 14,
paddingHorizontal: 10,
color: "#fff",
fontSize: 18,
letterSpacing: 6,
textAlign: "center"
}}
/>

</View>

</View>

{/* BUTTON */}
<TouchableOpacity
onPress={verifyOTP}
activeOpacity={0.85}
style={{ marginTop: 25 }}
disabled={loading}   // 🔥 disables multiple taps
>

<LinearGradient
colors={["#2563eb", "#38bdf8"]}
style={{
padding: 16,
borderRadius: 18,
alignItems: "center",
opacity: loading ? 0.7 : 1
}}
>

{loading ? (
<ActivityIndicator color="#fff" />
) : (
<Text style={{
color: "#fff",
fontWeight: "700"
}}>
Verify OTP
</Text>
)}

</LinearGradient>

</TouchableOpacity>

{/* INFO */}
<View style={{
marginTop: 20,
alignItems: "center"
}}>
<Text style={{
color: "#64748b",
fontSize: 12,
textAlign: "center"
}}>
Check your email inbox or spam folder
</Text>
</View>

</BlurView>

</Animated.View>

</ScrollView>

</TouchableWithoutFeedback>

</KeyboardAvoidingView>

<Toast />

</LinearGradient>

);
}