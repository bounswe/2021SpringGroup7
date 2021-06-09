import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import api from '../../services/post'
import AddCommentIcon from '@material-ui/icons/AddComment';
import SimpleMap from '../Map/index'
import { Button, Divider, Grid, ListItemAvatar, Paper, TextField } from "@material-ui/core";

const imgLink =
  "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '90%',
        alignSelf: 'center',
        borderRadius: 10,
        margin: '5%'

    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));

export default function PostCard(props) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [isFetched, setIsFetched] = useState(false)
    const [storyData, setStoryData] = useState(null)
    const [commentValue,setCommentValue]=useState('')
    const [comments,setComments]=useState([])


    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    if (isFetched == false) {
        if(props.props){
            console.log(props.props.id)
        api.GET_POST(props.props.id).then((resp) => {
            console.log(resp)
            setStoryData(resp)


        })
        api.GET_COMMENTS(props.props.id).then((resp)=>{
            setComments([resp[0],resp[1],resp[2],resp[3],resp[4],resp[5],resp[6],resp[7],resp[8]])
        })

        setIsFetched(true)
        }
        
    }
    const handleLike=()=>{
        api.LIKE_POST({'postId':storyData.id,'username':'atainan'}).then((response)=>{
            console.log(response)
        })
    }

    const showAddComment=()=>{
        return(<Paper style={{ padding: "40px 20px", marginTop: 30 }}>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar alt='AT TA' src='' />
          </Grid>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <h4 style={{ margin: 0, textAlign: "left" }}>atainan</h4>
            <p style={{ textAlign: "left" }}>
              <TextField style={{width:'90%'}} variant='filled' value={commentValue} onChange={(e)=>setCommentValue(e.target.value)}>

              </TextField>
            </p>
            <p style={{ textAlign: "right", color: "gray" }}>
              <Button onClick={handleComment}>COMMENT</Button>
            </p>
          </Grid>
        </Grid>
      </Paper>)
    }
    const handleComment=()=>{
        let formdata = new FormData();
        formdata.append("text", commentValue)
        api.COMMENT_POST({'postId':storyData.id,'username':'atainan',comment:formdata}).then((response)=>{
            console.log(response)
        })
        setExpanded(true)
        const data={'comment':commentValue, 'username':'atainan', "date": '10 seconds ago' }
        const temp=comments
        temp.push(data)
        setComments(temp)
        setCommentValue('')
    }


    return (
        <Card className={classes.root} elevation={1}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        {storyData?storyData.owner_username.substring(0,2).toUpperCase():'?'}
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={storyData?storyData.topic:''}
                subheader={storyData?storyData.storyDate.start.substring(0,17) +' - '+ storyData.storyDate.end.substring(0,17):' '}
            />
            <CardMedia
                className={classes.media}
                image={storyData?storyData.multimedia[0]:''}
                title="Paella dish"
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {storyData?storyData.story:''}
                    <div></div>
                    {storyData?storyData.tags.map(item=>{
                        return (<a style={{marginRight:'2s%'}} href=''>  #{item}</a>)
                    }):''}
                    
        </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites" onClick={handleLike}>
                    <FavoriteIcon />
                </IconButton>
                
                <IconButton  onClick={(e)=> setExpanded(true)}>
                    <AddCommentIcon />
                </IconButton>

                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    
                    
                    <div style={{ padding: 14 }} className="App">
      <h1>Comments</h1>
      {showAddComment()}
      {comments.map((item)=>{
          if (item){
            return (<Paper style={{ padding: "40px 20px", marginTop: 100 }}>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              <Avatar alt={item.username} src='' />
            </Grid>
            <Grid justifyContent="left" item xs zeroMinWidth>
              <h4 style={{ margin: 0, textAlign: "left" }}>{item.username}</h4>
              <p style={{ textAlign: "left" }}>
               {item.comment}
              </p>
              <p style={{ textAlign: "left", color: "gray" }}>
                {item.date}
              </p>
            </Grid>
          </Grid>
        </Paper>)
          }
          
          
      })}
      
      
      
      
    </div>  
    {/* <SimpleMap></SimpleMap> */}
                </CardContent>
            </Collapse>
        </Card>
    );
}
