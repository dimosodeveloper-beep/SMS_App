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

  const [modalVisible, setModalVisible] = useState(false);

  // 🔥 Notification badges (example)
  const [notifications, setNotifications] = useState({
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

  const checkForUpdate = async () => {
    try {
      const response = await fetch(EndPoint + "/LatestVersionView/");
      const data = await response.json();

      const latestVersion = data.latest_version;
      const currentVersion = "1";

      if (currentVersion < latestVersion) {
        Alert.alert(
          "New Version Available",
          "Please update the application.",
          [
            {
              text: "Download",
              onPress: () =>
                Linking.openURL(
                  "https://play.google.com/store/apps/details?id=ttpc.AgriHub"
                ),
            },
            { text: "Later", style: "cancel" },
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

  if (!fontsLoaded) return null;

  const drawerItems = [
    { name: "home", label: "Home", icon: "view-dashboard" },
    { name: "register-user", label: "Register User", icon: "account-group" },
    { name: "create-class", label: "Create Class", icon: "account-tie" },
    { name: "create-stream", label: "Create Stream", icon: "file-document-edit" },
    { name: "create-student", label: "Create Student", icon: "chart-bar" },
    
  ];

  const AnimatedItem = ({ item, index, onPress }) => {
    const scale = useSharedValue(1);
    const float = useSharedValue(0);

    useEffect(() => {
      float.value = withRepeat(withTiming(-4, { duration: 2000 }), -1, true);
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
          style={[
            styles.drawerItem,
            isActive && styles.activeItem
          ]}
        >
          <LinearGradient
            colors={isActive ? ["#22c55e", "#4ade80"] : ["#36d1dc", "#5b86e5"]}
            style={styles.iconBox}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={20}
              color="#fff"
            />
          </LinearGradient>

          <Text style={[
            styles.drawerLabel,
            isActive && { color: "#22c55e" }
          ]}>
            {item.label}
          </Text>

          {/* 🔥 BADGE */}
          {item.badge && notifications[item.badge] > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {notifications[item.badge]}
              </Text>
            </View>
          )}

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
          <LinearGradient
            colors={["#0f2027", "#203a43", "#2c5364"]}
            style={{ flex: 1 }}
          >
            {/* HEADER */}
            <ImageBackground
              source={{
                uri: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
              }}
              style={styles.headerImage}
            >
              <LinearGradient
                colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.2)"]}
                style={styles.headerOverlay}
              >
                <View style={styles.profileCard}>
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                    }}
                    style={styles.avatar}
                  />
                  <Text style={styles.welcome}>Karibu</Text>
                  <Text style={styles.username}>
                    {userData?.username}
                  </Text>
                </View>
              </LinearGradient>
            </ImageBackground>

            {/* MENU */}
            <ScrollView contentContainerStyle={{ padding: 15 }}>
              {drawerItems.map((item, index) => (
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
              <Pressable
                onPress={() => setModalVisible(true)}
                style={({ pressed }) => [
                  styles.logoutButton,
                  pressed && { transform: [{ scale: 0.9 }] },
                ]}
              >
                <LinearGradient
                  colors={["#ff416c", "#ff4b2b"]}
                  style={styles.logoutIcon}
                >
                  <FontAwesome name="sign-out" size={22} color="#fff" />
                </LinearGradient>
              </Pressable>
            </View>

            {/* MODAL */}
            <Modal visible={modalVisible} transparent animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.modalBox}>
                  <Text style={styles.modalTitle}>Logout</Text>
                  <Text style={styles.modalText}>
                    {userData?.username}, do you want to logout?
                  </Text>

                  <View style={styles.modalButtons}>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Text style={{ color: "#ef4444", fontFamily: "Bold" }}>
                        NO
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleLogout}>
                      <Text style={{ color: "#22c55e", fontFamily: "Bold" }}>
                        YES
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </LinearGradient>
        )}
      >
        {drawerItems.map((item) => (
          <Drawer.Screen
            key={item.name}
            name={item.name}
            options={{ drawerLabel: item.label }}
          />
        ))}
      </Drawer>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: { height: 220, width: "100%" },

  headerOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  profileCard: { alignItems: "center" },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 40,
    marginBottom: 8,
  },

  welcome: {
    color: "#ccc",
    fontSize: 14,
    fontFamily: "Medium",
  },

  username: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Bold",
  },

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

  activeItem: {
    backgroundColor: "rgba(34,197,94,0.15)",
    borderColor: "#22c55e",
  },

  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  drawerLabel: {
    color: "#fff",
    fontFamily: "Medium",
    fontSize: 15,
    flex: 1,
  },

  badge: {
    backgroundColor: "#ef4444",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  logoutContainer: {
    alignItems: "center",
    // marginBottom: 10,
    // paddingBottom:100,
    position:'absolute',
    bottom:100,
    right:10,
  },

  logoutIcon: {
    padding: 15,
    borderRadius: 50,
  },

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

  modalTitle: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "Bold",
    marginBottom: 10,
  },

  modalText: {
    color: "#ccc",
    marginBottom: 20,
    fontFamily: "Regular",
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});