import React, { useState } from "react";
import PropTypes from "prop-types";

import columbusLogo from '../../assets/Columbus.svg';

import { makeStyles, styled } from "@material-ui/core/styles";
import { AppBar, Box, InputBase, Toolbar, Button, ButtonGroup, Link, Typography } from "@material-ui/core";

import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExploreIcon from "@material-ui/icons/Explore"
import HomeIcon from '@material-ui/icons/Home';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import SettingsIcon from '@material-ui/icons/Settings';
import AddBoxRoundedIcon from '@material-ui/icons/AddBoxRounded';
import Person from '@material-ui/icons/Person';
import LocationOnIcon from '@material-ui/icons/LocationOn';


/*********************************************************** 
  Reference : https://mui.com/components/app-bar/
************************************************************/
const Search = styled('div')(({ theme }) => ({
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

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1.5),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
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

/************************************************************/

const useStyles = makeStyles((theme) => ({
  appbar: {
    position:'static',
    backgroundColor: 'white'
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
    border: '1.5px solid' 
  },
  button: {
    //backgroundColor:"#0060a0",
    //color:"white"
  },
  avatar: {
    backgroundColor:"#0071bc",
    color:"black"
  }
}));

export default function Header(props) {
  const classes = useStyles();
  //const { sections, title } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    
    //handleMobileMenuClose();
  };

  const handleLogOut = () => {
    setAnchorEl(null);
    localStorage.removeItem("jwtToken");
  };
const menuId = 'primary-search-account-menu';

const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
         <IconButton
              size="small"
              aria-label="show 1 new notifications"
              color="default"  
            >
              <Badge badgeContent={0} color="error">
                <NotificationsIcon />
              </Badge>
          </IconButton>
          Notifications
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
           <IconButton
              size="small"
              aria-label="account of current user"
              aria-controls={'primary-search-account-menu'}
              aria-haspopup="true"
              className={classes.button}
            >
              <AccountCircle />
            </IconButton>
          Profile
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
           <IconButton
              size="small"
              aria-label="account settings"
              aria-haspopup="true"
              color="default"
            >
              <SettingsIcon />
            </IconButton>
          Settings
      </MenuItem>
      <MenuItem onClick={handleLogOut}>
           <Button 
            className={classes.button}
            variant="contained"
            color="default"
            href="/"
            >
            Logout
          </Button>
        </MenuItem>
    </Menu>
  );

  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 1 }}>
      <AppBar className={classes.appbar}>
      
      <Toolbar className={classes.toolbar}>
        
        <Link
            href={`/Home`}
          >
            <Button>
              <img src={columbusLogo} className={classes.logo} alt="logo" />
            </Button>
        
        </Link>

         <Search>
            <SearchIconWrapper>
              <LocationOnIcon
                color="action"
              />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search Location Stories…"
              inputProps={{ 'aria-label': 'search' }}
            />
            <Tooltip title="Search" arrow>
              <Button
                variant="contained"
                disableElevation
                className={classes.button}
              >
                <SearchIcon />
              </Button>
            </Tooltip>
        </Search>
        

        <Box sx={{ flexGrow: 1 }} />
        {localStorage.getItem('jwtToken') ?
        (<Stack direction="row" spacing={1}>
          <Tooltip title="Explore" arrow>
            <Button
              className={classes.button}
              variant="contained"
              size="small"
              aria-label="explore"
              href="/"
              startIcon={<ExploreIcon />}>
              Explore
            </Button>
          </Tooltip>

          <Tooltip title="Add Story" arrow>
            <Button
              className={classes.button}
              variant="contained"
              size="small"
              aria-label="explore"            
              href="/"
              startIcon={<AddBoxRoundedIcon />}
            >
              Share
            </Button>
          </Tooltip>
        
          <Button 
            className={classes.button}
            size="small"
            color="default" 
            variant="contained"
            onClick={handleProfileMenuOpen}
            startIcon={ <Badge badgeContent={0} >
                              <Avatar sx={{ width: 30, height:30 }} classname={classes.avatar}>{localStorage.getItem('username').substring(0,2)}</Avatar>
                        </Badge>}
             style={{textTransform: 'none'}} 
            >
              
              <Typography>{localStorage.getItem('username')}</Typography>
              <IconButton
              className={classes.button}
              size="small"
              aria-label="account of current user"
              aria-controls={'primary-search-account-menu'}
              aria-haspopup="true"
            >
              <KeyboardArrowDownIcon className={classes.button}/>
            </IconButton>  
          </Button> </Stack>) : 
          
          <Tooltip title="Register" arrow>
            <Button
              className={classes.button}
              variant="contained"
              size="small"
              aria-label="explore"            
              href="/login"
              startIcon={<Person/>}
            >
              Sign In
            </Button>
          </Tooltip>}
          
        </Toolbar>

      
      <Toolbar
        component="nav"
        variant="dense"
        className={classes.toolbarSecondary}
      >
      </Toolbar>
      </AppBar>
      {renderMenu}
      </Box>
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.array,
  title: PropTypes.string,
};
