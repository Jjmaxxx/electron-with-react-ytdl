//import { makeStyles} from "@material-ui/core";
const styles = {
    root: {
      display: 'flex',
      // backgroundColor:'black',
    },
    appBar: {
      //zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
      width: "300px",
      height:"100%",
      flexShrink: 0,
      backgroundColor:"#12171d"

    },
    drawerPaper:{
      width: "300px",
    },
    drawerTabs: {
      width: "100%",
      display:"inline-block"
    },
    drawerContainer: {
      overflow: 'auto',
    },
    content: {
      marginLeft:"180px", 
    },
    contentContainer: {
      flexGrow: 1,
      height:"100%",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection:"column",
      //padding: theme.spacing(3),
    },
    contentInputCenter:{
      display: 'flex',
      alignItems: 'center',
      flexDirection:"column",
    },
    contentCenter:{
      display:"flex",
      alignItems:'center',
    },
    break: {
      flexBasis:"100%",
      width:0
    },
    iconClicked:{
      color:"#5cdfe7"
    }, 
    playPauseButton:{
      backgroundColor:"#00adb5", 
      width:"55px", 
      height:"55px"
    },
    playPauseIcon:{
      color:"#000000", 
      marginTop:"5px"
    },
    playerBarContainer:{
      height:"110px",
      display:"flex", 
      alignItems:"center",
      // justifyContent:"space-between",
    },
    playerBar:{
      // marginLeft:"auto",
      // paddingLeft:"205px"
    },
    playPauseIconContainer:{
      display:"flex",
      justifyContent:"center",
      alignItems:"center", 
      width:"100%"
    },
    playerIcons:{
      marginTop:"5px"
    },
    timeSliderText:{
      color:"#00adb5",
      marginTop:"3px"
    },
    volumeBar:{
      width:"400px",
      marginRight:"10px",
      // marginLeft:"auto"
    },
    video: {
      margin: 0,
      top: 'auto',
      right: 10,
      bottom: 143,
      left: 'auto',
      position: 'fixed',
    },
    vidImage:{
      color:"#000000",
      marginTop:"3px"
    },
    vidInfoContainer:{
      display:"flex",
      alignItems:"center", 
      width:"400px",
      marginLeft:"5px"
    },
    vidImageContainer:{
      backgroundColor:"#00adb5", 
      width:"50px",
      height:"50px", 
      marginLeft:"18px", 
      display:"flex", 
      justifyContent:"center",
      alignItems:"center"
    }
};
export default styles;