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

import { DrawerItemList } from "@react-navigation/drawer";

import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

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

  return (
    <View style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          swipeEnabled: true,
          drawerStyle: {
            width: width - 60,
            backgroundColor: "#f5f7fb",
          },
        }}
        drawerContent={(props) => (
          <View style={{ flex: 1 }}>
            
            {/* HEADER IMAGE */}
            <ImageBackground
              source={{
                uri: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
              }}
              style={styles.headerImage}
            >
              <LinearGradient
                colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.4)"]}
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

                  <Text style={styles.systemText}>
                    School Management System
                  </Text>
                </View>
              </LinearGradient>
            </ImageBackground>

            {/* MENU */}
            <ScrollView style={{ marginTop: 10 }}>
              <View style={styles.menuContainer}>
                <DrawerItemList {...props} />
              </View>
            </ScrollView>

            {/* LOGOUT BUTTON */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => setModalVisible(true)}
            >
              <LinearGradient
                colors={["#ff512f", "#dd2476"]}
                style={styles.logoutGradient}
              >
                <FontAwesome name="sign-out" size={18} color="white" />

                <Text style={styles.logoutText}>Logout</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* MODAL */}
            <Modal visible={modalVisible} transparent animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.modalBox}>
                  <Text style={styles.modalTitle}>Logout</Text>

                  <Text style={styles.modalText}>
                    {userData?.username}, Do you want to logout?
                  </Text>

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={{ color: "red", fontFamily: "Bold" }}>
                        NO
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleLogout}>
                      <Text style={{ color: "green", fontFamily: "Bold" }}>
                        YES
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )}
      >

        <Drawer.Screen
          name="home"
          options={{
            drawerLabel: "Home",
            drawerIcon: () => (
              <MaterialCommunityIcons name="view-dashboard" size={24} color="#333" />
            ),
          }}
        />

        <Drawer.Screen
          name="register-user"
          options={{
            drawerLabel: "Register User",
            drawerIcon: () => (
              <MaterialCommunityIcons name="account-group" size={24} color="#333" />
            ),
          }}
        />

        <Drawer.Screen
          name="create-class"
          options={{
            drawerLabel: "Create Class",
            drawerIcon: () => (
              <MaterialCommunityIcons name="account-tie" size={24} color="#333" />
            ),
          }}
        />

        <Drawer.Screen
          name="create-stream"
          options={{
            drawerLabel: "Create Stream",
            drawerIcon: () => (
              <MaterialCommunityIcons name="file-document-edit" size={24} color="#333" />
            ),
          }}
        />

        <Drawer.Screen
          name="create-student"
          options={{
            drawerLabel: "Create Student",
            drawerIcon: () => (
              <MaterialCommunityIcons name="chart-bar" size={24} color="#333" />
            ),
          }}
        />

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

  menuContainer: {
    paddingHorizontal: 15,
  },

  logoutButton: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
  },

  logoutGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
  },

  logoutText: {
    color: "white",
    marginLeft: 10,
    fontFamily: "Bold",
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