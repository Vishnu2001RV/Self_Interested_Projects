import './App.css';
import { ProductContents } from './availableProduct.js';
import androidphone from './Android_Phone.png'
import Rive, { Layout } from 'rive-react';
import FarmerAnimation from './FarmerMultiple.riv'
import ploughed from './ploughed.jpg'
import unploughed from './unploughed.jpg'

function App() {

  return (
      <div className="App">
          
          <div className="BodyContent">
              <div className="content1">
                  <h1 className="androidheader">Android Phone Display </h1>
                  <div className="phone">
                      <img src={androidphone} className="androidphoneimg" alt="Phone Animation" />
                      <video src={'/videos/Docs_Animation.mp4'} className="videoCSS" loop autoPlay muted />
                          {/* Without muted video autoplay not works */}
                  </div>
                  <div id="farmerAlone">
                      <Rive src={FarmerAnimation} artboard="Farmer" animations={["Farmer2sec"]} layout={new Layout({ fit: 'contain', alignment: 'center'})}  />
                  </div>
              </div>  
              <div id="container">
                  <h1>Available Product Contents</h1>
                  <ProductContents assignedID="1" src="/ProductImages/tractor1.jpg"></ProductContents>
                  <ProductContents assignedID="2" src="/ProductImages/tractor1.jpg"></ProductContents>
                  <ProductContents assignedID="3" src="/ProductImages/tractor1.jpg"></ProductContents>
                  <ProductContents assignedID="4" src="/ProductImages/tractor1.jpg"></ProductContents>
              </div>
              
              <div className="content2">
                  <div id="farmerAppliation">
                      <Rive src={FarmerAnimation} artboard="Farmer" animations={["Farmer5sec"]} />
                  </div>
                  <div id="container1">
                      <div id="Tractor">
                          <Rive src={FarmerAnimation} artboard="Tractor" animations={["Tractor_Ploughing"]} layout={new Layout({ fit: 'fill', alignment: 'center' })}  />
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
}
export default App;


