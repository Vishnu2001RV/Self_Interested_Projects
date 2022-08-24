// import { post } from "jquery";

// let base_url = process.env.BASE_URL || 'http://localhost:8000';
let base_url = process.env.BASE_URL || 'https://dart-tractor-server.herokuapp.com';

let url_with_email = base_url + '/' + localStorage.getItem("emailId")??'';

export async function ClientSignUp(newUser) {

    const response = await fetch(base_url+`/signUp?`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify( newUser
        )
      })

    let temp = await response.json();

    if (temp['status'] === "accepted") {

        url_with_email = base_url + '/' + newUser['emailId'];
        localStorage.setItem("emailId", newUser['emailId']);
        localStorage.setItem("instanceKey", temp['instanceKey']);
    }

    return temp['status'];
    
}

export async function ClientLogin(emailId, password) {


    const response = await fetch(base_url + `/login?`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
            {
                "emailId": emailId,
                "password": password,
            }
        )
    })

    let temp = await response.json();

    if (temp['status'] === "accepted") {
        
        url_with_email = base_url + '/' + emailId;
        localStorage.setItem("emailId", emailId);
        localStorage.setItem("instanceKey", temp['instanceKey']);
    }

    return temp['status'];

}

export async function ClientSetUserDetails(updateParam) {

    const response = await fetch(url_with_email+`/setUserDetails?`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'instanceKey': localStorage.getItem('instanceKey')
    },
        body: JSON.stringify(
            updateParam
        )
    })

    let temp = await response.json();
    return temp['status'];

}

export async function ClientgetUserDetails() {

    const response = await fetch(url_with_email+`/getUserDetails?`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'instanceKey': localStorage.getItem('instanceKey')
        },
        
    })

    return await response.json();

}

export async function ClientSetProfileImage(Image) {

    const response = await fetch(url_with_email+`/setProfileImage?`, {
        method: 'POST',
        headers: {
            'Content-Type': 'image/jpeg',
            'instanceKey': localStorage.getItem('instanceKey')
        },
        body: Image
    })

    let temp = await response.json();
    return temp['status'];

}

export async function ClientGetProfileImage(emailId) {

    const response = await fetch(url_with_email+`/getProfileImage?`, {
        method: 'POST',
        headers: {
            'Content-Type': 'image/jpeg',
            'instanceKey': localStorage.getItem('instanceKey'),
            'emailId':emailId,
        },
    })

    return response.text();

}

export async function ClientSetEquipmentImage(Image, equipmentName) {

    const response = await fetch(url_with_email+`/setEquipmentImage?`, {
        method: 'POST',
        headers: {
            'Content-Type': 'image/jpeg',
            'instanceKey': localStorage.getItem('instanceKey'),
            'equipmentName': equipmentName,
        },
        body: Image
    })

    let temp = await response.json();
    return temp['status'];

}

export async function ClientGetAnyEquipmentImage(emailId, equipmentName) {

    const response = await fetch(url_with_email+`/getAnyEquipmentImage?`, {
        method: 'POST',
        headers: {
            'Content-Type': 'image/jpeg',
            'instanceKey': localStorage.getItem('instanceKey'),
            'emailId': emailId,
            'equipmentName': equipmentName,
        },
    })

    return response.text();

}


export async function ClientSetEquipmentWithEmails(updateParam) {

    const response = await fetch(url_with_email+`/setEquipmentWithEmails?`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'instanceKey': localStorage.getItem('instanceKey')
        },
        body: JSON.stringify(
            updateParam
        )
    })

    let temp = await response.json();
    return temp['status'];

}

export async function ClientGetEquipmentDetailsCurrentClient() {

    const response = await fetch(url_with_email+`/getEquipmentDetailsCurrentClient?`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'instanceKey': localStorage.getItem('instanceKey')
        },

    })

    return await response.json();

}

export async function ClientGetEquipmentDetailsOtherClient(equipParam,display=null) {

    const response = await fetch(url_with_email+`/getEquipmentDetailsOtherClient?`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'instanceKey': localStorage.getItem('instanceKey'),
            'displayall': display

        },
        body: JSON.stringify(
            equipParam
        )
    })

    return await response.json();

}


export async function ClientDropEquipmentDetails(equipName) {

    const response = await fetch(url_with_email+`/dropEquipmentDetails?`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'instanceKey': localStorage.getItem('instanceKey'),

        },
        body: JSON.stringify(
            {
                "equipmentName": equipName
            }
        )
    })

    let temp = await response.json();
    return temp['status'];

}