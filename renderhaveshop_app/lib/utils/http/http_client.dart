import 'dart:convert';

import 'package:http/http.dart' as http;

class AppHttpHelper() {
  static const String _baseUrl = "https://api_url/";

  //get
  static Future<Map<String, dynamic>> get(String endpoint) async {
    final response = await http.get(Uri.parse('$_baseUrl/$endpoint'));
    return _handleResponse(response);
  }

  //post
  static Future<Map<String, dynamic>> post(
    String endpoint,
    dynamic data,
  ) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/$endpoint'),
      headers: {'Content-Type': "application/json"},
      body: json.encode(data),
    );
    return _handleResponse(response);
  }

  //put
  static Future<Map<String, dynamic>> put(String endpoint, dynamic data) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/$endpoint'),
      headers: {'Content-Type': "application/json"},
      body: json.encode(data),
    );
    return _handleResponse(response);
  }

  //handle response
  static Map<String, dynamic> _handleResponse(http.Response response) {
    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception("Failed to load data : ${response.statusCode}");
    }
  }
}
