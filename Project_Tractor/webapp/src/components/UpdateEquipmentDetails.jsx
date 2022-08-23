import React from 'react';
import $ from 'jquery';
// import "./updateEquicss.css";
// import './availableProduct.css';

import { ProductContents } from './availableProduct.js';


import { 
    // BrowserRouter,
    // // Switch,
    // Routes,
    // Route,
    Navigate,
} from "react-router-dom";

import { ClientGetEquipmentDetailsCurrentClient, ClientSetEquipmentWithEmails, ClientSetEquipmentImage, ClientGetAnyEquipmentImage } from "../services/clientServices.js";


class UpdateEquipmentDetails extends React.Component {
    
    constructor(props) {
        super(props);
        this.file = '';
        this.equipmentStorage = []
        this.state = {
            success: false,
            file:'',
            received: false,
            iswrong: false,
            imageupdated: false,
            imagepresent: false,
            search:false,
            equipchange:false,
            emailId:'',
            token:[],
            equipmentName: "",
            rentCost: "",
            available: "",
            state: "",
            city: "",
            description: "",

        };
        this.initialstate = {
            success: false,
            file: '',
            received: true,
            iswrong: false,
            imageupdated: false,
            imagepresent: false,
            search: false,
            equipchange: false,
            emailId: '',
            token: [],
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

    handleChange_submit(event) { //card pop which card selected pop and add new card ?

        let progress = $('#progressbar');

        if (event.target.name === "submit") {

            let this_temp = this;
            ClientSetEquipmentWithEmails(this.state).then(
                (result) => {

                    if (result === "set") {

                        if (this_temp.state.imageupdated) {

                            fetch(this_temp.file).then(r => r.blob()).then(
                                (temp) => {

                                    this_temp.convertBlobToBase64(temp).then((str) => {
                                        ClientSetEquipmentImage(str, this_temp.state.equipmentName).then(
                                            (result2) => {

                                                if (result2 === "set") {
                                                    // this_temp.setState({ success: true });

                                                    window.location.reload();
                                                    this_temp.setState(this_temp.initialstate);
                                                    // this_temp.file ='';

                                                    $(".Nstart").hide();
                                                    $(".start").show();
                                                    let check = 0;
                                                    progress.children()
                                                        .each(function () {
                                                            if (check)
                                                                $(this).removeClass('active');
                                                            check++;

                                                        });
                                                }
                                                else {

                                                    window.alert('Update Error');

                                                }


                                            }

                                        );
                                    });

                                });

                            this_temp.setState({ equipchange: true });
                            this_temp.equipmentStorage.push(<ProductContents assignedID="d" src="/ProductImages/tractor1.jpg" updateCard={this_temp} details={this_temp.state} />);
                            // console.log(this_temp.state);
                        }
                        else
                        {
                            // this.setState({ success: true });
                        
                
                        window.location.reload();
                        // this_temp.setState({equipchange:true});
                        
                        // console.log(this_temp.state);

                         //todo master
                            this_temp.equipmentStorage.push(<ProductContents assignedID="10" src="/ProductImages/tractor1.jpg" updateCard={this_temp} details={this_temp.state} />);
                            
                            this_temp.setState({ equipchange: true });
                            // console.log(this_temp.state);
                            this_temp.setState(this_temp.initialstate);
                        // console.log(this_temp.state);
                        $(".Nstart").hide();
                        $(".start").show();
                        let progress = $("#progressbar")
                        let check=0;
                        progress.children()
                            .each(function () {
                                if(check)
                                $(this).removeClass('active');
                                check++;

                            });
                        }

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
    //todo2
    async handleChange_profileupload(event) {
        // this.profileimg = event.target.files[0]
        
        this.setState({ imageupdated: true });
        this.file = URL.createObjectURL(event.target.files[0]);
    }
    GetUserDetails = () => {
        let that = this;
        that.setState({ emailId: localStorage.getItem("emailId") });
        return ClientGetEquipmentDetailsCurrentClient().then(
            (result) => {
                if (result['status'] === "active") {
                    that.setState({ token: result["output"]["token"] });
                    // console.log(that.state);
                    // console.log(result["output"]["token"]);
                    //first allow css to choose
                    //we set email Id and return the current thing
                    //search bar //display all tokens
                    // click on any update equipment name and this goes to the another return in render
                    //update it as usual
                    //
                    for (let i = that.state.token.length-1;i>=0;i--)
                    {
                        
                        
                        ClientGetAnyEquipmentImage(that.state.emailId, that.state.token[i]['equipmentName']).then((Result) => 
                            {
                            that.setState({ received: false });

                                if (Result.toString() === "empty") {
                                    
                                    that.equipmentStorage.push(<ProductContents assignedID={i} src="/ProductImages/tractor1.jpg" updateCard={that} details={that.state.token[i]} />);
                                }
                                else{
                                    that.equipmentStorage.push(<ProductContents assignedID={i} src={Result} updateCard={that} details={that.state.token[i]} />);
                                }
                            that.setState({ received: true });

                            });
                        // that.equipmentStorage.push(<ProductContents assignedID={i} src="/ProductImages/tractor1.jpg" onClick={this.handleChange_loadequip} details={this.state.token["token"][i]}/>);
                        
                    }
                    
                    
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

        if (!this.state.received) return (<h1>wait</h1>)
        return (
            <>
                {(this.state.success) ? <Navigate to="/Home" /> : <div></div>}
                {/* {(this.state.restart) ? <Navigate to="/signUp" /> : <div></div>} */}

                <div className="UpdateProfile">
                    <div id="container">
                        <div id="container">
                            <div style={{
                                "left": "82%",
                                "top": "1em",
                                "position": "sticky",
                                "z-index": "4",
                            }} class="dropdown">
                                <button class="dropbtn">Contents</button>

                                <div class="dropdown-content">
                                    
                                    <a href="./AboutUs">Home Page</a>
                                    <a href="./UpdateProfile">Update Profile Details</a>
                                    <a href="./SetEquipmentDetails">Set Equpiment Details</a>
                                    <a href="./SearchProducts">Search Equipment Details</a>

                                </div>
                            </div>
                        <h1 style={{ "font-family": "cursive"}}>Available Product Contents</h1>
                            {(this.state.equipchange) ? this.equipmentStorage : this.equipmentStorage}
                            
                            {/* {(this.equipchange)?this.equipmentStorage: this.equipmentStorage} */}
                        {/* <ProductContents assignedID="1" src="/ProductImages/tractor1.jpg"></ProductContents>
                        <ProductContents assignedID="2" src="/ProductImages/tractor1.jpg"></ProductContents>
                        <ProductContents assignedID="3" src="/ProductImages/tractor1.jpg"></ProductContents>
                        <ProductContents assignedID="4" src="/ProductImages/tractor1.jpg"></ProductContents>
                        <ProductContents assignedID="1" src="/ProductImages/tractor1.jpg"></ProductContents>
                        <ProductContents assignedID="2" src="/ProductImages/tractor1.jpg"></ProductContents>
                        <ProductContents assignedID="3" src="/ProductImages/tractor1.jpg"></ProductContents>
                        <ProductContents assignedID="4" src="/ProductImages/tractor1.jpg"></ProductContents>
                            <ProductContents assignedID="1" src="/ProductImages/tractor1.jpg"></ProductContents>
                            <ProductContents assignedID="2" src="/ProductImages/tractor1.jpg"></ProductContents>
                            <ProductContents assignedID="3" src="/ProductImages/tractor1.jpg"></ProductContents>
                            <ProductContents assignedID="4" src="/ProductImages/tractor1.jpg"></ProductContents> */}
                            
                    </div>
                    </div>
                    <form style={{ "position": "sticky","margin":"0 auto","width":"46em","top":"3%"}} id="msform">

                        <ul style={{ "margin-bottom": "1.5em" }} id="progressbar">
                            <li style={{ "z-index": "5" }} className="active">Register Your Equipment</li>
                            <li style={{ "z-index": "4" }}>Location Details</li>
                            <li style={{ "z-index": "3" }}>Equipment Photo</li>

                        </ul>

                        <fieldset className="start">
                            <h2 className="fs-title">Update Your Equipment</h2>
                            <h3 className="fs-subtitle">Equipment Details</h3>
                            <input type="text" name="equipmentName" placeholder="EquipmentName" onChange={this.handleChange_equip_details} value={this.state.equipmentName}/>
                            <input id="pwd1" type="text" name="rentCost" placeholder="RentCost" onChange={this.handleChange_equip_details} value={this.state.rentCost} />
                            <input id="available" type="text" name="available" placeholder="Available" onChange={this.handleChange_equip_details} value={this.state.available} />
                            <input type="button" name="next" className="next action-button" value="Next" onClick={this.handleChange_nextclick} />

                        </fieldset>

                        <fieldset className="Nstart">
                            <h2 className="fs-title">Location Details</h2>
                            <h3 className="fs-subtitle">Your presence on the social network</h3>
                            <input type="text" name="state" placeholder="State" onChange={this.handleChange_location_details} value={this.state.state} />
                            <input type="text" name="city" placeholder="City" onChange={this.handleChange_location_details} value={this.state.city} />
                            <textarea name="description" placeholder="Description" onChange={this.handleChange_location_details} value={this.state.description}></textarea>
                            <input type="button" name="previous" className="previous action-button" value="Previous" onClick={this.handleChange_previousclick} />
                            <input type="button" name="next" className="next action-button" value="Next" onClick={this.handleChange_nextclick} />
                        </fieldset>
                        <fieldset className="Nstart">
                            <h2 className="fs-title">Profile Photo</h2>

                            <input type="file" onChange={this.handleChange_profileupload} />
                            {(this.state.imageupdated) ? <img src={this.file} style={{ "border-radius": "0" }} alt='' className="profileImage" id="profileImage"  /> : <div></div>}

                            <input type="button" name="previous" className="previous action-button" value="Previous" onClick={this.handleChange_previousclick} />
                            <button id="sub" type="button" name="submit" className="save" onClick={this.handleChange_submit}>Submit</button>
                        </fieldset>

                    </form>

                </div>
            </>

        );
    }
}

export default UpdateEquipmentDetails;
