import {typography} from 'material-ui/styles';
import {grey600} from 'material-ui/styles/colors';

const styles = {
  navigation: {
    fontSize: 15,
    fontWeight: typography.fontWeightLight,
    color: grey600,
    paddingBottom: 15,
    display: 'block'
  },
  title: {
    fontSize: 24,
    fontWeight: typography.fontWeightLight,
    marginBottom: 20
  },
  titlePage:{
    fontFamily: "sans-serif",
    fontSize: "24px",
    fontWeight: "300",
    margin: "10px 0"
  },
  paper: {
    position: "relative",
    padding: 15
  },
  clear: {
    clear: 'both'
  }
};

export default styles;
