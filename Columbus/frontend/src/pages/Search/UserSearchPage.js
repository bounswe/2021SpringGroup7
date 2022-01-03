import * as React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import GoogleMapsWithClustering from "../../components/GoogleMaps/GoogleMapsWithClustering";
import Post from "../../components/Post/Post";
import Wrapper from "../../components/Wrapper";
import USER_SERVICE from "../../services/user";
import { Stack } from "@mui/material";
import SearchIcon from "@material-ui/icons/Search";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import Button from "@material-ui/core/Button";

import TextField from "@material-ui/core/TextField";

import MenuItem from "@material-ui/core/MenuItem";
import { Paper, Select, makeStyles, CircularProgress} from "@material-ui/core";
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, ListItemButton} from "@mui/material"

const filterSectionRowStyle = {
  "margin-left": "5%",
  "margin-right": "5%",
  "margin-top": "2%",
  "margin-bottom": "2px",
};

const filterSectionColStyle = {
  background: "#FFFFFF",
  "padding-bottom": "10px"
};
const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#FFFFF"
  }
}));

export default function UserSearchPage() {
  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate()
  const [users, setUsers] = React.useState(null);
  const searchText = searchParams.get("searchText") ? searchParams.get("searchText") : "";


  React.useEffect(() => {
    USER_SERVICE.SEARCH_USER(searchText.replace("@", "")).then((response) => {
        setUsers(response.data.return)
    });
  }, []);
  
  return (
    <Wrapper searchValue={searchText}>
      <Paper className={useStyles.root} elevation={4} square>
          <Typography>Users</Typography>
          {users ? 
             users.length === 0 ?
             <Typography>Could not find any user...</Typography>
             :
             <List>
            {users.map(user => 
                <ListItem alignItems="flex-start" on>
                    <ListItemButton
                     onClick={(e) => navigate('/Profile/' + user.user_id)}
                    >
                    <ListItemAvatar>
                        <Avatar alt={user.username} src={user.photo_url} />
                    </ListItemAvatar>
                    <ListItemText
                    primary={user.username}
                    secondary={
                        <React.Fragment>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                            {user.first_name + " " + user.last_name}
                        </Typography>
                        </React.Fragment>
                    }/>
                    </ListItemButton>
                </ListItem>
              )
            }
      
          </List> : <><CircularProgress>Loading</CircularProgress></>
          }
      </Paper>
    </Wrapper>
  );
}
