import React from 'react';
import $ from 'jquery';
// import "./signupcss.css";
import {
    Navigate,
} from "react-router-dom";

import { ClientSetEquipmentWithEmails, ClientSetEquipmentImage } from "../services/clientServices.js";


class SetEquipmentDetails extends React.Component {

    constructor(props) {
        super(props);
        this.file = null;
        this.state = {
            success: false,
            restart: false,
            iswrong: false,
            imagepresent: false,
            equipmentName: "",
            rentCost: "",
            available: "",
            state: "",
            city: "",
            description: "",

        };


        this.handleChange_equip_details = this.handleChange_equip_details.bind(this);
        this.handleChange_location_details = this.handleChange_location_details.bind(this);
        this.handleChange_submit = this.handleChange_submit.bind(this);
        this.handleChange_nextclick = this.handleChange_nextclick.bind(this);
        this.handleChange_previousclick = this.handleChange_previousclick.bind(this);
        this.handleChange_profileupload = this.handleChange_profileupload.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange_equip_details(event) {

        if (event.target.name === "equipmentName") {
            this.setState({ equipmentName: event.target.value });

        }
        else if (event.target.name === "rentCost") {
            this.setState({ rentCost: event.target.value });
        }
        else if (event.target.name === "available") {
            this.setState({ available: event.target.value });
        }
    }

    handleChange_location_details(event) {

        if (event.target.name === "state") {
            this.setState({ state: event.target.value });
        } else if (event.target.name === "city") {
            this.setState({ city: event.target.value });
        }
        else if (event.target.name === "description") {
            this.setState({ description: event.target.value });
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


            ClientSetEquipmentWithEmails(this.state).then(
                (result) => {
                    if (result === "set") {
                        if (this.state.imagepresent) {
                            // let myImage = new Image();
                            // myImage.src = this.file;
                            let this_temp = this;
                            // console.log("SDf");
                            fetch(this.file).then(r => r.blob()).then(
                                (temp) => {
                                    this_temp.convertBlobToBase64(temp).then((str) => {

                                        ClientSetEquipmentImage(str,this.state.equipmentName).then(
                                            (result2) => {

                                                if (result2 === "set") {

                                                    // this_temp.setState({ success: true });
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
                    }
                    else {

                        window.alert('Please Login Again');
                        window.location.replace("/Login");

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
    async handleChange_profileupload(event) {
        // this.profileimg = event.target.files[0]
        this.file = URL.createObjectURL(event.target.files[0]);
        this.setState({ imagepresent: true });
    }
    componentDidMount() {
        // this.jQueryCode();
    }

    render() {

        return (
            <>

                {(this.state.success) ? <Navigate to="/AboutUs" /> : <div></div>}
                {/* {(this.state.restart) ? <Navigate to="/signUp" /> : <div></div>} */}

                <div className="SignUp">
                    <form id="updater">
                        <ul id="progressbar">
                            <li style={{ "z-index": "5" }} className="active">Register Your Equipment</li>
                            <li style={{ "z-index": "4" }}>Location Details</li>
                            <li style={{ "z-index": "3" }}>Equipment Photo</li>

                        </ul>
                    </form>

                    <form id="msform">

                        <fieldset>
                            <h2 className="fs-title">Register Your Equipment</h2>
                            <h3 className="fs-subtitle">Equipment Details</h3>
                            <input type="text" name="equipmentName" placeholder="EquipmentName" onChange={this.handleChange_equip_details} />
                            <input id="pwd1" type="text" name="rentCost" placeholder="RentCost" onChange={this.handleChange_equip_details} />
                            <input id="pwd2" type="text" name="available" placeholder="Available" onChange={this.handleChange_equip_details} />
                            <input type="button" name="next" className="next action-button" value="Next" onClick={this.handleChange_nextclick} />


                        </fieldset>

                        <fieldset>
                            <h2 className="fs-title">Location Details</h2>
                            <h3 className="fs-subtitle">Your presence on the social network</h3>
                            <input type="text" name="state" placeholder="State" onChange={this.handleChange_location_details} />
                            <input type="text" name="city" placeholder="City" onChange={this.handleChange_location_details} />
                            <textarea name="description" placeholder="Description" onChange={this.handleChange_location_details} ></textarea>
                            <input type="button" name="previous" className="previous action-button" value="Previous" onClick={this.handleChange_previousclick} />
                            <input type="button" name="next" className="next action-button" value="Next" onClick={this.handleChange_nextclick} />
                        </fieldset>
                        <fieldset>
                            <h2 className="fs-title">Equipment Photo</h2>

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

export default SetEquipmentDetails;


// let inputProps = {
//     color: "blue",
//     title: "Title"
// };
// <NavigationBar props={inputProps} />