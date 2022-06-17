// TODO Implement this library.
// using cookie one could say for next tab if login is needed or not (save the instace key on cokkie)

import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:shelf_plus/shelf_plus.dart';
import 'package:mongo_dart/mongo_dart.dart';
/*
   -Database:-
            userDetails : (temp inventory)
                                   - userName
                                   - password
                                   - description
                                   - designation
                                   - hobby

            userVsTokens :
                                  - userName
                                  - tokens [{},{},{}]

            userVsProfileImage : 
                                   - userName
                                   - Image
           
            userVsStoredFile :      
                                   - userName
                                   - type
                                   - binaryFile

* Reference:- at end of file
*/

/**
 * For deployment we use mongo atlas so no need the bellow variables
 */
// String host = Platform.environment['MONGO_DART_DRIVER_HOST'] ?? '127.0.0.1';
// String port = Platform.environment['MONGO_DART_DRIVER_PORT'] ?? '27017';

class Person {
  final String name;
  final String password;
  Person({required this.name, required this.password});
  static Person fromJsonSignup(Map<dynamic, dynamic> json) {
    return Person(name: json['userName'], password: json['password']);
  }
}

class ImageData {
  final String type;
  dynamic image;

  ImageData({required this.type, this.image});

  // created with tools like json_serializable package
  static ImageData fromJson(Map<String, dynamic> json) {
    return ImageData(type: json['type'], image: json['userImage']);
  }
}

class PersonDetails {
  final String description;
  final String designation;
  final String hobby;
  PersonDetails(
      {required this.description,
      required this.designation,
      required this.hobby});
  static PersonDetails fromJsonPersonDetails(Map<dynamic, dynamic> json) {
    return PersonDetails(
        description: json['description'],
        designation: json['designation'],
        hobby: json['hobby']);
  }
}

extension PersonAccessor on RequestBodyAccessor {
  Future<Person> get asPersonSignUp async =>
      Person.fromJsonSignup(await asJson);

  Future<PersonDetails> get getPersonDetails async =>
      PersonDetails.fromJsonPersonDetails(await asJson);
}

void tokenUpdater(
    String userName, DbCollection collection, String token) async {
  var nextExpiry = setExpiryTime();
  collection.updateOne({
    "userName": userName,
    "token": {
      "\$elemMatch": {"value": token}
    }
  }, {
    "\$set": {"token.\$.expiryTime": nextExpiry}
  });
}

Future<dynamic> tokenValidator(
    DbCollection collection, String token, String user) async {
  String status = "invalid";
  var query = await collection.findOne({
    "userName": user,
    "token": {
      "\$elemMatch": {"value": token}
    }
  });

  if (query != null) {
    var now = DateTime.now();
    status = "expired";
    for (var i in query['token']) {
      if (i['value'].toString() == token) {
        /*
         * Checks if time is expired or not using date and time in dart
         * Then ask for function to update
         */
        if (now.isBefore(i['expiryTime'])) {
          status = "active";
          tokenUpdater(user, collection, token);
          break;
        }
      }
    }
  }
  return {"status": status};
}

Future<bool> userExist(DbCollection collection, String user) async {
  var p = await collection.findOne({"userName": user});

  if (p != null) {
    return true;
  }
  return false;
}

DateTime setExpiryTime() {
  return DateTime.now().add(const Duration(seconds: 120));
}

dynamic collection1;
dynamic collection2;
dynamic collection3;
dynamic collection4;

void databaseOpen() async {
  var mongo_password = Platform.environment['MONGO_PASSWORD'];
  var mongo_uri = Platform.environment['MONGODB_URI'];

  if (mongo_uri != null) {
    mongo_uri = mongo_uri.replaceAll('<password>', mongo_password!);
  } else {
    String host = Platform.environment['MONGO_DART_DRIVER_HOST'] ?? '127.0.0.1';
    String port = Platform.environment['MONGO_DART_DRIVER_PORT'] ?? '27017';
    mongo_uri = 'mongodb://$host:$port/sastra_pruvity';
  }

  var db = await Db.create(mongo_uri);
  // var db = Db(mongo_uri.toString());

  await db.open(secure: true);

  collection1 = db.collection('userDetails');
  collection2 = db.collection('userVsTokens');
  collection3 = db.collection('userVsProfileImage');
  collection4 = db.collection('userVsStoredFile');
  /*
     During Actual runtime each server restart should delete the instance token 
     collection2.drop();
  */
  collection2.drop();
}

dynamic signUp(Request request) async {
  var p = await request.body.asPersonSignUp;

  if (await userExist(collection1, p.name) == false) {
    String token = ObjectId().toString().split("\"")[1];

    await collection1.insertOne({
      "userName": p.name,
      "password": p.password,
      "description": "",
      "designation": "",
      "hobby": "",
      "token": []
    });

    await collection2.insertOne({
      "userName": p.name,
      "token": [
        {"value": token, "expiryTime": setExpiryTime()}
      ]
    });

    return {'status': 'accepted', 'instanceKey': token};
  }

  return {'status': 'duplicateEntry', 'instanceKey': 0};
}

dynamic login(Request request) async {
  var p = await request.body.asPersonSignUp;
  var temp =
      await collection1.findOne({"userName": p.name, "password": p.password});

  if (temp != null) {
    String token = ObjectId().toString().split("\"")[1];

    await collection2.update({
      "userName": p.name
    }, {
      "\$push": {
        "token": {"value": token, "expiryTime": setExpiryTime()}
      }
    }, upsert: true);
    return {'status': 'accepted', 'instanceKey': token};
  } else {
    return {'status': 'rejected', 'instanceKey': 0};
  }
}

dynamic setProfileImage(
    Request request, String userName, String fileType) async {
  // binary file so cannot get user name as object

  userName = Uri.decodeFull(userName);
  final headerFiles = request.headers;
  String token = headerFiles['instanceKey'].toString();

  dynamic result = await tokenValidator(collection2, token, userName);

  if (result["status"] == "active") {
    // cannot set images more than 48000000 bytes

    var file = await request.read().expand((x) => x).toList();

    await collection3.updateOne({
      "userName": userName
    }, {
      "\$set": {"fileType": fileType, "userImage": file}
    }, upsert: true);

    return {'status': 'set'};
  } else if (result["status"] == "expired") {
    return {'status': 'expired'};
  } else {
    return {'status': 'invalid'};
  }

  // for corresponding user check if the instaceKey present in InstanceKeys
}

dynamic setUserDetails(Request request, String userName) async {
  userName = Uri.decodeFull(userName);
  var p = await request.body.getPersonDetails;
  final headerFiles = request.headers;
  String token = headerFiles['instanceKey'].toString();
  dynamic result = await tokenValidator(collection2, token, userName);

  if (result["status"] == "active") {
    await collection1.updateOne({
      "userName": userName
    }, {
      "\$set": {
        "description": p.description,
        "designation": p.designation,
        "hobby": p.hobby
      }
    });

    return {'status': 'set'};
  } else if (result["status"] == "expired") {
    return {'status': 'expired'};
  } else {
    return {'status': 'invalid'};
  }
}

dynamic getUserDetails(Request request, String userName) async {
  userName = Uri.decodeFull(userName);
  final headerFiles = request.headers;
  String token = headerFiles['instanceKey'].toString();
  dynamic result = await tokenValidator(collection2, token, userName);
  if (result["status"] == "active") {
    var temp = await collection1.findOne({"userName": userName});
    return {
      'status': 'active',
      'Designation': temp!["designation"],
      'Description': temp["description"],
      'hobby': temp["hobby"]
    };
  } else if (result["status"] == "expired") {
    return {'status': 'expired'};
  } else {
    return {'status': 'invalid'};
  }
}

dynamic getProfileImage(Request request, String userName) async {
  userName = Uri.decodeFull(userName);
  final headerFiles = request.headers;
  String token = headerFiles['instanceKey'].toString();
  dynamic result = await tokenValidator(collection2, token, userName);

  if (result["status"] == "active") {

    var temp = await collection3.findOne({"userName": userName});

    if (temp == null) return "empty";

    var bytes = Uint8List.fromList(temp["userImage"].cast<int>());

    return bytes;
  } else if (result["status"] == "expired") {
    return {'status': 'expired'};
  } else {
    return {'status': 'invalid'};
  }
}

dynamic set3dModel(Request request, String userName, String fileType) async {
  userName = Uri.decodeFull(userName);
  final headerFiles = request.headers;
  String token = headerFiles['instanceKey'].toString();

  dynamic result = await tokenValidator(collection2, token, userName);

  if (result["status"] == "active") {
    var file = await request.read().expand((x) => x).toList();

    await collection4.updateOne({
      "userName": userName
    }, {
      "\$set": {"fileType": fileType, "user3dModel": file}
    }, upsert: true);

    return {'status': 'set'};
  } else if (result["status"] == "expired") {
    return {'status': 'expired'};
  } else {
    return {'status': 'invalid'};
  }
}

dynamic get3dModel(Request request, String userName, String fileType) async {
  userName = Uri.decodeFull(userName);
  final headerFiles = request.headers;
  String token = headerFiles['instanceKey'].toString();

  dynamic result = await tokenValidator(collection2, token, userName);

  if (result["status"] == "active") {
    var temp =
        await collection4.findOne({"userName": userName, "fileType": fileType});

    var bytes = Uint8List.fromList(temp["user3dModel"].cast<int>());

    return bytes;
  } else if (result["status"] == "expired") {
    return {'status': 'expired'};
  } else {
    return {'status': 'invalid'};
  }
}
/*

   References:- 

   db.inventory.find( {item:"journal","instock": { $elemMatch: { warehouse: "C" } } } )
   db.inventory.update( {item:"journal","instock": { $elemMatch: { warehouse: "A" } } },{$set: { "instock.$.warehouse" : "NEW content B" }})
*/