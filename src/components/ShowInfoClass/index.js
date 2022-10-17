import React from 'react'
import './styles.css';

class ShowInfoClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            info: ''
        };
    }

    componentDidMount() {

        fetch(
            '/api/nasa?q=proxy',
            {headers: {
                    'Content-Type': 'application/json'
                }}
        )
        .then(resp => {
            resp.json().then((data) => {
                this.setState({
                    info: data,
                });
            });
        })
        .catch(err => {
            console.log('======failure=======');
            console.log(err);
        });
    }

    render() {
        const { info } = this.state;
        return (
            <div className="info-section">
                The info is {info}
            </div>
        )
    }
}

export default ShowInfoClass;