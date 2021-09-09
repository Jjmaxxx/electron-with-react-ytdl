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
    paper:{
      backgroundColor:"#12171d"
    }
};
export default styles;