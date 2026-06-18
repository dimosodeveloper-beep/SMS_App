import React,{useState,useEffect,useContext} from "react";
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

export default function AllSubjects(){

  const router = useRouter();

  const { language } = useContext(LanguageContext);

  const [subjects,setSubjects] = useState([]);
  const [filteredSubjects,setFilteredSubjects] = useState([]);
  const [search,setSearch] = useState("");
  const [loading,setLoading] = useState(false);
  const [token,setToken] = useState(null);

  const scaleAnim = new Animated.Value(1);

  // Animation
  const pressIn=()=>{
    Animated.spring(scaleAnim,{
      toValue:0.96,
      useNativeDriver:true
    }).start();
  }

  const pressOut=()=>{
    Animated.spring(scaleAnim,{
      toValue:1,
      friction:4,
      tension:40,
      useNativeDriver:true
    }).start();
  }

  // Load Token
  useEffect(()=>{
    const loadToken = async()=>{
      const savedToken = await AsyncStorage.getItem("userToken");
      setToken(savedToken);
    };
    loadToken();
  },[]);

  // Fetch Subjects
  useEffect(()=>{
    if(token){
      fetchSubjects(token);
    }
  },[token]);

  const fetchSubjects = async(token)=>{
    setLoading(true);

    try{

      console.log("TOKEN => ", token);

      const response = await axios.get(
        EndPoint + "/subjects/",
        {
          headers:{
            Authorization:`Token ${token}`,
            "Content-Type":"application/json"
          }
        }
      );

      console.log("SUBJECTS => ",response.data);

      setSubjects(response.data);
      setFilteredSubjects(response.data);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setLoading(false);

    }catch(error){

      setLoading(false);

      console.log("ERROR => ",error.response?.data);

      Toast.show({
        type:"error",
        text1: language === "sw"
        ? "Hitilafu kupata masomo"
        : "Error fetching subjects",
        text2:JSON.stringify(error.response?.data)
      });

    }
  }

  const handleSearch=(text)=>{
    setSearch(text);

    if(text === ""){
      setFilteredSubjects(subjects);
      return;
    }

    const filtered = subjects.filter((item)=>{

      const subjectName =
      language === "sw"
      ? (item.name_SW || item.name)
      : item.name;

      return subjectName
      .toLowerCase()
      .includes(text.toLowerCase());

    });

    setFilteredSubjects(filtered);
  }

  const openSubject=(item)=>{
    console.log("Selected Subject => ",item);
  }

  return(
    <LinearGradient
      colors={["#020617","#0f172a","#111827","#1e293b"]}
      style={styles.container}
    >

      <Image
        source={{
          uri:"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
        }}
        style={[
          styles.bg,
          {
            opacity:0.18
          }
        ]}
        blurRadius={2}
      />

      <View style={{
        position:"absolute",
        top:-120,
        right:-80,
        width:260,
        height:260,
        borderRadius:200,
        backgroundColor:"rgba(37,99,235,0.18)"
      }}/>

      <View style={{
        position:"absolute",
        bottom:-100,
        left:-80,
        width:240,
        height:240,
        borderRadius:200,
        backgroundColor:"rgba(56,189,248,0.12)"
      }}/>

      <Header
        title={
          language === "sw"
          ? "Dashibodi ya Shule"
          : "School Dashboard"
        }
        subtitle={
          language === "sw"
          ? "Mfumo wa Usimamizi"
          : "Management System"
        }
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal:14,
          paddingTop:10,
          paddingBottom:160
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

      <BlurView
        intensity={60}
        tint="dark"
        style={[
          styles.blur,
          {
            overflow:"hidden",
            borderRadius:30,
            padding:0,
            backgroundColor:"rgba(15,23,42,0.55)",
            borderWidth:1,
            borderColor:"rgba(255,255,255,0.08)"
          }
        ]}
      >

        <LinearGradient
          colors={[
            "rgba(255,255,255,0.08)",
            "rgba(255,255,255,0.02)"
          ]}
          start={{x:0,y:0}}
          end={{x:1,y:1}}
          style={{
            padding:22,
            borderRadius:30
          }}
        >

          <View style={{
            flexDirection:"row",
            alignItems:"center",
            justifyContent:"space-between"
          }}>

            <View style={{flex:1,paddingRight:10}}>

              <Text style={{
                color:"#ffffff",
                fontSize:30,
                fontWeight:"900",
                letterSpacing:0.5
              }}>
                {
                  language === "sw"
                  ? "Masomo Yote"
                  : "All Subjects"
                }
              </Text>

              <Text style={{
                color:"#94a3b8",
                marginTop:8,
                fontSize:15,
                lineHeight:22
              }}>
                {
                  language === "sw"
                  ? "Masomo yote yaliyopo shuleni"
                  : "Available subjects in your school"
                }
              </Text>

            </View>

            <LinearGradient
              colors={["#2563eb","#38bdf8"]}
              style={{
                width:65,
                height:65,
                borderRadius:22,
                justifyContent:"center",
                alignItems:"center",
                shadowColor:"#38bdf8",
                shadowOpacity:0.5,
                shadowRadius:12,
                elevation:10
              }}
            >
              <MaterialCommunityIcons
                name="book-education"
                size={30}
                color="#fff"
              />
            </LinearGradient>

          </View>

          <View style={{
            flexDirection:"row",
            marginTop:25,
            gap:12
          }}>

            <LinearGradient
              colors={["rgba(37,99,235,0.25)","rgba(59,130,246,0.08)"]}
              style={{
                flex:1,
                borderRadius:22,
                padding:16,
                borderWidth:1,
                borderColor:"rgba(96,165,250,0.25)"
              }}
            >

              <Text style={{
                color:"#93c5fd",
                fontSize:13,
                marginBottom:6
              }}>
                {
                  language === "sw"
                  ? "Jumla ya Masomo"
                  : "Total Subjects"
                }
              </Text>

              <Text style={{
                color:"#fff",
                fontSize:24,
                fontWeight:"900"
              }}>
                {subjects.length}
              </Text>

            </LinearGradient>

            <LinearGradient
              colors={["rgba(16,185,129,0.25)","rgba(16,185,129,0.06)"]}
              style={{
                flex:1,
                borderRadius:22,
                padding:16,
                borderWidth:1,
                borderColor:"rgba(52,211,153,0.25)"
              }}
            >

              <Text style={{
                color:"#6ee7b7",
                fontSize:13,
                marginBottom:6
              }}>
                {
                  language === "sw"
                  ? "Matokeo ya Utafutaji"
                  : "Search Results"
                }
              </Text>

              <Text style={{
                color:"#fff",
                fontSize:24,
                fontWeight:"900"
              }}>
                {filteredSubjects.length}
              </Text>

            </LinearGradient>

          </View>

          <View style={{marginTop:25}}>

            <View style={{
              flexDirection:"row",
              alignItems:"center",
              backgroundColor:"rgba(15,23,42,0.85)",
              borderWidth:1,
              borderColor:"rgba(148,163,184,0.15)",
              borderRadius:20,
              paddingHorizontal:16,
              height:60
            }}>

              <Ionicons
                name="search"
                size={22}
                color="#94a3b8"
              />

              <TextInput
                value={search}
                onChangeText={handleSearch}
                placeholder={
                  language === "sw"
                  ? "Tafuta somo..."
                  : "Search subject..."
                }
                placeholderTextColor="#94a3b8"
                style={{
                  flex:1,
                  color:"#fff",
                  marginLeft:12,
                  fontSize:15
                }}
              />

              {search !== "" &&(

                <TouchableOpacity
                  onPress={()=>{
                    setSearch("");
                    setFilteredSubjects(subjects);
                  }}
                >

                  <Ionicons
                    name="close-circle"
                    size={22}
                    color="#94a3b8"
                  />

                </TouchableOpacity>

              )}

            </View>

          </View>

          {filteredSubjects.length === 0 && !loading &&(

            <View style={{
              justifyContent:"center",
              alignItems:"center",
              paddingVertical:50
            }}>

              <MaterialCommunityIcons
                name="book-search-outline"
                size={75}
                color="#475569"
              />

              <Text style={{
                color:"#cbd5e1",
                fontSize:20,
                fontWeight:"700",
                marginTop:15
              }}>
                {
                  language === "sw"
                  ? "Hakuna Masomo Yaliyopatikana"
                  : "No Subjects Found"
                }
              </Text>

              <Text style={{
                color:"#94a3b8",
                textAlign:"center",
                marginTop:8,
                lineHeight:22
              }}>
                {
                  language === "sw"
                  ? "Jaribu kutafuta kwa jina jingine la somo"
                  : "Try searching using another subject name"
                }
              </Text>

            </View>

          )}

          <View style={{marginTop:22}}>

            {filteredSubjects.map((item,index)=>(

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
                  onPress={()=>openSubject(item)}
                  activeOpacity={0.9}
                >

                  <LinearGradient
                    colors={[
                      "rgba(30,41,59,0.95)",
                      "rgba(15,23,42,0.95)"
                    ]}
                    start={{x:0,y:0}}
                    end={{x:1,y:1}}
                    style={{
                      borderRadius:26,
                      padding:18,
                      borderWidth:1,
                      borderColor:"rgba(148,163,184,0.12)",
                      overflow:"hidden"
                    }}
                  >

                    <View style={{
                      position:"absolute",
                      top:-20,
                      right:-20,
                      width:100,
                      height:100,
                      borderRadius:100,
                      backgroundColor:"rgba(37,99,235,0.12)"
                    }}/>

                    <View style={{
                      flexDirection:"row",
                      alignItems:"center"
                    }}>

                      <LinearGradient
                        colors={["#2563eb","#38bdf8"]}
                        style={{
                          width:70,
                          height:70,
                          borderRadius:22,
                          justifyContent:"center",
                          alignItems:"center",
                          marginRight:16
                        }}
                      >

                        <MaterialCommunityIcons
                          name="book-open-page-variant"
                          size={32}
                          color="#fff"
                        />

                      </LinearGradient>

                      <View style={{flex:1}}>

                        <Text style={{
                          color:"#ffffff",
                          fontSize:20,
                          fontWeight:"900",
                          marginBottom:6
                        }}>
                          {
                            language === "sw"
                            ? (item.name_SW || item.name)
                            : item.name
                          }
                        </Text>

                        <View style={{
                          flexDirection:"row",
                          alignItems:"center"
                        }}>

                          <View style={{
                            width:8,
                            height:8,
                            borderRadius:20,
                            backgroundColor:"#22c55e",
                            marginRight:8
                          }}/>

                          <Text style={{
                            color:"#94a3b8",
                            fontSize:14
                          }}>
                            {
                              language === "sw"
                              ? "Somo Linapatikana"
                              : "Subject Available"
                            }
                          </Text>

                        </View>

                        <View style={{
                          flexDirection:"row",
                          alignItems:"center",
                          marginTop:10
                        }}>

                          <View style={{
                            backgroundColor:"rgba(37,99,235,0.18)",
                            paddingHorizontal:12,
                            paddingVertical:7,
                            borderRadius:12
                          }}>

                            <Text style={{
                              color:"#93c5fd",
                              fontWeight:"700",
                              fontSize:12
                            }}>
                              {
                                language === "sw"
                                ? `ID YA SOMO ${item.id}`
                                : `SUBJECT ID ${item.id}`
                              }
                            </Text>

                          </View>

                        </View>

                      </View>

                      <View style={{
                        justifyContent:"center",
                        alignItems:"center"
                      }}>

                        <Ionicons
                          name="chevron-forward-circle"
                          size={34}
                          color="#60a5fa"
                        />

                      </View>

                    </View>

                  </LinearGradient>

                </TouchableOpacity>

              </Animated.View>

            ))}

          </View>

        </LinearGradient>

      </BlurView>

      </ScrollView>

      {loading &&(
        <View style={styles.loader}>

          <BlurView
            intensity={80}
            tint="dark"
            style={{
              width:220,
              paddingVertical:30,
              borderRadius:30,
              justifyContent:"center",
              alignItems:"center",
              overflow:"hidden",
              borderWidth:1,
              borderColor:"rgba(255,255,255,0.08)",
              backgroundColor:"rgba(15,23,42,0.75)"
            }}
          >

            <LinearGradient
              colors={[
                "rgba(37,99,235,0.25)",
                "rgba(56,189,248,0.08)"
              ]}
              style={{
                position:"absolute",
                width:"100%",
                height:"100%"
              }}
            />

            <ActivityIndicator
              size="large"
              color="#38bdf8"
            />

            <Text style={{
              color:"#ffffff",
              marginTop:18,
              fontSize:16,
              fontWeight:"700"
            }}>
              {
                language === "sw"
                ? "Inapakua masomo..."
                : "Fetching subjects..."
              }
            </Text>

            <Text style={{
              color:"#94a3b8",
              marginTop:8,
              fontSize:13
            }}>
              {
                language === "sw"
                ? "Tafadhali subiri kidogo"
                : "Please wait a moment"
              }
            </Text>

          </BlurView>

        </View>
      )}

      <TouchableOpacity
        activeOpacity={0.9}
        style={{
          position:"absolute",
          bottom:35,
          right:20
        }}
      >

        <LinearGradient
          colors={["#2563eb","#38bdf8"]}
          style={{
            width:68,
            height:68,
            borderRadius:24,
            justifyContent:"center",
            alignItems:"center",
            elevation:10,
            shadowColor:"#38bdf8",
            shadowOpacity:0.4,
            shadowRadius:10
          }}
        >

          <Ionicons
            name="book"
            size={30}
            color="#fff"
          />

        </LinearGradient>

      </TouchableOpacity>

      <Toast/>

    </LinearGradient>
  )
}