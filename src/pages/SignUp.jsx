import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signup } from '../store/actions/userActions'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


class _SignUp extends Component {
    state = {
        msg: '',
        signupCred: {
            email: '',
            password: '',
            fullName: ''
        }
    }

    signupHandleChange = ev => {
        const { name, value } = ev.target;
        this.setState(prevState => ({
            signupCred: {
                ...prevState.signupCred,
                [name]: value
            }
        }));
    };

    doSignup = async ev => {
        ev.preventDefault();
        const { email, password, fullName } = this.state.signupCred;
        if (!email || !password || !fullName) {
            return this.setState({ msg: 'All inputs are required!' });
        }
        const signupCreds = { email, password, fullName };
        this.props.signup(signupCreds);
        this.setState({ signupCred: { email: '', password: '', fullName: '' } });
        this.props.history.push('/login');
    };


    render() {
        return (
            <main className="sign-up">

                <p>{this.state.msg}</p>

                <form className="sign-up-form" onSubmit={this.doSignup} noValidate>

                    <TextField onChange={this.signupHandleChange}
                        className="signup-full-name"
                        autoComplete="fname"
                        name="fullName"
                        variant="outlined"
                        required
                        fullWidth
                        id="fullName"
                        label="Full Name"
                        autoFocus
                    />

                    <TextField onChange={this.signupHandleChange}
                        className="signup-email"
                        variant="outlined"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                    />

                    <TextField onChange={this.signupHandleChange}
                        className="signup-password"
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
                        className="sign-up-submit-btn"
                    >
                        Sign Up
                    </Button>
                </form>


                {/* <a  className="sign-in-link">
                    Already have an account? Sign in
                    </a> */}
            </main >
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.trelloUser.userReducer
})

const mapDispatchToProps = {

    signup
}

export const SignUp = connect(mapStateToProps, mapDispatchToProps)(_SignUp);
