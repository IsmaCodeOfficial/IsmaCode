# IsmaCode ProGuard Rules
# Mantener el puente JavaScript-Android
-keepclassmembers class com.ismacode.app.MainActivity$AndroidBridge {
    public *;
}
-keepattributes JavascriptInterface
-keep class * extends android.webkit.WebViewClient
-keep class * extends android.webkit.WebChromeClient
