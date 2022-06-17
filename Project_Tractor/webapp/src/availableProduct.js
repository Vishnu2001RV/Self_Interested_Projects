import './availableProduct.css';
import $ from 'jquery';



export function ProductContents(param) {

    var cardID = "addItemClass" + param.assignedID
    var imageID = "heading"+ param.assignedID

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
        $("#" + (param.assignedID)).attr('style', 'width: calc(100% - 4em)');
        $("#heading" + param.assignedID).css('height', '10.5em');
    }
    function MouseOut(event) {
        $("#" + (param.assignedID)).attr('style', 'width: calc(100% - 0em)');
        $(".heading").css('height', '13.5em');
        event.target.scrollTo(0, 0);
    }
    
    return (
        <>
            <div id={cardID} className="card scroll" onMouseOver={MouseOver} onMouseOut={MouseOut}>
                <div id = {imageID} className="heading">
                    <img id={param.assignedID} className="Equipement" src={param.src} alt="adidas" />
                    <h1>Tractor2</h1>
                </div>
                <div className="info">
                    <h3>This is the Fully Equiped tractor </h3>
                    <div className="sizes">
                        <button>39</button>
                        <button>40</button>
                        <button className="active">42</button>
                        <button>44</button>
                    </div>
                    <div className="purchase">
                        <button>Purchase</button>
                    </div>
                </div>
            </div>
        
        </>
        
        
    );
}



