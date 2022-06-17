import 'dart:convert';
import 'package:http/http.dart' as http;

//Todo
// 48000000 bytes only these many bytes accepted by the server
// no larger file

Future<dynamic> loginAPI(String userName, String password) async {
  final response = await http.post(
    Uri.parse('https://dartconsoleserver.herokuapp.com/login'),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode(
        <String, String>{"userName": userName, "password": password}),
  );

  if (response.statusCode == 200) {
    return jsonDecode(response.body.toString());
  } else {
    return "Unsucessfull Attempt";
  }
}

Future<dynamic> signUpAPI(String userName, String password) async {
  final response = await http.post(
    Uri.parse('https://dartconsoleserver.herokuapp.com/signUp'),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode(
        <String, String>{"userName": userName, "password": password}),
  );

  if (response.statusCode == 200) {
    return jsonDecode(response.body.toString());
  } else {
    return "Unsucessfull Attempt";
  }
}

Future<dynamic> setUserDetailsAPI(
    String userName, dynamic json, dynamic body) async {
  final response = await http.post(
    Uri.parse('https://dartconsoleserver.herokuapp.com/' +
        userName +
        '/setUserDetails'),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'instanceKey': json['instanceKey']
    },
    body: jsonEncode(body),
  );

  if (response.statusCode == 200) {
    return jsonDecode(response.body.toString());
  } else {
    return "Unsucessfull Attempt";
  }
}

Future<dynamic> getUserDetailsAPI(String userName, dynamic json) async {
  final response = await http.post(
    Uri.parse('https://dartconsoleserver.herokuapp.com/' +
        userName +
        '/getUserDetails'),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'instanceKey': json['instanceKey']
    },
    body: jsonEncode({'userName': userName}),
  );

  if (response.statusCode == 200) {
    return jsonDecode(response.body.toString());
  } else {
    return "Unsucessfull Attempt";
  }
}

Future<dynamic> setUserProfileAPI(
    String userName, dynamic json, dynamic body, String type) async {
  final response = await http.post(
    Uri.parse('https://dartconsoleserver.herokuapp.com/' +
        userName +
        '/setProfileImage/' +
        type),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'instanceKey': json['instanceKey']
    },
    body: body,
  );

  if (response.statusCode == 200) {
    return jsonDecode(response.body.toString());
  } else {
    return "Unsucessfull Attempt";
  }
}

Future<dynamic> getUserProfileAPI(String userName, dynamic json) async {
  final response = await http.post(
      Uri.parse('https://dartconsoleserver.herokuapp.com/' +
          userName +
          '/getProfileImage'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'instanceKey': json['instanceKey']
      },
      body: jsonEncode({'fileType': 'jpg'}));

  if (response.statusCode == 200) {
    // return jsonDecode(response.body.toString());
    
    // if (response.contentLength! < 8) {
    //   return String.fromCharCodes(response.body.codeUnits);
    // }
    return response.body;
  } else {
    return "Unsucessfull Attempt";
  }
}
