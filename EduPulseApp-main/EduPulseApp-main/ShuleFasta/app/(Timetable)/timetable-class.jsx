import React,{useState,useEffect,useRef,useContext} from "react";
import{
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  ScrollView
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

import {useRouter} from "expo-router";
import {Ionicons,MaterialCommunityIcons} from "@expo/vector-icons";

import { LanguageContext } from "../../components/LanguageContext";

export default function getTimeTableClasses(){

  const router = useRouter();

  const { language } = useContext(LanguageContext);

  const [classes,setClasses] = useState([]);
  const [filteredClasses,setFilteredClasses] = useState([]);
  const [search,setSearch] = useState("");
  const [loading,setLoading] = useState(false);
  const [token,setToken] = useState(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Animation
  const pressIn=()=>{
    Animated.spring(scaleAnim,{
      toValue:0.96,
      friction:4,
      useNativeDriver:true
    }).start();
  }

  const pressOut=()=>{
    Animated.spring(scaleAnim,{
      toValue:1,
      friction:4,
      useNativeDriver:true
    }).start();
  }

  // TOKEN LOAD
  useEffect(()=>{
    const loadToken = async()=>{
      const savedToken = await AsyncStorage.getItem("userToken");

      console.log("===== TOKEN FROM STORAGE =====");
      console.log(savedToken);

      setToken(savedToken);
    };
    loadToken();
  },[]);

  // FETCH CLASSES
  useEffect(()=>{
    if(token){
      fetchClasses(token);
    }
  },[token]);

  const fetchClasses = async(token)=>{
    setLoading(true);

    try{

      console.log("===== FETCH CLASSES START =====");
      console.log("TOKEN => ", token);

      const response = await axios.get(
        EndPoint + "/classes/",
        {
          headers:{
            Authorization:`Token ${token}`,
            "Content-Type":"application/json"
          }
        }
      );

      console.log("===== CLASSES RESPONSE =====");
      console.log(response.data);

      setClasses(response.data);
      setFilteredClasses(response.data);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    }catch(error){

      console.log("===== ERROR FETCHING CLASSES =====");
      console.log(error.response?.data);

      Toast.show({
        type:"error",
        text1:
          language === "sw"
            ? "Hitilafu kupata madarasa"
            : "Error fetching classes",
        text2:
          language === "sw"
            ? "Imeshindikana kupakia orodha ya madarasa"
            : "Failed to load classes list"
      });

    }

    setLoading(false);
  }

  // SEARCH
  const handleSearch=(text)=>{
    setSearch(text);

    if(text === ""){
      setFilteredClasses(classes);
      return;
    }

    const filtered = classes.filter((item)=>{
      const className = language === "sw" ? (item.name_SW || item.name) : item.name;
      return className.toLowerCase().includes(text.toLowerCase());
    });

    setFilteredClasses(filtered);
  }

  // ✅ NAVIGATE WITH CLASS ID (FIXED)
  const openTimetable=(item)=>{

    console.log("===== CLICKED CLASS =====");
    console.log(item);

    console.log("===== SENDING CLASS ID =====");
    console.log(item.id);

    router.push({
      pathname:"/(Timetable)/get-timetable",
      params:{
        classId:item.id,
        className: item.name,
      }
    });
  }

  return(
    <LinearGradient
      colors={["#020617","#0f172a","#1e293b"]}
      style={styles.container}
    >

      <Image
        source={{
          uri:"https://images.unsplash.com/photo-1588072432836-e10032774350"
        }}
        style={[
          styles.bg,
          {
            opacity:0.18
          }
        ]}
      />

      <Header
        title={
          language === "sw"
            ? "Dashibodi ya Shule"
            : "School Dashboard"
        }
        subtitle={
          language === "sw"
            ? "Madarasa ya Ratiba"
            : "Timetable Classes"
        }
      />

      <ScrollView
        contentContainerStyle={{
          padding:15,
          paddingBottom:300
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

      <BlurView
        intensity={55}
        tint="dark"
        style={[
          styles.blur,
          {
            borderRadius:28,
            borderWidth:1,
            borderColor:"rgba(255,255,255,0.08)",
            overflow:"hidden",
            backgroundColor:"rgba(15,23,42,0.45)"
          }
        ]}
      >

        {/* TOP HEADER */}
        <LinearGradient
          colors={["rgba(37,99,235,0.18)","rgba(56,189,248,0.05)"]}
          style={{
            padding:20,
            borderRadius:24,
            marginBottom:20,
            borderWidth:1,
            borderColor:"rgba(59,130,246,0.15)"
          }}
        >

          <View style={{
            flexDirection:"row",
            justifyContent:"space-between",
            alignItems:"center"
          }}>

            <View style={{flex:1,paddingRight:10}}>

              <Text style={{
                color:"#ffffff",
                fontSize:26,
                fontWeight:"bold"
              }}>
                {
                  language === "sw"
                    ? "Chagua Darasa"
                    : "Select Class"
                }
              </Text>

              <Text style={{
                color:"#cbd5e1",
                marginTop:8,
                lineHeight:22,
                fontSize:14
              }}>
                {
                  language === "sw"
                    ? "Chagua chumba cha darasa ili kuona ratiba za vipindi na vikao vya kila siku."
                    : "Choose a classroom to view timetable schedules and daily sessions."
                }
              </Text>

            </View>

            <LinearGradient
              colors={["#2563eb","#38bdf8"]}
              style={{
                width:65,
                height:65,
                borderRadius:20,
                justifyContent:"center",
                alignItems:"center"
              }}
            >
              <Ionicons
                name="calendar-outline"
                size={30}
                color="#fff"
              />
            </LinearGradient>

          </View>

        </LinearGradient>

        {/* SEARCH */}
        <View style={{
          marginBottom:22
        }}>

          <View style={{
            flexDirection:"row",
            alignItems:"center",
            backgroundColor:"rgba(15,23,42,0.9)",
            borderRadius:18,
            borderWidth:1,
            borderColor:"#334155",
            paddingHorizontal:15,
            height:58
          }}>

            <Ionicons
              name="search"
              size={20}
              color="#94a3b8"
            />

            <TextInput
              value={search}
              onChangeText={handleSearch}
              placeholder={
                language === "sw"
                  ? "Tafuta darasa..."
                  : "Search class..."
              }
              placeholderTextColor="#94a3b8"
              style={{
                flex:1,
                color:"#fff",
                marginLeft:10,
                fontSize:15
              }}
            />

            {search !== "" &&(
              <TouchableOpacity onPress={()=>handleSearch("")}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            )}

          </View>

        </View>

        {/* STATS */}
        <View style={{
          flexDirection:"row",
          justifyContent:"space-between",
          marginBottom:25
        }}>

          <LinearGradient
            colors={["#1e293b","#0f172a"]}
            style={{
              width:"48%",
              borderRadius:22,
              padding:16,
              borderWidth:1,
              borderColor:"#334155"
            }}
          >

            <View style={{
              width:45,
              height:45,
              borderRadius:14,
              backgroundColor:"rgba(37,99,235,0.2)",
              justifyContent:"center",
              alignItems:"center",
              marginBottom:12
            }}>
              <Ionicons
                name="school-outline"
                size={22}
                color="#38bdf8"
              />
            </View>

            <Text style={{
              color:"#94a3b8",
              fontSize:13
            }}>
              {
                language === "sw"
                  ? "Jumla ya Madarasa"
                  : "Total Classes"
              }
            </Text>

            <Text style={{
              color:"#fff",
              fontSize:26,
              fontWeight:"bold",
              marginTop:5
            }}>
              {classes.length}
            </Text>

          </LinearGradient>

          <LinearGradient
            colors={["#1e293b","#0f172a"]}
            style={{
              width:"48%",
              borderRadius:22,
              padding:16,
              borderWidth:1,
              borderColor:"#334155"
            }}
          >

            <View style={{
              width:45,
              height:45,
              borderRadius:14,
              backgroundColor:"rgba(34,197,94,0.2)",
              justifyContent:"center",
              alignItems:"center",
              marginBottom:12
            }}>
              <MaterialCommunityIcons
                name="table-clock"
                size={22}
                color="#22c55e"
              />
            </View>

            <Text style={{
              color:"#94a3b8",
              fontSize:13
            }}>
              {
                language === "sw"
                  ? "Yaliyopo"
                  : "Available"
              }
            </Text>

            <Text style={{
              color:"#fff",
              fontSize:26,
              fontWeight:"bold",
              marginTop:5
            }}>
              {filteredClasses.length}
            </Text>

          </LinearGradient>

        </View>

        {/* EMPTY */}
        {filteredClasses.length === 0 && !loading &&(
          <View style={{
            justifyContent:"center",
            alignItems:"center",
            paddingVertical:50
          }}>

            <Ionicons
              name="folder-open-outline"
              size={70}
              color="#475569"
            />

            <Text style={{
              color:"#94a3b8",
              textAlign:"center",
              marginTop:15,
              fontSize:16
            }}>
              {
                language === "sw"
                  ? "Hakuna madarasa yaliyopatikana"
                  : "No classes found"
              }
            </Text>

          </View>
        )}

        {/* CLASS LIST */}
        {filteredClasses.map((item,index)=>(

          <Animated.View
            key={item.id}
            style={{
              transform:[{scale:scaleAnim}],
              marginBottom:18
            }}
          >

            <TouchableOpacity
              onPressIn={pressIn}
              onPressOut={pressOut}
              onPress={()=>openTimetable(item)}
              activeOpacity={0.9}
            >

              <LinearGradient
                colors={[
                  "rgba(30,41,59,0.95)",
                  "rgba(15,23,42,0.98)"
                ]}
                style={{
                  padding:20,
                  borderRadius:24,
                  borderWidth:1,
                  borderColor:"rgba(148,163,184,0.15)",
                  overflow:"hidden"
                }}
              >

                {/* GLOW */}
                <View style={{
                  position:"absolute",
                  top:-30,
                  right:-30,
                  width:100,
                  height:100,
                  borderRadius:50,
                  backgroundColor:"rgba(37,99,235,0.12)"
                }}/>

                <View style={{
                  flexDirection:"row",
                  justifyContent:"space-between",
                  alignItems:"center"
                }}>

                  <View style={{flex:1}}>

                    <View style={{
                      flexDirection:"row",
                      alignItems:"center"
                    }}>

                      <View style={{
                        width:52,
                        height:52,
                        borderRadius:16,
                        justifyContent:"center",
                        alignItems:"center",
                        backgroundColor:"rgba(37,99,235,0.18)",
                        marginRight:14
                      }}>

                        <Ionicons
                          name="book-outline"
                          size={24}
                          color="#38bdf8"
                        />

                      </View>

                      <View style={{flex:1}}>

                        <Text style={{
                          color:"#ffffff",
                          fontSize:19,
                          fontWeight:"bold"
                        }}>
                          {language === "sw" ? (item.name_SW || item.name) : item.name}
                        </Text>

                        <Text style={{
                          color:"#94a3b8",
                          marginTop:5,
                          fontSize:13
                        }}>
                          {
                            language === "sw"
                              ? "Ratiba ya Darasa"
                              : "Classroom Timetable"
                          }
                        </Text>

                      </View>

                    </View>

                    <View style={{
                      flexDirection:"row",
                      marginTop:18
                    }}>

                      <View style={{
                        backgroundColor:"rgba(37,99,235,0.15)",
                        paddingHorizontal:12,
                        paddingVertical:7,
                        borderRadius:12,
                        marginRight:10
                      }}>
                        <Text style={{
                          color:"#38bdf8",
                          fontWeight:"600",
                          fontSize:12
                        }}>
                          {
                            language === "sw"
                              ? `ID YA DARASA ${item.id}`
                              : `CLASS ID ${item.id}`
                          }
                        </Text>
                      </View>

                      <View style={{
                        backgroundColor:"rgba(34,197,94,0.15)",
                        paddingHorizontal:12,
                        paddingVertical:7,
                        borderRadius:12
                      }}>
                        <Text style={{
                          color:"#22c55e",
                          fontWeight:"600",
                          fontSize:12
                        }}>
                          {
                            language === "sw"
                              ? "HAI"
                              : "ACTIVE"
                          }
                        </Text>
                      </View>

                    </View>

                  </View>

                  <LinearGradient
                    colors={["#2563eb","#38bdf8"]}
                    style={{
                      width:48,
                      height:48,
                      borderRadius:16,
                      justifyContent:"center",
                      alignItems:"center",
                      marginLeft:15
                    }}
                  >

                    <Ionicons
                      name="arrow-forward"
                      size={22}
                      color="#fff"
                    />

                  </LinearGradient>

                </View>

              </LinearGradient>

            </TouchableOpacity>

          </Animated.View>

        ))}

      </BlurView>

      </ScrollView>

      {/* LOADER */}
      {loading &&(
        <View style={styles.loader}>

          <BlurView
            intensity={70}
            tint="dark"
            style={[
              styles.loaderCard,
              {
                borderRadius:22,
                overflow:"hidden",
                borderWidth:1,
                borderColor:"rgba(255,255,255,0.08)"
              }
            ]}
          >

            <LinearGradient
              colors={["rgba(37,99,235,0.2)","rgba(15,23,42,0.95)"]}
              style={{
                padding:30,
                alignItems:"center",
                borderRadius:22
              }}
            >

              <ActivityIndicator
                size="large"
                color="#38bdf8"
              />

              <Text style={{
                color:"#fff",
                marginTop:15,
                fontSize:16,
                fontWeight:"600"
              }}>
                {
                  language === "sw"
                    ? "Tunapakia madarasa..."
                    : "Fetching classes..."
                }
              </Text>

              <Text style={{
                color:"#94a3b8",
                marginTop:6,
                textAlign:"center"
              }}>
                {
                  language === "sw"
                    ? "Tafadhali subiri wakati tunapakia vyumba vya madarasa ya ratiba"
                    : "Please wait while loading timetable classrooms"
                }
              </Text>

            </LinearGradient>

          </BlurView>

        </View>
      )}

      <Toast/>

    </LinearGradient>
  )
}