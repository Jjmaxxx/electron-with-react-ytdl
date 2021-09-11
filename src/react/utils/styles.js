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
      justifyContent:"space-between",
      positon:'absolute'
    },
    playerBar:{
      // marginLeft:"auto",
      // paddingLeft:"205px"
    },
    volumeBar:{
      width:"200px",
      marginRight:"5px",
      // marginLeft:"auto"
    },
    video: {
      margin: 0,
      top: 'auto',
      right: 10,
      bottom: 143,
      left: 'auto',
      position: 'fixed',
    }
};
export default styles;