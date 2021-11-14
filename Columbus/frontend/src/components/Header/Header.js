import React, { useState } from "react";
import PropTypes from "prop-types";

import columbusLogo from '../../columbus-logo.svg';

import { makeStyles, styled } from "@material-ui/core/styles";
import { AppBar, Box, InputBase, Toolbar, Button, ButtonGroup, Link } from "@material-ui/core";

import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';

import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExploreIcon from "@material-ui/icons/Explore"
import HomeIcon from '@material-ui/icons/Home';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import SettingsIcon from '@material-ui/icons/Settings';
import AddBoxRoundedIcon from '@material-ui/icons/AddBoxRounded';
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
    height: 150,
    width: 150,
  },
  profilePic: {
    borderRadius: 50,
    width: 30, 
    height: 30,
  },
  navigationButtons: { 
    border: '1.5px solid' 
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
              size="large"
              aria-label="show 1 new notifications"
              color="default"  
            >
              <Badge badgeContent={1} color="error">
                <NotificationsIcon />
              </Badge>
          </IconButton>
          Notifications
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
           <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls={'primary-search-account-menu'}
              aria-haspopup="true"
              color="default"
            >
              <AccountCircle />
            </IconButton>
          Profile
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
           <IconButton
              size="large"
              aria-label="account settings"
              aria-haspopup="true"
              color="default"
            >
              <SettingsIcon />
            </IconButton>
          Settings
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
           <Button 
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
            href={`/`}
          >
        <img src={columbusLogo} className={classes.logo} alt="logo" />
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
              >
                <SearchIcon />
              </Button>
            </Tooltip>
        </Search>
        

        <Box sx={{ flexGrow: 1 }} />

        <ButtonGroup variant="text">
          <Tooltip title="Home Page" arrow>
            <Button
              variant="contained"
              size="large"
              aria-label="home page of the current user"
              color="default"
              edge="start"
              href="/"
              className={classes.navigationButtons}
            >
              <HomeIcon />
            </Button>
          </Tooltip>

          <Tooltip title="Explore" arrow>
            <Button
              variant="contained"
              size="large"
              aria-label="explore"
              color="default"
              href="/"
            >
              <ExploreIcon />
            </Button>
          </Tooltip>

          <Tooltip title="Add Story" arrow>
            <Button
              variant="contained"
              size="large"
              aria-label="explore"
              color="default"
              href="/"
            >
              <AddBoxRoundedIcon />
            </Button>
          </Tooltip>
        
          <Button 
            size="medium"
            color="default" 
            variant="contained"
            onClick={handleProfileMenuOpen}
            >
               
              <Badge badgeContent={1} color="error">
                <Tooltip title="Salih Yılmaz" arrow>
                  <Avatar sx={{ width: 25, height: 25 }}>S</Avatar>
                </Tooltip>
              </Badge>

              <IconButton
              size="small"
              aria-label="account of current user"
              aria-controls={'primary-search-account-menu'}
              aria-haspopup="true"
              color="default"
            >
              <KeyboardArrowDownIcon />
            </IconButton>  
         </Button>
        </ButtonGroup>

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
