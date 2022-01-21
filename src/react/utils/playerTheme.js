import { createTheme } from '@mui/material/styles';

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
      MuiDialog:{
        root:{
          backgroundColor:"#00adb5",
        },
        BackdropProps:{
          backgroundColor:"#00adb5",
        },
        PaperProps:{
          backgroundColor:"#00adb5",
        }
      },
      MuiCssBaseline: {
        '@global': {
          '*': {
            'scrollbar-width': 'thin',
          },
          // '& .MuiDialogContent-root': {
          //   backgroundColor:"#00adb5"
          // },
          // '& .MuiDialogActions-root': {
          //   backgroundColor:"#00adb5"
          // },
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