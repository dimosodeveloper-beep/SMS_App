import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

export default StyleSheet.create({

  container:{
    flex:1,
    justifyContent:"center"
  },

  bg:{
    position:"absolute",
    width:"100%",
    height:height,
    opacity:0.25
  },

  blur:{
    flex:1,
    justifyContent:"center",
    padding:25
  },

  title:{
    fontSize:40,
    fontWeight:"bold",
    color:"#fff",
    textAlign:"center"
  },

  subtitle:{
    textAlign:"center",
    color:"#cbd5f5",
    marginBottom:40
  },

  form:{
    backgroundColor:"rgba(255,255,255,0.06)",
    padding:25,
    borderRadius:20,
    borderWidth:1,
    borderColor:"rgba(255,255,255,0.1)"
  },

  label:{
    color:"#cbd5f5",
    marginBottom:6
  },

  input:{
    backgroundColor:"rgba(255,255,255,0.08)",
    padding:15,
    borderRadius:12,
    marginBottom:15,
    color:"#fff"
  },

  passwordBox:{
    flexDirection:"row",
    alignItems:"center",
    backgroundColor:"rgba(255,255,255,0.08)",
    borderRadius:12,
    paddingHorizontal:15,
    marginBottom:20
  },

  passwordInput:{
    flex:1,
    paddingVertical:15,
    color:"#fff"
  },

  button:{
    padding:16,
    borderRadius:12,
    alignItems:"center"
  },

  buttonText:{
    color:"#fff",
    fontWeight:"bold",
    fontSize:16
  },

  bioButton:{
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    marginTop:20
  },

  bioText:{
    color:"#38bdf8",
    marginLeft:8
  },

  link:{
    textAlign:"center",
    marginTop:20,
    color:"#38bdf8",
    fontWeight:"600"
  },

  loader:{
    position:"absolute",
    top:0,
    bottom:0,
    left:0,
    right:0,
    backgroundColor:"rgba(0,0,0,0.6)",
    justifyContent:"center",
    alignItems:"center"
  },

  loaderCard:{
    backgroundColor:"#fff",
    padding:30,
    borderRadius:18,
    alignItems:"center",
    width:220
  },

  loadingText:{
    marginTop:12,
    fontWeight:"600"
  }

});