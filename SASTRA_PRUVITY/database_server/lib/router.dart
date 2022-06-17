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
var port = portEnv == null ? 9999 : int.parse(portEnv!);

void main() async {

  var initialize = await init();
  
  var overrideHeaders = {
    // ORIGIN : "localhost:64907",
    ACCESS_CONTROL_ALLOW_ORIGIN: "*",
    //change this to the localhost where flutter app started
    ACCESS_CONTROL_ALLOW_METHODS: "GET, POST, DELETE, OPTIONS",
    ACCESS_CONTROL_ALLOW_HEADERS: "*",
    "Content-Type": "application/json"
  };

  var handler = const Pipeline()
      .addMiddleware(corsHeaders(headers: overrideHeaders))
      .addHandler(initialize);

  var server = await serve(handler, '0.0.0.0', port);
  server.autoCompress = true;
  print('Serving at http://${server.address.host}:${server.port}');
}

Future<Handler> init() async {
  databaseOpen();
  var app = Router().plus;

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
  app.post('/<userName>/setProfileImage/<fileType>', setProfileImage,
      use: download());

  // setUserDetails
  app.post('/<userName>/setUserDetails', setUserDetails);

  // getUserDetails
  app.post('/<userName>/getUserDetails', getUserDetails);

  // getProfileImage
  app.post('/<userName>/getProfileImage', getProfileImage);

  // set3dModel
  app.post('/<userName>/set3dModel/<fileType>', set3dModel);

  // get3dModel
  app.post('/<userName>/get3dModel/<fileType>', get3dModel);

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
