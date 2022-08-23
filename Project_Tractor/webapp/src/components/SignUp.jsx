import React from 'react';
import $ from 'jquery';
// import "./signupcss.css";

import {
    Navigate,
} from "react-router-dom";

import { ClientSignUp, ClientSetProfileImage } from "../services/clientServices.js";


class SignUp extends React.Component {

    constructor(props) {
        super(props);
        this.file = null;     
        this.state = {
            success: false,
            restart: false,
            iswrong: false,
            imagepresent:false,
            
            emailId: "",
            password: "",
            cpassword: "",
            firstname: "",
            lastname: "",
            designation: "",
            phoneno: "",
            state: "",
            city: "",
            profileNote: "",

        };  

        
        this.handleChange_acc_details = this.handleChange_acc_details.bind(this);
        this.handleChange_personal_details = this.handleChange_personal_details.bind(this);
        this.handleChange_location_details = this.handleChange_location_details.bind(this);
        this.handleChange_submit = this.handleChange_submit.bind(this);
        this.handleChange_nextclick = this.handleChange_nextclick.bind(this);
        this.handleChange_previousclick = this.handleChange_previousclick.bind(this);
        this.handleChange_profileupload = this.handleChange_profileupload.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange_acc_details(event){
        
        if (event.target.name === "emailId") {
            this.setState({ emailId: event.target.value});
            
        }
        else if (event.target.name === "password") {
            this.setState({ password: event.target.value });
        }
        else if (event.target.name === "cpassword") {
            this.setState({ cpassword: event.target.value });

            if(this.setState.password===this.setState.cpassword)
            {
                this.setState({ iswrong: false });
            }
            else{
                this.setState({iswrong: true});
            }
        }
    }
    handleChange_personal_details(event) {
        

        if (event.target.name === "firstname") {
            this.setState({ firstname: event.target.value });
        }
        else if (event.target.name === "lastname") {
            this.setState({ lastname: event.target.value });

        } else if (event.target.name === "designation") {
            this.setState({ designation: event.target.value });
        }
        else if (event.target.name === "phoneno") {
            this.setState({ phoneno: event.target.value });
        }
    }
    handleChange_location_details(event) {
        
        if (event.target.name === "state") {
            this.setState({ state: event.target.value });
        } else if (event.target.name === "city") {
            this.setState({ city: event.target.value });
        }
        else if (event.target.name === "profileNote") {
            this.setState({ profileNote: event.target.value });
        }
    }
    convertBlobToBase64 = (blob) => new Promise((resolve, reject) => {
        // eslint-disable-next-line
        const reader = new FileReader;
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });
    
    handleChange_submit(event) {

        
        if (event.target.name === "submit") {


            ClientSignUp(this.state).then(
                (result) => {
                    if(result==="accepted")
                    {
                        if(this.state.imagepresent)
                        {
                            // let myImage = new Image();
                            // myImage.src = this.file;
                            let this_temp = this;
                            
                            fetch(this.file).then(r => r.blob()).then(
                                (temp) =>{
                                    this_temp.convertBlobToBase64(temp).then((str) => {
                                        ClientSetProfileImage(str).then(
                                            (result2) => {

                                                if (result2 === "set") {
                                                    localStorage.setItem('search', '');
                                                    this_temp.setState({ success: true });
                                                }
                                                else {

                                                    window.alert('Update Error');

                                                }


                                            }

                                        );
                                    });                                    
                                    
                                });

                            
                        }
                        else
                        this.setState({ success: true});
                    }
                    else
                    {

                            window.alert('User Already exists');
                            window.location.replace("/signUp");
                        
                    }


                }

            );

        } 
    }
    handleChange_nextclick(event) {
        let current_fs, next_fs; //fieldsets
        current_fs = event.target.parentElement;
        next_fs = event.target.parentElement.nextSibling;
        $("#progressbar li").eq($("fieldset").index($(next_fs))).addClass("active");
        $(next_fs).show();
        $(current_fs).hide();
    }
    handleChange_previousclick(event) {
        let current_fs, previous_fs; //fieldsets
        current_fs = event.target.parentElement;
        previous_fs = event.target.parentElement.previousSibling;
        $("#progressbar li").eq($("fieldset").index($(current_fs))).removeClass("active");
        $(current_fs).hide();
        $(previous_fs).show();

    }
    async handleChange_profileupload (event) 
    {
        // this.profileimg = event.target.files[0]
        this.file = URL.createObjectURL(event.target.files[0]);
        this.setState({ imagepresent: true });
    }
    componentDidMount(){
        // this.jQueryCode();
    }

    render() {

        return (
            <>

                {(this.state.success) ? <Navigate to="/AboutUs" /> : <div></div>}
                {/* {(this.state.restart) ? <Navigate to="/signUp" /> : <div></div>} */}

            <div className = "SignUp">
                    <form id="updater">
                        <ul id="progressbar">
                            <li style={{ "z-index": "5" }} className="active">Account Setup</li>
                            <li style={{ "z-index": "4" }}>Social Profiles</li>
                            <li style={{ "z-index": "3" }}>Personal Details</li>
                            <li style={{ "z-index": "2" }}>Profile Photo</li>

                        </ul>
                    </form>

            <form id="msform">
                              
                <fieldset>
                    <h2 className="fs-title">Create your account</h2>
                    <h3 className="fs-subtitle">Account Details</h3>
                        <input type="text" name="emailId" placeholder="Email" onChange={this.handleChange_acc_details}/>
                        <input id="pwd1" type="password" name="password" placeholder="Password" onChange={this.handleChange_acc_details} />
                            <input id="pwd2" type="password" name="cpassword" placeholder="Confirm Password" className={`${this.state.iswrong ? "inputred" : ''}`}  onChange={this.handleChange_acc_details} />
                            <input type="button" name="next" className="next action-button" value="Next" onClick={this.handleChange_nextclick} />
                      
                    
                    </fieldset>


                <fieldset>
                        <h2 className="fs-title">Personal Details</h2>
                        <h3 className="fs-subtitle">We will never sell it</h3>
                        <input type="text" name="firstname" placeholder="First Name" onChange={this.handleChange_personal_details} />
                        <input type="text" name="lastname" placeholder="Last Name" onChange={this.handleChange_personal_details} />
                        <input type="text" name="designation" placeholder="Designation" onChange={this.handleChange_personal_details} />
                        <input type="text" name="phoneno" placeholder="Phone" onChange={this.handleChange_personal_details} />
                        
                            <input type="button" name="previous" className="previous action-button" value="Previous" onClick={this.handleChange_previousclick} />
                            <input type="button" name="next" className="next action-button" value="Next" onClick={this.handleChange_nextclick} />
                </fieldset>
                
                <fieldset>
                    <h2 className="fs-title">Location Details</h2>   
                    <h3 className="fs-subtitle">Your presence on the social network</h3>
                        <input type="text" name="state" placeholder="State" onChange={this.handleChange_location_details} />
                        <input type="text" name="city" placeholder="City" onChange={this.handleChange_location_details} />
                        <textarea name="profileNote" placeholder="ProfileNote" onChange={this.handleChange_location_details} ></textarea>
                        <input type="button" name="previous" className="previous action-button" value="Previous" onClick={this.handleChange_previousclick} />
                        <input type="button" name="next" className="next action-button" value="Next" onClick={this.handleChange_nextclick} />               
                </fieldset>
                        <fieldset>
                            <h2 className="fs-title">Profile Photo</h2>

                            {(!this.state.imagepresent) ? <input type="file" onChange={this.handleChange_profileupload} /> : <div></div>}
                            {(this.state.imagepresent) ? <img alt='' className="profileImage" id="profileImage" src={this.file} /> : <div></div>}

                            <input type="button" name="previous" className="previous action-button" value="Previous" onClick={this.handleChange_previousclick} />
                            <button id="sub" type="button" name="submit" className="save" onClick={this.handleChange_submit}>Submit</button>
                        </fieldset>  
                
            </form>
                
            </div>
            </>
            
        );
    }
}

export default SignUp;


// let inputProps = {
//     color: "blue",
//     title: "Title"
// };
// <NavigationBar props={inputProps} />