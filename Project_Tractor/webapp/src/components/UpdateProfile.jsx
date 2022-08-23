import React from 'react';
import $ from 'jquery';
// import "./signupcss.css";
// import "./updateEquicss.css";
// import './availableProduct.css';
import {
    // BrowserRouter,
    // // Switch,
    // Routes,
    // Route,
    Navigate,
} from "react-router-dom";

import { ClientgetUserDetails, ClientSetUserDetails, ClientSetProfileImage, ClientGetProfileImage } from "../services/clientServices.js";


class UpdateProfile extends React.Component {

    constructor(props) {
        super(props);
        this.file = null;
        this.state = {
            success: false,
            received: false,
            iswrong: false,
            imageupdated: false,
            imagepresent: false,
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

    handleChange_acc_details(event) {

        if (event.target.name === "emailId") {
            this.setState({ emailId: event.target.value });

        }
        else if (event.target.name === "password") {
            this.setState({ password: event.target.value });
        }
        else if (event.target.name === "cpassword") {
            this.setState({ cpassword: event.target.value });

            if (this.setState.password === this.setState.cpassword) {
                this.setState({ iswrong: false });
            }
            else {
                this.setState({ iswrong: true });
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

    ConvertImage(image) {
        let reader = new FileReader();
        reader.onload = function () {

            let arrayBuffer = this.result,
                array = new Uint8Array(arrayBuffer),
                binaryString = String.fromCharCode.apply(null, array);

            return binaryString;

        }
        return reader.readAsArrayBuffer(image);

    }

    handleChange_submit(event) {


        if (event.target.name === "submit") {

            let this_temp = this;
            ClientSetUserDetails(this.state).then(
                (result) => {

                    if (result === "set") {
                        
                        if (this_temp.state.imageupdated) {
                            
                            fetch(this_temp.file).then(r => r.blob()).then(
                                (temp) => {

                                    this_temp.convertBlobToBase64(temp).then((str)=>{
                                        ClientSetProfileImage(str).then(
                                            (result2) => {

                                                if (result2 === "set") {

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
                        this.setState({ success: true });
                        // this.state["success"];
                    }
                    else {


                        // window.location
                        window.alert('Please Login Again');
                        window.location.replace("/Login");



                    }

     
                }

            );

        }
    }

    handleChange_nextclick(event)
    {
        let current_fs, next_fs; //fieldsets
        current_fs = event.target.parentElement;
        next_fs = event.target.parentElement.nextSibling;
        $("#progressbar li").eq($("fieldset").index($(next_fs))).addClass("active");
        $(next_fs).show();
        $(current_fs).hide();
    }
    handleChange_previousclick(event) {
        let current_fs,previous_fs; //fieldsets
        current_fs = event.target.parentElement;
        previous_fs = event.target.parentElement.previousSibling;
        $("#progressbar li").eq($("fieldset").index($(current_fs))).removeClass("active");
        $(current_fs).hide();
        $(previous_fs).show();

    }
    async handleChange_profileupload(event) {
        // this.profileimg = event.target.files[0]
        this.file = URL.createObjectURL(event.target.files[0]);
        this.setState({ imageupdated: true });
    }
    GetUserDetails = () => {
        let that = this;
        that.setState({emailId:localStorage.getItem("emailId")});
        return ClientgetUserDetails().then( 
            (result) => { 
                if (result['status'] === "active") {
                    that.setState(result);
                    ClientGetProfileImage(that.state.emailId).then
                    ((Result) =>{
                        if(Result.toString()==="empty")
                        {
                            that.setState({ received: true });

                        }
                        else
                        {

                            that.file = Result;                         
                            that.setState({ received: true });
                            that.setState({ imagepresent: true });
                        }
                    }
                    );
                    
                    that.setState({received:true});
                    // return result;
                }
                else if (result['status'] === "expired") {

                    window.alert('Session TimedOut');
                    window.location.replace("/Login");

                }
                else { 

                    // window.location
                    window.alert('Session Invalid');
                    window.location.replace("/Login");



                }


            }

        );

    }

    componentDidMount() {
        this.GetUserDetails();
 
    }

    render() {
        
        if (!this.state.received) return(<h1>wait</h1>)
        return (
            <>
                {(this.state.success) ? <Navigate to="/AboutUs" /> : <div></div>}
                {/* {(this.state.restart) ? <Navigate to="/signUp" /> : <div></div>} */}

                <div className="UpdateProfile">
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
                            <h2 className="fs-title">Update Your Account</h2>
                            <h3 className="fs-subtitle">Account Details</h3>
                            <input type="text" name="emailId" placeholder="Email" onChange={this.handleChange_acc_details} value={this.state.emailId} readOnly/>
                            <input id="pwd1" type="password" name="password" placeholder="Password" onChange={this.handleChange_acc_details} value={this.state.password} />
                            <input id="pwd2" type="password" name="cpassword" placeholder="Confirm Password" className={`${this.state.iswrong ? "inputred" : ''}`} onChange={this.handleChange_acc_details} />
                            <input type="button" name="next" className="next action-button" value="Next" onClick={this.handleChange_nextclick}/>

                        </fieldset>
                     
                        <fieldset>
                            <h2 className="fs-title">Personal Details</h2>
                            <h3 className="fs-subtitle">We will never sell it</h3>
                            <input type="text" name="firstname" placeholder="First Name" onChange={this.handleChange_personal_details} value={this.state.firstname} />
                            <input type="text" name="lastname" placeholder="Last Name" onChange={this.handleChange_personal_details} value={this.state.lastname} />
                            <input type="text" name="designation" placeholder="Designation" onChange={this.handleChange_personal_details} value={this.state.designation} />
                            <input type="text" name="phoneno" placeholder="Phone" onChange={this.handleChange_personal_details} value={this.state.phoneno} />

                            <input type="button" name="previous" className="previous action-button" value="Previous" onClick={this.handleChange_previousclick} />
                            <input type="button" name="next" className="next action-button" value="Next" onClick={this.handleChange_nextclick} />
                        </fieldset>

                        <fieldset>
                            <h2 className="fs-title">Location Details</h2>
                            <h3 className="fs-subtitle">Your presence on the social network</h3>
                            <input type="text" name="state" placeholder="State" onChange={this.handleChange_location_details} value={this.state.state} />
                            <input type="text" name="city" placeholder="City" onChange={this.handleChange_location_details} value={this.state.city} />
                            <textarea name="profileNote" placeholder="ProfileNote" onChange={this.handleChange_location_details} value={this.state.profileNote}></textarea>

                            <input type="button" name="previous" className="previous action-button" value="Previous" onClick={this.handleChange_previousclick} />
                            <input type="button" name="next" className="next action-button" value="Next" onClick={this.handleChange_nextclick} />
                            {/* <input id= "sub" type="submit" name="submit" className="submit action-button" value="Submit" onClick={this.handleSubmit} /> */}
                            {/* <button id="sub" type="button" name="submit" className="save" onClick={this.handleChange_submit}>Submit</button> */}
                        </fieldset>
                        <fieldset>
                            <h2 className="fs-title">Profile Photo</h2>

                            <input type="file" onChange={this.handleChange_profileupload} />
                            {(this.state.imageupdated || this.state.imagepresent) ? <img alt='' className="profileImage" id="profileImage" src={this.file} /> : <div></div>}

                            <input type="button" name="previous" className="previous action-button" value="Previous" onClick={this.handleChange_previousclick} />
                            <button id="sub" type="button" name="submit" className="save" onClick={this.handleChange_submit}>Submit</button>
                        </fieldset>   

                    </form>

                </div>
            </>

        );
    }
}

export default UpdateProfile;
