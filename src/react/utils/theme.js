import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#142850',
      light:'#27496D',
      contrastText: '#fff',
    },
    secondary: {
      main: '#00909E',
      light:'#DAE1E7',
      contrastText: '#000',
    },
  },
});
export default theme;