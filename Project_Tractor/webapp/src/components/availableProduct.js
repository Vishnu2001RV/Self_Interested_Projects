// import './availableProduct.css';
import $ from 'jquery';
import { ClientGetAnyEquipmentImage, ClientDropEquipmentDetails } from "../services/clientServices.js";


export function ProductContents(param) {



    var cardID = "addItemClass" + param.assignedID
    var imageID = "heading"+ param.assignedID


    const handleChange_dropEquip = (event) =>
    {
        event.stopPropagation();
        
        ClientDropEquipmentDetails(param.details['equipmentName']).then((result) => {
            
            if (result === "set") {
                event.target.parentNode.parentNode.removeChild(event.target.parentNode);

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
            
        });

    }
    
    const handleChange_loadequip = (event) => {
        
    
        // const messageState = useState(props.message);
        
        param.updateCard.setState(param.details);
        // updateCardSet(param.details);
        ClientGetAnyEquipmentImage(param.updateCard.state.emailId, param.updateCard.state.equipmentName).then
                        ((Result) => {
                            if (Result.toString() === "empty") {
                                // console.log(updateCard.state.emailId);
                            }
                            else {
                                
                                //not syncronous
                                // $("#profileImage").attr("src", Result);
                                param.updateCard.file = Result; 
                                param.updateCard.setState({ imagepresent: true, });
                                
                                param.updateCard.setState({});


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
                <div id="displayclose" className="close" onClick={handleChange_dropEquip}></div>
                <div id = {imageID} className="heading">
                    <img id={param.assignedID} className="Equipement" src={param.src} alt="adidas" />
                    <h1>{param.details['equipmentName']}</h1>
                    
                </div>
                <div style={{"width": "100 %","background": "white"}} className="info">
                    <h3>{param.details['description']}</h3>
                    <h3>Available :- {param.details['available']}</h3>
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



