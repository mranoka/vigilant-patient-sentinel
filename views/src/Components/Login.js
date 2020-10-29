import React from 'react';
import Logo from './Logo';
import Button from 'react-bootstrap/Button';
import User from './User';
import Admin from './Admin';

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pass: '',
            user: '',
            route: '',
            authUser: '',
            err: ''
        }

        this.handleUser = this.handleUser.bind(this);
        this.handlePass = this.handlePass.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }
    // captures entry of password by user and assigns it to state
    handlePass(e) {
        this.setState({
            pass: e.target.value
        })
    }
    // captures entry of username by user and assigns it to state
    handleUser(e) {
        this.setState({
            user: e.target.value
        })
    }
    // authenticates username and password combination when user logs in
    handleLogin() {
        fetch(`/login/${this.state.user},${this.state.pass}`)
            .then(res => res.json())
            .then(response => {
                return fetch(`/auth/${response.token}`)
            }).then(res => res.json())
            .then(response => {
                // if password and username are incorrect
                if (response.err) {
                    this.setState({
                        err: response.err
                    })
                }
                // if password and username are correct
                if (response.admin === false) {
                    console.log(response)
                    this.setState({
                        authUser: response.id,
                        pass: '',
                        user: '',
                        route: '/user',
                        err: ''
                    })
                } else if (response.admin === true) {
                    this.setState({
                        pass: '',
                        user: '',
                        route: '/admin'
                    })
                }
            }).catch(function (err) {
                console.log(err)
            })
    }
    render() {
        return (
            <div>
                <Logo />
                <div id='login-div'>
                    {this.state.route === '' ?
                        <div>
                            <label id='username-login'>
                                Username:
                        <input onChange={this.handleUser} type='text' placeholder='enter username' value={this.state.user} />
                            </label>
                            <br />
                            <label id='password-login'>
                                Password:
                        <input onChange={this.handlePass} type='password' placeholder='enter password' value={this.state.pass} />
                            </label>
                            <br />
                            <Button id='login-button-login' onClick={this.handleLogin} variant='success'>Login</Button>
                        </div> : ''}
                    <div>
                        {this.state.route === '/user' ?
                            <User user={this.state.authUser} /> : ''}
                    </div>
                    <div>
                        {this.state.route === '/admin' && <Admin />}
                    </div>
                    <div>
                        {this.state.err && <h3 id='error-login'>{this.state.err}</h3>}
                    </div>
                </div>
            </div>
        )
    }
}