import React,{useState,useEffect,useRef} from "react";
import{
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  ScrollView,
  Modal
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

import {useRouter,useLocalSearchParams} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

export default function AllStudents(){

  const router = useRouter();
  const {streamId,streamName,className} = useLocalSearchParams();

  const [students,setStudents] = useState([]);
  const [filteredStudents,setFilteredStudents] = useState([]);
  const [search,setSearch] = useState("");
  const [loading,setLoading] = useState(false);
  const [token,setToken] = useState(null);

  const [deleteModal,setDeleteModal] = useState(false);
  const [selectedId,setSelectedId] = useState(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const pressIn=()=>{
    Animated.spring(scaleAnim,{
      toValue:0.95,
      useNativeDriver:true
    }).start();
  }

  const pressOut=()=>{
    Animated.spring(scaleAnim,{
      toValue:1,
      useNativeDriver:true
    }).start();
  }

  useEffect(()=>{
    const loadToken = async()=>{
      const savedToken = await AsyncStorage.getItem("userToken");
      setToken(savedToken);
    };
    loadToken();
  },[]);

  useEffect(()=>{
    if(token){
      fetchStudents(token);
      checkLoggedIn(token);
    }
  },[token]);

  const fetchStudents = async(token)=>{
    setLoading(true);

    try{
      const response = await axios.get(
        EndPoint + "/students/", 
        {
          headers:{
            Authorization:`Token ${token}`,
            "Content-Type":"application/json"
          }
        }
      );

      setStudents(response.data);
      setFilteredStudents(response.data);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setLoading(false);
    }catch(error){
      setLoading(false);
      Toast.show({
        type:"error",
        text1:"Error fetching students",
        text2:JSON.stringify(error.response?.data)
      });
    }
  }

  const checkLoggedIn = async(token)=>{
    try {
      await axios.get(
        EndPoint + '/Account/user_data/',
        {
          headers:{
            Authorization:`Token ${token}`
          }
        }
      );
    } catch (error) {}
  }

  const handleSearch=(text)=>{
    setSearch(text);

    if(text === ""){
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter((item)=>
      (item.first_name + " " + item.last_name)
      .toLowerCase()
      .includes(text.toLowerCase())
    );

    setFilteredStudents(filtered);
  }

  const openCreateStudent=()=>{
    router.push("/create-student");
  }

  /* DELETE */
  const confirmDelete = (id)=>{
    setSelectedId(id);
    setDeleteModal(true);
  };

  const deleteStudent = async()=>{
    try{
      await axios.delete(
        EndPoint+`/update-delete-student/${selectedId}/`,
        {headers:{Authorization:`Token ${token}`}}
      );

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Toast.show({type:"success",text1:"Deleted"});

      setDeleteModal(false);
      fetchStudents(token);

    }catch(e){
      Toast.show({type:"error",text1:"Delete failed"});
    }
  };

  /* EDIT */
  const goToEdit = (item)=>{
    router.push({
      pathname:"/(Screens)/edit-student",
      params:item
    });
  };

  return(
    <LinearGradient
      colors={["#020617","#0f172a","#1e293b"]}
      style={styles.container}
    >
      <Image
        source={{
          uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"
        }}
        style={styles.bg}
      />

      <Header
        title="School Dashboard"
        subtitle="Management System"
      />

      <ScrollView
        contentContainerStyle={{
          padding:10,
          paddingBottom:120
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

      <BlurView intensity={40} tint="dark" style={styles.blur}>

        <Text style={styles.title}>
          Students {className} {streamName ? "- " + streamName : ""}
        </Text>

        <Text style={styles.subtitle}>
          All students in this school
        </Text>

        <View style={{marginTop:20}}>

          <TextInput
            value={search}
            onChangeText={handleSearch}
            placeholder="Search student..."
            placeholderTextColor="#94a3b8"
            style={{
              backgroundColor:"#0f172a",
              borderWidth:1,
              borderColor:"#334155",
              borderRadius:10,
              padding:12,
              color:"#fff",
              marginBottom:20
            }}
          />

          {filteredStudents.length === 0 && !loading &&(
            <Text style={{
              color:"#94a3b8",
              textAlign:"center",
              marginTop:30
            }}>
              No students found
            </Text>
          )}

          {filteredStudents.map((item,index)=>(
            <Animated.View
              key={item.id}
              style={{
                transform:[{scale:scaleAnim}],
                marginBottom:15
              }}
            >
              <TouchableOpacity
                onPressIn={pressIn}
                onPressOut={pressOut}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={["#1e293b","#0f172a"]}
                  style={{
                    padding:18,
                    borderRadius:14,
                    borderWidth:1,
                    borderColor:"#334155"
                  }}
                >
                  <View style={{
                    flexDirection:"row",
                    justifyContent:"space-between",
                    alignItems:"center"
                  }}>
                    <View>
                      <Text style={{
                        color:"#ffffff",
                        fontSize:18,
                        fontWeight:"bold"
                      }}>
                        {item.first_name} {item.last_name}
                      </Text>

                      <Text style={{
                        color:"#94a3b8",
                        marginTop:4
                      }}>
                        Adm: {item.admission_number}
                      </Text>

                      <Text style={{
                        color:"#64748b",
                        marginTop:2
                      }}>
                        Gender: {item.gender}
                      </Text>
                    </View>

                    {/* ACTIONS */}
                    <View style={{flexDirection:"row",alignItems:"center"}}>

                      <TouchableOpacity onPress={()=>goToEdit(item)}>
                        <Ionicons name="create" size={22} color="#38bdf8"/>
                      </TouchableOpacity>

                      <TouchableOpacity 
                        onPress={()=>confirmDelete(item.id)} 
                        style={{marginLeft:15}}
                      >
                        <Ionicons name="trash" size={22} color="#ef4444"/>
                      </TouchableOpacity>

                    </View>

                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}

        </View>
      </BlurView>
      </ScrollView>

      {loading &&(
        <View style={styles.loader}>
          <View style={styles.loaderCard}>
            <ActivityIndicator
              size="large"
              color="#2563eb"
            />
            <Text style={styles.loadingText}>
              Fetching students...
            </Text>
          </View>
        </View>
      )}

      {/* DELETE MODAL */}
      <Modal visible={deleteModal} transparent animationType="fade">
        <View style={{
          flex:1,
          backgroundColor:"rgba(0,0,0,0.7)",
          justifyContent:"center",
          padding:20
        }}>
          <View style={{
            backgroundColor:"#020617",
            padding:20,
            borderRadius:15
          }}>
            <Text style={{color:"#fff",marginBottom:20}}>
              Are you sure you want to delete this student?
            </Text>

            <View style={{flexDirection:"row",justifyContent:"space-between"}}>

              <TouchableOpacity onPress={()=>setDeleteModal(false)}>
                <Text style={{color:"#94a3b8"}}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={deleteStudent}>
                <Text style={{color:"#ef4444",fontWeight:"bold"}}>Delete</Text>
              </TouchableOpacity>

            </View>

          </View>
        </View>
      </Modal>

      <TouchableOpacity
        onPress={openCreateStudent}
        style={{
          position:"absolute",
          bottom:100,
          right:20,
          backgroundColor:"#2563eb",
          paddingHorizontal:20,
          paddingVertical:15,
          borderRadius:30,
          shadowColor:"#000",
          shadowOffset:{width:0,height:2},
          shadowOpacity:0.5,
          shadowRadius:4,
          elevation:5,
        }}
      >
        <Text style={{color:"#fff",fontWeight:"bold",fontSize:16}}>
          Add Student
        </Text>
      </TouchableOpacity>

      <Toast/>

    </LinearGradient>
  )
}