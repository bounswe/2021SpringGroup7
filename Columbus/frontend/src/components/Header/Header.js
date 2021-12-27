import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
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
import Divider from '@mui/material/Divider';

import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExploreIcon from "@material-ui/icons/Explore"

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import SettingsIcon from '@material-ui/icons/Settings';
import AddBoxRoundedIcon from '@material-ui/icons/AddBoxRounded';
import Person from '@material-ui/icons/Person';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import {useStyles, Search, SearchIconWrapper, StyledInputBase} from "./Header.styles"
import {API_INSTANCE} from '../../config/api';
import NotificationMenu from '../Notifications/NotificationMenu'

export default function Header(props) {
  const classes = useStyles();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(null);
  const isNotificationMenuOpen = Boolean(isNotificationsOpen);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationsOpen = (event) => {
    setIsNotificationsOpen(event.currentTarget);
  }
  const handleLogOut = () => {
    setAnchorEl(null);
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userid");
    API_INSTANCE.defaults.headers.common['Authorization'] = null;
  };




const renderMenu = (
    <Menu
      elevation={5}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={'primary-search-account-menu'}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
           <Button
              size="small"
              aria-label="account of current user"
              aria-controls={'primary-search-account-menu'}
              aria-haspopup="true"
              className={classes.button}
              href="/Profile"
              startIcon={<AccountCircle />}
            >
              Profile
            </Button>
          
      </MenuItem>
      <Divider></Divider>
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
                    (<>
                    <Stack direction="row" spacing={1}>
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
                          aria-label="share-story"
                          color="default"
                          onClick={() => navigate("/Home/Story/Create")}
                          startIcon={<AddBoxRoundedIcon />}
                        >
                          Share
                        </Button>
                      </Tooltip>

                      <Tooltip title="Notifications" arrow>
                        <Button
                          variant="contained"
                          size="small"
                          aria-label="notifications"
                          color="default"
                          onClick={handleNotificationsOpen}
                        >
                          <Badge badgeContent={1} color="error" variant="dot">
                            <NotificationsIcon />
                          </Badge>
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
                      </Button>
                      </Stack> </>) 
                      : 
          
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
                      </Tooltip>
                      }
        </Toolbar>

      
      <Toolbar
        component="nav"
        variant="dense"
        className={classes.toolbarSecondary}
      >
      </Toolbar>
      </AppBar>
      {renderMenu}
      <NotificationMenu 
          isNotificationsOpen={isNotificationsOpen} 
          setIsNotificationsOpen={setIsNotificationsOpen} 
          isNotificationMenuOpen={isNotificationMenuOpen}
        />
      </Box>

    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.array,
  title: PropTypes.string,
};
