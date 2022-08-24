export function StaticproductDetails(param) {
    
    return (
        <>
            <fieldset className="start">
                <h2 className="fs-title">Profile Photo</h2>

                {(this.state.imageupdated) ? <img src={param.details.image} alt='' className="profileImage" id="profileImage2" /> : <div></div>}


                <input type="button" name="next" className="next action-button" defaultValue="Next" onClick={this.handleChange_nextclick} />

            </fieldset>
            <fieldset className="Nstart">
                <h2 className="fs-title">Product Owners Details</h2>
                <h3 className="fs-subtitle">Account Details</h3>
                <input type="text" name="emailId" placeholder="Email" value={param.details.emailId} readOnly />
                <input type="text" name="firstname" placeholder="First Name" value={param.details.firstname} />
                <input type="text" name="lastname" placeholder="Last Name" value={param.details.lastname} />
                <input type="button" name="previous" className="previous action-button" defaultValue="Previous" onClick={this.handleChange_previousclick} />
                <input type="button" name="next" className="next action-button" defaultValue="Next" onClick={this.handleChange_nextclick} />

            </fieldset>

            <fieldset className="Nstart">
                <h2 className="fs-title">Personal Details</h2>
                <h3 className="fs-subtitle">We will never sell it</h3>
                <input type="text" name="designation" placeholder="Designation" value={param.details.designation} />
                <input type="text" name="phoneno" placeholder="Phone" value={param.details.phoneno} />
                <input type="button" name="previous" className="previous action-button" defaultValue="Previous" onClick={this.handleChange_previousclick} />
                <input type="button" name="next" className="next action-button" defaultValue="Next" onClick={this.handleChange_nextclick} />
            </fieldset>

            <fieldset className="Nstart">
                <h2 className="fs-title">Location Details</h2>
                <h3 className="fs-subtitle">Your presence on the social network</h3>

                <input type="text" name="state" placeholder="State" value={param.details.state} />
                <input type="text" name="city" placeholder="City" value={param.details.city} />
                <textarea name="profileNote" placeholder="ProfileNote" value={param.details.profileNote} />

                <input type="button" name="previous" className="previous action-button" defaultValue="Previous" onClick={this.handleChange_previousclick} />

            </fieldset>


        </>


    );
}

export default StaticproductDetails;