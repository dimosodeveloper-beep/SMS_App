import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  ScrollView,
  Modal,
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";

import DateTimePicker from "@react-native-community/datetimepicker";

import styles from "../../components/LoginStyles";
import { EndPoint } from "../../components/links";
import Header from "../../components/Header";

import { useRouter } from "expo-router";
import { LanguageContext } from "../../components/LanguageContext";

export default function CreateTimetable() {
  const router = useRouter();
  const { language } = useContext(LanguageContext);

  /* STATES */
  const [classroom, setClassroom] = useState(null);
  const [stream, setStream] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [subject, setSubject] = useState(null);

  const [day, setDay] = useState(null);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [classes, setClasses] = useState([]);
  const [streams, setStreams] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  /* MODALS */
  const [classModal, setClassModal] = useState(false);
  const [streamModal, setStreamModal] = useState(false);
  const [teacherModal, setTeacherModal] = useState(false);
  const [subjectModal, setSubjectModal] = useState(false);
  const [dayModal, setDayModal] = useState(false);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  /* FIX REANIMATED */
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };
  const pressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  /* TOKEN */
  useEffect(() => {
    const loadToken = async () => {
      const t = await AsyncStorage.getItem("userToken");
      setToken(t);
    };
    loadToken();
  }, []);

  /* FETCH */
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const c = await axios.get(EndPoint + "/classes2/", {
        headers: { Authorization: `Token ${token}` },
      });
      const t = await axios.get(EndPoint + "/teachers2/", {
        headers: { Authorization: `Token ${token}` },
      });
      const s = await axios.get(EndPoint + "/subjects2/", {
        headers: { Authorization: `Token ${token}` },
      });

      setClasses(c.data);
      setTeachers(t.data);
      setSubjects(s.data);
    } catch (e) {
      console.log(e);
    }
  };

  /* FETCH STREAMS */
  const fetchStreams = async (classId) => {
    try {
      const res = await axios.get(EndPoint + "/streams/" + classId + "/", {
        headers: { Authorization: `Token ${token}` },
      });
      setStreams(res.data);
    } catch (e) {
      console.log("STREAM ERROR", e.response?.data);
    }
  };

  /* SELECT CLASS */
  const selectClass = (id) => {
    setClassroom(id);
    setStream(null);
    fetchStreams(id);
    setClassModal(false);
  };

  /* FORMAT TIME */
  const formatTime = (date) => date.toTimeString().slice(0, 5);

  /* ERROR PARSER */
  const getErrorMessage = (errObj) => {
    let messages = [];

    Object.keys(errObj).forEach((key) => {
      const value = errObj[key];

      if (Array.isArray(value)) {
        messages.push(`${key}: ${value.join(", ")}`);
      } else if (typeof value === "object") {
        messages.push(`${key}: ${getErrorMessage(value)}`);
      } else {
        messages.push(`${key}: ${value}`);
      }
    });

    return messages.join("\n");
  };

  /* CREATE */
  const createTimetable = async () => {
    if (!classroom || !stream || !teacher || !subject || !day) {
      Toast.show({
        type: "error",
        text1: language === "sw" ? "Jaza sehemu zote" : "Fill all fields",
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        EndPoint + "/create-timetable/",
        {
          classroom,
          stream,
          teacher,
          subject,
          day,
          start_time: formatTime(startTime),
          end_time: formatTime(endTime),
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Toast.show({
        type: "success",
        text1: language === "sw" ? "Ratiba Imetengenezwa" : "Timetable Created",
      });

      router.back();
    } catch (e) {
      const err = e.response?.data?.errors;

      if (err) {
        const message = getErrorMessage(err);

        Toast.show({
          type: "error",
          text1: language === "sw" ? "Hitilafu" : "Error",
          text2: message,
        });
      } else {
        Toast.show({
          type: "error",
          text1: language === "sw" ? "Imeshindikana" : "Failed",
        });
      }
    }

    setLoading(false);
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <LinearGradient colors={["#020617", "#0f172a", "#1e293b"]} style={styles.container}>
      <Image
        source={{ uri: "https://images.unsplash.com/photo-1588072432836-e10032774350" }}
        style={styles.bg}
      />

      <Header
        title={language === "sw" ? "Tengeneza Ratiba" : "Create Timetable"}
        subtitle={language === "sw" ? "Ratiba Mahiri" : "Smart Scheduling"}
      />

      <ScrollView contentContainerStyle={{ padding: 10, paddingBottom: 200 }}>
        <BlurView intensity={40} tint="dark" style={styles.blur}>
          <Text style={styles.title}>
            {language === "sw" ? "Tengeneza Ratiba" : "Create Timetable"}
          </Text>

          <View style={styles.form}>
            {/* CLASS */}
            <Text style={styles.label}>{language === "sw" ? "Darasa" : "Class"}</Text>
            <TouchableOpacity onPress={() => setClassModal(true)}>
              <LinearGradient colors={["#1e293b", "#0f172a"]} style={{ padding: 15, borderRadius: 10 }}>
                <Text style={{ color: "#fff" }}>
                  {classroom
                    ? classes.find((i) => i.id === classroom)?.name
                    : language === "sw"
                    ? "Chagua Darasa"
                    : "Select Class"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* STREAM */}
            <Text style={styles.label}>{language === "sw" ? "Tahasusi" : "Stream"}</Text>
            <TouchableOpacity onPress={() => setStreamModal(true)}>
              <LinearGradient colors={["#1e293b", "#0f172a"]} style={{ padding: 15, borderRadius: 10 }}>
                <Text style={{ color: "#fff" }}>
                  {stream
                    ? streams.find((i) => i.id === stream)?.name
                    : language === "sw"
                    ? "Chagua Tahasusi"
                    : "Select Stream"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* TEACHER */}
            <Text style={styles.label}>{language === "sw" ? "Mwalimu" : "Teacher"}</Text>
            <TouchableOpacity onPress={() => setTeacherModal(true)}>
              <LinearGradient colors={["#1e293b", "#0f172a"]} style={{ padding: 15, borderRadius: 10 }}>
                <Text style={{ color: "#fff" }}>
                  {teacher
                    ? teachers.find((i) => i.id === teacher)?.name
                    : language === "sw"
                    ? "Chagua Mwalimu"
                    : "Select Teacher"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* SUBJECT */}
            <Text style={styles.label}>{language === "sw" ? "Somo" : "Subject"}</Text>
            <TouchableOpacity onPress={() => setSubjectModal(true)}>
              <LinearGradient colors={["#1e293b", "#0f172a"]} style={{ padding: 15, borderRadius: 10 }}>
                <Text style={{ color: "#fff" }}>
                  {subject
                    ? subjects.find((i) => i.id === subject)?.name
                    : language === "sw"
                    ? "Chagua Somo"
                    : "Select Subject"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* DAY */}
            <Text style={styles.label}>{language === "sw" ? "Siku" : "Day"}</Text>
            <TouchableOpacity onPress={() => setDayModal(true)}>
              <LinearGradient colors={["#1e293b", "#0f172a"]} style={{ padding: 15, borderRadius: 10 }}>
                <Text style={{ color: "#fff" }}>
                  {day ? day : language === "sw" ? "Chagua Siku" : "Select Day"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* TIME */}
            <Text style={styles.label}>{language === "sw" ? "Muda wa Kuanza" : "Start Time"}</Text>
            <TouchableOpacity onPress={() => setShowStartPicker(true)}>
              <LinearGradient colors={["#1e293b", "#0f172a"]} style={{ padding: 15, borderRadius: 10 }}>
                <Text style={{ color: "#fff" }}>{formatTime(startTime)}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.label}>{language === "sw" ? "Muda wa Kumaliza" : "End Time"}</Text>
            <TouchableOpacity onPress={() => setShowEndPicker(true)}>
              <LinearGradient colors={["#1e293b", "#0f172a"]} style={{ padding: 15, borderRadius: 10 }}>
                <Text style={{ color: "#fff" }}>{formatTime(endTime)}</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* BUTTON */}
            <Animated.View style={{ transform: [{ scale: scaleAnim }], marginTop: 20 }}>
              <TouchableOpacity onPressIn={pressIn} onPressOut={pressOut} onPress={createTimetable}>
                <LinearGradient colors={["#2563eb", "#38bdf8"]} style={styles.button}>
                  <Text style={styles.buttonText}>
                    {language === "sw" ? "Tengeneza Ratiba" : "Create Timetable"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </BlurView>
      </ScrollView>

      {/* MODALS */}
      <Modal visible={classModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", padding: 20 }}>
          <View style={{ backgroundColor: "#020617", borderRadius: 15, padding: 10 }}>
            {classes.map((i) => (
              <TouchableOpacity key={i.id} onPress={() => selectClass(i.id)} style={{ paddingVertical: 12 }}>
                <Text style={{ color: "#fff" }}>{i.name}</Text>
                <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.05)", marginTop: 10 }} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Modal visible={streamModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", padding: 20 }}>
          <View style={{ backgroundColor: "#020617", borderRadius: 15, padding: 10 }}>
            {streams.map((i) => (
              <TouchableOpacity key={i.id} onPress={() => { setStream(i.id); setStreamModal(false); }} style={{ paddingVertical: 12 }}>
                <Text style={{ color: "#fff" }}>{i.name}</Text>
                <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.05)", marginTop: 10 }} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Modal visible={teacherModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", padding: 20 }}>
          <View style={{ backgroundColor: "#020617", borderRadius: 15, padding: 10 }}>
            {teachers.map((i) => (
              <TouchableOpacity key={i.id} onPress={() => { setTeacher(i.id); setTeacherModal(false); }} style={{ paddingVertical: 12 }}>
                <Text style={{ color: "#fff" }}>{i.name}</Text>
                <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.05)", marginTop: 10 }} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Modal visible={subjectModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", padding: 20 }}>
          <View style={{ backgroundColor: "#020617", borderRadius: 15, padding: 10 }}>
            {subjects.map((i) => (
              <TouchableOpacity key={i.id} onPress={() => { setSubject(i.id); setSubjectModal(false); }} style={{ paddingVertical: 12 }}>
                <Text style={{ color: "#fff" }}>{i.name}</Text>
                <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.05)", marginTop: 10 }} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Modal visible={dayModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", padding: 20 }}>
          <View style={{ backgroundColor: "#020617", borderRadius: 15, padding: 10 }}>
            {daysOfWeek.map((d) => (
              <TouchableOpacity key={d} onPress={() => { setDay(d); setDayModal(false); }} style={{ paddingVertical: 12 }}>
                <Text style={{ color: "#fff" }}>{d}</Text>
                <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.05)", marginTop: 10 }} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* TIME PICKERS */}
      {showStartPicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display="default"
          onChange={(e, date) => { setShowStartPicker(false); if (date) setStartTime(date); }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display="default"
          onChange={(e, date) => { setShowEndPicker(false); if (date) setEndTime(date); }}
        />
      )}

      {/* LOADER */}
      {loading && (
        <View style={styles.loader}>
          <View style={styles.loaderCard}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>
              {language === "sw" ? "Inatengeneza..." : "Creating..."}
            </Text>
          </View>
        </View>
      )}

      <Toast />
    </LinearGradient>
  );
}