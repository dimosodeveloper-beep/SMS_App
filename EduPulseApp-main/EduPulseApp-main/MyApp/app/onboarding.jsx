import { useRouter } from 'expo-router';
import {
StyleSheet,
Platform,
ImageBackground,
Text,
ScrollView,
View,
Image,
FlatList,
TouchableOpacity,
Modal,
Dimensions
} from 'react-native';

import {Ionicons,AntDesign} from '@expo/vector-icons';

import React,{useState,useEffect} from 'react';

import {LinearGradient} from 'expo-linear-gradient';
import Checkbox from 'expo-checkbox';
import {useFonts} from 'expo-font';

const {width,height} = Dimensions.get('window');

const OnboardingScreen = () => {

const router = useRouter();

let [fontsLoaded] = useFonts({
'Bold': require('../assets/fonts/Poppins-Bold.ttf'),
'Medium': require('../assets/fonts/Poppins-Medium.ttf'),
'SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
'Regular': require('../assets/fonts/Poppins-Regular.ttf'),
});

const [showImage,setShowImage] = useState(true);
const [modalVisible,setModalVisible] = useState(false);
const [isChecked,setChecked] = useState(false);

useEffect(()=>{
const interval = setInterval(()=>{
setShowImage(prev=>!prev);
},5000);

return ()=>clearInterval(interval);

},[]);

const [onboardings] = useState([

{
Title:'Smart School Management',
Description:'Manage your entire school operations from one powerful platform. Control students, teachers, classes, and academic records with ease. This system helps schools operate faster, smarter, and more efficiently in the digital age.',
OnboardingImage:{uri:'https://images.unsplash.com/photo-1588072432836-e10032774350'},
id:'1'
},

{
Title:'Student & Teacher Management',
Description:'Register students and teachers easily, organize classes and streams, and keep accurate academic records. Everything is centralized so administrators and teachers can focus on delivering quality education.',
OnboardingImage:{uri:'https://images.unsplash.com/photo-1509062522246-3755977927d7'},
id:'2'
},

{
Title:'Results, Attendance & Reports',
Description:'Track attendance, manage exams, generate rankings, and produce professional report cards automatically. Parents can also monitor their child’s progress through the system anytime.',
OnboardingImage:{uri:'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f'},
id:'3'
}

]);

const Slide = ({item}) => {

return(

<View style={styles.slideContainer}>

<ImageBackground
source={item?.OnboardingImage}
style={styles.image}
resizeMode="cover"
>

<LinearGradient
colors={['rgba(0,0,0,0.1)','rgba(0,0,0,0.4)','rgba(0,0,0,0.85)']}
style={styles.gradient}
>

<View style={styles.textCard}>

<Text style={styles.title1}>{item?.Title}</Text>

<Text style={styles.title}>
{item?.Description}
</Text>

</View>

</LinearGradient>

</ImageBackground>

</View>

);

};

const [currentSlideIndex,setCurrentSlideIndex] = useState(0);
const ref = React.useRef();

const updateCurrentSlideIndex = e => {

const contentOffsetX = e.nativeEvent.contentOffset.x;
const currentIndex = Math.round(contentOffsetX / width);

setCurrentSlideIndex(currentIndex);

if(currentIndex === onboardings.length - 1){
setTimeout(()=>setModalVisible(true),500);
}

};

const Footer = () => {

return(

<View style={styles.footer}>

<View style={styles.indicatorContainer}>

{onboardings.map((_,index)=>(

<View
key={index}
style={[
styles.indicator,
currentSlideIndex == index && styles.activeIndicator
]}
/>

))}

</View>

{currentSlideIndex == onboardings.length - 1 && (

<TouchableOpacity
style={styles.getstarted2}
onPress={()=>setModalVisible(true)}
>

<Ionicons
name="arrow-up-circle"
size={60}
color="#00e5ff"
/>

</TouchableOpacity>

)}

</View>

);

};

return(

<>

{!fontsLoaded ? (<View/>) : (

<LinearGradient
colors={['#021B1F','#000']}
style={{flex:1}}
>

<FlatList
keyExtractor={item=>item.id}
ref={ref}
onMomentumScrollEnd={updateCurrentSlideIndex}
showsHorizontalScrollIndicator={false}
horizontal
data={onboardings}
pagingEnabled
renderItem={({item})=><Slide item={item}/>}
/>

<Footer/>

<Modal
visible={modalVisible}
transparent
animationType="slide"
onRequestClose={()=>setModalVisible(false)}
>

<View style={styles.modalContainer}>

<View style={styles.modalContent}>

<TouchableOpacity
onPress={()=>setModalVisible(false)}
style={{alignSelf:'flex-end'}}
>

<AntDesign
name="closecircle"
size={28}
color="#ff4d4d"
/>

</TouchableOpacity>

<Text style={styles.modalTitle}>
School Management System – Terms & Conditions
</Text>

<ScrollView>

<Text style={styles.modalText2}>

Welcome to the School Management System platform.

By using this application you agree to use it responsibly for educational and administrative purposes within your institution.

</Text>

<Text style={styles.modalText2}>

All information entered into the system including student records, exam results, attendance and school data must be accurate and used according to school policies.

</Text>

<Text style={styles.modalText2}>

The system protects your data and ensures that each school can only access its own information. Unauthorized access or misuse of the system may lead to suspension of your account.

</Text>

<Text style={styles.modalText2}>

By continuing to use this application, you accept these terms and agree to follow the policies of your institution.

</Text>

</ScrollView>

<View style={styles.checkboxContainer}>

<Checkbox
style={styles.checkbox}
value={isChecked}
onValueChange={setChecked}
color={isChecked ? '#00e5ff' : undefined}
/>

<Text style={{marginLeft:10,color:'white'}}>
I understand and agree
</Text>

</View>

{isChecked && (

<TouchableOpacity
onPress={()=>router.replace("/login")}
style={styles.getstarted}
>

<Text style={{color:'white',fontSize:16}}>
GET STARTED
</Text>

<Ionicons
name="arrow-forward-circle"
size={24}
color="white"
/>

</TouchableOpacity>

)}

</View>

</View>

</Modal>

</LinearGradient>

)}

</>

);

};

export default OnboardingScreen;

const styles = StyleSheet.create({

slideContainer:{
width:width,
height:height,
},

image:{
width:width,
height:height,
justifyContent:'flex-end'
},

gradient:{
flex:1,
justifyContent:'flex-end'
},

textCard:{
padding:25,
paddingBottom:60,
},

title1:{
color:'white',
fontSize:28,
fontFamily:'Bold',
marginBottom:10
},

title:{
color:'#e0e0e0',
fontSize:16,
lineHeight:24,
fontFamily:'Regular'
},

footer:{
position:'absolute',
bottom:40,
width:width
},

indicatorContainer:{
flexDirection:'row',
justifyContent:'center',
alignItems:'center'
},

indicator:{
height:10,
width:10,
backgroundColor:'#666',
marginHorizontal:6,
borderRadius:10
},

activeIndicator:{
backgroundColor:'#00e5ff',
width:18,
height:18
},

getstarted2:{
position:'absolute',
right:25,
bottom:-10
},

modalContainer:{
flex:1,
justifyContent:'flex-end'
},

modalContent:{
backgroundColor:'#021B1F',
padding:20,
borderTopLeftRadius:30,
borderTopRightRadius:30,
height:height - 60
},

modalTitle:{
fontSize:20,
fontFamily:'Bold',
marginTop:10,
textAlign:'center',
color:'white'
},

modalText2:{
fontSize:15,
marginTop:12,
color:'#d6d6d6',
fontFamily:'Regular',
lineHeight:22
},

checkboxContainer:{
flexDirection:'row',
marginTop:25,
alignItems:'center',
alignSelf:'center'
},

checkbox:{
height:26,
width:26,
borderColor:'white'
},

getstarted:{
marginTop:35,
backgroundColor:'#00a8c5',
flexDirection:'row',
justifyContent:'space-between',
alignItems:'center',
alignSelf:'center',
paddingHorizontal:30,
paddingVertical:14,
borderRadius:12
}

});