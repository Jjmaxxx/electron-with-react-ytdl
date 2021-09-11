import { createTheme } from '@material-ui/core/styles';

const playerTheme = createTheme({
  overrides:{
    // MuiButton: {
    //     root: {

    //     }, 
    //   },
      MuiDrawer: {
        paper: {
          backgroundColor: "#000000"
        }
      }, 
  },
  palette: {
    primary: {
      main: '#007d85',
      light:'#4dadb5',
      dark:"#005058",
      contrastText: '#fff',
    },
    secondary: {
      main: '#00adb5',
      light:'#5cdfe7',
      dark:"#007d85",
      contrastText: '#EEEEEE',
    },
    background:{
      default:"#121921"
    }
  },
});
export default playerTheme;