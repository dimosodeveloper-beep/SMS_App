import { useRouter } from 'expo-router';
import {
  useNavigation,
  DrawerActions
} from '@react-navigation/native';
//account options
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
  Pressable
} from 'react-native';

import React, { useContext, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from './UserContext';
import i18n from "./translations";

export default function MainHeader({ title, subtitle }) {

  const router = useRouter();
  const navigation = useNavigation();
  const { userData } = useContext(UserContext);

  const [modalVisible, setModalVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const openMenu = () =>
    navigation.dispatch(DrawerActions.openDrawer());

  const roleTitle = userData?.role
    ? `${userData.role.charAt(0).toUpperCase()}${userData.role.slice(1)} ${i18n.t("dashboard_title")}`
    : title;

  /* =========================
  OPEN MODAL (SLIDE IN)
  ========================= */
  const openProfileModal = () => {
    setModalVisible(true);

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
  };

  /* =========================
  CLOSE MODAL
  ========================= */
  const closeModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true
      })
    ]).start(() => {
      setModalVisible(false);
    });
  };

  /* =========================
  GO TO CHANGE PASSWORD
  ========================= */
  const goToChangePassword = () => {
    closeModal();
    router.push("/(Account)/change-password");
  };

  return (
    <View style={styles.header}>

      {/* MENU */}
      <TouchableOpacity onPress={openMenu}>
        <Ionicons name="menu" size={28} color="#fff" />
      </TouchableOpacity>

      {/* TITLE */}
      <View style={{ alignItems: "center" }}>
        <Text style={styles.title}>{roleTitle}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* PROFILE ICON */}
      <TouchableOpacity onPress={openProfileModal}>
        <Image
          source={require("../assets/icon.png")}
          style={styles.profile}
        />
      </TouchableOpacity>

      {/* =========================
      MODAL
      ========================= */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
      >
        <Pressable style={styles.overlay} onPress={closeModal}>

          <Animated.View
            style={[
              styles.modalBox,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >

            <Text style={styles.modalTitle}>
              Account Options
            </Text>

            {/* CHANGE PASSWORD */}
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={goToChangePassword}
            >
              <Ionicons name="lock-closed-outline" size={20} color="#38bdf8" />
              <Text style={styles.modalText}>
                Change Password
              </Text>
            </TouchableOpacity>

            {/* CLOSE */}
            <TouchableOpacity
              style={[styles.modalBtn, { marginTop: 10 }]}
              onPress={closeModal}
            >
              <Ionicons name="close-circle-outline" size={20} color="#f87171" />
              <Text style={[styles.modalText, { color: "#f87171" }]}>
                Close
              </Text>
            </TouchableOpacity>

          </Animated.View>

        </Pressable>
      </Modal>

    </View>
  );
}

/* =========================
STYLES
========================= */

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
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center"
  },

  modalBox: {
    backgroundColor: "#0f172a",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(56,189,248,0.2)"
  },

  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15
  },

  modalBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12
  },

  modalText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 15
  }

});