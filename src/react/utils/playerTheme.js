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
      MuiCssBaseline: {
        '@global': {
          '*': {
            'scrollbar-width': 'thin',
          },
          '*::-webkit-scrollbar': {
            width: '10px',
            height: '10px',
            
          },
          '*::-webkit-scrollbar-track': {
            backgroundColor:"#00adb5"
            
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor:"#007d85",
          }
        }
      }
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