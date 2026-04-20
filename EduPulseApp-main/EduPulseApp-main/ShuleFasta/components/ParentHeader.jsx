import { useRouter } from "expo-router";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "./UserContext";

export default function ParentHeader({ title, subtitle }) {
  const router = useRouter();
  const navigation = useNavigation();
  const { userData } = useContext(UserContext);

  const roleTitle = userData?.role
    ? `${userData.role.charAt(0).toUpperCase()}${userData.role.slice(1)} Dashboard`
    : title;

  return (
    <View style={styles.header}>

      {/* LEFT - App Icon (NO MENU) */}
      <Image
        source={require("../assets/icon.png")}
        style={styles.appIcon}
      />

      {/* CENTER */}
      <View style={{ alignItems: "center" }}>
        <Text style={styles.title}>{roleTitle}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* RIGHT - PROFILE */}
      <TouchableOpacity>
        <Image
          source={{ uri: "https://i.pravatar.cc/100" }}
          style={styles.profile}
        />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 18,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0f172a",
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },

  appIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
  },

  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: 12,
  },

  profile: {
    width: 38,
    height: 38,
    borderRadius: 20,
  },
});