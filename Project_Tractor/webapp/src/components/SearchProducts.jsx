import React from 'react';
import $ from 'jquery';
// import "./updateEquicss.css";
// import './availableProduct.css';

import { ProductContents } from './DisplayProduct.js';


import {
    // BrowserRouter,
    // // Switch,
    // Routes,
    // Route,
    Navigate,
} from "react-router-dom";

import { ClientGetEquipmentDetailsOtherClient, ClientSetEquipmentWithEmails, ClientSetEquipmentImage, ClientGetAnyEquipmentImage } from "../services/clientServices.js";


class SearchProducts extends React.Component {

    constructor(props) {
        super(props);
        this.file = null;
        this.equipmentStorage = []
        this.state = {
            success: false,
            file: '',
            received: false,
            iswrong: false,
            imageupdated: false,
            imagepresent: false,
            search: false,
            equipchange: false,
            prodisplay:true,
            personalDetails:{
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
                image:"",
                searchresult:localStorage.getItem('search')
            },
            equipmentDetails: {
                emailId: '',
                token: [],
                equipmentName: "",
                rentCost: "",
                available: "",
                state: "",
                city: "",
                description: "",
                image:""
            },

            emailId: '',
            token: [],
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
            prodisplay: true,
            emailId: '',
            personalDetails: {
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
                image:""
            },
            equipmentDetails: {
                emailId: '',
                token: [],
                equipmentName: "",
                rentCost: "",
                available: "",
                state: "",
                city: "",
                description: "",
                image:""
            },
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
        this.handleChange_searchSubmit = this.handleChange_searchSubmit.bind(this);
        this.togglechanged = this.togglechanged.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange_equip_details(event) {

        if (event.target.name === "equipmentName") {
            this.setState({equipmentDetails:{ equipmentName: event.target.value }});

        }
        else if (event.target.name === "rentCost") {
            this.setState({ equipmentDetails: { rentCost: event.target.value }});
        }
        else if (event.target.name === "available") {
            this.setState({ equipmentDetails: { available: event.target.value }});
        }
    }

    handleChange_location_details(event) {

        if (event.target.name === "state") {
            this.setState({ equipmentDetails: { state: event.target.value }});
        } else if (event.target.name === "city") {
            this.setState({ equipmentDetails: { city: event.target.value }});
        }
        else if (event.target.name === "description") {
            this.setState({ equipmentDetails: { description: event.target.value }});
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
                            
                        }
                        else {
                            // this.setState({ success: true });


                            window.location.reload();
                            // this_temp.setState({equipchange:true});

                            // console.log(this_temp.state);

                            //todo master
                            this_temp.equipmentStorage.push(<ProductContents assignedID="10" src="/ProductImages/tractor1.jpg" updateCard={this_temp} details={this_temp.state} />);

                            this_temp.setState({ equipchange: true });

                            this_temp.setState(this_temp.initialstate);
                            // console.log(this_temp.state);
                            $(".Nstart").hide();
                            $(".start").show();
                            let progress = $("#progressbar")
                            let check = 0;
                            progress.children()
                                .each(function () {
                                    if (check)
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

    togglechanged(event)
    {
        if(event.target.parentElement.firstChild.checked)
            this.setState({ prodisplay: false});
        else
            this.setState({ prodisplay: true });
    }

    GetUserDetails = () => {
        let that = this;
        // that.setState({ emailId: localStorage.getItem("emailId") });
        // console.log(localStorage.getItem('search'));
        that.setState({ searchresult: localStorage.getItem('search') });

        return ClientGetEquipmentDetailsOtherClient({ "equipmentName": localStorage.getItem('search') },"no").then(
            (result) => {
                if (result['status'] === "active") {
                    that.setState({ equipmentDetails: { token: result["output"]}});
                    // that.setState({ received: true });
                    // console.log(result);
                    // console.log(result["output"]["token"]);
                    //first allow css to choose
                    //we set email Id and return the current thing
                    //search bar //display all tokens
                    // click on any update equipment name and this goes to the another return in render
                    //update it as usual
                    //
                    that.setState({ received: true });
                    Object.entries(that.state.equipmentDetails.token).forEach(([key, value]) => {

                        // console.log(key, value); // key ,value
                        // console.log(value['equipmentDetails']);
                        let i = parseInt(key);

                        ClientGetAnyEquipmentImage(value['personal']['emailId'], value['equipmentDetails']['equipmentName']).then((Result) => {
                            that.setState({ received: false });

                            if (Result.toString() === "empty") {

                                that.equipmentStorage.push(<ProductContents assignedID={i} src="/ProductImages/tractor1.jpg" updateCard={that} details={value} />);
                            }
                            else {
                                that.equipmentStorage.push(<ProductContents assignedID={i} src={Result} updateCard={that} details={value} />);
                            }
                            // console.log(i);
                            that.setState({ received: true });

                        });


                    });

                    // for (let i = that.state.token.length - 1; i >= 0; i--) {


                    //     ClientGetAnyEquipmentImage(that.state.emailId, that.state.token[i]['equipmentName']).then((Result) => {
                    //         that.setState({ received: false });

                    //         if (Result.toString() === "empty") {

                    //             that.equipmentStorage.push(<ProductContents assignedID={i} src="/ProductImages/tractor1.jpg" updateCard={that} details={that.state.token[i]} />);
                    //         }
                    //         else {
                    //             that.equipmentStorage.push(<ProductContents assignedID={i} src={Result} updateCard={that} details={that.state.token[i]} />);
                    //         }
                    //         that.setState({ received: true });

                    //     });
                    //     // that.equipmentStorage.push(<ProductContents assignedID={i} src="/ProductImages/tractor1.jpg" onClick={this.handleChange_loadequip} details={this.state.token["token"][i]}/>);

                    // }


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
    handleChange_searchSubmit(event){

        // console.log(event.target.previousSibling.value)
        this.setState({ searchresult : event.target.previousSibling.value });
        localStorage.setItem('search', event.target.previousSibling.value??'');
        
        window.location.reload();    

        // get information about all or just wait

    }

    componentDidMount() {
        this.GetUserDetails();
        // $("#initialingsearch").attr('value',localStorage.getItem('search')??'d');


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
                                    <a href="./UpdateEquipmentDetails">Update Equipment Details</a>


                                </div>
                            </div>
                            <h1 style={{ "font-family": "cursive" }}>Search Available Products
                            </h1>
                            
                            {(this.state.equipchange) ? this.equipmentStorage : this.equipmentStorage}
                        </div>

                    </div>
                    {/* <div style={{
                        "left": "51%",
                        "position":"absolute"
                    }} class="dropdown">
                        <button class="dropbtn">Dropdown</button>

                        <div class="dropdown-content">
                            <a >Planned Upcomming Task</a>
                            <a href="./UpdateProfile">Update Profile Details</a>
                            <a href="./SetEquipmentDetails">Set Equpiment Details</a>
                            <a href="./UpdateEquipmentDetails">Update Equipment Details</a>
                            <a href="./SearchProducts">Search Equipment Details</a>

                        </div>
                    </div>
                     */}
                    <form style={{ "position": "sticky", "margin": "0 auto", "width": "46em" }} id="msform">
                        
                        <div class="search-bar" >
                            <input style={{ "width": "10em !important" }} type="search" name="searching" onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    
                                    localStorage.setItem('search', e.target.value ?? '');
                                    
                                    
                                    window.location.reload();    
                                }
                            }} onChange={(e) => { this.setState({ searchresult: e.target.value }); }} value={this.state.searchresult} id="initialingsearch" required />
                            <button style={{ "margin": "-3px" }} class="search-btn" type="button" onClick={this.handleChange_searchSubmit}>
                                <span>Search</span>
                            </button>
                        </div>
                        <div id="switchbox" onChange={this.togglechanged}>
                            Show Personal Details :
                            <label class="switch">
                                <input type="checkbox" />
                                <div></div>
                            </label>
                        </div>
                    {(this.state.prodisplay)?<>

                            <fieldset className="start" id="equipstart">
                                <h2 className="fs-title">Update Your Equipment</h2>
                                <h3 className="fs-subtitle">Equipment Details</h3>
                                <input type="text" name="equipmentName" placeholder="EquipmentName" value={this.state.equipmentDetails.equipmentName} />
                                <input id="pwd1" type="text" name="rentCost" placeholder="RentCost" value={this.state.equipmentDetails.rentCost} />
                                <input id="available" type="text" name="available" placeholder="Available" onChange={this.handleChange_equip_details} value={this.state.equipmentDetails.available} />
                                <input type="button" name="next" className="next action-button" defaultValue="Next" onClick={this.handleChange_nextclick} />

                            </fieldset>

                            <fieldset className="Nstart">
                                <h2 className="fs-title">Location Details</h2>
                                <h3 className="fs-subtitle">Your presence on the social network</h3>
                                <input type="text" name="state" placeholder="State" value={this.state.equipmentDetails.state} />
                                <input type="text" name="city" placeholder="City" value={this.state.equipmentDetails.city} />
                                <textarea name="description" placeholder="Description" value={this.state.equipmentDetails.description}></textarea>
                                <input type="button" name="previous" className="previous action-button" defaultValue="Previous" onClick={this.handleChange_previousclick} />
                                <input type="button" name="next" className="next action-button" defaultValue="Next" onClick={this.handleChange_nextclick} />
                            </fieldset>
                            <fieldset className="Nstart">
                                <h2 className="fs-title">Equipment Photo</h2>

                                {/* <input type="file" onChange={this.handleChange_profileupload} /> */}
                                {(this.state.imageupdated) ? <img style={{ "border-radius": "0" }} src={this.state.equipmentDetails.image} alt='' className="profileImage" id="profileImage" /> : <div></div>}

                                <input type="button" name="previous" className="previous action-button" defaultValue="Previous" onClick={this.handleChange_previousclick} />
                                <input type="button" name="next" className="next action-button" defaultValue="Next" onClick={this.handleChange_nextclick} />
                            </fieldset>
                            <fieldset className="Nstart">
                                <input type="button" name="previous" className="previous action-button" defaultValue="Previous" onClick={this.handleChange_previousclick} />
                            </fieldset>

                        
                    
                    
                    </>:
                    <>


                                <fieldset className="start">
                                    <h2 className="fs-title">Profile Photo</h2>

                                    {(this.state.imageupdated) ? <img src={this.state.personalDetails.image} alt='' className="profileImage" id="profileImage2" /> : <div></div>}

                                    
                                    <input type="button" name="next" className="next action-button" defaultValue="Next" onClick={this.handleChange_nextclick} />

                                </fieldset>   
                                <fieldset className="Nstart">
                                    <h2 className="fs-title">Product Owners Details</h2>
                                    <h3 className="fs-subtitle">Account Details</h3>
                                    <input type="text" name="emailId" placeholder="Email" value={this.state.personalDetails.emailId} readOnly />
                                    <input type="text" name="firstname" placeholder="First Name" value={this.state.personalDetails.firstname} />
                                    <input type="text" name="lastname" placeholder="Last Name" value={this.state.personalDetails.lastname} />
                                    <input type="button" name="previous" className="previous action-button" defaultValue="Previous" onClick={this.handleChange_previousclick} />
                                    <input type="button" name="next" className="next action-button" defaultValue="Next" onClick={this.handleChange_nextclick} />

                                </fieldset>

                                <fieldset className="Nstart">
                                    <h2 className="fs-title">Personal Details</h2>
                                    <h3 className="fs-subtitle">We will never sell it</h3>

                                    <input type="text" name="designation" placeholder="Designation" value={this.state.personalDetails.designation} />
                                    <input type="text" name="phoneno" placeholder="Phone" value={this.state.personalDetails.phoneno} />

                                    <input type="button" name="previous" className="previous action-button" defaultValue="Previous" onClick={this.handleChange_previousclick} />
                                    <input type="button" name="next" className="next action-button" defaultValue="Next" onClick={this.handleChange_nextclick} />
                                </fieldset>
            
                                <fieldset className="Nstart">
                                    <h2 className="fs-title">Location Details</h2>
                                    <h3 className="fs-subtitle">Your presence on the social network</h3>

                                    <input type="text" name="state" placeholder="State" value={this.state.personalDetails.state} />
                                    <input type="text" name="city" placeholder="City" value={this.state.personalDetails.city} />
                                    <textarea name="profileNote" placeholder="ProfileNote" value={this.state.personalDetails.profileNote} />

                                    <input type="button" name="previous" className="previous action-button" defaultValue="Previous" onClick={this.handleChange_previousclick} />
                                    
                                </fieldset>
                                
                         
                    
                    
                    </>
                    }

                    </form>
                    
                </div>
            </>

        );
    }
}

export default SearchProducts;
