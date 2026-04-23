import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  Alert,
  Linking,
  ImageBackground,
  Pressable,
} from "react-native";

import React, { useState, useContext, useEffect } from "react";

import { Drawer } from "expo-router/drawer";

import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";

import { StatusBar } from "expo-status-bar";

import { UserContext } from "../../components/UserContext";
import { LanguageContext } from "../../components/LanguageContext";

import { EndPoint } from "../../components/links";

import { useFonts } from "expo-font";

import { useRouter, usePathname } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  FadeInDown,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function MainLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const { userData, userToken, setUserData, setUserToken } =
    useContext(UserContext);

  const { language, changeLanguage, t } = useContext(LanguageContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [langModal, setLangModal] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");

  const [notifications] = useState({
    results: 3,
    parents: 2,
  });

  let [fontsLoaded] = useFonts({
    Bold: require("../../assets/fonts/Poppins-Bold.ttf"),
    Medium: require("../../assets/fonts/Poppins-Medium.ttf"),
    SemiBold: require("../../assets/fonts/Poppins-SemiBold.ttf"),
    Regular: require("../../assets/fonts/Poppins-Regular.ttf"),
  });

  useEffect(() => {
    checkForUpdate();
  }, []);

  const roleLabel = userData?.role
    ? `${userData.role.charAt(0).toUpperCase()}${userData.role.slice(1)} ${t("dashboard")}`
    : `School ${t("dashboard")}`;

  const checkForUpdate = async () => {
    try {
      const response = await fetch(EndPoint + "/LatestVersionView/");
      const data = await response.json();

      const latestVersion = data.latest_version;
      const currentVersion = "1";

      if (currentVersion < latestVersion) {
        Alert.alert(
          t("new_version"),
          t("update_required"),
          [
            {
              text: t("download"),
              onPress: () =>
                Linking.openURL(
                  "https://play.google.com/store/apps/details?id=ttpc.AgriHub"
                ),
            },
            { text: t("later"), style: "cancel" },
          ]
        );
      }
    } catch (error) {}
  };

  const handleLogout = async () => {
    try {
      await axios.post(EndPoint + `/Account/logout_user/`, null, {
        headers: { Authorization: `Token ${userToken}` },
      });

      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");

      setUserData(null);
      setUserToken(null);

      setModalVisible(false);

      router.replace("/login");
    } catch (error) {
      router.replace("/login");
    }
  };

  const confirmLanguageChange = async () => {
    await changeLanguage(selectedLang);
    setLangModal(false);
  };

  if (!fontsLoaded) return null;

  const drawerItems = [
    { name: "home", label: t("home"), icon: "view-dashboard" },
    { name: "register-user", label: t("register_user"), icon: "account-group" },
    { name: "create-class", label: t("create_class"), icon: "account-tie" },
    { name: "create-stream", label: t("create_stream"), icon: "file-document-edit" },
    { name: "create-student", label: t("create_student"), icon: "chart-bar" },
    { name: "create-teacher", label: t("create_teacher"), icon: "chart-bar" },
    { name: "create-timetable", label: t("create_timetable"), icon: "chart-bar" },
    { name: "create-event", label: t("create_event"), icon: "view-dashboard" },
    { name: "create-grade", label: t("create_grade"), icon: "account-tie" },
  ];

  const filteredDrawerItems =
    userData?.role === "admin"
      ? drawerItems
      : drawerItems.filter((item) => item.name === "home");

  const AnimatedItem = ({ item, index, onPress }) => {
    const scale = useSharedValue(1);
    const float = useSharedValue(0);

    useEffect(() => {
      float.value = withRepeat(
        withTiming(-4, { duration: 2000 }),
        -1,
        true
      );
    }, []);

    const isActive = pathname.includes(item.name);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }, { translateY: float.value }],
    }));

    return (
      <Animated.View entering={FadeInDown.delay(index * 100)} style={animatedStyle}>
        <Pressable
          android_ripple={{ color: "rgba(255,255,255,0.2)" }}
          onPress={onPress}
          onPressIn={() => (scale.value = withSpring(0.95))}
          onPressOut={() => (scale.value = withSpring(1))}
          style={[styles.drawerItem, isActive && styles.activeItem]}
        >
          <LinearGradient
            colors={isActive ? ["#22c55e", "#4ade80"] : ["#36d1dc", "#5b86e5"]}
            style={styles.iconBox}
          >
            <MaterialCommunityIcons name={item.icon} size={20} color="#fff" />
          </LinearGradient>

          <Text style={[styles.drawerLabel, isActive && { color: "#22c55e" }]}>
            {item.label}
          </Text>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: width - 60,
            backgroundColor: "transparent",
          },
        }}
        drawerContent={(props) => (
          <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={{ flex: 1 }}>

            {/* LANGUAGE BUTTONS */}
            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20, gap: 20 }}>
              <TouchableOpacity onPress={() => { setSelectedLang("en"); setLangModal(true); }}>
                <Text style={{ fontSize: 26 }}>🇬🇧</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { setSelectedLang("sw"); setLangModal(true); }}>
                <Text style={{ fontSize: 26 }}>🇹🇿</Text>
              </TouchableOpacity>
            </View>

            {/* HEADER */}
            <ImageBackground
              source={{ uri: "https://images.unsplash.com/photo-1523240795612-9a054b0db644" }}
              style={styles.headerImage}
            >
              <LinearGradient colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.2)"]} style={styles.headerOverlay}>
                <View style={styles.profileCard}>
                  <Image
                    source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
                    style={styles.avatar}
                  />

                  <Text style={styles.roleTitle}>{roleLabel}</Text>
                  <Text style={styles.welcome}>{t("welcome")}</Text>
                  <Text style={styles.username}>{userData?.username}</Text>
                </View>
              </LinearGradient>
            </ImageBackground>

            <ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 100 }}>
              {filteredDrawerItems.map((item, index) => (
                <AnimatedItem
                  key={item.name}
                  item={item}
                  index={index}
                  onPress={() => props.navigation.navigate(item.name)}
                />
              ))}
            </ScrollView>

            {/* LOGOUT */}
            <View style={styles.logoutContainer}>
              <Pressable onPress={() => setModalVisible(true)}>
                <LinearGradient colors={["#ff416c", "#ff4b2b"]} style={styles.logoutIcon}>
                  <FontAwesome name="sign-out" size={22} color="#fff" />
                </LinearGradient>
              </Pressable>
            </View>

            {/* LANGUAGE MODAL */}
            <Modal visible={langModal} transparent animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.modalBox}>
                  <Text style={styles.modalTitle}>
                    {selectedLang === "en" ? t("change_to_english") : t("change_to_swahili")}
                  </Text>

                  <View style={styles.modalButtons}>
                    <TouchableOpacity onPress={() => setLangModal(false)}>
                      <Text style={{ color: "#ef4444", fontFamily: "Bold" }}>{t("no")}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={confirmLanguageChange}>
                      <Text style={{ color: "#22c55e", fontFamily: "Bold" }}>{t("yes")}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* LOGOUT MODAL */}
            <Modal visible={modalVisible} transparent animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.modalBox}>
                  <Text style={styles.modalTitle}>{t("logout")}</Text>
                  <Text style={styles.modalText}>
                    {userData?.username}, {t("confirm_logout")}
                  </Text>

                  <View style={styles.modalButtons}>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Text style={{ color: "#ef4444", fontFamily: "Bold" }}>{t("no")}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleLogout}>
                      <Text style={{ color: "#22c55e", fontFamily: "Bold" }}>{t("yes")}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

          </LinearGradient>
        )}
      >
        {filteredDrawerItems.map((item) => (
          <Drawer.Screen key={item.name} name={item.name} options={{ drawerLabel: item.label }} />
        ))}
      </Drawer>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: { height: 220, width: "100%" },
  headerOverlay: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileCard: { alignItems: "center" },
  avatar: { width: 70, height: 70, borderRadius: 40, marginBottom: 8 },
  roleTitle: { color: "#22c55e", fontSize: 16, fontFamily: "Bold", marginBottom: 5 },
  welcome: { color: "#ccc", fontSize: 14, fontFamily: "Medium" },
  username: { color: "#fff", fontSize: 20, fontFamily: "Bold" },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  activeItem: { backgroundColor: "rgba(2, 20, 18, 0.86)", borderColor: "#22c55e" },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  drawerLabel: { color: "#fff", fontFamily: "Medium", fontSize: 15, flex: 1 },
  logoutContainer: { alignItems: "center", position: "absolute", bottom: 150, right: 10 },
  logoutIcon: { padding: 15, borderRadius: 50 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#1e293b",
    padding: 25,
    borderRadius: 15,
  },
  modalTitle: { fontSize: 18, color: "#fff", fontFamily: "Bold", marginBottom: 10 },
  modalText: { color: "#ccc", marginBottom: 20, fontFamily: "Regular" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
});