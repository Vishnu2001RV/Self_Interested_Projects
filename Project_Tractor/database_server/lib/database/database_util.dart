// TODO Implement this library.
// using cookie one could say for next tab if login is needed or not (save the instace key on cokkie)

import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:shelf_plus/shelf_plus.dart';
import 'package:mongo_dart/mongo_dart.dart';
import 'package:json_annotation/json_annotation.dart';
part 'database_util.g.dart';

//dart run build_runner build
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

//todo1
// class Person {
//   final String name;
//   final String password;
//   Person({required this.name, required this.password});
//   static Person fromJsonSignup(Map<dynamic, dynamic> json) {
//     return Person(name: json['userName'], password: json['password']);
//   }
// }

class Client {
  final String emailId;
  final String password;
  final String firstname;
  final String lastname;
  final String designation;
  final String phoneno;
  final String state;
  final String city;
  final String profileNote;

  Client({
    required this.emailId,
    required this.password,
    required this.firstname,
    required this.lastname,
    required this.designation,
    required this.phoneno,
    required this.state,
    required this.city,
    required this.profileNote,
  });
  static Client fromJsonSignup(Map<dynamic, dynamic> json) {
    return Client(
        emailId: json['emailId'] ?? '',
        password: json['password'] ?? '',
        firstname: json['firstname'] ?? '',
        lastname: json['lastname'] ?? '',
        designation: json['designation'] ?? '',
        phoneno: json['phoneno'] ?? '',
        state: json['state'] ?? '',
        city: json['city'] ?? '',
        profileNote: json['profileNote'] ?? '');
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

//todo123
@JsonSerializable()
class PersonDetails {
  final String firstname;
  final String lastname;
  final String password;
  final String designation;
  final String phoneno;
  final String state;
  final String city;
  final String profileNote;

  PersonDetails({
    required this.firstname,
    required this.lastname,
    required this.password,
    required this.designation,
    required this.phoneno,
    required this.state,
    required this.city,
    required this.profileNote,
  });
  static PersonDetails fromJsonPersonDetails(Map<dynamic, dynamic> json) {
    return PersonDetails(
        firstname: json['firstname'] ?? '',
        lastname: json['lastname'] ?? '',
        password: json['password'] ?? '',
        designation: json['designation'] ?? '',
        phoneno: json['phoneno'] ?? '',
        state: json['state'] ?? '',
        city: json['city'] ?? '',
        profileNote: json['profileNote'] ?? '');
  }

  factory PersonDetails.fromJson(Map<String, dynamic> json) =>
      _$PersonDetailsFromJson(json);

  /// `toJson` is the convention for a class to declare support for serialization
  /// to JSON. The implementation simply calls the private, generated
  /// helper method `_$UserToJson`.
  Map<String, dynamic> toJson() => _$PersonDetailsToJson(this);

  // Map<String, dynamic> toJson() {
  //   return {
  //       "firstname": this.firstname,
  //       "lastname": this.lastname,
  //       "designation": this.designation,
  //       "phoneno": this.phoneno,
  //       "state": this.state,
  //       "city": this.city,
  //       "profileNote": this.profileNote
  //       };
  // }
}

class EquipmentDetails {
  final String equipmentName;
  final String rentCost;
  final String state;
  final String city;
  final String description;
  final String available;

  EquipmentDetails({
    required this.equipmentName,
    required this.rentCost,
    required this.state,
    required this.city,
    required this.description,
    required this.available,
  });
  static EquipmentDetails fromJsonEquipmentDetails(Map<dynamic, dynamic> json) {
    return EquipmentDetails(
        equipmentName: json['equipmentName'] ?? '',
        rentCost: json['rentCost'] ?? '',
        state: json['state'] ?? '',
        city: json['city'] ?? '',
        description: json['description'] ?? '',
        available: json['available'] ?? '');
  }
}

extension ClientAccessor on RequestBodyAccessor {
  Future<Client> get asClientSignUp async =>
      Client.fromJsonSignup(await asJson);

  Future<PersonDetails> get getPersonDetails async =>
      PersonDetails.fromJsonPersonDetails(await asJson);

  Future<EquipmentDetails> get getEquipmentDetails async =>
      EquipmentDetails.fromJsonEquipmentDetails(await asJson);
}

void tokenUpdater(String emailId, DbCollection collection, String token) async {
  var nextExpiry = setExpiryTime();
  collection.updateOne({
    "emailId": emailId,
    "token": {
      "\$elemMatch": {"value": token}
    }
  }, {
    "\$set": {"token.\$.expiryTime": nextExpiry}
  });
}

Future<dynamic> tokenValidator(
    DbCollection collection, String token, String emailId) async {
  String status = "invalid";
  var query = await collection.findOne({
    "emailId": emailId,
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
          tokenUpdater(emailId, collection, token);
          break;
        }
      }
    }
  }
  return {"status": status};
}

Future<bool> emailExist(DbCollection collection, String emailId) async {
  var p = await collection.findOne({"emailId": emailId});

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
dynamic collection5;
dynamic collection6;
dynamic collection7;

void databaseOpen() async {
  var mongo_password = Platform.environment['MONGO_PASSWORD'];
  var mongo_uri = Platform.environment['MONGODB_URI'];

  if (mongo_uri != null) {
    mongo_uri = mongo_uri.replaceAll('<password>', mongo_password!);
  } else {
    String host = Platform.environment['MONGO_DART_DRIVER_HOST'] ?? '127.0.0.1';
    String port = Platform.environment['MONGO_DART_DRIVER_PORT'] ?? '27017';
    mongo_uri = 'mongodb://$host:$port/project_tractor';
  }

  var db = await Db.create(mongo_uri);
  // var db = Db(mongo_uri.toString());

  await db.open(); //secure: true

  collection1 = db.collection('emailDetails');
  collection2 = db.collection('emailVsTokens');
  collection3 = db.collection('emailVsProfileImage');
  collection4 = db.collection('emailVsStoredFile');

  collection5 = db.collection('EquipmentVsEmailS');
  collection6 = db.collection('emailVsEquipmentDetails');

  collection7 = db.collection('email_And_equipnameVsImage');

  /*
     During Actual runtime each server restart should delete the instance token 
     collection2.drop();
  */
  // collection1.drop();
  // collection2.drop();
  // collection3.drop();
  // collection4.drop();
  // collection5.drop();
  // collection6.drop();
  // collection7.drop();
}

dynamic signUp(Request request) async {
  var p = await request.body.asClientSignUp;
  if (await emailExist(collection1, p.emailId) == false) {
    String token = ObjectId().toString().split("\"")[1];
/*
        firstname: json['firstname'],
        lastname: json['lastname'],
        designation: json['designation'],
        phoneno: json['phoneno'],
        state: json['state'],
        city: json['city'],
        profileNote:json['profileNote']

 */
    await collection1.insertOne({
      "emailId": p.emailId,
      "password": p.password,
      "firstname": p.firstname,
      "lastname": p.lastname,
      "designation": p.designation,
      "phoneno": p.phoneno,
      "state": p.state,
      "city": p.city,
      "profileNote": p.profileNote,
      "token": []
    });

    await collection2.insertOne({
      "emailId": p.emailId,
      "token": [
        {"value": token, "expiryTime": setExpiryTime()}
      ]
    });

    return {'status': 'accepted', 'instanceKey': token};
  }

  return {'status': 'duplicateEntry', 'instanceKey': 0};
}

dynamic login(Request request) async {
  var p = await request.body.asClientSignUp;

  var temp =
      await collection1.findOne({"emailId": p.emailId, "password": p.password});

  if (temp != null) {
    String token = ObjectId().toString().split("\"")[1];

    await collection2.update({
      "emailId": p.emailId
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

dynamic setProfileImage(Request request, String emailId) async {
  // binary file so cannot get user name as object

  emailId = Uri.decodeFull(emailId);
  final headerFiles = request.headers;
  String token = headerFiles['instanceKey'].toString();

  dynamic result = await tokenValidator(collection2, token, emailId);

  if (result["status"] == "active") {
    // cannot set images more than 48000000 bytes

    var file = await request.read().expand((x) => x).toList();

    var temp = await collection3.findOne({"emailId": emailId});

    if (temp == null) {
      await collection3.insertOne({"emailId": emailId, "userImage": file});
    } else {
      await collection3.updateOne({
        "emailId": emailId,
      }, {
        "\$set": {"userImage": file}
      }, upsert: true);
    }

    return {'status': 'set'};
  } else if (result["status"] == "expired") {
    return {'status': 'expired'};
  } else {
    return {'status': 'invalid'};
  }

  // for corresponding user check if the instaceKey present in InstanceKeys
}

dynamic getProfileImage(Request request, String emailId) async {
  emailId = Uri.decodeFull(emailId);
  final headerFiles = request.headers;
  String token = headerFiles['instanceKey'].toString();

  String tempEmailId = headerFiles['emailId'].toString();

  dynamic result = await tokenValidator(collection2, token, emailId);

  if (result["status"] == "active") {
    var temp = await collection3.findOne({"emailId": tempEmailId});

    if (temp == null) return "empty";

    var bytes = Uint8List.fromList(temp["userImage"].cast<int>());

    return bytes;
  } else if (result["status"] == "expired") {
    return {'status': 'expired'};
  } else {
    return {'status': 'invalid'};
  }
}

//todo134
//collection7 = db.collection('email_And_equipnameVsImage');
dynamic setEquipmentImage(Request request, String emailId) async {
  // binary file so cannot get user name as object

  emailId = Uri.decodeFull(emailId);
  final headerFiles = request.headers;
  String token = headerFiles['instanceKey'].toString();
  String equipmentName = headerFiles['equipmentName'].toString();

  dynamic result = await tokenValidator(collection2, token, emailId);

  if (result["status"] == "active") {
    // cannot set images more than 48000000 bytes

    var file = await request.read().expand((x) => x).toList();

    var temp = await collection7
        .findOne({"emailId": emailId, "equipmentName": equipmentName});

    if (temp == null)
      await collection7.insertOne({
        "emailId": emailId,
        "equipmentName": equipmentName,
        "equipmentImage": file
      });
    else {
      // temp = null;
      await collection7.updateOne({
        "emailId": emailId,
        "equipmentName": equipmentName,
        // "equipmentImage": file
      }, {
        "\$set": {"equipmentImage": file}
      }, upsert: true);
    }

    return {'status': 'set'};
  } else if (result["status"] == "expired") {
    return {'status': 'expired'};
  } else {
    return {'status': 'invalid'};
  }

  // for corresponding user check if the instaceKey present in InstanceKeys
}

dynamic getAnyEquipmentImage(Request request, String emailId) async {
  emailId = Uri.decodeFull(emailId);
  final headerFiles = request.headers;
  String token = headerFiles['instanceKey'].toString();

  String tempEmailId = headerFiles['emailId'].toString();
  String equipmentName = headerFiles['equipmentName'].toString();

  dynamic result = await tokenValidator(collection2, token, emailId);

  if (result["status"] == "active") {
    var temp = await collection7
        .findOne({"emailId": tempEmailId, "equipmentName": equipmentName});

    if (temp == null) return "empty";

    var bytes = Uint8List.fromList(temp["equipmentImage"].cast<int>());

    return bytes;
  } else if (result["status"] == "expired") {
    return {'status': 'expired'};
  } else {
    return {'status': 'invalid'};
  }
}

dynamic setUserDetails(Request request, String emailId) async {
  emailId = Uri.decodeFull(emailId);
  var p = await request.body.getPersonDetails;
  final headerFiles = request.headers;
  String token = headerFiles['instanceKey'].toString();
  dynamic result = await tokenValidator(collection2, token, emailId);

  if (result["status"] == "active") {
      
  
    await collection1.updateOne({
      "emailId": emailId
    }, {
      "\$set": {
        "firstname": p.firstname,
        "password" : p.password,
        "lastname": p.lastname,
        "designation": p.designation,
        "phoneno": p.phoneno,
        "state": p.state,
        "city": p.city,
        "profileNote": p.profileNote,
      }
    });

    return {'status': 'set'};
    
  } else if (result["status"] == "expired") {
    return {'status': 'expired'};
  } else {
    return {'status': 'invalid'};
  }
}

dynamic getUserDetails(Request request, String emailId) async {
  emailId = Uri.decodeFull(emailId);
  final headerFiles = request.headers;
  String token = headerFiles['instanceKey'].toString();
  dynamic result = await tokenValidator(collection2, token, emailId);
  if (result["status"] == "active") {
    var temp = await collection1.findOne({"emailId": emailId});
    return {
      'status': 'active',
      "firstname": temp["firstname"],
      "lastname": temp["lastname"],
      "password": temp["password"],
      "designation": temp["designation"],
      "phoneno": temp["phoneno"],
      "state": temp["state"],
      "city": temp["city"],
      "profileNote": temp["profileNote"],
    };
  } else if (result["status"] == "expired") {
    return {'status': 'expired'};
  } else {
    return {'status': 'invalid'};
  }
}

// collection5 = db.collection('EquipmentVsEmailS');
// collection6 = db.collection('emailVsEquipmentDetails');

/**
         equipmentName: json['equipmentName'],
        rentCost: json['rentCost'],
        state: json['state'],
        city: json['city'],
        description: json['description'],
        available: json['available']
        );
 */
dynamic setEquipmentWithEmails(Request request, String emailId) async {
  emailId = Uri.decodeFull(emailId);
  var p = await request.body.getEquipmentDetails;
  final headerFiles = request.headers;
  String token = headerFiles['instanceKey'].toString();
  dynamic result = await tokenValidator(collection2, token, emailId);

  if (result["status"] == "active") {
    var query1 = await collection5.findOne({
      "equipmentName": p.equipmentName,
    });

    var query2 = await collection6.findOne({
      "emailId": emailId,
    });

    if (query1 == null) {
      // equipment 1st time insert
      await collection5.insertOne({
        "equipmentName": p.equipmentName,
        "token": [
          {
            "emailId": emailId,
          }
        ]
      });
      // insertOne
    } else {
      await collection5.updateOne({
        "equipmentName": p.equipmentName,
      }, {
        "\$pull": {
          "token": {
            "emailId": emailId,
          }
        }
      });
      await collection5.updateOne({
        "equipmentName": p.equipmentName,
      }, {
        "\$push": {
          "token": {
            "emailId": emailId,
          }
        }
      }, upsert: true);
    }

    if (query2 == null) {
      await collection6.insertOne({
        "emailId": emailId,
        "token": [
          {
            "equipmentName": p.equipmentName,
            "rentCost": p.rentCost,
            "state": p.state,
            "city": p.city,
            "description": p.description,
            "available": p.available
          }
        ]
      });
    } else {
      await collection6.update({
        "emailId": emailId,
      }, {
        "\$pull": {
          "token": {
            "equipmentName": p.equipmentName,
          }
        }
      });

      await collection6.update({
        "emailId": emailId,
      }, {
        "\$push": {
          "token": {
            "equipmentName": p.equipmentName,
            "rentCost": p.rentCost,
            "state": p.state,
            "city": p.city,
            "description": p.description,
            "available": p.available
          }
        }
      }, upsert: true);
    }

    return {'status': 'set'};
  } else if (result["status"] == "expired") {
    return {'status': 'expired'};
  } else {
    return {'status': 'invalid'};
  }
}

// givne email and equipmentname dropt he content
//can only drop then add new equipment
// or only modify that equipment

dynamic dropEquipmentDetails(Request request, String emailId) async {
  emailId = Uri.decodeFull(emailId);
  var p = await request.body.getEquipmentDetails;
  final headerFiles = request.headers;
  String token = headerFiles['instanceKey'].toString();
  dynamic result = await tokenValidator(collection2, token, emailId);

  if (result["status"] == "active") {
    var query1 = await collection5.findOne({
      "equipmentName": p.equipmentName,
    });
    var query2 = await collection6.findOne({
      "emailId": emailId,
    });

    if (query1 != null) {
      await collection5.updateOne({
        "equipmentName": p.equipmentName,
      }, {
        "\$pull": {
          "token": {
            "emailId": emailId,
          }
        }
      });
    }

    if (query2 != null) {
      await collection6.update({
        "emailId": emailId,
      }, {
        "\$pull": {
          "token": {
            "equipmentName": p.equipmentName,
          }
        }
      });
    }

    return {'status': 'set'};
  } else if (result["status"] == "expired") {
    return {'status': 'expired'};
  } else {
    return {'status': 'invalid'};
  }
}

// collection1 = db.collection('emailDetails');
// collection3 = db.collection('emailVsProfileImage');
// collection5 = db.collection('EquipmentVsEmailS');
// collection6 = db.collection('emailVsEquipmentDetails');

//get all details of matched equipement with specific equipments attached
// for that header display is none
//else for all equipments attach displayall to done in header

dynamic getEquipmentDetailsOtherClient(Request request, String emailId) async {
  emailId = Uri.decodeFull(emailId);
  var p = await request.body.getEquipmentDetails;
  final headerFiles = request.headers;
  String token = headerFiles['instanceKey'].toString();
  dynamic result = await tokenValidator(collection2, token, emailId);

  var displayall = headerFiles['displayall'].toString();

  var output = {};
  if (result["status"] == "active") {
    var query = await collection5.findOne({
      "equipmentName": p.equipmentName,
    });

    // output['status'] = 'active';
    var counter = 0;
    if (query != null) {
      for (var i in query['token']) {
        var emailIdtemp = i['emailId'].toString();

        var personalDetail =
            await collection1.findOne({"emailId": emailIdtemp});

        var equipmentDetail1 = await collection6.findOne(
          {"emailId": emailIdtemp},
        );
        dynamic equip = equipmentDetail1;
        if (displayall=="no") {
          for (var i in equipmentDetail1['token']) {
            if (i["equipmentName"].toString() == p.equipmentName) {
              equip = i;
              break;
            }
          }
        }

        personalDetail.remove("_id");
        personalDetail.remove("password");
        personalDetail.remove("token");
        var collect = {"personal": personalDetail, "equipmentDetails": equip};
        output[counter.toString()] = collect;
        // output['1'] = {
        //   'emailId': personalDetail['emailId'],
        //   'password': personalDetail['password'],
        //   'firstname': personalDetail['firstname'],
        //   'lastname': personalDetail['lastname'],
        //   'designation': personalDetail['designation'],
        //   'phoneno': personalDetail['phoneno'],
        //   'state': personalDetail['state'],
        //   'city': personalDetail['city'],
        //   'profileNote': personalDetail['profileNote'],
        // };
        // jsonDecode(equipmentDetail['token'])

        counter++;
      }
    }
    return {'status': 'active', 'output': output};
  } else if (result["status"] == "expired") {
    return {'status': 'expired'};
  } else {
    return {'status': 'invalid'};
  }
}

dynamic getEquipmentDetailsCurrentClient(
    Request request, String emailId) async {
  emailId = Uri.decodeFull(emailId);
  // var p = await request.body.getEquipmentDetails;
  final headerFiles = request.headers;
  String token = headerFiles['instanceKey'].toString();
  dynamic result = await tokenValidator(collection2, token, emailId);

  var output = {};
  if (result["status"] == "active") {
    var query = await collection6.findOne({
      "emailId": emailId,
    });

    if (query != null) {
      output = query;
    }

    return {'status': 'active', 'output': output};
  } else if (result["status"] == "expired") {
    return {'status': 'expired'};
  } else {
    return {'status': 'invalid'};
  }
}

dynamic set3dModel(Request request, String emailId, String fileType) async {
  emailId = Uri.decodeFull(emailId);
  final headerFiles = request.headers;
  String token = headerFiles['instanceKey'].toString();

  dynamic result = await tokenValidator(collection2, token, emailId);

  if (result["status"] == "active") {
    var file = await request.read().expand((x) => x).toList();

    await collection4.updateOne({
      "emailId": emailId
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

dynamic get3dModel(Request request, String emailId, String fileType) async {
  emailId = Uri.decodeFull(emailId);
  final headerFiles = request.headers;
  String token = headerFiles['instanceKey'].toString();

  dynamic result = await tokenValidator(collection2, token, emailId);

  if (result["status"] == "active") {
    var temp =
        await collection4.findOne({"emailId": emailId, "fileType": fileType});

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
