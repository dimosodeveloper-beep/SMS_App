import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function Header({title, subtitle}){

  const router = useRouter();
  const navigation = useNavigation();
  const {width, height} = Dimensions.get('window');

  // Go back to previous screen
  const goBack = () => {
    if(navigation.canGoBack()){
      navigation.goBack();
    }
  };

  // Go to Home screen
  const goHome = () => router.push("/(main)/home");

  return(
    <View style={styles.header}>

      {/* Left: Go Back Button */}
      <TouchableOpacity 
        onPress={goBack} 
        style={styles.leftBtn}
      >
        <Ionicons name="arrow-back-circle" size={36} color="#38bdf8"/>
      </TouchableOpacity>

      {/* Center: Title & Subtitle */}
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {/* Right: Go Home Button */}
      <TouchableOpacity 
        onPress={goHome} 
        style={styles.rightBtn}
      >
        <Ionicons name="home" size={36} color="#38bdf8"/>
      </TouchableOpacity>

    </View>
  );

}

const styles = StyleSheet.create({

  header:{
    paddingTop:60,
    paddingBottom:20,
    paddingHorizontal:20,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    backgroundColor:"#020617", // dark professional background
    borderBottomWidth:0.5,
    borderBottomColor:"#333"
  },

  leftBtn:{
    padding:5
  },

  center:{
    flex:1,
    alignItems:"center"
  },

  title:{
    color:"#fff",
    fontSize:20,
    fontWeight:"bold"
  },

  subtitle:{
    color:"#aaa",
    fontSize:12
  },

  rightBtn:{
    padding:5
  }

});