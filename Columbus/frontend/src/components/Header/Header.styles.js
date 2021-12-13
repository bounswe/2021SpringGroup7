import { makeStyles, styled } from "@material-ui/core/styles";
import InputBase from '@mui/material/InputBase';

export const useStyles = makeStyles((theme) => ({
  appbar: {
    position:'static',
    backgroundColor: 'white',
  },
  toolbar: {
    borderBottom: `2px solid ${theme.palette.divider}`,
  },
  toolbarTitle: {
    flex: 1,
    color: 'black',
  },
  toolbarSecondary: {
    overflowX: "auto",
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
  logo: {
    padding: 10,
    height: 90,
    width: 130,
  },
  profilePic: {
    borderRadius: 50,
    width: 30, 
    height: 30,
  },
  navigationButtons: { 
    border: '1.5px solid' ,
  },
  button: {
    //backgroundColor:"#0060a0",
    //color:"white"
  },
  avatar: {
    backgroundColor:"#0071bc",
    color:"black",
  }
})
);

/*********************************************************** 
  Reference : https://mui.com/components/app-bar/
************************************************************/
export const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor:"#e6e5dc",
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(5),
    width: 'auto',
  },
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1.5),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'default',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 5),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(5)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
    fontSize: 15,
  },
}));