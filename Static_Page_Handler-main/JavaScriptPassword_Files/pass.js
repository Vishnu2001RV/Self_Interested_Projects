// Adding Listner to input to enable enter option
var input = document.getElementById("pswd");
input.addEventListener("keyup", function (event) {

    if (event.code.toString() === "Enter") 
    {
        event.preventDefault();
        document.getElementById("button1").click();
    }
});

//To Extract value from cookie (stack overflow)
function getCookie(name) 
{
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();

}


function transmission(ws, person, opened) 
{

    var password = document.getElementById("pswd").value;

    if (opened)
        ws.send(person);
    else
        ws.onopen = () => ws.send(person);

    ws.onmessage = function (event) {
        if (event.data == "valid") {

            ws.send(password);

            ws.onmessage = function (direction_change) {

                if (direction_change.data == "Password Error") {
                    alert("Passwords do not match");
                    ws.close();
                }
                else {
                    window.location = direction_change.data;
                }

            }
        }
        else {
            window.location = "unknown.html";
        }
    };

    ws.onclose = function (event) {
        if (!event.wasClean) {
            console.log("Server Shutdown before completion")
        } 
    };

}

function checkPswd() 
{

    var person = prompt("Please enter your User Name", getCookie("person"));
    document.cookie = "person = " + person + "; path=/";

    var address = getCookie("address");
    var ws = new WebSocket("wss://" + address + ".ngrok.io");

    /*
     * If there exist custom domain https://loginliveexample.com/websocket
     * Steps:-
     * 1. 
     * 2. Need to portfoward the localhost to the customdomain
     * 3. Replace ws with var ws = new WebSocket("ws://loginliveexample.com/websocket");
     * 4. Can skip else part of onerror if there is a fixed domain
    */

    ws.onerror = (event) => 
    {

        address = prompt("Re-Enter-The-Login", "");

        if (address == "localhost") // localhost connection only when server is down
        {
            transmission(new WebSocket("ws://localhost:6969/"), person, false);
        }
        else 
        {
            document.cookie = "address = " + address + "; path=/";
            transmission(new WebSocket("wss://" + address + ".ngrok.io"), person, false);
        }

    };

    ws.onopen = () => transmission(ws, person, true); //3rd argument to ensure that transmission is not called twice

}
