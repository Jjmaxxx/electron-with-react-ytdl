import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  overrides:{
    MuiOutlinedInput: {
      root: {
        "& $notchedOutline": {
          borderColor: "purple"
        },
        "&$focused $notchedOutline": {
          borderColor: "orange"
        },
        color: "green"
      },
      notchedOutline: {}
    },
    MuiInput :{
      "& $Standard":{
        borderColor: "purple"
      }
    }
  },
  palette: {
    primary: {
      main: '#383d44',
      light:'#62676f',
      dark:"#12171d",
      contrastText: '#fff',
    },
    secondary: {
      main: '#00adb5',
      light:'#5cdfe7',
      dark:"#007d85",
      contrastText: '#EEEEEE',
    },
    background:{
      default:"#383d44"
    }
  },
});
export default theme;