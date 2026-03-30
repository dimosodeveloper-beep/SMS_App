import { useRouter } from "expo-router";
import {
StyleSheet,
Text,
View,
Image,
FlatList,
TouchableOpacity,
Modal,
Dimensions,
Animated,
ScrollView
} from "react-native";

import React,{useState,useRef,useEffect} from "react";

import {Ionicons,AntDesign} from "@expo/vector-icons";

import {LinearGradient} from "expo-linear-gradient";

import Checkbox from "expo-checkbox";

import {BlurView} from "expo-blur";

import {useFonts} from "expo-font";

const {width,height} = Dimensions.get("window");

const OnboardingScreen = () => {

const router = useRouter();

let [fontsLoaded] = useFonts({
Bold: require("../assets/fonts/Poppins-Bold.ttf"),
Medium: require("../assets/fonts/Poppins-Medium.ttf"),
SemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
Regular: require("../assets/fonts/Poppins-Regular.ttf"),
});

const fadeAnim = useRef(new Animated.Value(0)).current;
const gradientAnim = useRef(new Animated.Value(0)).current;

useEffect(()=>{

Animated.timing(fadeAnim,{
toValue:1,
duration:1200,
useNativeDriver:true
}).start();

Animated.loop(
Animated.timing(gradientAnim,{
toValue:1,
duration:6000,
useNativeDriver:true
})
).start();

},[]);

const gradientTranslate = gradientAnim.interpolate({
inputRange:[0,1],
outputRange:[-200,200]
});

const [modalVisible,setModalVisible] = useState(false);
const [isChecked,setChecked] = useState(false);

const onboardings=[

{
title:"Smart School Management",
description:"Manage students, teachers, classes and school operations from one intelligent platform built for modern schools.",
image:"https://images.unsplash.com/photo-1588072432836-e10032774350"
},

{
title:"Student & Teacher Management",
description:"Register students and teachers, organize classrooms and streams, and keep accurate academic records easily.",
image:"https://images.unsplash.com/photo-1509062522246-3755977927d7"
},

{
title:"Results, Attendance & Reports",
description:"Track attendance, manage exams, generate rankings and produce professional academic reports automatically.",
image:"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
}

];

const [currentSlideIndex,setCurrentSlideIndex]=useState(0);
const ref = useRef();

const updateCurrentSlideIndex = e =>{

const contentOffsetX = e.nativeEvent.contentOffset.x;
const currentIndex = Math.round(contentOffsetX / width);

setCurrentSlideIndex(currentIndex);

};

const Slide = ({item}) =>{

return(

<View style={styles.slide}>

<View style={styles.imageContainer}>

<Image
source={{uri:item.image}}
style={styles.image}
/>

</View>

<View style={styles.gradientArea}>

<Animated.View
style={{
transform:[{translateX:gradientTranslate}]
}}
>

<LinearGradient
colors={["#2563eb","#7c3aed","#06b6d4"]}
start={{x:0,y:0}}
end={{x:1,y:1}}
style={styles.gradientBackground}
/>

</Animated.View>

<BlurView intensity={60} tint="dark" style={styles.glassOverlay}/>

</View>

<Animated.View style={[styles.card,{opacity:fadeAnim}]}>

<Text style={styles.title}>
{item.title}
</Text>

<Text style={styles.desc}>
{item.description}
</Text>

</Animated.View>

</View>

);

};

const nextSlide = ()=>{

if(currentSlideIndex < onboardings.length-1){

ref.current.scrollToOffset({
offset:(currentSlideIndex+1)*width
});

}else{

setModalVisible(true);

}

};

if(!fontsLoaded) return null;

return(

<View style={{flex:1,backgroundColor:"#020617"}}>

<FlatList
ref={ref}
data={onboardings}
horizontal
pagingEnabled
showsHorizontalScrollIndicator={false}
onMomentumScrollEnd={updateCurrentSlideIndex}
renderItem={({item})=><Slide item={item}/>}
/>

<View style={styles.bottom}>

<View style={styles.indicators}>

{onboardings.map((_,index)=>{

return(

<View
key={index}
style={[
styles.indicator,
currentSlideIndex==index && styles.activeIndicator
]}
/>

);

})}

</View>

<TouchableOpacity
onPress={nextSlide}
style={styles.nextBtn}
>

<Ionicons
name="arrow-forward"
size={26}
color="white"
/>

</TouchableOpacity>

</View>

<Modal
visible={modalVisible}
transparent
animationType="slide"
>

<View style={styles.modalContainer}>

<View style={styles.modal}>

<TouchableOpacity
onPress={()=>setModalVisible(false)}
style={{alignSelf:"flex-end"}}
>

<AntDesign
name="closecircle"
size={28}
color="#ff4d4d"
/>

</TouchableOpacity>

<Text style={styles.modalTitle}>
Terms & Conditions
</Text>

<ScrollView>

<Text style={styles.modalText}>

Welcome to the School Management System platform.

This application is designed to help schools manage academic and administrative operations efficiently.

</Text>

<Text style={styles.modalText}>

All student records, exam results and school information must be entered accurately and used only for official educational purposes.

</Text>

<Text style={styles.modalText}>

Each school account can access only its own data and unauthorized use of the system may lead to account suspension.

</Text>

<Text style={styles.modalText}>

By continuing to use this application you agree to follow your institution policies and system guidelines.

</Text>

</ScrollView>

<View style={styles.checkRow}>

<Checkbox
value={isChecked}
onValueChange={setChecked}
color={isChecked ? "#3b82f6" : undefined}
/>

<Text style={styles.checkText}>
I agree to the terms
</Text>

</View>

{isChecked &&(

<TouchableOpacity
onPress={()=>router.replace("/login")}
>

<LinearGradient
colors={["#2563eb","#38bdf8"]}
style={styles.startBtn}
>

<Text style={styles.startText}>
GET STARTED
</Text>

<Ionicons
name="arrow-forward-circle"
size={26}
color="white"
/>

</LinearGradient>

</TouchableOpacity>

)}

</View>

</View>

</Modal>

</View>

);

};

export default OnboardingScreen;

const styles = StyleSheet.create({

slide:{
width:width,
height:height,
backgroundColor:"#020617"
},

imageContainer:{
height:height*0.52,
overflow:"hidden"
},

image:{
width:width,
height:"100%"
},

gradientArea:{
position:"absolute",
top:height*0.45,
width:width,
height:height
},

gradientBackground:{
width:width*2,
height:height
},

glassOverlay:{
position:"absolute",
width:width,
height:height
},

card:{
position:"absolute",
top:height*0.58,
paddingHorizontal:30
},

title:{
fontSize:28,
color:"white",
fontFamily:"Bold",
marginBottom:12
},

desc:{
fontSize:16,
color:"#e2e8f0",
lineHeight:24,
fontFamily:"Regular"
},

bottom:{
position:"absolute",
bottom:60,
width:width,
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
paddingHorizontal:30
},

indicators:{
flexDirection:"row"
},

indicator:{
width:10,
height:10,
borderRadius:10,
backgroundColor:"#64748b",
marginRight:8
},

activeIndicator:{
width:22,
backgroundColor:"#38bdf8"
},

nextBtn:{
backgroundColor:"#2563eb",
width:55,
height:55,
borderRadius:50,
justifyContent:"center",
alignItems:"center"
},

modalContainer:{
flex:1,
justifyContent:"flex-end",
backgroundColor:"rgba(0,0,0,0.6)"
},

modal:{
backgroundColor:"#020617",
padding:25,
borderTopLeftRadius:30,
borderTopRightRadius:30,
height:height-120
},

modalTitle:{
fontSize:22,
fontFamily:"Bold",
color:"white",
textAlign:"center",
marginBottom:20
},

modalText:{
fontSize:15,
color:"#cbd5f5",
marginBottom:12,
lineHeight:22,
fontFamily:"Regular"
},

checkRow:{
flexDirection:"row",
alignItems:"center",
marginTop:20
},

checkText:{
color:"white",
marginLeft:10,
fontSize:15
},

startBtn:{
marginTop:30,
flexDirection:"row",
alignItems:"center",
justifyContent:"space-between",
paddingVertical:15,
paddingHorizontal:25,
borderRadius:14
},

startText:{
color:"white",
fontSize:16,
fontFamily:"SemiBold"
}

});