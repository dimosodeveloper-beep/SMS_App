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

import { useRouter } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function MainLayout() {
  const router = useRouter();

  const { userData, userToken, setUserData, setUserToken } =
    useContext(UserContext);

  const [modalVisible, setModalVisible] = useState(false);

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
      const response = await axios.post(
        EndPoint + `/Account/logout_user/`,
        null,
        {
          headers: {
            Authorization: `Token ${userToken}`,
          },
        }
      );

      if (response.status === 200) {
        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("userData");

        setUserData(null);
        setUserToken(null);

        setModalVisible(false);

        router.replace("/login");
      }
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
    { name: "all-exam-categories", label: "Exam Categories", icon: "chart-bar" },
    { name: "all-exams", label: "All Exams", icon: "chart-bar" },
    { name: "add-single-results", label: "Add Single Results", icon: "account-tie" },
    { name: "add-multiple-results", label: "Add Multiple Results", icon: "chart-bar" },

     { name: "(Results)/get-exams-categories", label: "Get Results", icon: "chart-bar" },
   
  ];

  return (
    <View style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          swipeEnabled: true,
          drawerStyle: {
            width: width - 60,
            backgroundColor: "transparent",
          },
        }}
        drawerContent={(props) => (
          <LinearGradient
            colors={["#000000", "#141414"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          >
            <View style={{ flex: 1 }}>
              {/* HEADER IMAGE */}
              <ImageBackground
                source={{
                  uri: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
                }}
                style={styles.headerImage}
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.8)", "rgba(255,255,255,0.2)"]}
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
                      {userData ? userData.username : ""}
                    </Text>
                    <Text style={styles.systemText}>School Management System</Text>
                  </View>
                </LinearGradient>
              </ImageBackground>

              {/* MENU SCROLL */}
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                  paddingHorizontal: 15,
                  paddingTop: 20,
                  paddingBottom: 100, // ensures last item is not cut
                }}
              >
                {drawerItems.map((item, index) => (
                  <TouchableOpacity
                    key={item.name}
                    style={styles.drawerItem}
                    onPress={() => props.navigation.navigate(item.name)}
                  >
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={24}
                      color="#fff"
                    />
                    <Text style={styles.drawerLabel}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* LOGOUT BUTTON FIXED */}
              <View style={styles.logoutContainer}>
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={() => setModalVisible(true)}
                >
                  <LinearGradient
                    colors={["#000000", "#2a0ea8"]}
                    style={styles.logoutIcon}
                  >
                    <FontAwesome name="sign-out" size={24} color="white" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* MODAL */}
              <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                  <View style={styles.modalBox}>
                    <Text style={styles.modalTitle}>Logout</Text>
                    <Text style={styles.modalText}>
                      {userData?.username}, Do you want to logout?
                    </Text>
                    <View style={styles.modalButtons}>
                      <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Text style={{ color: "red", fontFamily: "Bold" }}>NO</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleLogout}>
                        <Text style={{ color: "green", fontFamily: "Bold" }}>YES</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
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
  headerImage: {
    height: 230,
    width: "100%",
  },
  headerOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileCard: {
    alignItems: "center",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 40,
    marginBottom: 8,
  },
  welcome: {
    color: "white",
    fontSize: 16,
    fontFamily: "Medium",
  },
  username: {
    color: "white",
    fontSize: 20,
    fontFamily: "Bold",
  },
  systemText: {
    color: "#ddd",
    fontSize: 12,
    fontFamily: "Regular",
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 15,
    borderRadius: 6,
    marginVertical: 6,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 1,
  },
  drawerLabel: {
    color: "#fff",
    fontFamily: "Medium",
    fontSize: 16,
    marginLeft: 15,
  },
  logoutContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
    right:10,
  },
  logoutButton: {},
  logoutIcon: {
    padding: 15,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "white",
    padding: 25,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Bold",
    marginBottom: 10,
  },
  modalText: {
    fontFamily: "Regular",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});