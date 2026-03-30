import { useRouter } from 'expo-router';
import { useNavigation, DrawerActions } from '@react-navigation/native';

import { StyleSheet,Platform,TextInput,ActivityIndicator,
  Pressable, Text,Animated,ScrollView, View,Image, 
  Button, FlatList,TouchableOpacity,Modal,
  TouchableWithoutFeedback, Keyboard,Dimensions,
  
   
  KeyboardAvoidingView 
   } from 'react-native';
import React, {useState,useRef,useCallback, useEffect, useContext} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {MaterialIcons,Entypo,MaterialCommunityIcons,FontAwesome5, Ionicons,Feather,AntDesign, FontAwesome} from '@expo/vector-icons';


import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import LottieView from 'lottie-react-native';

export default function MainHeader({title, subtitle}){

 // const navigation = useNavigation();
  const {width, height} = Dimensions.get('window');
  


  const router = useRouter();
  const navigation = useNavigation();

  const openMenu = () => navigation.dispatch(DrawerActions.openDrawer());
 const GoHome = () => router.push("/(main)/home");


return(

<View style={styles.header}>

<TouchableOpacity 
 onPress={openMenu}

>
<Ionicons name="menu" size={28} color="#fff"/>
</TouchableOpacity>

<View style={{alignItems:"center"}}>
<Text style={styles.title}>{title}</Text>
<Text style={styles.subtitle}>{subtitle}</Text>
</View>

<Image
source={{uri:"https://i.pravatar.cc/100"}}
style={styles.profile}
/>

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
justifyContent:"space-between"
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

profile:{
width:36,
height:36,
borderRadius:20
}

});