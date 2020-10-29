import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import fetch from 'isomorphic-fetch';

export default class User extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            info: ''
        }
    }
    componentDidMount() {
        fetch(`/patient/${this.props.user}`)
            .then(res => res.json())
            .then(response => {
                
                this.setState({
                    info: response.patientData.appointments
                })
            }, err => console.log(err))
    }
    render() {
        return (
            <div>
                <div id='user-logout'>
                    <a href='/login'><Button variant='dark'>LOGOUT</Button></a>
                </div>
                <Card>
                    <Card.Body>
                        <Card.Title id='ap-title'>Your Appointment: </Card.Title>
                        <Card.Text id='ap-body'>
                            {this.state.info}
                        </Card.Text>
                    </Card.Body>
                </Card>

            </div>
        )
    }
}