import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import React, { useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from './UserContext';

export default function Header({ title, subtitle }) {

  const router = useRouter();
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');

  const { userData } = useContext(UserContext);

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  // 🔥 ROLE BASED HOME NAVIGATION
  const goHome = () => {
    if (userData?.role === "parent") {
      router.push("/(Parents)/parent_home");
    } else {
      router.push("/(main)/home");
    }
  };

  const roleTitle = userData?.role
    ? `${userData.role.charAt(0).toUpperCase()}${userData.role.slice(1)} Dashboard`
    : title;

  return (
    <View style={styles.header}>

      {/* LEFT BACK */}
      <TouchableOpacity
        onPress={goBack}
        style={styles.leftBtn}
      >
        <Ionicons
          name="arrow-back-circle"
          size={36}
          color="#38bdf8"
        />
      </TouchableOpacity>

      {/* CENTER */}
      <View style={styles.center}>
        <Text style={styles.title}>{roleTitle}</Text>

        {subtitle ? (
          <Text style={styles.subtitle}>{subtitle}</Text>
        ) : null}
      </View>

      {/* RIGHT HOME (ROLE BASED) */}
      <TouchableOpacity
        onPress={goHome}
        style={styles.rightBtn}
      >
        <Ionicons
          name="home"
          size={36}
          color="#38bdf8"
        />
      </TouchableOpacity>

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
    backgroundColor: "#020617",
    borderBottomWidth: 0.5,
    borderBottomColor: "#333"
  },

  leftBtn: {
    padding: 5
  },

  center: {
    flex: 1,
    alignItems: "center"
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

  rightBtn: {
    padding: 5
  }

});