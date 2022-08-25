import 'package:shelf_plus/shelf_plus.dart';
import 'package:shelf_cors_headers/shelf_cors_headers.dart';
import 'database/database_util.dart';
import 'dart:io' show Platform;
import 'package:shelf/shelf_io.dart';
/*
* after inserting package run dart pub upgrade
* client connected will be given a unique key ie id while connecting
* to run in debug mode(instant reload) use dart run --enable-vm-service

* Reference:- at end of file
*/

var portEnv = Platform.environment['PORT'];
var port = portEnv == null ? 8000 : int.parse(portEnv!);

void main() async {

  var initialize = await init();
  
  var overrideHeaders = {
    ORIGIN : "http://localhost:3000",
    ACCESS_CONTROL_ALLOW_ORIGIN: "http://localhost:3000",
    // //change this to the localhost where flutter app started
    ACCESS_CONTROL_ALLOW_METHODS: "GET, POST, DELETE, OPTIONS",
    ACCESS_CONTROL_ALLOW_HEADERS: "*",
    'Content-Type': 'application/json;charset=utf-8'
  };

  var handler = const Pipeline()
      .addMiddleware(corsHeaders(headers: overrideHeaders))
      .addHandler(initialize);

  var server = await serve(handler, '0.0.0.0', port);
  server.autoCompress = true;
  print('Serving at http://${server.address.host}:${server.port}');
}
// void main() => shelfRun(init);
Future<Handler> init() async {
  

  var header = {
    ORIGIN: "http://localhost:3000",
    // "AccessControl-Allow-Origin":"http://localhost:3000",
    // ORIGIN : "http://localhost:3000",
    
    ACCESS_CONTROL_ALLOW_ORIGIN: "*",
    // // //change this to the localhost where flutter app started
    ACCESS_CONTROL_ALLOW_METHODS: "GET, POST, DELETE, OPTIONS",
    ACCESS_CONTROL_ALLOW_HEADERS: "*",
    'Content-Type': 'application/json',
    // 'Content-Type': 'application/json;charset=utf-8'
  };

  databaseOpen();
  var app = Router().plus;
  app.use(corsHeaders( headers: header
    
  ));

  // using middleware using shelf_plus use has no effect
  // so did the middleware and serve in the main() function itself
  // app.use(middleware.middleware);

  //server get
  app.get('/',()=>"Your accessing via Browser");

  //signup
  app.post('/signUp', signUp);

  // login
  app.post('/login', login);

  // setProfileImage
  app.post('/<emailId>/setProfileImage', setProfileImage,
      use: download());

  // setUserDetails
  app.post('/<emailId>/setUserDetails', setUserDetails);

  // getProfileImage
  app.post('/<emailId>/getProfileImage', getProfileImage);

  // getUserDetails
  app.post('/<emailId>/getUserDetails', getUserDetails);


  // setEquipmentImage
  app.post('/<emailId>/setEquipmentImage', setEquipmentImage);

  // getAnyEquipmentImage
  app.post('/<emailId>/getAnyEquipmentImage', getAnyEquipmentImage);


  // getEquipmentDetailsOtherClient
  app.post('/<emailId>/getEquipmentDetailsOtherClient', getEquipmentDetailsOtherClient);

  // getEquipmentDetailsCurrentClient
  app.post('/<emailId>/getEquipmentDetailsCurrentClient',
      getEquipmentDetailsCurrentClient);


  //setEquipmentWithEmails
  app.post('/<emailId>/setEquipmentWithEmails', setEquipmentWithEmails);

  //dropEquipmentDetails
  app.post('/<emailId>/dropEquipmentDetails', dropEquipmentDetails);


  // set3dModel
  app.post('/<emailId>/set3dModel/<fileType>', set3dModel);

  // get3dModel
  app.post('/<emailId>/get3dModel/<fileType>', get3dModel);

  return app;
}

/*
 *  Client Side:- //TODO
 *  1. SignUp
 *        - (Request) userName and password is (sent)
 *        - (Response) status and instance key
 *  2. Login 
 *        - (Request) userName and password is (sent)
 *        - (Response) status and instance key
 *  3. setUserDetails 
 *        - attach the instance key got from login or signUp to the (API)headers
 *        - url:-  url/<userName>/setUserDetails
 *        - (Request) description, designation, hobby 
 *        - (Response) status
 *  4. getUserDetails
 *        - attach the instance key got from login or signUp to the (API)headers
 *        - url:- url/<userName>/getUserDetails
 *        - (Request) ---
 *        - (Response) status, designation,description,hobby
 *  5. setProfileImage
 *        - attach the instance key got from login or signUp to the (API)headers
 *        - url :- url/<userName>/setProfileImage
 *        - body:- a binary file
 *        - (Request) Image sent as bytes
 *        - (Response) status
 * 
 *  6. getProfileImage
 *        - attach the instance key got from login or signUp to the (API)headers
 *        - url :- url/<userName>/getProfileImage
 *        - (Request) ---
 *        - (Response) Image received as bytes
 *  7. set3dModel
 *        - attach the instance key got from login or signUp to the (API)headers
 *        - url :- url/<userName>/set3dModel/<fileType>
 *        - body:- a binary file
 *        - (Request) File sent as bytes
 *        - (Responce) status
 *  8. get3dModel
 *       - attach the instance key got from login or signUp to the (API)headers
 *       - url :- url/<userName>/get3dModel/<fileType>
 *       - (Request)  ---
 *       - (Responce) File received as bytes
 */
