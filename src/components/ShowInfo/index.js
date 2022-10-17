import React, { useEffect, useState } from 'react'
import './styles.css';

function ShowInfo() {

  const [info, setInfo] = useState('')

    useEffect(() => {
        fetch(
            '/api/nasa?q=proxy',
            {headers: {
                    'Content-Type': 'application/json'
                }}
        )
            .then(resp => {
                resp.json().then((data) => {
                    setInfo(data);
                });
            })
            .catch(err => {
                console.log('======failure=======');
                console.log(err);
            });
    }, [])

  return (
    <>
      <div className="info-section">
        The info it {info}
      </div>
    </>
  );
}

export default ShowInfo;
