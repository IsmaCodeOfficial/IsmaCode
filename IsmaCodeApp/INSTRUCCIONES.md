# IsmaCode — Proyecto Android

## Opciones para compilar el APK

---

## ✅ OPCIÓN 1: Android Studio (Recomendada)

### Requisitos
- [Android Studio](https://developer.android.com/studio) (gratis, ~1GB)
- Java 17+ (incluido en Android Studio)

### Pasos

1. **Descarga e instala Android Studio**
   - https://developer.android.com/studio

2. **Abre el proyecto**
   - Lanza Android Studio
   - Clic en **"Open"** → selecciona la carpeta `IsmaCodeApp`
   - Espera a que Gradle sincronice (~2-3 min, descarga dependencias)

3. **Compila el APK**
   - Menú: **Build → Build Bundle(s)/APK(s) → Build APK(s)**
   - Espera ~2 min
   - Clic en **"Locate"** para encontrar el APK

4. **El APK estará en:**
   ```
   IsmaCodeApp/app/build/outputs/apk/debug/app-debug.apk
   ```

5. **Instalar en el móvil**
   - Pasa el APK al móvil (WhatsApp, Drive, cable USB...)
   - En el móvil: Ajustes → Seguridad → **Instalar fuentes desconocidas** (actívalo)
   - Abre el APK y pulsa Instalar

---

## ✅ OPCIÓN 2: GitHub Actions (Sin instalar nada)

Si tienes GitHub, puedes compilar en la nube gratis:

1. Sube el proyecto a un repositorio GitHub
2. Crea el archivo `.github/workflows/build.yml` con este contenido:

```yaml
name: Build APK
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
      - name: Build APK
        run: ./gradlew assembleDebug
      - uses: actions/upload-artifact@v3
        with:
          name: ismacode-debug.apk
          path: app/build/outputs/apk/debug/app-debug.apk
```

3. Haz push → GitHub compila automáticamente
4. Descarga el APK desde la pestaña **Actions** de tu repositorio

---

## ✅ OPCIÓN 3: Buildozer / Compilador online

Si no quieres instalar nada localmente:

- **Appetize.io**: Para probar en navegador
- **Codemagic.io**: CI/CD gratuito para Android
- **Bitrise**: Otra opción de CI/CD

---

## 📁 Estructura del proyecto

```
IsmaCodeApp/
├── app/
│   ├── src/main/
│   │   ├── assets/web/          ← Toda la app web de IsmaCode
│   │   │   ├── index.html       ← UI adaptada a móvil
│   │   │   ├── ismacode-core.js ← El intérprete del lenguaje
│   │   │   ├── app.js           ← Lógica original
│   │   │   └── styles.css       ← Estilos originales
│   │   ├── java/com/ismacode/app/
│   │   │   └── MainActivity.kt  ← Activity principal con WebView
│   │   ├── res/
│   │   │   ├── layout/activity_main.xml
│   │   │   ├── values/themes.xml
│   │   │   └── mipmap-*/        ← Iconos
│   │   └── AndroidManifest.xml
│   └── build.gradle
├── build.gradle
├── settings.gradle
└── gradle.properties
```

---

## ⚙️ Arquitectura elegida: WebView

**Por qué WebView y no React Native o Flutter:**

- El intérprete `ismacode-core.js` (82KB) es JavaScript puro → funciona 100% en WebView sin modificar ni una línea
- El canvas HTML5 en WebView Android tiene aceleración por hardware → animaciones fluidas
- Fidelidad visual perfecta: mismos colores, misma tipografía, mismo diseño
- Sin reescribir el lenguaje en otro idioma (Dart, TypeScript, etc.)
- Tiempo de desarrollo: horas vs semanas con otras opciones

**Lo que hace el puente Android ↔ JS:**
- `copyToClipboard(text)` → copia usando el sistema Android
- `saveFile(name, content)` → guarda en almacenamiento local Android
- `shareText(text)` → usa el intent SHARE nativo de Android
- `openFilePicker()` → abre el selector de archivos del sistema

---

## 📱 Funcionalidades de la app

| Función | Estado |
|---------|--------|
| Editor de código con numeración de líneas | ✅ |
| Autocompletado de palabras clave IsmaCode | ✅ |
| Ejecutar código con el intérprete completo | ✅ |
| Consola de salida | ✅ |
| Canvas para juegos y dibujos | ✅ |
| Ejemplos integrados (10 ejemplos) | ✅ |
| Guardar archivos .ic en el dispositivo | ✅ |
| Abrir archivos .ic desde el dispositivo | ✅ |
| Exportar/compartir código | ✅ |
| Modo oscuro (diseño original) | ✅ |
| Pantalla completa sin barras | ✅ |
| Soporte teclas físicas | ✅ |
| Touch en canvas (ratón simulado) | ✅ |

---

## 🎨 Colores de la app

Los mismos que el original:
- Fondo: `#07070A`
- Acento: `#CF0050`
- Acento 2: `#FF4D92`
- Texto: `#FFF7FB`

---

## 📋 Requisitos mínimos del dispositivo

- Android 7.0 (API 24) o superior
- ~30MB de espacio libre
- Cualquier teléfono moderno

---

Creado con ❤️ para IsmaCode de Ismael Messadia Blancat
