import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';


// {
//   "userId": 1,
//     "id": 1,
//       "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
//         "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
// }

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [item, setItem] = useState({})

  useEffect(() => {


    fetch("https://jsonplaceholder.typicode.com/posts/1")
      .then((result) => result.json())
      .then(result => {
        setIsLoaded(true)
        setItem(result)
      })

  })

  if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            {item.body}
          </p>
        </header>
      </div>
    );
  }

}

export default App;
