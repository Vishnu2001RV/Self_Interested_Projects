# A Server approach towards Static WebPages

*This is an example on how to use server and protect the pages for clients, hosted via static server.*
### Github Repo at [Static_Page_Handler](https://github.com/Vishnu2001RV/Static_Page_Handler)

<h3><b>Note:-</b></h3>

*Server has control on the direction of pages hosted for clients.*

# Server Side

## server.py
  Part 1
 <b>
- This is a python server which uses a http-server to host the content in the directory JavaScriptPassword_Files.
- The server has many options like. </b>

```bash
 1. Send all client connected now
 2. Pause all client connecting now
 3. Add a User
 4. Remove a User
 5. Change Password
 6. Change the Redirection
 7. To print users still connected
 8. Exit
```
 Part 2
<b>
- The server receives username and transmits the validity,  direction through the websocket
- When Server side selects option 1 the client sends the password that is checked by server and returns direction => `"./mainfile.html"` when password is correct else `returns "Password error"`
- Server has option to change the redition eg change from `./mainfile.html` to `./subfile.html`
- Server sends direction of website only to the user that is present in `server.py`
- Users can later on be added or removed from the serve.</b>
## Demonstrating Few Options
   <b><p>By chossing option 1<p align = "center">All the client connected refresh itself to the direction that the server sends</p></p>
   <p>By choosing option 2<p align = "center">All the upcomming client that are connected are in pause state till server is in option 1 state.</p></p>
   <p>By choosing option 7<p align = "center">Displays the Clients Connected(If option 2 Server State is Enabled )</p></p></b>

   
## Some Information About Server
- 1. The server host the folder `obfuscated_files` at `localhost://8084`  using python's `http.server` for Development purpose;
  2. Server host the websocket server at port `6969` which is then portforwared to the custom domain.
  3. Here we have used `ngrok` to portfoward the port `6969` to ramdom domain name. So user needs to at least one time fill the domain name when asked. This happens during first time or when there is change in random domain name.

## If choose to use custom domain <b>

- 1. *Follow the steps mentioned in comment statement in `function checkPswd()`present in `./JavaScriptPassword_Files/pass.js`*
  2. *Later on u can forward `localhost://8084` to `https://loginliveexample.com/files` and foward port `6969` to  `https://loginliveexample.com/websocket` . So that client can recive websocket connection and get `pass.js` from single server.*
  3. *Need to Change `pass.js`(as mentioned on point 11) and `login.html`(as below)*
       ```html
       <script id = "pass" type="application/javascript" src="https://loginliveexample.com/files/pass.js" hidden></script>
       ``` 

## Client Side(ie the Pages hosted for clients)

1. *</b><b>Should include `login.html` along with the file(`eg mainfile.html`) which has to be redirected from login.html `./File_in_Client_Static_Page/login.html)`</b>*
2. *<b>Should include a folder(obfuscated_files) along with login.html</b>*
3. *<b>The order of files on client side</b>*

   ```bash
   ---HostingFolder
         |----obfuscated_files
         |         |---pass.js
         |
         |-----login.html
         |-----mainfile.html
         |-----subfile.html

   ```

 4. *<b>The login.html has a script which enables it to use pass.js</b>*
 5. *<b>Later on when there is fixed domain to host javascript , src can be changed to that domain if needed.</b>*
```html
<script id = "pass" type="application/javascript" src="./obfuscated_files/pass.js" hidden></script>
```
 6. *<b>By adding this script in head tag of the website like `mainfile.html` or `subfile.html` we are ensuring that the client wont be able to get back to the page after it has been loaded to his browser and wont be able to see this script `startup` after it has been loaded locally.</b>*

```html
 <script id = "startup">
    function addState() 
        {
                let stateObj = { id: "101" };
                try 
                {
                    window.history.replaceState(stateObj,"CS161", window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/") + 1)+"CS161.html");
                }
                catch(exception)
                {
                    // To ensure that url is changed else to terminate the loading
                    console.log(exception)
                    alert("Open the Page using http-server or use a static webpage hoster");
                    window.stop();
  
                }
  
        }
        addState();
        document.getElementById("startup").remove();  
</script>
```
 Remember:

```javascript
 // from stack overflow
window.history.replaceState() //will change the URL in the browser (ie. pressing the back button won't take you back)

window.history.pushState() //will change the URL, and keep the old one in the browser history (ie. pressing the back button will take you back)
```
 ### Always client side should be started with http server or other server and not locally

- Details on obfuscated files and login.html are given below.

# terser.js (To obfuscate the javascript)

*It is mainly used to create a obfucated code of pass.js in JavaScriptPassword_Files and stores it in folder named obfuscated_files*

Prerequisite:-

1. *<b>Should contain node.js</b>*
2. ```apache
   npm install -g terser  
   npm install terser
   ```
3. *<b>For additional Details look on to the  [Documnetation of Terser](https://github.com/terser/terser)</b>*
4. *<b>Do ```node terser.js```</b>*
5. *<b>To Get the Obfuscated file pass.js in folder ```obfuscated_files```</b>*
```bash
---HostingFolder
  |
  |----obfuscated_files
  |         |---pass.js
  |
  |-----JavaScriptPassword_Files
  |         |---pass.js
  |
  |-----terser.js

node terser.js
```
# Example of login.html

```html
<!DOCTYPE html>
<html lang="en-US">
<head>
    <title>Login page</title>
</head>
<body>
    <form onsubmit="return false">
        <label for="pswd">Enter your password: </label>
        <input type="password" id="pswd">
        <input id ="button1" type="button" value="Submit" onclick="checkPswd();">
    </form> 
    <!--Function to check password -->
    <script id = "pass" type="application/javascript" src="./obfuscated_files/pass.js" hidden></script>
</body>
</html>
```
## load.js (Optional)
- *<b>It is temporarily used to protect pass.js</b>*
