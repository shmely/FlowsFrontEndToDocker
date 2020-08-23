import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from '../store/actions/userActions'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class _SignIn extends Component {
    state = {

        loginCred: {
            email: '',
            password: ''
        },
        msg: ''
    }

    loginHandleChange = ev => {
        const { name, value } = ev.target;
        this.setState(prevState => ({
            loginCred: {
                ...prevState.loginCred,
                [name]: value
            }
        }));
    };



    doLogin = async ev => {
        ev.preventDefault();
        const { email, password } = this.state.loginCred;
        if (!email || !password) {
            this.setState({ msg: 'Please enter correct user/password' });
        } else {
            const userCreds = { email, password };
            try {
                this.props.login(userCreds);
            }
            catch (err) {
                console.log(err);
            }
            this.setState({ loginCred: { email: '', password: '' }, msg: '' }, () => { this.props.history.push('/boards') });

        }

    };



    render() {
        return (
            <main className="sign-in">
                <p>{this.state.msg}</p>
                <form className="sign-in-form" onSubmit={this.doLogin} noValidate>


                    <TextField onChange={this.loginHandleChange}
                        className="signin-email"
                        variant="outlined"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                    />

                    <TextField onChange={this.loginHandleChange}
                        className="signin-password"
                        variant="outlined"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="sign-in-submit-btn"
                    >
                        Sign In
                    </Button>


                </form>


                <a href="/signUp" className="sign-in-link">
                    Dont have an account? Sign Up
                    </a>
            </main >
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.trelloUser.userReducer
})

const mapDispatchToProps = {
    login
}

export const SignIn = connect(mapStateToProps, mapDispatchToProps)(_SignIn);
