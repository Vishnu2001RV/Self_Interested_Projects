// import './availableProduct.css';
import $ from 'jquery';
import { ClientGetAnyEquipmentImage, ClientGetProfileImage } from "../services/clientServices.js";


export function ProductContents(param) {



    let cardID = "addItemClass" + param.assignedID
    let imageID = "heading" + param.assignedID

    let equipDetails = param.details.equipmentDetails;
    let persondetails = param.details.personal;

    // console.log(persondetails);
    // ClientGetAnyEquipmentImage(persondetails.emailId, equipDetails.equipmentName).then
    //     ((Result) => {
    //         console.log(Result);
    //         if (Result === "empty") {
    //             console.log("sdf");
    //         }
    //         else {
    //             console.log("Sdfeed");
    //             //not syncronous
    //             param.updateCard.file = Result;
    //             param.updateCard.setState({ imagepresent: true, });
    //             param.updateCard.setState({});


    //         }
    //     }
    //     );

    //call callback here itself if possible

    
    const handleChange_loadequip = (event) => {


        // const messageState = useState(props.message);

        param.updateCard.setState({ equipmentDetails: equipDetails });
        param.updateCard.setState({ personalDetails: persondetails });
        // console.log(equipDetails);
        $("#profileImage").css({ "display": "none" });
        $("#profileImage2").css({ "display": "none" });
        
        // updateCardSet(param.details);
        ClientGetAnyEquipmentImage(persondetails.emailId, equipDetails.equipmentName).then
            ((Result) => {
                if (Result.toString() === "empty") {
                    $("#profileImage").css({ "display": "none" });
                    
                }
                else {

                    //not syncronous
                    $("#profileImage").css({ "display": "" });
                    $("#profileImage").attr("src", Result);
                    param.updateCard.setState({ equipmentDetails: { image: Result } });
                    param.updateCard.setState({ imageupdated: true, });
                    // param.updateCard.setState({});


                }
            }
            );

        ClientGetProfileImage(persondetails.emailId).then
            ((Result) => {
                if (Result.toString() === "empty") {
                    $("#profileImage2").css({ "display":"none"});
                    
                }
                else {
                    // console.log(Result);
                    //not syncronous
                    $("#profileImage2").css({ "display": "" });
                    $("#profileImage2").attr("src", Result);
                    param.updateCard.setState({ personalDetails: { image: Result } });
                    // param.updateCard.file = Result;
                    param.updateCard.setState({ imageupdated: true, });
                    // param.updateCard.setState({});


                }
            }
            );            


    }
    // var Individualcard = $('#addItemClass'+param.assignedID)
    // Individualcard.hover(function () {
    //     $("#" + (param.assignedID)).attr('style', 'width: calc(100% - 4em)');
    //     $("#heading" + param.assignedID).css('height', '10.5em');

    // }, function () {
    //     $("#" + (param.assignedID)).attr('style', 'width: calc(100% - 0em)');
    //     $(".heading").css('height', '13.5em');
    //     this.scrollTo(0, 0);
    // });

    //try using some other than jquery in react
    function MouseOver(event) {
        // $("#" + (param.assignedID)).attr('style', 'width: calc(13rem - 4em)');
        // $("#" + (param.assignedID)).attr('style', 'height: calc(100%  - 4em)');


        $("#heading" + param.assignedID).css('height', '13rem ');

    }
    function MouseOut(event) {
        // $("#" + (param.assignedID)).attr('style', 'width: calc(13rem  - 0em)');
        // $("#" + (param.assignedID)).attr('style', 'height: calc(100%  - 0em)');


        $(".heading").css('height', '13.5em');
        event.target.scrollTo(0, 0);
    }

    return (
        <>
            <div id={cardID} className="card scroll" onClick={handleChange_loadequip} onMouseOver={MouseOver} onMouseOut={MouseOut}  >
                {/* <div id="displayclose" className="close" onClick={handleChange_dropEquip}></div> */}
                <div id={imageID} className="heading">
                    <img id={param.assignedID} className="Equipement" src={param.src} alt="adidas" />
                    <h1>{persondetails['firstname']}</h1>
                    
                </div>
                <div style={{ "width": "100 %", "background": "white" }} className="info">
                    <h2>{equipDetails['equipmentName']}</h2>
                    <h3>Rent Cost:- {equipDetails['rentCost']}</h3>
                    <h3>Available :- {equipDetails['available']}</h3>
                    {/* <div className="sizes">

                    </div> */}
                    {/* <div className="purchase">
                        <button>Purchase</button>
                    </div> */}
                </div>
            </div>

        </>


    );
}



