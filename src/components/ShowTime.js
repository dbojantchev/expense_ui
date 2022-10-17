import React, { useEffect, useState } from 'react'
import './ShowTime.css';

function ShowTime() {

  const [time, setTime] = useState('');

  useEffect(() => {
    fetch(
        '/api/time?q=proxy',
        {headers: {
                'Content-Type': 'application/json'
            }}
        )
        .then(resp => {
        resp.json().then((data) => {
            setTime(data);
        });
    })
        .catch(err => {
          console.log('======failure=======');
          console.log(err);
        });
  }, [])

  return (
      <div className="show-time">
        The time now {time}
      </div>
  );
}

export default ShowTime;
