import 'package:flutter/material.dart';
import 'package:renderhaveshop_app/utils/themes/theme.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'RenderHavenShop',
      themeMode: .system,
      theme: AppTheme.lighttheme,
      darkTheme: AppTheme.darktheme,
      // home: const HomePage(title: 'Flutter Demo Home Page'),
    );
  }
}
