// import './component.css';
// import "./logincss.css";
// import "./signupcss.css";
import React, { useState } from 'react';
import "./updateEquicss.css";
import './availableProduct.css';
import './searchBar.css';
import "./aboutcss.css";



import androidphone from '../Android_Phone.png'
import Rive, { Layout } from 'rive-react';
import FarmerAnimation from '../FarmerMultiple.riv'
import ploughed from '../ploughed.jpg'
import unploughed from '../unploughed.jpg'


function Home1() {
    const [show, showToggle] = useState(1);

    let toggleshow = (event)=>{
        showToggle(1-show);
    };

    

    if(show)
    return (

        <div className="Home">
            <h1 style={{"font-family": "cursive" }} className="androidheader">HOME PAGE</h1>
            <div style={{"top":"10px"}}className="BodyContent">
                <div style={{
                    "left": "80%",
                    "top": "-3em",
                }} className="dropdown">
                    <button className="dropbtn">Contents</button>
                    
                    <div  className="dropdown-content">
                        <div  onClick={toggleshow}>Planned Upcomming Task</div>
                        <a href="./UpdateProfile">Update Profile Details</a>
                        <a href="./SetEquipmentDetails">Set Equpiment Details</a>
                        <a href="./UpdateEquipmentDetails">Update Equipment Details</a>
                        <a href="./SearchProducts">Search Equipment Details</a>
                        
                    </div>
                </div>
                <div style={{ "top": "-3em" }}className="content1">

                    
                    <div id="farmerAppliation">
                        <Rive src={FarmerAnimation} artboard="Farmer" animations={["Farmer5sec"]} />
                    </div>
                    <div id="container1">
                        <div id="Tractor">
                            <Rive src={FarmerAnimation} artboard="Tractor" animations={["Tractor_Ploughing"]} layout={new Layout({ fit: 'fill', alignment: 'center' })} />
                        </div>
                        <div id="farmLand">
                            <img className="bottom" src={ploughed} alt="ploughed" />
                            <img className="top" src={unploughed} alt="unploughed" />
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
    else
        return (

            <div className="Home">
                <div style={{ "top": "5em" }} className="BodyContent">

                    <div style={{ "top": "-2em" ,"position":"relative"}} className="content2">
                        
                        <h1 style={{
                            "top": "-1.2em",
                            "left": "2em",
                            "position": "relative",
                            "font-family": "cursive"
                        }}> Planned Upcomming Tasks</h1>
                        <div style={{
                            "left": "80%",
                            "top": "-3em",
                        }} className="dropdown">
                            <button className="dropbtn">Contents</button>
                            <div className="dropdown-content">
                                <div  onClick={toggleshow}>Project Page</div>
                                <a href="./UpdateProfile">Update Profile Details</a>
                                <a href="./SetEquipmentDetails">Set Equpiment Details</a>
                                <a href="./UpdateEquipmentDetails">Update Equipment Details</a>
                                <a href="./SearchProducts">Search Equipment Details</a>
                                
                            </div>
                        </div>
                        <div style={{ "left": "40%", }} className="phone">
                            <img style={{ "width": "17.8em" }} src={androidphone} className="androidphoneimg" alt="Phone Animation" />
                            <video style={{ "width": "16em", "left": "12px" }} src={'/videos/Docs_Animation.mp4'} className="videoCSS" loop autoPlay muted />
                            {/* Without muted video autoplay not works */}
                        </div>
                        {/* <div id="farmerAlone">
                        <Rive src={FarmerAnimation} artboard="Farmer" animations={["Farmer2sec"]} layout={new Layout({ fit: 'contain', alignment: 'center' })} />
                    </div> */}
                    </div>

                </div>
            </div>
        );
}
export default Home1;

