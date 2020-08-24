import React, { useRef, useState } from 'react';
import './App.css'
import AsciiImage from './utils/AsciiImage';
import NavBar from './components/NavBar'

function App() {

  const fileRef = useRef(null);
  let [asciiImage, setAsciiImage] = useState("");
  let [width, setWidth] = useState('100');
  let [fileName, setFilename] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const file = fileRef.current.files[0];
    if(!file || width<100 || width>500){
      return
    }
    let reader = new FileReader();
    reader.onload = async (event) => {

      let asciiImage = new AsciiImage(event.target.result, parseInt(width));

      let x = await asciiImage.getValue();
      setAsciiImage(x);
    }
    reader.readAsDataURL(file);
  }

  const handleFileInputChange = (event) => {
    if (event.target.files[0]) {
      const fileName = event.target.files[0].name;
      setFilename(fileName);
    }
  }

  return (
    <>
      <NavBar />
      <main className="body">
        {!asciiImage ?
          <form onSubmit={handleFormSubmit} className="form">

            <p align="center">This is a webapp created to convert images into ascii images.Just upload your file, specify the maximum width and click submit button to see your ascii image</p>

            <div className="file-input-wrapper">
              <button className="btn-file-input">{fileName ? fileName : 'Upload File'}</button>
              <input type="file" ref={fileRef} accept="image/*" onChange={handleFileInputChange} />
            </div>
            <label align="center" className="width-label">Maximum Width (100-500)<br />
              <input type="text" value={width} onChange={e => setWidth(e.target.value)} />
            </label>

            <button type="submit" className="submit">Submit</button>
          </form>
          :
          <div className="result-div">
            <button className="back-btn" onClick={()=>{setAsciiImage('');setFilename('');}}>Back</button>
            <div className="pre-wrapper">
              <pre style={{fontSize:getFontSize(parseInt(width))}}>{asciiImage}</pre>
            </div>
          </div>
        }
      </main>

    </>
  );
}


const getFontSize=(width)=>{
  if(width<=500 && width >400){
    return '2px';
  }
  else{
    return '.5rem';
  }
}


export default App;
