package com.ismacode.app

import android.annotation.SuppressLint
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.WindowInsets
import android.view.WindowInsetsController
import android.webkit.*
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.WindowCompat
import java.io.BufferedReader
import java.io.InputStreamReader

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private var fileCallback: ValueCallback<Array<Uri>>? = null

    // Lanzador para abrir archivos .ic
    private val openFileLauncher = registerForActivityResult(
        ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        uri?.let { loadIcFile(it) }
    }

    // Lanzador para abrir archivos mediante el input HTML
    private val webFileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        if (uri != null) {
            fileCallback?.onReceiveValue(arrayOf(uri))
        } else {
            fileCallback?.onReceiveValue(null)
        }
        fileCallback = null
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Pantalla completa con modo oscuro
        WindowCompat.setDecorFitsSystemWindows(window, false)
        window.decorView.setBackgroundColor(0xFF07070A.toInt())
        hideSystemUI()

        setContentView(R.layout.activity_main)
        webView = findViewById(R.id.webView)

        setupWebView()
        loadApp()

        // Manejar botón atrás
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) webView.goBack()
                else finish()
            }
        })
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        val settings = webView.settings
        settings.javaScriptEnabled          = true
        settings.domStorageEnabled          = true
        settings.allowFileAccess            = true
        settings.allowContentAccess         = true
        settings.databaseEnabled            = true
        settings.mediaPlaybackRequiresUserGesture = false
        settings.useWideViewPort            = true
        settings.loadWithOverviewMode       = true
        settings.setSupportZoom(false)
        settings.builtInZoomControls        = false
        settings.displayZoomControls        = false

        // Cache para que funcione offline
        settings.cacheMode = WebSettings.LOAD_DEFAULT

        // Interfaz Java→JavaScript (puente Android)
        webView.addJavascriptInterface(AndroidBridge(), "Android")

        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                // Inyectar variable para saber que estamos en Android
                webView.evaluateJavascript("window.IS_ANDROID = true;", null)
            }

            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                // Bloquear navegación externa
                return request?.url?.scheme != "file"
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            // Gestión del input[type=file] del HTML
            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                fileCallback?.onReceiveValue(null)
                fileCallback = filePathCallback
                webFileChooserLauncher.launch("*/*")
                return true
            }

            // Permitir alertas y prompts (para ask/preguntar)
            override fun onJsAlert(view: WebView?, url: String?, message: String?, result: JsResult?): Boolean {
                result?.confirm()
                return false
            }

            override fun onJsPrompt(
                view: WebView?, url: String?, message: String?,
                defaultValue: String?, result: JsPromptResult?
            ): Boolean {
                return false // Usar el prompt nativo del WebView
            }
        }
    }

    private fun loadApp() {
        webView.loadUrl("file:///android_asset/web/index.html")
    }

    private fun loadIcFile(uri: Uri) {
        try {
            val inputStream = contentResolver.openInputStream(uri)
            val reader = BufferedReader(InputStreamReader(inputStream))
            val content = reader.readText()
            reader.close()
            val escaped = content
                .replace("\\", "\\\\")
                .replace("`", "\\`")
                .replace("$", "\\$")
            webView.evaluateJavascript(
                "if(window.IsmaCodeMobile) window.IsmaCodeMobile.setCode(`$escaped`);",
                null
            )
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun hideSystemUI() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.insetsController?.let {
                it.hide(WindowInsets.Type.statusBars() or WindowInsets.Type.navigationBars())
                it.systemBarsBehavior = WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            }
        } else {
            @Suppress("DEPRECATION")
            window.decorView.systemUiVisibility = (
                View.SYSTEM_UI_FLAG_FULLSCREEN
                or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            )
        }
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) hideSystemUI()
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
        hideSystemUI()
    }

    override fun onPause() {
        super.onPause()
        webView.onPause()
    }

    override fun onDestroy() {
        super.onDestroy()
        webView.destroy()
    }

    // ── Puente Android ↔ JavaScript ─────────────────────────────
    inner class AndroidBridge {

        @JavascriptInterface
        fun copyToClipboard(text: String) {
            val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            clipboard.setPrimaryClip(ClipData.newPlainText("IsmaCode", text))
        }

        @JavascriptInterface
        fun saveFile(name: String, content: String) {
            // Guardar en SharedPreferences como respaldo
            val prefs = getSharedPreferences("ismacode_files", Context.MODE_PRIVATE)
            prefs.edit().putString(name, content).apply()
        }

        @JavascriptInterface
        fun shareText(text: String) {
            val intent = Intent(Intent.ACTION_SEND).apply {
                type = "text/plain"
                putExtra(Intent.EXTRA_TEXT, text)
                putExtra(Intent.EXTRA_SUBJECT, "Código IsmaCode")
            }
            startActivity(Intent.createChooser(intent, "Compartir código IsmaCode"))
        }

        @JavascriptInterface
        fun openFilePicker() {
            openFileLauncher.launch("*/*")
        }

        @JavascriptInterface
        fun log(msg: String) {
            android.util.Log.d("IsmaCode", msg)
        }
    }
}
