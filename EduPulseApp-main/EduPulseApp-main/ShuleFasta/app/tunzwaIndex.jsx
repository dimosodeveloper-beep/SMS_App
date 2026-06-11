import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from "react-native";

import { EventRegister } from "react-native-event-listeners";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Toast from "react-native-toast-message";

import * as LocalAuthentication from "expo-local-authentication";
import * as Haptics from "expo-haptics";

import { Ionicons } from "@expo/vector-icons";
import styles from "../components/LoginStyles";
import { EndPoint } from "../components/links";

import i18n from "../components/translations";
import { LanguageContext } from "../components/LanguageContext";

export default function Login() {

const router = useRouter();
const { changeLanguage } = useContext(LanguageContext);

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const [langModalVisible, setLangModalVisible] = useState(false);
const [selectedLang, setSelectedLang] = useState(null);

// 🔥 FIX: prevent double click
const isSubmitting = useRef(false);

const shakeAnim = useRef(new Animated.Value(0)).current;
const floatAnim = useRef(new Animated.Value(0)).current;
const fadeAnim = useRef(new Animated.Value(0)).current;
const buttonScale = useRef(new Animated.Value(1)).current;
const glowAnim = useRef(new Animated.Value(0)).current;

/* =========================
ANIMATIONS
========================= */

useEffect(() => {
Animated.loop(
Animated.sequence([
Animated.timing(floatAnim, {
toValue: 1,
duration: 3000,
useNativeDriver: true,
}),
Animated.timing(floatAnim, {
toValue: 0,
duration: 3000,
useNativeDriver: true,
}),
])
).start();

Animated.timing(fadeAnim, {
toValue: 1,
duration: 1000,
useNativeDriver: true,
}).start();

Animated.loop(
Animated.sequence([
Animated.timing(glowAnim, {
toValue: 1,
duration: 1500,
useNativeDriver: false,
}),
Animated.timing(glowAnim, {
toValue: 0,
duration: 1500,
useNativeDriver: false,
}),
])
).start();
}, []);

const floatInterpolate = floatAnim.interpolate({
inputRange: [0, 1],
outputRange: [0, -10],
});

/* =========================
BUTTON ANIMATION
========================= */
const pressIn = () => {
Animated.spring(buttonScale, {
toValue: 0.96,
useNativeDriver: true,
}).start();
};

const pressOut = () => {
Animated.spring(buttonScale, {
toValue: 1,
useNativeDriver: true,
}).start();
};

/* =========================
SHAKE
========================= */
const shake = () => {
Animated.sequence([
Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
]).start();
};

/* =========================
LOGIN (FIXED DOUBLE CLICK)
========================= */

const loginUser = async () => {

// 🔥 prevent multiple taps
if (loading || isSubmitting.current) return;
isSubmitting.current = true;

Keyboard.dismiss();

if (!username || !password) {
shake();
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

Toast.show({
type: "error",
text1: i18n.t("missing_fields"),
text2: i18n.t("fill_all_fields"),
});

isSubmitting.current = false;
return;
}

setLoading(true);

try {

const response = await axios.post(
EndPoint + "/Account/login_user/",
{ username, password }
);

const token = response.data.token;

await AsyncStorage.setItem("userToken", token);

const userResponse = await axios.get(
EndPoint + "/Account/user_data/",
{
headers: { Authorization: `Token ${token}` }
}
);

const userData = userResponse.data;

await AsyncStorage.setItem("userData", JSON.stringify(userData));

EventRegister.emit("updateUserToken", token);

Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

Toast.show({
type: "success",
text1: i18n.t("login_success"),
});

if (userData.role === "parent") {
router.replace("/(Parents)/parent_home");
} else {
router.replace("/(main)/home");
}

} catch (error) {

shake();
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

Toast.show({
type: "error",
text1: i18n.t("login_failed"),
text2: i18n.t("invalid_credentials"),
});

} finally {
setLoading(false);
isSubmitting.current = false;
}
};

/* =========================
BIOMETRIC LOGIN
========================= */
const biometricLogin = async () => {
const result = await LocalAuthentication.authenticateAsync({
promptMessage: i18n.t("biometric_login"),
});

if (result.success) {
const userData = await AsyncStorage.getItem("userData");

if (userData) {
const parsed = JSON.parse(userData);

Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

if (parsed.role === "parent") {
router.replace("/(Parents)/parent_home");
} else {
router.replace("/(main)/home");
}
}
}
};

/* =========================
LANGUAGE
========================= */
const openLanguageModal = (lang) => {
setSelectedLang(lang);
setLangModalVisible(true);
};

const confirmLanguage = async () => {
await changeLanguage(selectedLang);
setLangModalVisible(false);
};

/* =========================
UI
========================= */

return (

<LinearGradient
colors={["#020617", "#0f172a", "#1e3a8a"]}
style={{ flex: 1 }}
>

{/* FIX: KEYBOARD HANDLING WRAPPER */}
<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
<KeyboardAvoidingView
style={{ flex: 1 }}
behavior={Platform.OS === "ios" ? "padding" : "height"}
>

<ScrollView
keyboardShouldPersistTaps="handled"
contentContainerStyle={{
flexGrow: 1,
justifyContent: "center",
alignItems: "center",
}}
>

{/* BACKGROUND */}
<Image
source={{ uri: "https://images.unsplash.com/photo-1588072432836-e10032774350" }}
style={{ position: "absolute", width: "100%", height: "100%" }}
blurRadius={4}
/>

<View style={{
position: "absolute",
width: "100%",
height: "100%",
backgroundColor: "rgba(0,0,0,0.68)"
}} />

{/* LOGIN CARD */}
<Animated.View
style={{
transform: [
{ translateY: floatInterpolate },
{ translateX: shakeAnim }
],
opacity: fadeAnim,
width: "90%",
}}
>

<BlurView intensity={70} tint="dark" style={{
borderRadius: 30,
padding: 26,
backgroundColor: "rgba(15,23,42,0.45)"
}}>

{/* USERNAME */}
<TextInput
placeholder={i18n.t("username")}
placeholderTextColor="#94a3b8"
value={username}
onChangeText={setUsername}
style={{
backgroundColor: "rgba(255,255,255,0.08)",
padding: 16,
borderRadius: 14,
color: "#fff",
marginBottom: 15
}}
/>

{/* PASSWORD */}
<TextInput
placeholder={i18n.t("password")}
placeholderTextColor="#94a3b8"
secureTextEntry={!showPassword}
value={password}
onChangeText={setPassword}
style={{
backgroundColor: "rgba(255,255,255,0.08)",
padding: 16,
borderRadius: 14,
color: "#fff"
}}
/>

{/* LOGIN BUTTON */}
<TouchableOpacity
onPress={loginUser}
disabled={loading || isSubmitting.current}
style={{
marginTop: 25,
opacity: loading ? 0.7 : 1
}}
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
{i18n.t("login")}
</Text>
)}

</LinearGradient>
</TouchableOpacity>

</BlurView>

</Animated.View>

</ScrollView>

</KeyboardAvoidingView>
</TouchableWithoutFeedback>

<Toast />

</LinearGradient>
);
}