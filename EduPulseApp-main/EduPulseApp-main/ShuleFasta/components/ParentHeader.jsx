import { useRouter } from "expo-router";
import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { UserContext } from "./UserContext";
import i18n from "./translations";

export default function ParentHeader({ title, subtitle }) {

  const { userData } = useContext(UserContext);

  const roleTitle = userData?.role
    ? `${userData.role.charAt(0).toUpperCase()}${userData.role.slice(1)} ${i18n.t("dashboard_title")}`
    : title;

  return (
    <View style={styles.header}>

      <Image
        source={require("../assets/icon.png")}
        style={styles.appIcon}
      />

      <View style={{ alignItems: "center", marginLeft:20 }}>
        <Text style={styles.title}>{roleTitle}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

     

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