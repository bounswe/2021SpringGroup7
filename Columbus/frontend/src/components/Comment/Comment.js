import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Grid,
  Paper,
  TextField,
  Link,
} from "@material-ui/core";

export default function Comment(props){
    const [expandReply, setExpandReply] = useState(false);
    const [comment,setComment] = useState(null);
    const [commentValue, setCommentValue] = useState("");
    const handleComment = () => {
    
        const data = {
          text: commentValue,
          username: localStorage.getItem('username'),
          date: "10 seconds ago",
        };}
    useEffect(() => {
        setComment(props.comment);
    }, [props])
    const handleReply = () =>{
        setExpandReply(!expandReply);
    }
    const showAddComment = () => {
        return (
    
          <Paper style={{ padding: "20px 20px", marginTop: 10 }}>
            <Grid container wrap="nowrap" spacing={2}>
              <Grid item>
                <Link href="/">
                  <Avatar alt="AT TA" src="" />
                </Link>
              </Grid>
              <Grid justifyContent="left" item xs zeroMinWidth>
                <h4 style={{ margin: 0, textAlign: "left" }}>{localStorage.getItem('username')}</h4>
                <p style={{ textAlign: "left" }}>
                  <TextField
                    style={{ width: "90%" }}
                    variant="filled"
                    value={commentValue}
                    onChange={(e) => setCommentValue(e.target.value)}
                  ></TextField>
                </p>
                <p style={{ textAlign: "right", color: "gray" }}>
                  <Button onClick={handleComment}>COMMENT</Button>
                </p>
              </Grid>
            </Grid>
          </Paper>
        );
    };

    return(
        <Paper
        key={props.index}
        style={{ padding: "20px 20px", marginTop: 10 }}
      >
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar alt={props.comment.username} src="" />
          </Grid>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <h4 style={{ margin: 0, textAlign: "left" }}>
              {props.comment.username}
            </h4>
            <p style={{ textAlign: "left" }}>{props.comment.text}</p>
            <p style={{ textAlign: "left", color: "gray" }}>
              {new Date(props.comment.date).toLocaleString('tr-TR')}
            </p>
            <p style={{ textAlign: "right", color: "gray" }}>
              <Button onClick={handleReply}>REPLY</Button>
            </p>
            {expandReply? showAddComment() : null}
          </Grid>
        </Grid>
        <Grid container wrap="nowrap" spacing={2} style={{ marginLeft: '4rem' }}>
          <Grid item>
            <Avatar alt={props.comment.username} src="" />
          </Grid>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <h4 style={{ margin: 0, textAlign: "left" }}>
              {props.comment.username}
            </h4>
            <p style={{ textAlign: "left" }}>{props.comment.text}</p>
            <p style={{ textAlign: "left", color: "gray" }}>
              {new Date(props.comment.date).toLocaleString('tr-TR')}
            </p>
          </Grid>
        </Grid>
      </Paper>
      );
    }