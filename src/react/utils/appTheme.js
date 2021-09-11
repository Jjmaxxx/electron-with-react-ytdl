import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  overrides:{
    MuiOutlinedInput: {
      root: {
        "& $notchedOutline": {
          borderColor: "#62676f"
        },
        "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
          borderColor: "#62676f"
        },
        "& .MuiSvgIcon-root": {
          color: "#62676f",
        }
      }
    },
    MuiInputBase :{
      input:{
        color:"#00adb5",
      }
    },
    MuiInputLabel: {
      root: {
        color:"#007d85"
      }
    },
    MuiInput: {
      underline: {
        "&:before": {
          borderBottomColor:"#62676f"
        },
        '&:hover:not($disabled):before': {
          borderBottomColor:"#62676f"
        },
      }
    },
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
export default theme;