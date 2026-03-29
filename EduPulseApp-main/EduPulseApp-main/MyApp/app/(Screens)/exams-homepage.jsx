import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import Header from "../../components/Header";

import { useRouter } from "expo-router";

import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

import * as Haptics from "expo-haptics";

import styles from "../../components/LoginStyles";

import * as Animatable from "react-native-animatable";

export default function DashboardOptions() {

  const router = useRouter();

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scaleAnim,{
      toValue:0.95,
      useNativeDriver:true
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scaleAnim,{
      toValue:1,
      useNativeDriver:true
    }).start();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();

    if(hour < 12) return "Good Morning ☀️";
    if(hour < 18) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  };

  const options = [
    {
      title:"Exams Categories",
      icon:<Ionicons name="checkmark-done" size={24} color="#fff" />,
      route:"/(Exams)/all-exam-categories",
      colors:["#22c55e","#4ade80","#16a34a"]
    },
    {
      title:"Add New Category",
      icon:<MaterialIcons name="history" size={24} color="#fff" />,
      route:"/(Exams)/create-exam-category",
      colors:["#3b82f6","#60a5fa","#2563eb"]
    },

    {
      title:"All Exams",
      icon:<MaterialIcons name="history" size={24} color="#fff" />,
      route:"(Exams)/all-exams",
      colors:["#3b82f6","#60a5fa","#2563eb"]
    },

    {
      title:"Add New Exam",
      icon:<MaterialIcons name="history" size={24} color="#fff" />,
      route:"(Exams)/create-exam",
      colors:["#3b82f6","#60a5fa","#2563eb"]
    },
   
  ];

  return(
    <LinearGradient
      colors={["#020617","#0f172a","#1e293b"]}
      style={styles.container}
    >

      <Image
        source={{uri:"https://images.unsplash.com/photo-1577896851231-70ef18881754"}}
        style={styles.bg}
      />

      <Header
        title="School Dashboard"
        subtitle="Management System"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <BlurView intensity={50} tint="dark" style={styles.greetingCard}>
          <Text style={styles.greetingTitle}>
            {getGreeting()}
          </Text>

          <Text style={styles.greetingSubtitle}>
            Manage your school easily & professionally 🚀
          </Text>
        </BlurView>

        <View style={styles.optionsContainer}>

          {options.map((item,index)=>(
            <Animated.View
              key={index}
              style={[
                styles.cardWrapper,
                {transform:[{scale:scaleAnim}]}
              ]}
            >

              <TouchableOpacity
                activeOpacity={0.9}
                onPressIn={pressIn}
                onPressOut={pressOut}
                onPress={()=>{
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  router.push(item.route);
                }}
              >

                <LinearGradient
                  colors={item.colors}
                  start={{x:0,y:0}}
                  end={{x:1,y:1}}
                  style={styles.card}
                >

                  <View style={styles.cardContent}>

                    <View style={styles.leftContent}>

                      <View style={styles.iconBox}>
                        {item.icon}
                      </View>

                      <Text style={styles.cardText}>
                        {item.title}
                      </Text>

                    </View>

                    <Ionicons name="chevron-forward" size={22} color="#fff" />

                  </View>

                </LinearGradient>

              </TouchableOpacity>

            </Animated.View>
          ))}

        </View>

        <BlurView intensity={30} tint="dark" style={styles.footer}>
          <Text style={styles.footerText}>
            Shule Fasta 🚀 | Smart School System
          </Text>
        </BlurView>

      </ScrollView>

    </LinearGradient>
  );
}