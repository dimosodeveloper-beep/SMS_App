import { useRouter } from 'expo-router';
import {
  useNavigation,
  DrawerActions
} from '@react-navigation/native';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';

import React, { useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from './UserContext';
import i18n from "./translations";

export default function MainHeader({ title, subtitle }) {

  const router = useRouter();
  const navigation = useNavigation();
  const { userData } = useContext(UserContext);

  const openMenu = () =>
    navigation.dispatch(DrawerActions.openDrawer());

  const roleTitle = userData?.role
    ? `${userData.role.charAt(0).toUpperCase()}${userData.role.slice(1)} ${i18n.t("dashboard_title")}`
    : title;

  return (
    <View style={styles.header}>

      <TouchableOpacity onPress={openMenu}>
        <Ionicons name="menu" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={{ alignItems: "center" }}>
        <Text style={styles.title}>{roleTitle}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <Image
        source={{ uri: "https://i.pravatar.cc/100" }}
        style={styles.profile}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#020617"
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold"
  },

  subtitle: {
    color: "#aaa",
    fontSize: 12
  },

  profile: {
    width: 36,
    height: 36,
    borderRadius: 20
  }

});