import { render, screen, fireEvent, findAllByAltText, findAllByTestId, getByTestId } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import * as React from 'react';
import Comment from '../components/Comment/Comment'

test('It should set snackbar when replied empty comment', ()=>{
    const commentdata ={
        child_comments: [],
        date: "2022-01-03T20:28:02.332Z",
        id: 72,
        parent_comment_id: 0,
        photo_url: "https://columbus-test.s3.eu-central-1.amazonaws.com/users/17/profile.jpg",
        story_id: 27,
        text: "That is what your face exactly says!!!",
        user_id: 17,
        username: "mr"
    }
    render(
        <Comment 
            comment={commentdata} 
            isPinned = {false}
            storyUsername= "john"
            profilePhoto=""
            />
        )
    const button=screen.getByLabelText("reply button");
    fireEvent.click(button);
    const commentbutton=screen.getByLabelText("comment button")
    fireEvent.click(commentbutton);
    const snackbar=screen.getByLabelText("snackbar")
    expect(snackbar.className).toBe("MuiSnackbar-root MuiSnackbar-anchorOriginBottomLeft")
    
});

test('Pinned comment should have pin icon', ()=>{
    const commentdata ={
        child_comments: [],
        date: "2022-01-03T20:28:02.332Z",
        id: 72,
        parent_comment_id: 0,
        photo_url: "https://columbus-test.s3.eu-central-1.amazonaws.com/users/17/profile.jpg",
        story_id: 27,
        text: "That is what your face exactly says!!!",
        user_id: 17,
        username: "mr"
    }
    render(
        <Comment 
            comment={commentdata} 
            isPinned = {true}
            storyUsername= "john"
            profilePhoto=""
            />
        )
    const pinicon=screen.findByTestId("PushPinIcon");
    expect(pinicon).toBeTruthy();
});