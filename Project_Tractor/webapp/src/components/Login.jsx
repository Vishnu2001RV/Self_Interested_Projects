import React from 'react';

import {
    Navigate,
} from "react-router-dom";

import { ClientLogin } from "../services/clientServices.js";


class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            success: false,
            emailId: "a",
            password: "",
            signup: false,

        };

        this.handleChange_acc_details = this.handleChange_acc_details.bind(this);
        this.handleChange_submit = this.handleChange_submit.bind(this);
        this.handleChange_SignUp = this.handleChange_SignUp.bind(this);

    }

    handleChange_acc_details(event) {

        if (event.target.name === "emailId") {
            this.setState({ emailId: event.target.value});

        }
        else if (event.target.name === "password") {
            this.setState({ password: event.target.value });
        }

    }
    handleChange_SignUp(event) {

        this.setState({ signup: true });
    }
    
    handleChange_submit(event) {

        if (event.target.name === "submit") {

            
            ClientLogin(this.state.emailId,this.state.password).then(
                (result) => {
                    if (result === "accepted") {
                        localStorage.setItem('search', '');
                        this.setState({ success: true });
                    }
                    else {

                        window.alert('Invalid Email or Password');
                        window.location.replace("/Login");

                    }

                }

            );

        }
    }

    render() {
        return (
            <>

                {(this.state.success) ? <Navigate to="/AboutUs" /> : <div></div>}
                {(this.state.signup) ? <Navigate to="/SignUp" /> : <div></div>}
                {/* {(this.state.restart) ? <Navigate to="/signUp" /> : <div></div>} */}
                

                <button style={{"border-radius": "0em 0em 1em 1em",
                "position": "absolute",
                "top": "-1em",
                "left": "83%",
                "z-index": "1"}} id="sub" type="button" name="submit" className="save" onClick={this.handleChange_SignUp}>SignUp</button>

                <div className="Login">

                    <form id="msform" className='left_z'>
                        {/* <ul id="progressbar">
                            <li style={{ "z-index": "4" }} className="active">Account Setup</li>
                        </ul> */}


                        <fieldset>
                            <h2 className="fs-title">Login To Your Account</h2>
                            <h3 className="fs-subtitle">Account Details</h3>
                            <input type="text" name="emailId" placeholder="Email" onChange={this.handleChange_acc_details} />
                            <input id="pwd1" type="password" name="password" placeholder="Password" onChange={this.handleChange_acc_details} />
                            <button id="sub" type="button" name="submit" className="save" onClick={this.handleChange_submit}>Login</button>

                        </fieldset>

                    </form>

                </div>
            </>

        );
    }
}

export default Login;
