import React, { useState } from 'react';

function CsvFileUpload() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [file, setFile] = useState('');
  const [data, getFile] = useState([]);

  // const [file, setFile] = useState(''); // storing the uploaded file
  // storing the recived file from backend
  // const el = useRef(); // accesing input element

  const handleChange = (e) => {
    const file = e.target.files[0]; // accesing file
    // console.log(file);
    setFile(file); // storing file
  }

  const csvFileHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('csvfile', file);
    // formData.append('content', fileData.content);
    // formData.append('csvfile', fileData.csvfile);
    let url = 'http://localhost:8080/calendar/postcsv';
    let method = 'POST';

    fetch(url, {
      method: method,
      body: formData
    })
    .then(res => {
      if (res.status !== 200) {
        throw new Error('Uploading file failed!')
      }
      return res.json();
    })
    .then(resData => {
      console.log(resData)
      getFile(resData)
    })
    .catch(err => console.log(err))
  }

  const displayData = data.map(item => {
    const index = item.CRN
    return (
      <ul key={index} className="data-item">
        <li>{item["Building and Room"]}</li>
        <li>{item.CRN}</li>
        <li>{item.Course}</li>
        <li>{item["Course Title"]}</li>
        <li>{item["Credit Hrs Min"]}</li>
        <li>{item.Instructor}</li>
        <li>{item["Maximum Enrollment"]}</li>
        <li>{item["Meeting Pattern"]}</li>
        <li>{item["Part of Term"]}</li>
        <li>{item["Schedule Type"]}</li>
        <li>{item.Section}</li>
        <li>{item.Term}</li>
        <li>{item.Title}</li>
      </ul>
    )
  })
  // console.log(data[0])
  return (
      <div style={{marginTop: '50px', display: 'flex', flexDirection: 'column'}}>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
              <input
                type="file"
                name="csvfile"
                id="csvfile"
                onChange={handleChange}
                style={{
                  width: '200px',
                  height: '30px'
                }}
              />

              <button
                type="submit"
                onClick={csvFileHandler}
                style={{
                  border: 'none',
                  background: '#2767e9',
                  color: 'white',
                  width: '100px',
                  height: '30px',
                  cursor: 'pointer'
                }}
              >Get Data</button>
          </div>

          {displayData ? displayData : null}
      </div>
  );
}

export default CsvFileUpload;