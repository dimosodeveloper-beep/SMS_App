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
  TouchableOpacity,
  Dimensions
} from 'react-native';

import React, { useContext } from 'react';

import {
  Ionicons
} from '@expo/vector-icons';

import { UserContext } from './UserContext';

export default function MainHeader({ title, subtitle }) {

  const { width, height } = Dimensions.get('window');

  const router = useRouter();
  const navigation = useNavigation();

  const { userData } = useContext(UserContext);

  const openMenu = () =>
    navigation.dispatch(DrawerActions.openDrawer());

  const GoHome = () =>
    router.push("/(main)/home");

  const roleTitle = userData?.role
    ? `${userData.role.charAt(0).toUpperCase()}${userData.role.slice(1)} Dashboard`
    : title;

  return (

    <View style={styles.header}>

      {/* Menu */}
      <TouchableOpacity onPress={openMenu}>
        <Ionicons
          name="menu"
          size={28}
          color="#fff"
        />
      </TouchableOpacity>

      {/* Center */}
      <View style={{ alignItems: "center" }}>
        <Text style={styles.title}>
          {roleTitle}
        </Text>

        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>

      {/* Profile */}
      <Image
        source={{
          uri: "https://i.pravatar.cc/100"
        }}
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