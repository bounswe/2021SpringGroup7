import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import * as React from 'react';
import EditPostDialog from '../components/Dialogs/EditPostDialog/EditPostDialog.js'

test('It should allow to change topic and text and they are required', ()=>{
    const container=render(
        <EditPostDialog 
            open={true} 
            handleClose={() => {}} 
            edit={() => {}}
            topic="mocked topic"
            story="mocked story"/>
        )
        
    const topic = container.getByDisplayValue('mocked topic');
    fireEvent.change(topic, { target: { value: 'tested' } });
    expect(topic.value).toBe('tested');
    expect(topic).toBeRequired();
    
    const story = container.getByDisplayValue('mocked story');
    fireEvent.change(story, { target: { value: 'tested' } });
    expect(story.value).toBe('tested');
    expect(story).toBeRequired();
});