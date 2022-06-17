// ignore: file_names
// ignore_for_file: camel_case_types, prefer_const_constructors, prefer_const_constructors_in_immutables, prefer_const_literals_to_create_immutables, sized_box_for_whitespace, no_logic_in_create_state

import 'dart:convert';
import 'dart:io';
import 'dart:math';
import 'dart:typed_data';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:face_recogonition_3d/src/signup.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_svg/flutter_svg.dart';
// import './Widget/bezierContainer.dart';
import 'package:face_recogonition_3d/src/utils/validator.dart';
import 'package:face_recogonition_3d/src/loginPage.dart';
// import 'package:file_picker/file_picker.dart';
// import 'package:filepicker_windows/filepicker_windows.dart';
import 'package:image_picker/image_picker.dart';
import 'package:face_recogonition_3d/src/MainPage.dart';
// import 'package:camera/camera.dart';
// import 'package:simple_permissions/simple_permissions.dart';
// import 'package:permission_handler/permission_handler.dart';

// import 'package:flutter_image_compress/flutter_image_compress.dart';

class detailsPage extends StatefulWidget {
  detailsPage({Key? key, this.title, this.userName, this.json})
      : super(key: key);

  final String? title;
  final dynamic json;
  final String? userName;

  @override
  _DetailsPageState createState() => _DetailsPageState(userName, json);
}

class _DetailsPageState extends State<detailsPage> {
  TextEditingController userController = TextEditingController();
  TextEditingController descriptionController = TextEditingController();
  TextEditingController designationController = TextEditingController();
  TextEditingController hobbyController = TextEditingController();
  dynamic cameras;
  dynamic _profileImage;

  dynamic json;
  String? userName = "";
  bool _profileImageChanged = false;
  // dynamic image = null;
  // var picked = OpenFilePicker();

  void getInitialDetails(String userName, dynamic jsonValue) async {

    // cameras = await availableCameras();
    dynamic json = await getUserDetailsAPI(userName.toString(), jsonValue);
    dynamic profileImage =
        await getUserProfileAPI(userName.toString(), jsonValue);

    if (json == "Unsucessfull Attempt") {
      // userController.text = "";
      await new Future.delayed(const Duration(seconds: 5));
      getInitialDetails(userName, jsonValue);
    } else if (json['status'] == "active") {
      descriptionController.text = json['Description'];
      designationController.text = json['Designation'];
      hobbyController.text = json['hobby'];
    } else if (json['status'] == "expired") {
      Navigator.push(
          context, MaterialPageRoute(builder: (context) => LoginPage()));
    }

    List<int> list = profileImage.codeUnits;

    if (this.mounted) {
      setState(() {
        this._profileImage = Uint8List.fromList(list);
      });
    }
  }

  _DetailsPageState(String? userName, dynamic json) {
    this.userName = userName;
    this.json = json;
    userController.text = userName.toString();
    getInitialDetails(userName!, json);
  }

  Widget _backButton() {
    return InkWell(
      onTap: () {
        Navigator.pop(context);
      },
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 10),
        child: Row(
          children: <Widget>[
            Container(
              padding: EdgeInsets.only(left: 0, top: 10, bottom: 10),
              child: Icon(Icons.keyboard_arrow_left, color: Colors.black),
            ),
            Text('Back',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500))
          ],
        ),
      ),
    );
  }

  Widget _entryField(
      String title, TextEditingController controller, bool enabled,
      {bool isPassword = false}) {
    return Container(
      margin: EdgeInsets.symmetric(vertical: 15),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            title,
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
          ),
          SizedBox(
            height: 10,
          ),
          TextField(
              enabled: enabled,
              obscureText: isPassword,
              controller: controller,
              decoration: InputDecoration(
                  border: InputBorder.none,
                  fillColor: Color(0xfff3f3f4),
                  filled: true))
        ],
      ),
    );
  }

  Widget _submitButton() {
    return Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: [Colors.red, Color(0xfff7892b)]),
          boxShadow: <BoxShadow>[
            BoxShadow(
                color: Colors.grey.shade200,
                offset: Offset(2, 4),
                blurRadius: 5,
                spreadRadius: 2)
          ],
        ),
        child: TextButton(
            onPressed: () async {
              dynamic body = {
                'description': descriptionController.text,
                'designation': designationController.text,
                'hobby': hobbyController.text
              };

              dynamic json =
                  await setUserDetailsAPI(userName.toString(), this.json, body);

              dynamic json2 = null;

              if (json == "Unsucessfull Attempt") {
                // userController.text = "";
              } else if (json['status'] == "set") {
                Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) =>
                            MainPage(userName: userName, json: json)));
              } else if (json['status'] == "expired") {
                Navigator.push(context,
                    MaterialPageRoute(builder: (context) => LoginPage()));
              }

              if (_profileImage != null && _profileImageChanged == true) {
                dynamic body2 = {
                  'type': 'jpg',
                  'userImage': _profileImage,
                };

                json2 = await setUserProfileAPI(
                    userName.toString(), this.json, _profileImage, 'jpg');
              }
            },
            child: Container(
              width: MediaQuery.of(context).size.width,
              padding: EdgeInsets.symmetric(vertical: 15),
              alignment: Alignment.center,
              child: Text(
                'Update Details',
                style: TextStyle(fontSize: 20, color: Colors.white),
              ),
            )));
  }

  Widget _divider(String text) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        children: <Widget>[
          SizedBox(
            width: 20,
          ),
          Expanded(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 10),
              child: Divider(
                thickness: 1,
              ),
            ),
          ),
          Text(text),
          Expanded(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 10),
              child: Divider(
                thickness: 1,
              ),
            ),
          ),
          SizedBox(
            width: 20,
          ),
        ],
      ),
    );
  }

  Widget _createAccountLabel() {
    return InkWell(
      onTap: () {
        Navigator.push(
            context, MaterialPageRoute(builder: (context) => SignUpPage()));
      },
      child: Container(
        margin: EdgeInsets.symmetric(vertical: 20),
        padding: EdgeInsets.all(15),
        alignment: Alignment.bottomCenter,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const <Widget>[
            Text(
              'Don\'t have an account ?',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
            ),
            SizedBox(
              width: 10,
            ),
            Text(
              'Register',
              style: TextStyle(
                  color: Color(0xfff79c4f),
                  fontSize: 13,
                  fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ),
    );
  }

  Widget _title() {
    return RichText(
      textAlign: TextAlign.center,
      text: const TextSpan(
          text: '3D',
          style: TextStyle(
              fontSize: 30,
              fontWeight: FontWeight.w700,
              color: Color(0xffe46b10)),
          children: [
            TextSpan(
              text: ' Face',
              style: TextStyle(color: Colors.black, fontSize: 30),
            ),
            TextSpan(
              text: ' Recogonition',
              style: TextStyle(color: Color(0xffe46b10), fontSize: 30),
            ),
          ]),
    );
  }

  Widget _detailsWidget() {
    return Column(
      children: <Widget>[
        _entryField("User Name", userController, false),
        _entryField("Description", descriptionController, true),
        _entryField("Designation", designationController, true),
        _entryField("Hobby", hobbyController, true),
      ],
    );
  }

  // void profileImageConverter() async {
  //   image = await decodeImageFromList(_profileImage);
  // }

  // Future<MemoryImage> convert(RawImage rawImage) async {
  //   var byteData = await rawImage.image!.toByteData(
  //     format: ImageByteFormat.png,
  //   );
  //   return MemoryImage(byteData!.buffer.asUint8List());
  // }
// var picked = OpenFilePicker();
  // Future<Uint8List> testCompressFile(File file) async {
  //   var result = await FlutterImageCompress.compressWithFile(
  //     file.absolute.path,
  //     minWidth: 2300,
  //     minHeight: 1500,
  //     quality: 40,
  //     rotate: 90,
  //   );
  //   print(file.lengthSync());
  //   print(result!.length);
  //   return result;
  // }

  // late CameraController _controller;

  
//   late CameraController controller;

// @override
//   void initState() {
//     super.initState();
    
    
//           CameraController controller = CameraController(cameras[0], ResolutionPreset.medium);

//   }

//   @override
//   void dispose() {
//     // Dispose of the controller when the widget is disposed.
//     controller.dispose();
//     super.dispose();
//   }

  final ImagePicker _picker = ImagePicker();
  Widget imageUpload() {
    return ElevatedButton(
      child: Text('UPLOAD FILE'),
      onPressed: () async {
        // Permission. WriteExternalStorage also present;

        // use only for android

        // var status = await Permission.camera.status;
        // if (status.isGranted){


          // List<CameraDescription> cameras = await availableCameras();
          // CameraController controller = CameraController(cameras[0], ResolutionPreset.medium);

        if (this.mounted) {
          
          // final image = await controller.takePicture();

          final XFile? image = await _picker.pickImage(
            preferredCameraDevice: CameraDevice.front,
            source: ImageSource.camera,
            maxWidth: 500,
            maxHeight: 500,
            imageQuality: 40,
          );

          // var picked = await FilePicker.platform.pickFiles();
          dynamic temp = await image!.readAsBytes();

          if (temp != null) {
            setState(() {
              // var temp = picked.files.first.bytes;
              // var temp = picked.getFile()!.readAsBytesSync();
              if (temp != null) {
                this._profileImage = temp;
                _profileImageChanged = true;
              }

              // this._profileImage = picked.files.first.bytes!;
            });
            // profileImageConverter();
          }
        }
      },
    );
  }

  dynamic profilImageWidget() {
    dynamic temp = this._profileImage.lengthInBytes > 8
        ? Image.memory(_profileImage,
            height: MediaQuery.of(context).size.height * 0.4)
        : Image.asset('assets/uploadImage.jpg');
    return temp;
  }

  @override
  Widget build(BuildContext context) {
    Future pro() async {
      dynamic profileImage = await getUserProfileAPI(userName.toString(), json);
      return profileImage;
    }

    final height = MediaQuery.of(context).size.height;
    return Scaffold(
        body: Container(
      height: height,
      child: Stack(
        children: <Widget>[
          Container(
            padding: EdgeInsets.symmetric(horizontal: 20),
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  SvgPicture.asset(
                    'assets/faceRecogonition.svg',
                    width: MediaQuery.of(context).size.width * 0.4,
                    height: MediaQuery.of(context).size.height * 0.4,
                  ),
                  _title(),
                  SizedBox(height: 10),
                  _detailsWidget(),

                  _divider('Profile Image'),
                  imageUpload(),
                  // Image.asset('assets/uploadImage.jpg'),
                  // Image.memory(_profileImage, height: 40.0),

                  Center(
                    // child: _profileImageChanged == false
                    //     ? FutureBuilder(
                    //         future: pro(),
                    //         builder: (context, snapshot) {
                    //           if (snapshot.hasData) {
                    //             if (snapshot.data == "empty") {
                    //               return Image.asset('assets/uploadImage.jpg');
                    //             } else {

                    //               return Image.memory(_profileImage,
                    //                   height:
                    //                       MediaQuery.of(context).size.height *
                    //                           0.4);
                    //             }
                    //           } else {
                    //             return CircularProgressIndicator();
                    //           }
                    //         })
                    //     : Image.memory(_profileImage,
                    //         height: MediaQuery.of(context).size.height * 0.4),

                    child: this._profileImage == null
                        ? CircularProgressIndicator()
                        : profilImageWidget(),
                  ),
                  SizedBox(height: 10),
                  _submitButton(),
                  Container(
                    padding: EdgeInsets.symmetric(vertical: 10),
                    alignment: Alignment.centerRight,
                    child: Text('Forgot Password ?',
                        style: TextStyle(
                            fontSize: 14, fontWeight: FontWeight.w500)),
                  ),
                  SizedBox(height: 1),
                  _createAccountLabel(),
                  SizedBox(height: 10),
                ],
              ),
            ),
          ),
          Positioned(top: 40, left: 0, child: _backButton()),
        ],
      ),
    ));
  }
}
