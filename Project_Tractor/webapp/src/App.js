import "./App.css";
import React from 'react';
// npm install -S react-router-dom  use this to update the package in package.json also else it update only in dev
import {
    BrowserRouter,
    // Switch,
    Routes,
    Route,
    // Redirect,
} from "react-router-dom";

// import About component
import About from "./components/About";
// import ContactUs component
// import ContactUs from "./components/ContactUs";

import Login from "./components/Login";

import SignUp from "./components/SignUp";

import UpdateProfile from "./components/UpdateProfile";

import UpdateEquipmentDetails from "./components/UpdateEquipmentDetails";

import SetEquipmentDetails from "./components/SetEquipmentDetails";

import SearchProducts from "./components/SearchProducts";
class App extends React.Component {


    static name = '';
    static token = '';

    render() {
        
        return (
            <>
                <BrowserRouter>
                    <Routes>
                        <Route path="/AboutUs" element={<About />} /> {/*pass variable as param to home*/}
                        <Route path="/Login" element={<Login />} />
                        <Route path="/SignUp" element={<SignUp />} />
                        <Route path="/UpdateProfile" element={<UpdateProfile />} />
                        <Route path="/UpdateEquipmentDetails" element={<UpdateEquipmentDetails />} />
                        <Route path="/SetEquipmentDetails" element={<SetEquipmentDetails />} />
                        <Route path="/SearchProducts" element={<SearchProducts />} />
                        {/* <Route path='/SignOut' element={<Login />} /> */}
                        <Route path='*' exact={true} element={<Login />} />
                    </Routes>
                </BrowserRouter>
            </>
        );
    }

}
export default App;



// function App() {
//     var isLoggedIn =false;
//     return (
//         <>
//             <BrowserRouter>
//                 <Routes>
//                     <Route path="/Home" element={<Home />} />
//                     <Route path="/Login" element={<Login />} />
//                     <Route path="/SignUp" element={<SignUp />} />
//                 </Routes>
//             </BrowserRouter>
//         </>
//     );
// }

// export default App;


// import './App.css';
// import { ProductContents } from './availableProduct.js';
// import androidphone from './Android_Phone.png'
// import Rive, { Layout } from 'rive-react';
// import FarmerAnimation from './FarmerMultiple.riv'
// import ploughed from './ploughed.jpg'
// import unploughed from './unploughed.jpg'

// function App() {

//   return (
//       <div className="App">
//           <h1 className="androidheader">Tractor Workshop</h1>
//           <div className="BodyContent">
//               <div className="content1">
                  
//                   <div className="phone">
//                       <img src={androidphone} className="androidphoneimg" alt="Phone Animation" />
//                       <video src={'/videos/Docs_Animation.mp4'} className="videoCSS" loop autoPlay muted />
//                           {/* Without muted video autoplay not works */}
//                   </div>
//                   <div id="farmerAlone">
//                       <Rive src={FarmerAnimation} artboard="Farmer" animations={["Farmer2sec"]} layout={new Layout({ fit: 'contain', alignment: 'center'})}  />
//                   </div>
//               </div>  
//               <div id="container">
//                   <h1>Available Product Contents</h1>
//                   <ProductContents assignedID="1" src="/ProductImages/tractor1.jpg"></ProductContents>
//                   <ProductContents assignedID="2" src="/ProductImages/tractor1.jpg"></ProductContents>
//                   <ProductContents assignedID="3" src="/ProductImages/tractor1.jpg"></ProductContents>
//                   <ProductContents assignedID="4" src="/ProductImages/tractor1.jpg"></ProductContents>
//               </div>
              
//               <div className="content2">
//                   <div id="farmerAppliation">
//                       <Rive src={FarmerAnimation} artboard="Farmer" animations={["Farmer5sec"]} />
//                   </div>
//                   <div id="container1">
//                       <div id="Tractor">
//                           <Rive src={FarmerAnimation} artboard="Tractor" animations={["Tractor_Ploughing"]} layout={new Layout({ fit: 'fill', alignment: 'center' })}  />
//                       </div>
//                       <div id="farmLand">
//                           <img className="bottom" src={ploughed} alt="ploughed" />
//                           <img className="top" src={unploughed} alt="unploughed" />
//                       </div>
//                   </div>
//               </div> 
//           </div>
//       </div>
//   );
// }
// export default App;

// // todo1

// // import React from 'react';
// // // import ReactDOM from 'react-dom/client';

// // function Car(props) {
// //     return <li>I am a {props.brand}</li>;
// // }

// // function Garage() {
// //     const cars = ['Ford', 'BMW', 'Audi'];
// //     return (
// //         <>
// //             <h1>Who lives in my garage?</h1>
// //             <ul>
// //                 {cars.map((car) => <Car brand={car} />)}
// //             </ul>
// //         </>
// //     );
// // }

// // // const root = ReactDOM.createRoot(document.getElementById('root'));
// // // root.render(<Garage />);
// // function App() {
// //   return (
// //       <div className="App">
// //           <Garage />
// //       </div>
// //   );
// // }
// // export default App;