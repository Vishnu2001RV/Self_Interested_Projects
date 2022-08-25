// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'database_util.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PersonDetails _$PersonDetailsFromJson(Map<String, dynamic> json) =>
    PersonDetails(
      firstname: json['firstname'] as String,
      lastname: json['lastname'] as String,
      password: json['password'] as String,
      designation: json['designation'] as String,
      phoneno: json['phoneno'] as String,
      state: json['state'] as String,
      city: json['city'] as String,
      profileNote: json['profileNote'] as String,
    );

Map<String, dynamic> _$PersonDetailsToJson(PersonDetails instance) =>
    <String, dynamic>{
      'firstname': instance.firstname,
      'lastname': instance.lastname,
      'password': instance.password,
      'designation': instance.designation,
      'phoneno': instance.phoneno,
      'state': instance.state,
      'city': instance.city,
      'profileNote': instance.profileNote,
    };
