import React, { useRef, useState } from 'react';
import './App.css';
import AsciiImage from './AsciiImage';

function App() {

  const inputRef = useRef(null);
  let [asciiImage, setAsciiImage] = useState("");


  const inputChangeHandler = () => {
    let file = inputRef.current.files[0];
    let reader = new FileReader();
    reader.onload = async (event) => {

      let asciiImage = new AsciiImage(event.target.result, 700);

      let x = await asciiImage.getValue();
      setAsciiImage(x);
    }
    reader.readAsDataURL(file);

  }

  return (
    <>
      <input type="file" ref={inputRef} onChange={inputChangeHandler} />
      <pre>{asciiImage}</pre>
    </>
  );
}



export default App;
