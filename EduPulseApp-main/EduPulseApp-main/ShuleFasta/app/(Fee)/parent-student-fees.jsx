// app/(Parents)/parent-student-fees.jsx

import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import Toast from "react-native-toast-message";

import styles from "../../components/LoginStyles";
import { EndPoint } from "../../components/links";
import Header from "../../components/Header";

import { LanguageContext } from "../../components/LanguageContext";

export default function ParentStudentFees() {

  const { language } = useContext(LanguageContext);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem("userToken");
      setToken(savedToken);
    };
    loadToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchData(token);
    }
  }, [token]);

  const fetchData = async (token) => {
    setLoading(true);

    try {

      const res = await axios.get(
        EndPoint + "/parent-student-fees/",
        {
          headers: {
            Authorization: `Token ${token}`
          }
        }
      );

      setData(res.data);

    } catch (error) {

      Toast.show({
        type: "error",
        text1: language === "sw" ? "Hitilafu" : "Error",
        text2: language === "sw" ? "Imeshindikana kupakia data" : "Failed to load data"
      });

    }

    setLoading(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#020617" }}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ color: "#fff", marginTop: 10 }}>
          {language === "sw" ? "Inapakia..." : "Loading..."}
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#020617", "#0f172a", "#1e293b"]}
      style={{ flex: 1 }}
    >

      <Header
        title={language === "sw" ? "Ada za Mwanangu" : "My Child Fees"}
        subtitle={language === "sw" ? "Dashibodi ya Mzazi" : "Parent Dashboard"}
      />

      <ScrollView contentContainerStyle={{ padding: 15 }}>

        {data && (

          <BlurView intensity={40} tint="dark" style={styles.blur}>

            <Text style={styles.title}>
              {data.student_name}
            </Text>

            <Text style={{ color: "#94a3b8" }}>
              {language === "sw" ? "Darasa" : "Class"}: {data.classroom_name}
            </Text>

            <Text style={{ color: "#94a3b8" }}>
              {language === "sw" ? "Mkondo" : "Stream"}: {data.stream_name}
            </Text>

            <Text style={{ color: "#38bdf8", marginTop: 10 }}>
              {language === "sw" ? "Ada Jumla" : "Total Fee"}: {data.total_fee}
            </Text>

            <Text style={{ color: "#22c55e" }}>
              {language === "sw" ? "Imelipwa" : "Paid"}: {data.total_paid}
            </Text>

            <Text style={{ color: "#ef4444" }}>
              {language === "sw" ? "Salio" : "Balance"}: {data.balance}
            </Text>

            <Text style={{
              color: "#fff",
              marginTop: 20,
              fontWeight: "bold"
            }}>
              {language === "sw" ? "Historia ya Malipo" : "Payment History"}
            </Text>

            {data.payments.map((p, index) => (

              <View key={index} style={{
                marginTop: 10,
                padding: 10,
                backgroundColor: "#0f172a",
                borderRadius: 10
              }}>

                <Text style={{ color: "#fff" }}>
                  {p.amount_paid} TZS
                </Text>

                <Text style={{ color: "#94a3b8" }}>
                  {p.payment_date}
                </Text>

              </View>

            ))}

          </BlurView>

        )}

      </ScrollView>

      <Toast />

    </LinearGradient>
  );
}