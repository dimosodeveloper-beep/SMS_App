import React from "react";
import {
View,
Text,
StyleSheet,
ScrollView,
TouchableOpacity,
StatusBar,
Image
} from "react-native";

import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import Animated,
{
useSharedValue,
useAnimatedStyle,
withSpring,
withRepeat,
withTiming
} from "react-native-reanimated";

import Header from "../../components/Header";

export default function Home(){

const router = useRouter();

const stats = [
{ id:1,title:"Students",value:"1,245",icon:"people",route:"/all-students"},
{ id:2,title:"Teachers",value:"86",icon:"school",route:"/all-teachers"},
{ id:3,title:"Classes",value:"32",icon:"class",route:"/all-classes"},
{ id:4,title:"Subjects",value:"18",icon:"menu-book",route:"/all-subjects"},
];

const actions = [
{ id:1,title:"Add Student",icon:"user-plus",route:"/create-student"},
{ id:2,title:"Add Teacher",icon:"chalkboard-teacher",route:"/create-teacher"},
{ id:3,title:"Create Class",icon:"school",route:"/create-class"},
{ id:4,title:"View Reports",icon:"chart-bar",route:"/reports"},
];


const AnimatedCard = ({children,onPress})=>{

const scale = useSharedValue(1);
const float = useSharedValue(0);

React.useEffect(()=>{

float.value = withRepeat(
withTiming(-5,{duration:2000}),
-1,
true
);

},[]);

const animatedStyle = useAnimatedStyle(()=>{

return{
transform:[
{scale:scale.value},
{translateY:float.value}
]
};

});

return(

<Animated.View style={[styles.card,animatedStyle]}>

<TouchableOpacity
activeOpacity={0.8}
onPress={onPress}
onPressIn={()=> scale.value = withSpring(0.95)}
onPressOut={()=> scale.value = withSpring(1)}
>

{children}

</TouchableOpacity>

</Animated.View>

);

};


return(

<LinearGradient
colors={["#000000","#0d0d0d","#1a1a1a","#000000"]}
style={styles.container}
>

<StatusBar barStyle="light-content"/>

<Header
title="School Dashboard"
subtitle="Management System"
/>

<ScrollView showsVerticalScrollIndicator={false}>

<View style={styles.heroContainer}>

<Image
source={{uri:"https://images.unsplash.com/photo-1523240795612-9a054b0db644"}}
style={styles.heroImage}
/>

<View style={styles.heroOverlay}>
<Text style={styles.heroTitle}>Welcome Back</Text>
<Text style={styles.heroText}>
Manage students, teachers and classes easily with your dashboard
</Text>

<View style={styles.heroButtons}>

<TouchableOpacity
style={styles.createBtn}
onPress={()=>router.push("/create-school")}
>

<Text style={styles.btnText}>Create School</Text>

</TouchableOpacity>

<TouchableOpacity
style={styles.loginBtn}
onPress={()=>router.push("/login")}
>

<Text style={styles.btnText}>Login</Text>

</TouchableOpacity>

</View>

</View>

</View>


<View style={styles.statsContainer}>

{stats.map((item)=>(

<AnimatedCard
key={item.id}
onPress={()=>router.push(item.route)}
>

<MaterialIcons name={item.icon} size={30} color="#4A6CF7"/>

<Text style={styles.cardNumber}>{item.value}</Text>

<Text style={styles.cardTitle}>{item.title}</Text>

</AnimatedCard>

))}

</View>


<Text style={styles.sectionTitle}>Quick Actions</Text>

<View style={styles.actionsContainer}>

{actions.map((item)=>(

<TouchableOpacity
key={item.id}
style={styles.actionCard}
onPress={()=>router.push(item.route)}
>

<LinearGradient
colors={["#4A6CF7","#6A8DFF"]}
style={styles.iconBox}
>

<FontAwesome5 name={item.icon} size={16} color="#fff"/>

</LinearGradient>

<Text style={styles.actionText}>{item.title}</Text>

</TouchableOpacity>

))}

</View>


<Text style={styles.sectionTitle}>Recent Activities</Text>

<View style={styles.activityCard}>
<Text style={styles.activityText}>
New student registered in Form One.
</Text>
<Text style={styles.activityTime}>2 minutes ago</Text>
</View>

<View style={styles.activityCard}>
<Text style={styles.activityText}>
Mathematics exam results uploaded.
</Text>
<Text style={styles.activityTime}>30 minutes ago</Text>
</View>

<View style={styles.activityCard}>
<Text style={styles.activityText}>
Teacher meeting scheduled for tomorrow.
</Text>
<Text style={styles.activityTime}>1 hour ago</Text>
</View>

<View style={{height:40}}/>

</ScrollView>

</LinearGradient>

);
}



const styles = StyleSheet.create({

container:{
flex:1,
},

header:{
paddingTop:60,
paddingBottom:20,
paddingHorizontal:20,
flexDirection:"row",
alignItems:"center",
justifyContent:"space-between",
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
},

heroContainer:{
marginHorizontal:15,
marginBottom:15,
borderRadius:18,
overflow:"hidden",
borderWidth:1,
borderColor:"#2b2b2b"
},

heroImage:{
height:170,
width:"100%"
},

heroOverlay:{
position:"absolute",
bottom:0,
width:"100%",
backgroundColor:"rgba(0,0,0,0.6)",
padding:15
},

heroTitle:{
color:"#fff",
fontSize:20,
fontWeight:"bold"
},

heroText:{
color:"#ccc",
marginTop:4
},

heroButtons:{
flexDirection:"row",
marginTop:12
},

createBtn:{
backgroundColor:"#4A6CF7",
paddingVertical:8,
paddingHorizontal:14,
borderRadius:8,
marginRight:10
},

loginBtn:{
backgroundColor:"#2ecc71",
paddingVertical:8,
paddingHorizontal:14,
borderRadius:8
},

btnText:{
color:"#fff",
fontWeight:"bold"
},

statsContainer:{
flexDirection:"row",
flexWrap:"wrap",
justifyContent:"space-between",
padding:15
},

card:{
width:"47%",
backgroundColor:"#111",
borderRadius:16,
padding:20,
marginBottom:15,
alignItems:"center",
borderWidth:1,
borderColor:"#2a2a2a",
shadowColor:"#000",
shadowOpacity:0.4,
shadowRadius:8,
elevation:6
},

cardNumber:{
color:"#fff",
fontSize:24,
fontWeight:"bold",
marginTop:10
},

cardTitle:{
color:"#aaa",
marginTop:4
},

sectionTitle:{
color:"#fff",
fontSize:18,
fontWeight:"bold",
marginLeft:15,
marginBottom:10
},

actionsContainer:{
flexDirection:"row",
flexWrap:"wrap",
justifyContent:"space-between",
paddingHorizontal:15
},

actionCard:{
width:"47%",
backgroundColor:"#111",
borderRadius:16,
padding:15,
marginBottom:15,
flexDirection:"row",
alignItems:"center",
borderWidth:1,
borderColor:"#2a2a2a"
},

iconBox:{
width:38,
height:38,
borderRadius:10,
justifyContent:"center",
alignItems:"center",
marginRight:10
},

actionText:{
color:"#fff",
fontSize:14
},

activityCard:{
backgroundColor:"#111",
marginHorizontal:15,
marginBottom:12,
padding:15,
borderRadius:16,
borderWidth:1,
borderColor:"#2a2a2a"
},

activityText:{
color:"#fff",
fontSize:15
},

activityTime:{
color:"#777",
marginTop:5,
fontSize:12
}

});