import React, { useState } from "react";
import Wrapper from "../../components/Wrapper"
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { Container } from "@material-ui/core";
import { Switch, Toolbar, Typography, Link, Button } from "@material-ui/core"
import PostCard from '../../components/Post'
import api from '../../services/post'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import CreatePostDialog from '../../components/CreatePost/index'
const useStyles = makeStyles((theme) => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  name: {
    flex: 4,

  },
  toolbarSecondary: {
    justifyContent: "flex-end",
    overflowX: "auto",
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
}));

function Profile() {
  const classes = useStyles
  const [isFetched, setIsFetched] = useState(false)
  const [posts, setPosts] = useState([])
  const [name, setName] = useState('')
  const [nofFollowers, setNofFollowers] = useState(0)
  const [nofFollowing, setNofFollowing] = useState(0)
  const [OpenDialogFollowing, setOpenDialogFollowing] = React.useState(false);
  const [OpenDialogFollower, setOpenDialogFollower] = React.useState(false);
  const [username, setUsername] = useState('')
  const [following, setFollowing] = useState([])
  const [follower, setFollower] = useState([])
  const [postIds,setPostIds]=useState([])


  const handleClickOpenDialogFollowing = () => {
    setOpenDialogFollowing(true);
  };
  const handleClickOpenDialogFollower = () => {
    setOpenDialogFollower(true);
  };

  const handleCloseDialogFollowing = (value) => {
    setOpenDialogFollowing(false);

  };
  const handleCloseDialogFollower = (value) => {
    setOpenDialogFollower(false);

  };

  // const getFollowing=()=>{
  //   console.log('here')https://mediaim.expedia.com/destination/1/89db3ef5edce6577db2504603c8a383d.jpg?impolicy=fcrop&w=536&h=384&q=highcre
  //   if (username==''){
  //     return <div></div>
  //   }
  //   var result=[]
  //   api.GET_FOLLOWING(username).then(data=>{
  //     console.log(data.data)
  //     result=[data['0']]
  //   })
  //   return result


  //     }
  if (isFetched == false) {
    api.GET_PROFILE().then((resp) => {
      console.log(resp)

      setUsername(resp.username)
      setPosts(resp.posts)
      setName(resp.first_name + ' ' + resp.last_name)
      setNofFollowers(resp.nofFollowers)
      setNofFollowing(resp.nofFollowings)
      setFollowing(resp.followings)
      setFollower(resp.followers)
      setPostIds(resp.postIds)
    })

    setIsFetched(true)
  }

  return <div>
    <Wrapper>
      <Paper elevation={3} style={{ width: '100%', minHeight: 1090, padding: '4%', borderRadius: 10 ,marginBottom:40}}>
        <Container style={{ display: 'flex', flexDirection: 'row' }}>

          <Avatar alt="Remy Sharp" src="https://i.internethaber.com/storage/files/images/2019/05/08/avatar-2-3-ve-4un-vizyon-tarihle-lna9_cover.jpg" elevation={10} style={{
            width: 100,
            height: 100,
            marginLeft:50


          }} />

          <div>
            <Typography
              component="h2"
              variant="h3"

              color="inherit"
              align="center"
              noWrap
              className={classes.toolbarTitle}
              gutterBottom
            >
              {name}
            </Typography>
           

            <Container style={{ display: 'flex', flexDirection: 'row', }}>
              <p onClick={handleClickOpenDialogFollowing}  style={{ margin: 20, fontSize: 30 }}>Following: {nofFollowing}</p>
              <Dialog open={OpenDialogFollowing} onClose={handleCloseDialogFollowing} style={{minWidth:300,borderRadius:10}}  aria-labelledby="simple-dialog-title">
                <DialogTitle id="simple-dialog-title" style={{minWidth:300,textAlign:'center'}}>Followings</DialogTitle>
                {following.map(item => {
                  return (
                    <Container style={{ display: 'flex', flexDirection: 'row', padding:'4%',textAlign:'center'}}>
                      <Avatar alt='r b' src="" elevation={10} style={{
                        width: 40,
                        height: 40,
                        
                        marginRight:'4%',

                      }} >{item.substring(0,2).toUpperCase()}</Avatar>
                      <h3 style={{margin:0,marginTop:'3%'}}>{item}</h3>
                      
                      </Container>)
                })
                }
                {/* {getFollowing()} */}
              </Dialog>
              <p style={{ margin: 20, fontSize: 30 }} onClick={handleClickOpenDialogFollower}>Followers: {nofFollowers}</p>
              <Dialog open={OpenDialogFollower} onClose={handleCloseDialogFollower} style={{minWidth:300,borderRadius:10}}  >
                <DialogTitle id="simple-dialog-title" style={{minWidth:300,textAlign:'center'}}>Followings</DialogTitle>
                {follower.map(item => {
                  return (
                    <Container style={{ display: 'flex', flexDirection: 'row', padding:'4%',textAlign:'center'}}>
                      <Avatar alt='r b' src="" elevation={10} style={{
                        width: 40,
                        height: 40,
                        
                        marginRight:'4%',

                      }} >{item.substring(0,2).toUpperCase()}</Avatar>
                      <h3 style={{margin:0,marginTop:'3%'}}>{item}</h3>
                      
                      </Container>)
                })
                }
                {/* {getFollowing()} */}
              </Dialog>
            </Container>
            

          </div>
          
        </Container>
       <CreatePostDialog></CreatePostDialog>
          {postIds.map((item)=>{
            return(<PostCard props={{'id':item}}></PostCard>)
          })}
        
      </Paper>
    </Wrapper></div>;
}

export default Profile;
