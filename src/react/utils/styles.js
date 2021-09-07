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
      backgroundColor:'black'
    },
    drawerPaper:{
      width: "300px",
      backgroundColor:'black'
    },
    drawerTabs: {
      width: "100%",
      display:"inline-block"
    },
    drawerContainer: {
      overflow: 'auto',
    },
    content: {
      flexGrow: 1,
      height:"100%",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:"black",
      flexDirection:"column",
      //padding: theme.spacing(3),
    },
    break: {
      flexBasis:"100%",
      width:0
    }
};
export default styles;