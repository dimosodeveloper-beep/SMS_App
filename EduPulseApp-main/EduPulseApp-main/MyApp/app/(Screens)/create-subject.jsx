import React,{useState,useEffect} from "react";
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator,
  ScrollView, Animated
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {LinearGradient} from "expo-linear-gradient";
import {BlurView} from "expo-blur";
import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";

import styles from "../../components/LoginStyles";
import {EndPoint} from "../../components/links";
import Header from "../../components/Header";

export default function CreateSubject(){

  const [name,setName] = useState("");
  const [loading,setLoading] = useState(false);
  const [token,setToken] = useState(null);
  const [classrooms,setClassrooms] = useState([]);
  const [selectedClassrooms,setSelectedClassrooms] = useState({});
  const [streams,setStreams] = useState({});
  const scaleAnim = new Animated.Value(1);

  const pressIn=()=>{
    Animated.spring(scaleAnim,{toValue:0.95,useNativeDriver:true}).start();
  }
  const pressOut=()=>{
    Animated.spring(scaleAnim,{toValue:1,useNativeDriver:true}).start();
  }

  useEffect(()=>{
    const loadToken = async()=>{
      const savedToken = await AsyncStorage.getItem("userToken");
      setToken(savedToken);

      // fetch classrooms for this school
      if(savedToken){
        try{
          const res = await axios.get(EndPoint + "/get-classrooms/",{
            headers:{Authorization:`Token ${savedToken}`}
          });
          setClassrooms(res.data);
        }catch(e){
          console.log("Error loading classrooms",e);
        }
      }
    }
    loadToken();
  },[]);

  const toggleClassroom = (classId)=>{
    setSelectedClassrooms(prev=>{
      const newState = {...prev};
      if(newState[classId]){
        delete newState[classId];
      }else{
        newState[classId] = [];
      }
      return newState;
    });
  }

  const toggleStream = (classId, streamId)=>{
    setSelectedClassrooms(prev=>{
      const newState = {...prev};
      const arr = newState[classId] || [];
      if(arr.includes(streamId)){
        newState[classId] = arr.filter(id=>id!==streamId);
      }else{
        newState[classId] = [...arr,streamId];
      }
      return newState;
    });
  }

  const createSubject = async()=>{
    if(!name){
      Toast.show({type:"error", text1:"Missing Field", text2:"Enter subject name"});
      return;
    }
    if(!token){
      Toast.show({type:"error", text1:"Authentication Error", text2:"Login again"});
      return;
    }

    setLoading(true);
    try{
      const classroomsSelected = Object.keys(selectedClassrooms);
      const streamsSelected = [].concat(...Object.values(selectedClassrooms));

      const res = await axios.post(
        EndPoint + "/create-subject/",
        {
          name,
          classrooms: classroomsSelected,
          streams: streamsSelected
        },
        {headers:{Authorization:`Token ${token}`}}
      );

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({type:"success", text1:"Subject Created", text2:"Subject added successfully"});
      setName("");
      setSelectedClassrooms({});
      setLoading(false);

    }catch(error){
      setLoading(false);
      Toast.show({type:"error", text1:"Error", text2:JSON.stringify(error.response?.data)});
      console.log(error.response?.data);
    }
  }

  return(
    <LinearGradient colors={["#020617","#0f172a","#1e293b"]} style={styles.container}>
      <Header title="School Dashboard" subtitle="Management System"/>
      <ScrollView contentContainerStyle={{padding:10,paddingBottom:500}} keyboardShouldPersistTaps="handled">
        <BlurView intensity={40} tint="dark" style={styles.blur}>
          <Text style={styles.title}>Create Subject</Text>
          <Text style={styles.subtitle}>School Management System</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Subject Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Example: English"
              placeholderTextColor="#94a3b8"
            />

            {/* Classroom & Streams Multiselect */}
            <Text style={styles.label}>Select Classrooms & Streams</Text>
            {classrooms.map(cls=>(
              <View key={cls.id} style={{marginVertical:5}}>
                <TouchableOpacity onPress={()=>toggleClassroom(cls.id)}>
                  <Text style={{color:"#38bdf8",fontWeight:"bold"}}>{cls.name}</Text>
                </TouchableOpacity>

               {selectedClassrooms[cls.id] && cls.streams?.map(stream => (
  <View key={stream.id} style={{flexDirection:"row",alignItems:"center",marginLeft:20}}>
    <TouchableOpacity onPress={()=>toggleStream(cls.id,stream.id)}>
      <Text style={{color:selectedClassrooms[cls.id].includes(stream.id)?"#00ffcc":"#fff"}}>
        ☑ {stream.name}
      </Text>
    </TouchableOpacity>
  </View>
))}

              </View>
            ))}

            <Animated.View style={{transform:[{scale:scaleAnim}]}}>
              <TouchableOpacity onPressIn={pressIn} onPressOut={pressOut} onPress={createSubject}>
                <LinearGradient colors={["#2563eb","#38bdf8"]} style={styles.button}>
                  <Text style={styles.buttonText}>Create Subject</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

          </View>
        </BlurView>
      </ScrollView>

      {loading &&(
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#2563eb"/>
          <Text style={styles.loadingText}>Creating subject...</Text>
        </View>
      )}

      <Toast/>
    </LinearGradient>
  )
}