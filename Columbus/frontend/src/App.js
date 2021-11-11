import logo from './logo.svg';
import letter from './Cletter.svg'
import './App.css';
import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import ModalDialog from './pages/Register/ModalDialog';


// {
//   "userId": 1,
//     "id": 1,
//       "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
//         "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
// }

var API_BASE = "http://ec2-35-158-103-6.eu-central-1.compute.amazonaws.com:8000/test/hello/";

if (process.env.NODE_ENV === "development") {
    API_BASE = "http://localhost:8000/test/hello/";
}

function App() {
    const [isLoaded, setIsLoaded] = useState(false)
    const [item, setItem] = useState([])
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    useEffect(() => {

        let message = '! FRONT TEAM !'
        fetch(API_BASE + message)
            .then((result) => result.json())
            .then(result => {
                setIsLoaded(true)
                setItem(result)
            })

    })

    console.log(item)
    if (!isLoaded) {
        return <div > Loading... < /div>;
    } else {
        return ( <
            div className = "App" >
            <
            header className = "App-header" >
            <
            div > < header > < /header></div >
            <
            img src = { logo }
            className = "App-logo"

            alt = "logo" / >
            <
            img src = { letter }
            className = "Letter"
            width = "300"
            height = "300"
            alt = "letter" / >
            <
            div > <
            p > { item['return'] }

            <
            /p> </div >
            <
            /
            header > <
            Button variant = "contained"
            color = "primary"
            onClick = { handleOpen } >
            Signup <
            /Button> <
            ModalDialog open = { open }
            handleClose = { handleClose }
            /> < /
            div >
        );
    }

}

export default App;