import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import fetch from 'isomorphic-fetch';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import './Styles.css';


export default class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            info: [],
            UpdateProp: '',
            filterUpdate: '',
            filter: '',
            newData: '',
            delId: ''
        }

        this.handleFilterUpdate = this.handleFilterUpdate.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleUpdateProp = this.handleUpdateProp.bind(this);
        this.handleDataUpdate = this.handleDataUpdate.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

    }
    // fetches patient database 
    fetchData() {
        fetch('/getPatients')
            .then(res => res.json())
            .then(response => {
                this.setState({
                    info: response.patients
                })
            }, err => console.log(err))
    }
    // handles selection of filter key 
    handleFilter(e) {
        e.preventDefault();
        this.setState({
            filter: e.target.value
        })
    }
    // handles filter value entry in update car details section
    handleFilterUpdate(e) {
        this.setState({
            filterUpdate: e.target.value
        })
    }
    // handles selection of property to be updated
    handleUpdateProp(e) {
        e.preventDefault();
        this.setState({
            UpdateProp: e.target.value
        })
    }
    // handles new data entry in update car details section
    handleDataUpdate(e) {
        e.preventDefault();
        this.setState({
            newData: e.target.value
        })
    }
    handleUpdate(e) {
        e.preventDefault();
        // if user chooses to update 1 item (first item that matches parameters)
        if (this.state.UpdateProp && this.state.filter && e.target.value === 'update1') {
            fetch('/putOne', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    filterUpdate: this.state.filterUpdate,
                    filter: this.state.filter,
                    propNew: this.state.UpdateProp,
                    propData: this.state.newData
                })
            }).then(res => res.json())
                .then(response => {
                    console.log(response);
                    alert('Patient Information Updated!');
                    this.fetchData();
                }, (error) => {
                    throw error.message;
                });
        }
    }
    // deletes the documentation of selected patient
    handleDelete(e) {
        fetch('/delete', {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: e.target.value })
        }).then(res => res.json())
            .then(response => console.log(response),
                (error) => {
                    throw error.message;
                })
        alert(`The Documents of ${e.target.value} has been Delete!`)
        this.fetchData(); // fetch data once more to show update
    }

    // fetches all patient data from database and displays it for Admin.
    // data is fetched as soon as Admin logs in (component mounts)
    componentDidMount() {
        this.fetchData();
    }

    render() {
        const patientArr = this.state.info;
        const patientList = patientArr.map(item => (
            <Card>
                <Card.Body>
                    <Card.Title id='patient-title'>{item.name} {item.surname} {item.id_number}</Card.Title>
                    <Card.Text>
                        <ul>
                            <li className='li-patient'><span>Username: </span>{item.username}</li>
                            <li className='li-patient'><span>Password: </span>{item.password}</li>
                            <li className='li-patient'><span>Name: </span>{item.name}</li>
                            <li className='li-patient'><span>Surname: </span>{item.surname}</li>
                            <li className='li-patient'><span>DOB: </span>{item.dob}</li>
                            <li className='li-patient'><span>ID Number: </span>{item.id_number}</li>
                            <li className='li-patient'><span>Medical History: </span>{item.medical_history}</li>
                            <li className='li-patient'><span>Allergens: </span>{item.allergies}</li>
                            <li className='li-patient'><span>Appointments: </span>{item.appointments}</li>
                        </ul>
                    </Card.Text>
                    <Button id='delete-boton' onClick={this.handleDelete} value={item.id_number} variant="danger">DELETE</Button>
                </Card.Body>
            </Card>
        ))
        return (
            <div id='admin-div'>
                <div id='admin-logout'>
                    <a href='/login'><Button variant='dark'>LOGOUT</Button></a>
                </div>
                <Row>
                    <div>
                        <h3 className='headings'>Update Patient Details</h3>
                        <form>
                            <Form.Label>
                                Choose Filter Key:
                                <select onClick={this.handleFilter}>
                                    <option>None</option>
                                    <option value='username'>Username</option>
                                    <option value='name'>Name</option>
                                    <option value='id_number'>ID Number</option>
                                </select>
                                <Form.Control onChange={this.handleFilterUpdate} type='text' id='model-edit' name='model-edit' placeholder='enter filter value' value={this.state.filterUpdate} required />
                            </Form.Label>
                            <br />
                            <Form.Label>
                                Choose Property to Update:
                                    <select onClick={this.handleUpdateProp}>
                                    <option>None</option>
                                    <option value='username'>UserName</option>
                                    <option value='password'>Password</option>
                                    <option value='name'>Name</option>
                                    <option value='surname'>Surname</option>
                                    <option value='dob'>DOB</option>
                                    <option value='id_number'>ID Number</option>
                                    <option value='medical_history'>Medical History</option>
                                    <option value='allergies'>Allergens</option>
                                    <option value='appointments'>Appointments</option>
                                </select>
                                <Form.Control onChange={this.handleDataUpdate} type='text' id='make-edit' name='make-edit' placeholder='enter new data' value={this.state.newData} required />
                            </Form.Label>
                            <br />
                            <Button onClick={this.handleUpdate} variant='primary' value='update1'>UPDATE</Button>
                        </form>
                    </div>
                </Row>
                <hr />
                <div>
                    <h3 id='patient-list'>Patient List</h3>
                    {patientList}
                </div>
            </div>
        )
    }
}