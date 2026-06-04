(function (root) {

  // ─── Determinantes y partículas ignorables al inicio de línea ──────────────
  const FILLER_START = /^(?:el|la|los|las|un|una|unos|unas|al|del|mi|tu|su|mis|tus|sus|este|esta|estos|estas|ese|esa|esos|esas|aquel|aquella|aquellos|aquellas|lo|le|les|dicho|dicha|dichos|dichas|q|ke|kiero|quiero|vamos a|vamos|venga|va)\s+/i;
  const FILLER_INLINE = /\b(el|la|los|las|un|una|unos|unas|al|del)\b\s*/gi;

  // ─── Grupos de comandos (sinónimos) ────────────────────────────────────────
  const commandGroups = {
    print: [
      "mostrar","imprimir","decir","escribir","ensenar","enseñar","ver",
      "muestra","pinta","di","saca","display","print","log",
      "muestra el","muestra la","muestra los","muestra las",
      "di el","di la","pon en pantalla","saca por pantalla",
      "escribe el","escribe la","escribe los","escribe las",
      "imprime el","imprime la",
      "ponme","dimelo","dime","dimela","sacame","ensenme","enséñame",
      "q salga","ke salga","muestrame","muéstrame","saca por ahi",
      "que salga","que aparezca","que muestre","hacer que salga",
      "poner","pon ahi","pon aqui","pon ahí","pon aquí",
      "mostrarme","pon esto","saca esto","di esto",
      "quiero ver","quiero que salga","quiero que aparezca",
      "necesito ver","a ver","aver"
    ],
    ask: [
      "preguntar","pedir","consultar","solicitar","pregunta","pide",
      "dame","introduce","pidele al usuario","preguntale al usuario",
      "pide al usuario","pregunta al usuario",
      "preguntale","pregúntale","pidele","pídele",
      "q me diga","ke me diga","que me diga","que diga el usuario",
      "que escriba","que el usuario escriba","q escriba","ke escriba",
      "pide que escriba","pide que diga"
    ],
    set: [
      "guardar","crear","poner","definir","recordar","establecer",
      "fijar","asignar","pon","guarda","crea","sea","que sea","hazlo",
      "guarda el","guarda la","guarda los","guarda las",
      "crea el","crea la","crea un","crea una",
      "pon el","pon la","pon un","pon una",
      "define el","define la","define un","define una",
      "crea la variable","guarda la variable","define la variable",
      "crea el valor","guarda el valor",
      "haz que sea","haz que valga","que valga","q valga","ke valga",
      "pon que sea","pon que valga","deja que sea","deja que valga",
      "que quede","q quede","ke quede","apunta","apuntar",
      "anotar","anota","mete","meteré","guardo",
      "voy a guardar","voy a crear","voy a poner",
      "quiero guardar","quiero crear","quiero que sea"
    ],
    if: [
      "si","cuando","en caso de que","siempre que","comprueba si",
      "si acaso","en el caso de que","siempre y cuando",
      "si es que","comprueba que","verifica si","mira si",
      "a ver si","aver si","en caso q","en caso ke",
      "en caso que","si resulta que","si resulta q","si resulta ke",
      "si pasa que","si pasa q","si pasa ke",
      "xsi","siempre q","siempre ke",
      "mira a ver si","mira aver si","comprueba q","comprueba ke"
    ],
    else: [
      "sino","si_no","si-no","de lo contrario","en caso contrario",
      "si no","en otro caso","si eso no","si no es asi",
      "si no es así","de otra manera","de otro modo","si falla eso",
      "si no pues","sino pues","y si no","pues sino",
      "si no es verdad","si no se cumple","si no q","si no ke",
      "o sino","o si no","o si no pues","y si no pues",
      "en cambio","pero si no","pero sino"
    ],
    elif: [
      "sino si","si_no si","si no si","de lo contrario si",
      "o si","pero si","en cambio si","y si no",
      "si en cambio","si por el contrario",
      "o si no","y si","pero si","o a lo mejor si","o si pasa que",
      "o si resulta que","o si resulta q","o si resulta ke"
    ],
    end: [
      "fin","terminar","cerrar","acabar","listo","ya","hecho",
      "fin de","eso es todo","hasta aqui","hasta aquí",
      "eso es","fin del bloque","cierra",
      "ya esta","ya está","fin.","listo.","hecho.","ya.",
      "ok","venga","vale","fin ya","cerramos","ahi termina",
      "ahí termina","aqui acaba","aquí acaba","se acabo","se acabó",
      "hasta ahi","hasta ahí","fin del if","fin del si",
      "fin del bucle","fin del mientras","fin del repetir",
      "fin del para","fin de la funcion","fin de la función"
    ],
    repeat: [
      "repetir","repite","hacer","haz","hacer esto","loop",
      "repetir esto","hazlo","vuelta","da vueltas",
      "repite esto","haz esto","ejecutar",
      "haz eso","hazlo","hazlo esto","que se repita","q se repita",
      "ke se repita","que lo haga","q lo haga","ke lo haga",
      "que pase","q pase","ke pase","veces","repite eso",
      "que repita","hacer que repita","xveces","hacer n veces",
      "hacer veces","que se haga","q se haga"
    ],
    while: [
      "mientras","mientras que","hasta que","sigue mientras",
      "bucle mientras","repite mientras","continua mientras",
      "sigue hasta que","repite hasta que","hazlo mientras",
      "haz esto mientras",
      "mientras q","mientras ke","mientras que se cumpla",
      "hasta q","hasta ke","sigue hasta q","sigue hasta ke",
      "que siga mientras","q siga mientras","ke siga mientras",
      "no pares hasta que","no pares hasta q","no pares hasta ke",
      "seguir mientras"
    ],
    each: [
      "para cada","por cada","recorrer","recorre","para todo",
      "por todo","para todos los","por todos los",
      "para cada uno de los","por cada uno de los",
      "recorre todos los","para cada elemento de",
      "para cada elemento en","por cada elemento en",
      "para todos","para cada cosa en","por cada cosa en",
      "pa cada","pa cada uno","pa cada cosa en",
      "para cada uno en","por cada uno en",
      "ve por cada","pasa por cada","mira cada","coge cada",
      "para todo lo de","por todo lo de",
      "para cada item en","para cada elemento","por cada elemento",
      "recorre la lista","recorre cada"
    ],
    function: [
      "funcion","función","comando","receta","procedimiento",
      "tarea","accion","acción","bloque",
      "crear funcion","crear función","define funcion","define función",
      "nueva funcion","nueva función","hacer funcion",
      "hacer una funcion","hacer una función","crear una funcion",
      "crear una función","definir una funcion","definir una función",
      "quiero una funcion","quiero una función",
      "haz una funcion","haz una función",
      "pon una funcion que","pon una función que"
    ],
    return: [
      "devolver","regresar","retornar",
      "da","regresa","devuelve",
      "el valor es","mi resultado es","devuelve el","devuelve la",
      "retorna","el resultado final es",
      "que devuelva","q devuelva","ke devuelva",
      "devuelve eso","devuelve esto","sal con","salir con",
      "manda","manda de vuelta","responde con","responde"
    ],
    use: [
      "usar","ejecutar","llamar","lanzar","correr","aplicar",
      "llama a","ejecuta","usa","aplica","corre",
      "llama","llama al","llama a la","usa el","usa la",
      "ejecuta el","ejecuta la","pon a correr","pon en marcha",
      "activa","activar","lanza el","lanza la"
    ],
    add: [
      "sumar","aumentar","incrementar","sube","suma",
      "añadir a","anadir a","agrega a","añade a",
      "sube el","sube la","aumenta el","aumenta la",
      "suma al","suma a la","incrementa el","incrementa la",
      "añade al","añade a la",
      "ponle mas","ponle más","dale mas","dale más",
      "que sume","q sume","ke sume","hazle mas","hazle más",
      "subele","súbele","añadele","añádele","agregale","agrégale",
      "metele mas","métele más","sumarle","sumale","sumale a"
    ],
    subtract: [
      "restar","reducir","disminuir","baja","resta",
      "quita a","quita al","quita de","baja el","baja la",
      "resta al","resta a la","reduce el","reduce la",
      "disminuye el","disminuye la","quita de la",
      "ponle menos","dale menos","que reste","q reste","ke reste",
      "hazle menos","bajale","bájale","quitale","quítale",
      "restarle","restale","restale a","quitar de"
    ],
    multiply: [
      "multiplicar","duplicar","multiplica",
      "multiplica el","multiplica la","duplica el","duplica la",
      "por","que multiplique","q multiplique","ke multiplique",
      "hazlo por","hazle por"
    ],
    divide: [
      "dividir","partir","divide",
      "divide el","divide la","parte el","parte la",
      "que divida","q divida","ke divida","dividelo entre","hazlo entre"
    ],
    append: [
      "agregar","anadir","añadir","meter","insertar",
      "agrega","añade","mete","push","apuntar",
      "agregar a","añadir a","meter en","insertar en",
      "mete en","agrega a la lista","añade a la lista",
      "pon en la lista","añade al final",
      "mete en la","echa en","pon dentro","pon dentro de",
      "añadir en","anadir en","metelo en","ponlo en",
      "metele","metelo","ponlo","ponle","echale",
      "apunta en","apuntalo en"
    ],
    // NUEVO: insertar en posición concreta
    insert: [
      "insertar en","meter en posicion","agregar en posicion",
      "insertar en posicion","poner en posicion","insertar en índice",
      "insertar en indice","pon en posicion","mete en posicion"
    ],
    remove: [
      "quitar","sacar","eliminar","borrar",
      "quita","saca","elimina","borra",
      "quitar de","sacar de","eliminar de","borrar de",
      "quita de la","saca de la","borra de la",
      "sacalo de","sacalo","borralo","borralo de",
      "eliminalo","eliminalo de","quitalo","quitalo de",
      "fuera de","saca de ahi","saca de ahí",
      "quitar ese","quitar esa","borrar ese","borrar esa"
    ],
    // NUEVO: quitar por índice
    removeAt: [
      "quitar en posicion","eliminar en posicion","borrar en posicion",
      "quitar indice","eliminar indice","borrar indice",
      "quitar en indice","quitar posicion","eliminar posicion"
    ],
    clear: [
      "limpiar","borrar salida","limpia salida","borrar todo",
      "limpia la salida","borra la salida","limpia todo",
      "borra todo","limpia eso","que quede limpio","q quede limpio",
      "a cero","ponlo a cero","resetear salida","limpiar todo"
    ],
    wait: [
      "esperar","pausar","espera","pausa","aguardar","aguarda",
      "espera un momento","espera un poco","haz una pausa",
      "para un momento","esperate","espérate",
      "un momento","un seg","un segundo","un rato"
    ],
    frame: ["fotograma","frame","fps"],
    stop: [
      "parar","romper","salir","para","rompe","detener",
      "detén","termina bucle","sal del bucle","sal","para el bucle",
      "rompe el bucle","termina el bucle","acaba el bucle",
      "para ya","basta","parate","párate","stop",
      "salte","sálte","sal de ahi","sal de ahí",
      "fuera del bucle","cortar"
    ],
    continue: [
      "continuar","siguiente","sigue","continua","siguiente vuelta",
      "pasa a la siguiente","siguiente iteracion","siguiente iteración",
      "salta esta vuelta",
      "saltate esta","sáltate esta","saltate","sáltate",
      "pasa","pasa de esta","skip","sigue con la siguiente",
      "siguiente por favor","pasa a la siguiente vuelta"
    ],
    try: [
      "intentar","intenta","probar","prueba","a ver si",
      "probar esto","intenta esto","ver si funciona",
      "probar a","intentar hacer",
      "a ver que pasa","aver que pasa","probar a ver",
      "a ver si funciona","que intente","q intente","ke intente",
      "hazlo a ver","intenta eso","prueba esto","prueba eso",
      "intenta q","intenta ke","intenta que"
    ],
    catch: [
      "si falla","si_falla","si-falla","en caso de error",
      "al fallar","cuando falla","si hay error","si sale mal",
      "si algo falla","si ocurre un error","en caso de fallo",
      "si no funciona","si no sale bien","si falla algo",
      "si peta","cuando peta","si explota","si hay algun error",
      "si hay algún error","si da error","si sale un error",
      "si algo va mal","si va mal","si algo sale mal",
      "si no va","si no va bien","si falla la cosa"
    ],
    throw: [
      "lanzar error","falla con","lanza error","provocar error",
      "generar error","crear error",
      "manda un error","suelta un error","tira un error",
      "que falle con","q falle con","ke falle con"
    ],
    // NUEVO: switch/elegir caso
    switch: [
      "segun","según","elegir caso","dependiendo de","segun el valor de",
      "según el valor de","caso segun","switch"
    ],
    case: [
      "caso","case","cuando vale","cuando es","si vale","si es igual a"
    ],
    default: [
      "por defecto","default","en cualquier otro caso","si no hay caso",
      "caso por defecto","sino en cualquier caso"
    ],
    // NUEVO: forEach con índice
    eachIndex: [
      "para cada con indice","para cada con índice","recorrer con indice",
      "para cada elemento con su posicion","para cada uno con posicion",
      "con indice","enumerando"
    ],
    // Visuales
    screen:      ["pantalla","lienzo","escenario","ventana"],
    background:  ["fondo","pintar fondo","color de fondo"],
    color:       ["color","tinta","pincel"],
    rect:        ["rectangulo","rectángulo","cuadro","caja","rect"],
    circle:      ["circulo","círculo","bola","punto","esfera"],
    line:        ["linea","línea","raya","trazar linea"],
    text:        ["texto_en","texto en","texto","escribir en"],
    triangle:    ["triangulo","triángulo","flecha"],
    strokeRect:  ["marco","borde","recuadro"],
    bar:         ["barra","barra_vida","medidor","barra de vida"],
    sprite:      ["sprite","personaje","objeto","dibujar sprite"],
    camera:      ["camara","cámara","camara_en","mover camara"],
    clearScreen: [
      "limpiar pantalla","borrar pantalla","limpia pantalla",
      "limpiar lienzo","borra la pantalla","limpia la pantalla"
    ],
    // NUEVO: más comandos visuales
    opacity:     ["opacidad","transparencia","alfa","alpha"],
    rotate:      ["rotar","girar","rotacion","rotación"],
    scale:       ["escala","escalar","tamaño visual"],
    shadow:      ["sombra","con sombra","sombra de"],
    gradient:    ["degradado","gradiente","degrade"],
    polygon:     ["poligono","polígono","forma","forma regular"],
    star:        ["estrella","dibujar estrella"],
    image:       ["imagen","dibujar imagen","mostrar imagen","cargar imagen"],
    textAlign:   ["alinear texto","alineacion texto","alineación texto"],
    font:        ["fuente","tipografia","tipografía","letra"],
    arc:         ["arco","sector","pie"],
    bezier:      ["curva","bezier","curva bezier"],
    // NUEVO: guardar/cargar datos
    saveData:    ["guardar datos","guardar estado","salvar datos","salvar estado","guardar en local","guardar localmente"],
    loadData:    ["cargar datos","cargar estado","recuperar datos","recuperar estado","cargar local","cargar localmente"],
    deleteData:  ["borrar datos","eliminar datos","borrar estado","limpiar datos guardados"],
    // NUEVO: consola/debug
    debug:       ["depurar","debug","ver debug","mostrar debug","inspectar"],
    table:       ["tabla","mostrar tabla","imprimir tabla"],
    // NUEVO: clases
    class:       ["clase","tipo","plantilla","modelo","esquema"],
    new:         ["nuevo","nueva","crear nuevo","crear nueva","instanciar","hacer un","hacer una","crear instancia de"],
  };

  const synonymToCommand = new Map();
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const IDENT = String.raw`[\p{L}_][\p{L}\p{N}_]*`;

  function normalize(value) {
    return String(value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeInformal(line) {
    let s = line;
    s = s.replace(/\bq\b/gi, "que").replace(/\bke\b/gi, "que");
    s = s.replace(/\bxq\b/gi, "porque").replace(/\bxke\b/gi, "porque");
    s = s.replace(/\btb\b/gi, "también").replace(/\btmb\b/gi, "también");
    s = s.replace(/\bpa\b/gi, "para");
    s = s.replace(/\bpq\b/gi, "porque");
    s = s.replace(/\bk\b/gi, "que");
    s = s.replace(/\baki\b/gi, "aqui");
    s = s.replace(/[¡¿]/g, "");
    return s;
  }

  function stripLeadingDeterminer(line) {
    return line.replace(FILLER_START, "");
  }

  for (const [command, words] of Object.entries(commandGroups)) {
    for (const word of words) synonymToCommand.set(normalize(word), command);
  }

  function removeCommand(line, command) {
    const normal = normalize(line);
    const words  = [...(commandGroups[command] || [])].sort((a, b) => b.length - a.length);
    const found  = words.find(w => normal === normalize(w) || normal.startsWith(normalize(w) + " "));
    return found ? line.slice(found.length).trim() : line.trim();
  }

  function lineCommand(line) {
    const tryMatch = (text) => {
      const normal = normalize(text);
      const matches = [...synonymToCommand.entries()]
        .filter(([w]) => normal === w || normal.startsWith(w + " "))
        .sort((a, b) => b[0].length - a[0].length);
      return matches[0]?.[1] || null;
    };
    let cmd = tryMatch(line);
    if (cmd) return cmd;
    cmd = tryMatch(stripLeadingDeterminer(line));
    if (cmd) return cmd;
    const informal = normalizeInformal(line);
    cmd = tryMatch(informal);
    if (cmd) return cmd;
    cmd = tryMatch(stripLeadingDeterminer(informal));
    return cmd;
  }

  function normalizeLine(line) {
    const normal  = normalize(line);
    const matches = [...synonymToCommand.entries()]
      .filter(([w]) => normal === w || normal.startsWith(w + " "))
      .sort((a, b) => b[0].length - a[0].length);
    if (matches[0]) return line;
    return stripLeadingDeterminer(line);
  }

  function cleanBlockOpener(text) {
    return text
      .replace(/\s*:\s*$/i, "")
      .replace(/\s+dos\s+puntos\s*$/i, "")
      .replace(/\s+entonces\s*$/i, "")
      .replace(/\s+pues\s*$/i, "")
      .replace(/\s+que\s*$/i, "")
      .replace(/\s+¿?\s*$/i, "")
      .trim();
  }

  function identifierRegex(source, flags = "iu") {
    return new RegExp(source.replaceAll("__ID__", IDENT), flags);
  }

  function isBlank(line) {
    const clean  = line.trim();
    const normal = normalize(clean);
    return (
      clean === "" ||
      (normal === "nota" || /^nota[:.]\s/.test(normal)) ||
      normal.startsWith("//") || normal.startsWith("#") ||
      normal.startsWith("--") || normal.startsWith("/*") ||
      normal.startsWith("ps ") || normal === "ps" ||
      normal.startsWith("pues ") ||
      normal.startsWith("bueno ") || normal === "bueno" ||
      normal.startsWith("oye ") ||
      normal.startsWith("eh ") ||
      normal.startsWith("ok ") || normal === "ok" ||
      normal.startsWith("vale ") || normal === "vale"
    );
  }

  function splitOutsideQuotes(text, convert) {
    let result = "", quote = null, chunk = "";
    for (let i = 0; i < text.length; i++) {
      const char = text[i], prev = text[i - 1];
      if ((char === `"` || char === `'`) && prev !== "\\") {
        if (quote === char) { result += chunk + char; chunk = ""; quote = null; }
        else if (!quote)    { result += convert(chunk) + char; chunk = ""; quote = char; }
        else chunk += char;
      } else chunk += char;
    }
    return result + (quote ? chunk : convert(chunk));
  }

  function convertCommaStrings(expression) {
    let result = "", quote = null, commaText = null;
    for (let i = 0; i < expression.length; i++) {
      const char = expression[i], prev = expression[i - 1], next = expression[i + 1] || "";
      const last   = result.trimEnd().slice(-1);
      const canOpen = !quote && commaText === null && char === "," && next.trim() !== "" &&
                      !/\s/.test(next) && (result.trim() === "" || /[=+\-*/%([{:]/.test(last));
      if (commaText !== null) {
        if (char === ",") {
          result += JSON.stringify(commaText);
          const rest = expression.slice(i + 1), nextReal = rest.trimStart()[0] || "";
          if (nextReal && !"+-*/%)]}:,".includes(nextReal)) result += ",";
          commaText = null;
        } else commaText += char;
        continue;
      }
      if ((char === `"` || char === `'`) && prev !== "\\") quote = quote === char ? null : quote || char;
      if (canOpen) { commaText = ""; continue; }
      result += char;
    }
    return result + (commaText === null ? "" : "," + commaText);
  }

  function escapeRegex(text) { return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  function replaceToken(text, token, value) {
    return text.replace(
      new RegExp(`(?<![\\p{L}\\p{N}_])${escapeRegex(token)}(?![\\p{L}\\p{N}_])`, "giu"),
      value
    );
  }

  // Ternario natural: "X si condicion sino Y" → "condicion ? X : Y"
  function rewriteTernary(expr) {
    const m = expr.match(/^(.+?)\s+si\s+(.+?)\s+sino\s+(.+)$/i);
    if (m) return `(${m[2].trim()}) ? (${m[1].trim()}) : (${m[3].trim()})`;
    return expr;
  }

  function transformExpression(expression) {
    let expr = normalizeInformal(expression);

    // BUGFIX: strip artículos/determinantes fuera de comillas para evitar
    // "Unexpected identifier" cuando el usuario escribe "el nombre", "la nota", etc.
    expr = splitOutsideQuotes(expr, part => part.replace(FILLER_INLINE, ""));

    // Pipe: lista |> ordenar |> tomar(3)
    if (expr.includes("|>")) {
      const parts = expr.split("|>").map(s => s.trim());
      expr = parts.reduce((acc, fn) => {
        fn = fn.trim();
        if (/\w[\w\s]*\(/.test(fn)) return fn.replace(/(\w[\w\s]*)\(/, `$1(${acc}, `);
        return `${fn}(${acc})`;
      });
    }

    // Ternario natural
    expr = rewriteTernary(expr);

    return splitOutsideQuotes(convertCommaStrings(expr), part => {
      let text = part;
      for (const [token, value] of [
        ["es distinto de","!="],["no es igual a","!="],["distinto de","!="],["diferente de","!="],
        ["no es lo mismo que","!="],["no es lo mismo","!="],
        ["es igual a","=="],["igual a","=="],["es lo mismo que","=="],
        ["mayor o igual que",">="],["mayor o igual a",">="],
        ["menor o igual que","<="],["menor o igual a","<="],
        ["mayor que",">"],["mas grande que",">"],["más grande que",">"],
        ["menor que","<"],["mas pequeño que","<"],["más pequeño que","<"],
        ["mas grande o igual que",">="],["más grande o igual que",">="],
        ["mas","+"],[" más ","+"],["\u2013","-"],
        ["menos","-"],["por","*"],["entre","/"],["modulo","%"],["módulo","%"],
        ["abre parentesis","("],["cierra parentesis",")"],
        ["abre paréntesis","("],["cierra paréntesis",")"],
        ["coma",","],["dos puntos",":"],["punto","."],
        ["verdadero","true"],["falso","false"],["nulo","null"],["nada","null"],
        ["vacio","null"],["vacío","null"],
        [" y "," && "],[" o "," || "],["no ","!"],
        ["el resultado de",""],["la suma de",""],["el valor de",""],
        ["la longitud de","largo("],["el largo de","largo("],
        ["el numero de","numero("],["el número de","numero("],
        ["no es","!="],
      ]) text = replaceToken(text, token, value);
      return text;
    });
  }

  function friendlyError(lineNumber, message, detail = "") {
    const hints = {
      "is not defined":   (d) => `"${d.split(" ")[0]}" no existe todavia. Crealo antes con: ${d.split(" ")[0]} es ...`,
      "is not a function":() => `Eso no es una funcion. Escribiste bien el nombre?`,
      "Cannot read":      () => `Intente usar algo vacio o que no existe aun.`,
      "Unexpected token": () => `Algo esta mal escrito en esa linea. Revisa los simbolos.`,
      "SyntaxError":      () => `Error de escritura. Revisa comillas, parentesis o corchetes.`,
    };
    let hint = detail;
    for (const [key, fn] of Object.entries(hints)) {
      if (detail.includes(key)) { hint = fn(detail); break; }
    }
    const error = new Error(`Linea ${lineNumber}: ${message}${hint ? "\nPista: " + hint : ""}`);
    error.isIsmaCode = true;
    return error;
  }

  // ─── Interpolación de texto: "Hola {nombre}" ─────────────────────────────
  function interpolateString(str, context) {
    return str.replace(/\{([^}]+)\}/g, (_, expr) => {
      try {
        const val = new Function("ctx", `with(ctx){return (${expr})}`)(context);
        return val === null || val === undefined ? "" : String(val);
      } catch { return `{${expr}}`; }
    });
  }

  // ─── Clases IC ────────────────────────────────────────────────────────────
  // clase Punto x y:
  //   funcion mover dx dy:
  //     sumar x por dx
  //     sumar y por dy
  //   fin
  // fin
  // p es nuevo Punto 10 20
  // p.mover(5, 3)
  function signal(type, value = null) {
    const e = new Error(type); e.signal = type; e.returnValue = value; return e;
  }

  async function evalExpr(expression, context, lineNumber) {
    // Interpolación de texto: convierte "Hola {nombre}" → template literal
    let processed = expression;
    if (/["'].*\{[^}]+\}.*["']/.test(processed)) {
      processed = processed.replace(/(["'])((?:[^"'\\]|\\.)*)\1/g, (match, quote, content) => {
        if (!content.includes("{")) return match;
        // Convertir a template literal: {expr} → ${expr}
        const tpl = content.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\{([^}]+)\}/g, "$${$1}");
        return "`" + tpl + "`";
      });
    }
    const js = transformExpression(processed);
    try {
      return await new AsyncFunction("ctx", `with (ctx) { return await (${js}); }`)(context);
    } catch (err) {
      let msg = `No pude entender: "${expression}"`;
      if (err.message.includes("is not defined"))   msg = `"${err.message.split(" ")[0]}" no existe todavia. Olvidaste crearlo?`;
      else if (err.message.includes("is not a function")) msg = `Eso no es una funcion. Revisa el nombre.`;
      else if (err.message.includes("Cannot read")) msg = `Intente usar algo vacio o que no existe.`;
      else if (err.message.includes("Unexpected"))  msg = `Algo esta mal escrito. Revisa la linea.`;
      throw friendlyError(lineNumber, msg, err.message);
    }
  }

  function findBlockEnd(lines, startIndex) {
    let depth = 0, elseIndex = -1, elifIndexes = [], caseIndexes = [], defaultIndex = -1;
    // Para switch: rastrear fin opcional de cada caso
    const parentText = normalizeLine(lines[startIndex].text.trim());
    const parentCmd  = lineCommand(parentText);
    const isSwitch   = parentCmd === "switch";
    const caseEndAt  = new Map(); // caseLineIndex -> finLineIndex
    let lastCaseLineIdx = -1;
    for (let i = startIndex + 1; i < lines.length; i++) {
      const text = cleanBlockOpener(normalizeLine(lines[i].text.trim()));
      if (isBlank(text)) continue;
      const cmd = lineCommand(text);
      if (["if","repeat","while","each","eachIndex","function","try","switch","class"].includes(cmd)) depth++;
      if (cmd === "end") {
        if (isSwitch && depth === 0) {
          if (lastCaseLineIdx !== -1 && !caseEndAt.has(lastCaseLineIdx)) {
            // Este fin cierra el caso anterior (tiene fin explícito)
            caseEndAt.set(lastCaseLineIdx, i);
            lastCaseLineIdx = -1;
            continue;
          }
          // Este fin cierra el segun
          return { endIndex: i, elseIndex, elifIndexes, caseIndexes, defaultIndex, caseEndAt };
        }
        if (depth === 0) return { endIndex: i, elseIndex, elifIndexes, caseIndexes, defaultIndex, caseEndAt };
        depth--;
      }
      if (cmd === "else"    && depth === 0) elseIndex    = i;
      if (cmd === "elif"    && depth === 0) elifIndexes.push(i);
      if (cmd === "catch"   && depth === 0) elseIndex    = i;
      if (cmd === "case"    && depth === 0) {
        // Si hay un caso previo sin fin, cerrarlo en el índice actual (exclusivo)
        if (lastCaseLineIdx !== -1 && !caseEndAt.has(lastCaseLineIdx)) {
          caseEndAt.set(lastCaseLineIdx, i); // el caso anterior acaba aquí (sin fin explícito)
        }
        caseIndexes.push(i); lastCaseLineIdx = i;
      }
      if (cmd === "default" && depth === 0) {
        if (lastCaseLineIdx !== -1 && !caseEndAt.has(lastCaseLineIdx)) {
          caseEndAt.set(lastCaseLineIdx, i);
        }
        defaultIndex = i; lastCaseLineIdx = i;
      }
    }
    const openers = {
      if:"si", repeat:"repetir", while:"mientras", each:"para cada",
      eachIndex:"para cada con indice", function:"funcion", try:"intentar", switch:"segun"
    };
    const cmd = lineCommand(normalizeLine(lines[startIndex].text.trim()));
    throw friendlyError(lines[startIndex].number,
      `Falta cerrar este bloque. Añade "fin" al final del "${openers[cmd] || cmd}".`);
  }

  const ASSIGN_OPS = `(?:=|es|vale|como|igual|ahora es|ahora vale|sera|será|pasa a ser|se convierte en|igual a|es igual a|va a ser|tiene el valor de|tiene como valor|guarda el valor|guarda la|quiero que sea|que sea|q sea|ke sea|va a ser|tiene|contiene)`;

  function splitNameAndExpression(text, lineNumber) {
    const clean = text.replace(/^(?:el|la|los|las|un|una|unos|unas|al|del|mi|tu|su)\s+(?:valor\s+de\s+|variable\s+)?/i, "");
    const match = clean.match(identifierRegex(`^(__ID__)\\s*(?:${ASSIGN_OPS})\\s*(.+)$`));
    if (!match) throw friendlyError(lineNumber, `Para guardar un valor escribe: nombre es "valor" o puntos = 10`);
    let expression = match[2].trim();
    // "nuevo Clase arg1 arg2" → "Clase(arg1, arg2)"
    const nuevoMatch = expression.match(identifierRegex(`^(?:nuevo|nueva)\\s+(__ID__)(.*)$`));
    if (nuevoMatch) {
      const args = nuevoMatch[2].trim();
      if (!args) {
        expression = `${nuevoMatch[1]}()`;
      } else {
        // Split args respecting quoted strings
        const argParts = [];
        let current = "", inQuote = null;
        for (let i = 0; i < args.length; i++) {
          const ch = args[i];
          if ((ch === '"' || ch === "'") && !inQuote) { inQuote = ch; current += ch; }
          else if (ch === inQuote) { inQuote = null; current += ch; }
          else if (ch === ' ' && !inQuote) {
            if (current.trim()) argParts.push(current.trim());
            current = "";
          } else { current += ch; }
        }
        if (current.trim()) argParts.push(current.trim());
        expression = `${nuevoMatch[1]}(${argParts.join(", ")})`;
      }
    }
    return { name: match[1], expression };
  }

  function splitChange(text, lineNumber, example) {
    const clean = text.replace(/^(?:el|la|los|las|un|una)\s+/i, "");
    const match = clean.match(identifierRegex(`^(__ID__)\\s+(?:por|en|con|de|y)\\s+(.+)$`));
    if (!match) throw friendlyError(lineNumber, example);
    return { name: match[1], expression: match[2] };
  }

  // ─── Funciones integradas ──────────────────────────────────────────────────
  function makeBaseBuiltins(env) {
    const write = env.write || (() => {});
    const ask   = env.ask   || (() => "");
    const clear = env.clear || (() => {});
    const draw  = env.draw  || (() => {});
    const input = env.input || {};

    const keyNames = {
      izquierda:"arrowleft", derecha:"arrowright", arriba:"arrowup", abajo:"arrowdown",
      espacio:" ", saltar:" ", disparar:" ", enter:"enter", escape:"escape",
      inicio:"home", fin:"end", retroceso:"backspace", supr:"delete",
      a:"a",b:"b",c:"c",d:"d",e:"e",f:"f",g:"g",h:"h",i:"i",j:"j",k:"k",l:"l",
      m:"m",n:"n",o:"o",p:"p",q:"q",r:"r",s:"s",t:"t",u:"u",v:"v",w:"w",x:"x",y:"y",z:"z",
      "0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9",
      f1:"f1",f2:"f2",f3:"f3",f4:"f4",f5:"f5",f6:"f6",f7:"f7",f8:"f8",f9:"f9",f10:"f10",f11:"f11",f12:"f12"
    };
    const keyDown = key => Boolean(input.keys?.has?.(normalize(keyNames[normalize(key)] ?? key)));

    // Sistema de temporizadores internos
    const timers = new Map();
    let timerIdCounter = 0;

    // Sistema de partículas
    const particleSystems = new Map();

    // Almacenamiento local (localStorage wrapper)
    const storage = {
      guardar: (clave, valor) => {
        try { localStorage.setItem("ic_" + clave, JSON.stringify(valor)); return true; }
        catch { return false; }
      },
      cargar: (clave, defecto = null) => {
        try {
          const v = localStorage.getItem("ic_" + clave);
          return v !== null ? JSON.parse(v) : defecto;
        } catch { return defecto; }
      },
      borrar: (clave) => { try { localStorage.removeItem("ic_" + clave); return true; } catch { return false; } },
      listar: () => {
        try {
          return Object.keys(localStorage)
            .filter(k => k.startsWith("ic_"))
            .map(k => k.slice(3));
        } catch { return []; }
      }
    };

    const b = {
      // ── Salida ──────────────────────────────────────────────────────────────
      mostrar:write, imprimir:write, decir:write, escribir:write,
      ensenar:write, ver:write, muestra:write, di:write, log:write,
      ponme:write, dimelo:write, dime:write, muestrame:write,

      // NUEVO: mostrar con formato
      mostrar_linea: (v="") => write(String(v)),
      mostrar_json:  v => write(JSON.stringify(v, null, 2)),
      escribir_sin_salto: v => { /* no-op en modo texto, igual que mostrar */ write(String(v)); },

      // ── Entrada ─────────────────────────────────────────────────────────────
      preguntar_usuario: ask,

      // ── Tipo / Existencia ────────────────────────────────────────────────────
      largo:      v => v?.length ?? 0,
      longitud:   v => v?.length ?? 0,
      tamano:     v => v?.length ?? 0,
      vacio:      v => (v?.length ?? 0) === 0,
      tipo:       v => Array.isArray(v) ? "lista" : v === null ? "nulo" : typeof v === "object" ? "objeto" : typeof v,
      existe:     v => v !== null && v !== undefined,
      por_defecto:(v, def) => (v === null || v === undefined) ? def : v,
      es_numero:  v => !isNaN(Number(v)) && String(v).trim() !== "",
      es_texto:   v => typeof v === "string",
      es_lista:   v => Array.isArray(v),
      es_objeto:  v => v !== null && typeof v === "object" && !Array.isArray(v),
      es_funcion: v => typeof v === "function",
      es_nulo:    v => v === null || v === undefined,
      es_par:     v => Number(v) % 2 === 0,
      es_impar:   v => Number(v) % 2 !== 0,

      // ── Texto ────────────────────────────────────────────────────────────────
      mayusculas: v => String(v).toUpperCase(),
      minusculas: v => String(v).toLowerCase(),
      titulo:     v => String(v).replace(/\b\w/g, c => c.toUpperCase()),
      recortar:   v => String(v).trim(),
      reemplazar:(t, a, c) => String(t).split(String(a)).join(String(c)),
      texto:      v => String(v),
      contiene:  (p, i) => p?.includes?.(i) ?? false,
      empieza:   (t, s) => String(t).startsWith(String(s)),
      termina:   (t, e) => String(t).endsWith(String(e)),
      separar:   (t, s = "") => String(t).split(s),
      unir:      (l, s = "") => l.join(s),
      repetir_texto:(t, n) => String(t).repeat(Number(n)),
      quitar_espacios: v => String(v).trim(),
      formato:   (tpl, ...args) => tpl.replace(/{(\d+)}/g, (_, i) => args[i] ?? ""),
      partir:    (t, s) => String(t).split(s),
      letra_en:  (t, p) => String(t)[Number(p)] ?? "",
      poner_mayuscula: v => { const s = String(v); return s[0]?.toUpperCase() + s.slice(1); },
      quitar_texto: (t, q) => String(t).split(String(q)).join(""),
      contar_en: (t, s) => String(t).split(String(s)).length - 1,
      rellenar:  (t, n, c = " ") => String(t).padStart(Number(n), c),
      rellenar_der:(t, n, c = " ") => String(t).padEnd(Number(n), c),
      subcadena: (t, i, f) => String(t).slice(Number(i), f !== undefined ? Number(f) : undefined),
      invertir_texto: t => String(t).split("").reverse().join(""),
      es_palindromo: t => { const s = String(t).toLowerCase().replace(/\s/g,""); return s === s.split("").reverse().join(""); },
      codificar_url: t => encodeURIComponent(String(t)),
      decodificar_url: t => decodeURIComponent(String(t)),
      // NUEVO: expresiones regulares simplificadas
      coincide:  (t, patron) => new RegExp(patron, "i").test(String(t)),
      extraer:   (t, patron) => String(t).match(new RegExp(patron, "gi")) ?? [],
      reemplazar_patron: (t, patron, reemplazo) => String(t).replace(new RegExp(patron, "gi"), reemplazo),

      // ── Números ──────────────────────────────────────────────────────────────
      numero:    v => Number(v),
      entero:    v => parseInt(v, 10),
      decimal:   v => parseFloat(v),
      redondear: (v, decimales = 0) => {
        const factor = Math.pow(10, Number(decimales));
        return Math.round(Number(v) * factor) / factor;
      },
      piso:      v => Math.floor(Number(v)),
      techo:     v => Math.ceil(Number(v)),
      absoluto:  v => Math.abs(Number(v)),
      raiz:      v => Math.sqrt(Number(v)),
      raiz_cubica: v => Math.cbrt(Number(v)),
      potencia: (b2, e) => Math.pow(Number(b2), Number(e)),
      logaritmo: (v, base = Math.E) => Math.log(Number(v)) / Math.log(Number(base)),
      log10:     v => Math.log10(Number(v)),
      log2:      v => Math.log2(Number(v)),
      sen:       v => Math.sin(Number(v)),
      cos:       v => Math.cos(Number(v)),
      tan:       v => Math.tan(Number(v)),
      asen:      v => Math.asin(Number(v)),
      acos:      v => Math.acos(Number(v)),
      atan:      v => Math.atan(Number(v)),
      atan2:    (y, x) => Math.atan2(Number(y), Number(x)),
      grados:    v => Number(v) * (180 / Math.PI),
      radianes:  v => Number(v) * (Math.PI / 180),
      angulo:   (x1,y1,x2,y2) => Math.atan2(Number(y2)-Number(y1), Number(x2)-Number(x1)),
      mover_hacia:(f,t,s) => {
        const from=Number(f), to=Number(t), sp=Math.abs(Number(s));
        return Math.abs(to-from)<=sp ? to : from+Math.sign(to-from)*sp;
      },
      limitar:   (v,mn,mx) => Math.min(Number(mx), Math.max(Number(mn), Number(v))),
      distancia: (x1,y1,x2,y2) => Math.hypot(Number(x2)-Number(x1), Number(y2)-Number(y1)),
      normalizar:(v,mn,mx) => (Number(v)-Number(mn))/(Number(mx)-Number(mn)),
      interpolar:(a,b,t) => Number(a) + (Number(b)-Number(a)) * Number(t),
      lerp:      (a,b,t) => Number(a) + (Number(b)-Number(a)) * Number(t),
      suave:     t => { const n=Number(t); return n*n*(3-2*n); },  // smoothstep
      oscila:    (tiempo, velocidad=1, amplitud=1) => Math.sin(Number(tiempo)*Number(velocidad)) * Number(amplitud),
      choca:    (x1,y1,w1,h1,x2,y2,w2,h2) => (
        Number(x1)<Number(x2)+Number(w2) && Number(x1)+Number(w1)>Number(x2) &&
        Number(y1)<Number(y2)+Number(h2) && Number(y1)+Number(h1)>Number(y2)
      ),
      // NUEVO: colisión circular
      choca_circulos: (x1,y1,r1,x2,y2,r2) =>
        Math.hypot(Number(x2)-Number(x1), Number(y2)-Number(y1)) < Number(r1)+Number(r2),
      // NUEVO: colisión punto-círculo
      punto_en_circulo: (px,py,cx,cy,r) =>
        Math.hypot(Number(px)-Number(cx), Number(py)-Number(cy)) <= Number(r),
      dentro:   (x,y,l,t2,w,h) => Number(x)>=Number(l)&&Number(x)<=Number(l)+Number(w)&&Number(y)>=Number(t2)&&Number(y)<=Number(t2)+Number(h),
      azar:     (mn=0,mx=1) => Math.floor(Math.random()*(Math.floor(Number(mx))-Math.ceil(Number(mn))+1))+Math.ceil(Number(mn)),
      aleatorio:(mn=0,mx=1) => Math.floor(Math.random()*(Math.floor(Number(mx))-Math.ceil(Number(mn))+1))+Math.ceil(Number(mn)),
      azar_decimal:(mn=0,mx=1) => Math.random()*(Number(mx)-Number(mn))+Number(mn),
      rango:    (s,e,st=1) => {
        const r=[], from=Number(s), to=Number(e), jump=Number(st)||1;
        if(jump>0) for(let v=from;v<=to;v+=jump) r.push(v);
        if(jump<0) for(let v=from;v>=to;v+=jump) r.push(v);
        return r;
      },
      maximo:   (...v) => Math.max(...v.flat()),
      minimo:   (...v) => Math.min(...v.flat()),
      entre_rango:(v,mn,mx) => Number(v)>=Number(mn)&&Number(v)<=Number(mx),
      signo:    v => Math.sign(Number(v)),
      // NUEVO: física simple
      aplicar_gravedad: (vy, gravedad=0.5, max=20) => Math.min(Number(vy)+Number(gravedad), Number(max)),
      rebotar:   (v, factor=0.7) => -Math.abs(Number(v)) * Number(factor),
      friccion:  (v, factor=0.9) => Number(v) * Number(factor),
      // NUEVO: mapa de bits / colores
      hex_a_rgb: hex => {
        const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
        return {r,g,b};
      },
      rgb_a_hex: (r,g,b) => `#${[r,g,b].map(v=>Number(v).toString(16).padStart(2,"0")).join("")}`,
      mezclar_colores: (hex1, hex2, t=0.5) => {
        const c1=parseInt(hex1.slice(1),16), c2=parseInt(hex2.slice(1),16);
        const r=Math.round(((c1>>16)&255)*(1-t)+((c2>>16)&255)*t);
        const g=Math.round(((c1>>8)&255)*(1-t)+((c2>>8)&255)*t);
        const bl=Math.round((c1&255)*(1-t)+(c2&255)*t);
        return `#${[r,g,bl].map(v=>v.toString(16).padStart(2,"0")).join("")}`;
      },

      // ── Listas ────────────────────────────────────────────────────────────────
      elegir:        l => l[Math.floor(Math.random()*l.length)],
      ordenar:       l => [...l].sort((a,b)=>String(a).localeCompare(String(b),"es",{numeric:true})),
      ordenar_numeros:l => [...l].sort((a,b)=>Number(a)-Number(b)),
      ordenar_por:   (l,fn) => [...l].sort((a,b) => fn(a)>fn(b)?1:fn(a)<fn(b)?-1:0),
      mezclar:       l => [...l].sort(()=>Math.random()-0.5),
      invertir:      v => Array.isArray(v)?[...v].reverse():String(v).split("").reverse().join(""),
      unico:         l => [...new Set(l)],
      primero:       l => l[0],
      ultimo:        l => l[l.length-1],
      suma:          l => l.reduce((t,v)=>t+Number(v),0),
      producto:      l => l.reduce((t,v)=>t*Number(v),1),
      promedio:      l => l.reduce((t,v)=>t+Number(v),0)/l.length,
      mediana:       l => { const s=[...l].sort((a,b)=>a-b); const m=Math.floor(s.length/2); return s.length%2?s[m]:(s[m-1]+s[m])/2; },
      maximo_lista:  l => Math.max(...l),
      minimo_lista:  l => Math.min(...l),
      indice:       (l,i) => Array.isArray(l)?l.indexOf(i):String(l).indexOf(i),
      sublista:     (l,f,t2) => Array.isArray(l)?l.slice(Number(f),Number(t2)):String(l).slice(Number(f),Number(t2)),
      aplanar:       l => l.flat(),
      aplanar_todo:  l => l.flat(Infinity),
      sin_nulos:     l => l.filter(v => v !== null && v !== undefined),
      copiar_lista:  l => [...l],
      juntar_listas:(a,b) => [...a,...b],
      contar:       (l,v) => l.filter(i=>i===v).length,
      tiene:        (l,v) => Array.isArray(l)?l.includes(v):String(l).includes(String(v)),
      filtrar:      (l,fn) => l.filter(fn),
      mapear:       (l,fn) => l.map(fn),
      reducir:      (l,fn,ini) => l.reduce(fn,ini),
      // NUEVO: más ops de lista
      agrupar_por:  (l,fn) => l.reduce((acc,item) => { const k=fn(item); (acc[k]=acc[k]||[]).push(item); return acc; }, {}),
      zip:          (a,b) => a.map((v,i) => [v, b[i]]),
      tomar:        (l,n) => l.slice(0, Number(n)),
      saltar:       (l,n) => l.slice(Number(n)),
      partir_en:    (l,n) => { const r=[]; for(let i=0;i<l.length;i+=Number(n)) r.push(l.slice(i,i+Number(n))); return r; },
      rotar:        (l,n=1) => { const a=[...l]; const k=((Number(n)%a.length)+a.length)%a.length; return [...a.slice(k),...a.slice(0,k)]; },
      diferencia:   (a,b) => a.filter(v=>!b.includes(v)),
      interseccion: (a,b) => a.filter(v=>b.includes(v)),
      union_listas: (a,b) => [...new Set([...a,...b])],
      todos:        (l,fn) => l.every(fn),
      alguno:       (l,fn) => l.some(fn),
      ninguno:      (l,fn) => !l.some(fn),
      encontrar:    (l,fn) => l.find(fn) ?? null,
      encontrar_indice: (l,fn) => l.findIndex(fn),
      // NUEVO: cola y pila
      apilar:       (l,v) => { l.push(v); return l; },
      desapilar:    l => l.pop(),
      encolar:      (l,v) => { l.push(v); return l; },
      desencolar:   l => l.shift(),
      // NUEVO: rangos mejorados
      rango_letras: (a,z) => {
        const r=[], ca=a.charCodeAt(0), cz=z.charCodeAt(0);
        for(let c=ca;c<=cz;c++) r.push(String.fromCharCode(c));
        return r;
      },

      // ── Objetos / Diccionarios ────────────────────────────────────────────────
      nuevo_objeto:  () => ({}),
      objeto_de:    (...p) => { const o={}; for(let i=0;i<p.length;i+=2) o[p[i]]=p[i+1]; return o; },
      tiene_clave:  (o,k) => Object.prototype.hasOwnProperty.call(o??{},k),
      claves:        o => Object.keys(o??{}),
      valores:       o => Object.values(o??{}),
      pares:         o => Object.entries(o??{}),
      quitar_clave: (o,k) => { const r={...o}; delete r[k]; return r; },
      copiar_objeto: o => ({...o}),
      mezclar_objetos:(a,b) => ({...a,...b}),
      numero_de_claves:o => Object.keys(o??{}).length,
      // NUEVO: acceso profundo
      obtener:      (o, ...claves) => claves.reduce((acc,k) => acc?.[k], o),
      poner_en:     (o, clave, valor) => { const r={...o}; r[clave]=valor; return r; },
      // NUEVO: diccionario/mapa real (Map de JS)
      nuevo_mapa:   () => new Map(),
      mapa_poner:   (m,k,v) => { m.set(k,v); return m; },
      mapa_obtener: (m,k) => m.get(k) ?? null,
      mapa_tiene:   (m,k) => m.has(k),
      mapa_borrar:  (m,k) => { m.delete(k); return m; },
      mapa_claves:  m => [...m.keys()],
      mapa_valores: m => [...m.values()],
      mapa_pares:   m => [...m.entries()],
      mapa_largo:   m => m.size,
      // NUEVO: conjunto (Set)
      nuevo_conjunto: () => new Set(),
      conjunto_agregar: (s,v) => { s.add(v); return s; },
      conjunto_tiene: (s,v) => s.has(v),
      conjunto_quitar: (s,v) => { s.delete(v); return s; },
      conjunto_a_lista: s => [...s],
      conjunto_largo: s => s.size,

      // ── Tiempo ────────────────────────────────────────────────────────────────
      fecha:       () => new Date().toLocaleDateString("es-ES"),
      hora:        () => new Date().toLocaleTimeString("es-ES"),
      fecha_hora:  () => new Date().toLocaleString("es-ES"),
      ahora:       () => Date.now(),
      milisegundos:() => Date.now(),
      timestamp:   () => Date.now(),
      esperar:     ms => new Promise(r => setTimeout(r, Number(ms))),
      fotograma:  (fps=60) => new Promise(r => setTimeout(r, 1000/(Number(fps)||60))),
      // NUEVO: fecha detallada
      anio_actual: () => new Date().getFullYear(),
      mes_actual:  () => new Date().getMonth()+1,
      dia_actual:  () => new Date().getDate(),
      hora_actual: () => new Date().getHours(),
      minuto_actual:() => new Date().getMinutes(),
      segundo_actual:() => new Date().getSeconds(),

      // ── Teclado / Ratón ───────────────────────────────────────────────────────
      tecla:          keyDown,
      pulsando:       keyDown,
      // NUEVO: tecla recién pulsada (flanco de subida, gestionado por app.js)
      tecla_nueva:    key => Boolean(input.newKeys?.has?.(normalize(keyNames[normalize(key)] ?? key))),
      raton_x:        () => Number(input.mouse?.x||0),
      raton_y:        () => Number(input.mouse?.y||0),
      raton_pulsado:  () => Boolean(input.mouse?.down),
      raton_clic:     () => Boolean(input.mouse?.clicked),
      raton_derecho:  () => Boolean(input.mouse?.right),
      ancho_pantalla: () => Number(input.screen?.width||640),
      alto_pantalla:  () => Number(input.screen?.height||360),
      limpiar:        clear,

      // ── Pantalla / Dibujo ─────────────────────────────────────────────────────
      pantalla:      (w=640,h=360) => { input.screen={width:Number(w)||640,height:Number(h)||360}; draw("screen",{width:w,height:h}); },
      fondo:          c => draw("background",{color:c}),
      color:          c => draw("color",{color:c}),
      tinta:          c => draw("color",{color:c}),
      rectangulo:    (x,y,w,h) => draw("rect",{x,y,width:w,height:h}),
      cuadro:        (x,y,s) => draw("rect",{x,y,width:s,height:s}),
      caja:          (x,y,w,h) => draw("rect",{x,y,width:w,height:h}),
      circulo:       (x,y,r) => draw("circle",{x,y,radius:r}),
      bola:          (x,y,r) => draw("circle",{x,y,radius:r}),
      linea:         (x1,y1,x2,y2) => draw("line",{x1,y1,x2,y2}),
      raya:          (x1,y1,x2,y2) => draw("line",{x1,y1,x2,y2}),
      texto_en:      (t,x,y,s=20) => draw("text",{text:t,x,y,size:s}),
      triangulo:     (x1,y1,x2,y2,x3,y3) => draw("triangle",{x1,y1,x2,y2,x3,y3}),
      marco:         (x,y,w,h) => draw("strokeRect",{x,y,width:w,height:h}),
      borde:         (x,y,w,h) => draw("strokeRect",{x,y,width:w,height:h}),
      barra:         (x,y,w,h,v,mx=100) => draw("bar",{x,y,width:w,height:h,value:v,max:mx}),
      barra_vida:    (x,y,w,h,v,mx=100) => draw("bar",{x,y,width:w,height:h,value:v,max:mx}),
      medidor:       (x,y,w,h,v,mx=100) => draw("bar",{x,y,width:w,height:h,value:v,max:mx}),
      sprite:        (n,x,y,w=40,h=40) => draw("sprite",{name:n,x,y,width:w,height:h}),
      personaje:     (n,x,y,w=40,h=40) => draw("sprite",{name:n,x,y,width:w,height:h}),
      camara:        (x,y) => draw("camera",{x,y}),
      limpiar_pantalla:() => draw("clearScreen",{}),
      // NUEVO: visuales avanzados
      opacidad:      a => draw("opacity",{alpha:Number(a)}),
      rotar_canvas:  (angulo,cx=0,cy=0) => draw("rotate",{angle:Number(angulo),cx:Number(cx),cy:Number(cy)}),
      escalar_canvas:(sx,sy) => draw("scale",{sx:Number(sx),sy:Number(sy)}),
      sombra:        (color,blur=10,ox=5,oy=5) => draw("shadow",{color,blur:Number(blur),ox:Number(ox),oy:Number(oy)}),
      sin_sombra:    () => draw("shadow",{color:"transparent",blur:0,ox:0,oy:0}),
      fuente:        (familia,tamano=20) => draw("font",{family:familia,size:Number(tamano)}),
      alinear_texto: alineacion => draw("textAlign",{align:alineacion}),
      grosor_linea:  n => draw("lineWidth",{width:Number(n)}),
      // NUEVO: estrella
      estrella:      (x,y,radio_ext,radio_int,puntas=5) => draw("star",{x,y,outerRadius:radio_ext,innerRadius:radio_int,points:puntas}),
      // NUEVO: polígono regular
      poligono:      (x,y,radio,lados=6) => draw("polygon",{x,y,radius:radio,sides:lados}),
      // NUEVO: arco / sector
      arco:          (x,y,radio,inicio,fin,relleno=false) => draw("arc",{x,y,radius:radio,start:inicio,end:fin,fill:relleno}),
      // NUEVO: degradado lineal
      degradado:     (x1,y1,x2,y2,color1,color2) => draw("gradient",{x1,y1,x2,y2,color1,color2}),
      // NUEVO: imagen
      imagen:        (src,x,y,w,h) => draw("image",{src,x,y,width:w,height:h}),
      // NUEVO: guardar/restaurar estado canvas
      guardar_canvas: () => draw("save",{}),
      restaurar_canvas:() => draw("restore",{}),
      // NUEVO: curva bezier
      curva:         (x1,y1,cx1,cy1,cx2,cy2,x2,y2) => draw("bezier",{x1,y1,cx1,cy1,cx2,cy2,x2,y2}),
      // NUEVO: dibujo con relleno personalizado usando función callback
      rect_redondeado:(x,y,w,h,radio=10) => draw("roundRect",{x,y,width:w,height:h,radius:radio}),

      // ── Debug ─────────────────────────────────────────────────────────────────
      ver_tipo:  v => write(`[tipo: ${Array.isArray(v)?"lista":typeof v}] ${JSON.stringify(v)}`),
      ver_lista: l => write(`[lista de ${l.length}] ${JSON.stringify(l)}`),
      ver_objeto:o => write(`[objeto]\n${JSON.stringify(o,null,2)}`),
      depurar:   v => write(`[debug] ${JSON.stringify(v)}`),
      tabla:     l => {
        if (!Array.isArray(l)) { write(JSON.stringify(l,null,2)); return; }
        if (l.length === 0) { write("[tabla vacía]"); return; }
        const keys = typeof l[0]==="object" ? Object.keys(l[0]) : ["valor"];
        const header = keys.map(k=>k.padEnd(16)).join(" | ");
        const sep = keys.map(()=>"-".repeat(16)).join("-+-");
        write(header); write(sep);
        l.forEach(row => {
          if (typeof row==="object") write(keys.map(k=>String(row[k]??"").padEnd(16)).join(" | "));
          else write(String(row));
        });
      },

      // ── Almacenamiento Local ─────────────────────────────────────────────────
      guardar_datos: (clave, valor) => storage.guardar(clave, valor),
      cargar_datos:  (clave, defecto=null) => storage.cargar(clave, defecto),
      borrar_datos:  clave => storage.borrar(clave),
      listar_datos:  () => storage.listar(),

      // ── Utilidades varias ─────────────────────────────────────────────────────
      // NUEVO: crear objeto con propiedades físicas listo para juegos
      crear_entidad: (x=0,y=0,ancho=32,alto=32) => ({
        x:Number(x), y:Number(y), ancho:Number(ancho), alto:Number(alto),
        vx:0, vy:0, visible:true, vida:100, activo:true
      }),
      mover_entidad: (e, vx, vy) => {
        e.x = Number(e.x) + Number(vx||e.vx||0);
        e.y = Number(e.y) + Number(vy||e.vy||0);
        return e;
      },
      aplicar_fisica: (e, gravedad=0.5) => {
        e.vy = Math.min((Number(e.vy)||0) + Number(gravedad), 20);
        e.x = (Number(e.x)||0) + (Number(e.vx)||0);
        e.y = (Number(e.y)||0) + (Number(e.vy)||0);
        return e;
      },
      // NUEVO: generador de partículas simple
      crear_particulas: (x,y,cantidad=10,config={}) => {
        const ps = [];
        for(let i=0;i<cantidad;i++) ps.push({
          x:Number(x), y:Number(y),
          vx: (Math.random()-0.5)*(config.velocidad||4),
          vy: (Math.random()-1.5)*(config.velocidad||4),
          vida: config.vida||60,
          vida_max: config.vida||60,
          color: config.color||"#ff4d92",
          radio: config.radio||4,
          activo:true
        });
        return ps;
      },
      actualizar_particulas: (ps) => {
        ps.forEach(p => {
          if(!p.activo) return;
          p.x += p.vx; p.y += p.vy;
          p.vy += 0.15;
          p.vida--;
          if(p.vida<=0) p.activo=false;
        });
        return ps.filter(p=>p.activo);
      },
      dibujar_particulas: (ps) => {
        ps.forEach(p => {
          if(!p.activo) return;
          const alpha = p.vida/p.vida_max;
          draw("particula", {x:p.x, y:p.y, radio:p.radio, color:p.color, alpha});
        });
      },
      // NUEVO: interpolación de animación
      animar: (actual, objetivo, velocidad=0.1) =>
        Number(actual) + (Number(objetivo)-Number(actual)) * Number(velocidad),

      // NUEVO: crear tween simple
      tween: (inicio, fin, duracion=60) => {
        let frame=0;
        return () => {
          if(frame>=duracion) return fin;
          return inicio+(fin-inicio)*(frame++/duracion);
        };
      },

      // Constantes
      verdadero:true, falso:false, nulo:null, nada:null,
      PI:Math.PI, pi:Math.PI, infinito:Infinity, TAU:Math.PI*2,
    };

    // Alias con acentos y variantes
    Object.assign(b, {
      mayúsculas:b.mayusculas, minúsculas:b.minusculas, título:b.titulo,
      raíz:b.raiz, ángulo:b.angulo, único:b.unico, último:b.ultimo,
      índice:b.indice, máximo:b.maximo, mínimo:b.minimo,
      tamaño:b.tamano, vacío:v=>(v?.length??0)===0,
      rectángulo:b.rectangulo, círculo:b.circulo, línea:b.linea,
      triángulo:b.triangulo, cámara:b.camara,
      ratón_x:b.raton_x, ratón_y:b.raton_y, ratón_pulsado:b.raton_pulsado,
      mediana:b.mediana, intersección:b.interseccion,
      // Aliases informales de física
      gravedad: b.aplicar_gravedad,
      // Aliases de almacenamiento
      salvar:    b.guardar_datos,
      recuperar: b.cargar_datos,
    });

    return b;
  }

  // ─── Operaciones numéricas ────────────────────────────────────────────────
  async function applyNumberChange(context, line, rest, operation) {
    const clean = rest.replace(/^(?:el|la|los|las|un|una)\s+/i, "");
    let name, expression;
    const matchNormal = clean.match(identifierRegex(`^(__ID__)\\s+(?:por|en|con|y)\\s+(.+)$`));
    const matchInvert = rest.match(identifierRegex(`^(.+)\\s+a\\s+(?:el|la|los|las)?\\s*(__ID__)$`));
    if (matchNormal)      { name = matchNormal[1]; expression = matchNormal[2]; }
    else if (matchInvert) { name = matchInvert[2]; expression = matchInvert[1]; }
    else throw friendlyError(line.number, `Usa: sumar puntos por 10  o  sumar 10 a puntos`);
    const current = Number(context[name]) || 0;
    const value   = Number(await evalExpr(expression, context, line.number));
    if (operation === "add")      context[name] = current + value;
    if (operation === "subtract") context[name] = current - value;
    if (operation === "multiply") context[name] = current * value;
    if (operation === "divide")   context[name] = current / value;
  }

  // ─── Ejecutor principal ───────────────────────────────────────────────────
  async function executeLines(lines, context, env, start = 0, end = lines.length) {
    for (let index = start; index < end; index++) {
      const line    = lines[index];
      const rawText = line.text.trim();
      if (isBlank(rawText)) continue;

      const informalText = normalizeInformal(rawText);
      const text    = normalizeLine(informalText);
      const command = lineCommand(text);

      // ── print ──────────────────────────────────────────────────────────────
      if (command === "print") {
        env.write(await evalExpr(removeCommand(text, "print"), context, line.number));
        continue;
      }

      // ── ask ────────────────────────────────────────────────────────────────
      if (command === "ask") {
        const rest  = removeCommand(text, "ask");
        const match = rest.match(identifierRegex(`^(__ID__)(?:\\s+(.+))?$`));
        if (!match) throw friendlyError(line.number, `Pregunta asi: preguntar nombre "Como te llamas?"`);
        context[match[1]] = await env.ask(match[2] ? await evalExpr(match[2], context, line.number) : "Escribe un valor:");
        continue;
      }

      // ── set ────────────────────────────────────────────────────────────────
      if (command === "set") {
        const { name, expression } = splitNameAndExpression(removeCommand(text, "set"), line.number);
        context[name] = await evalExpr(expression, context, line.number);
        continue;
      }

      // Asignación sin comando explícito
      if (!command) {
        const cleanText = text.replace(/^(?:el|la|los|las|un|una|mi|tu|su)\s+(?:valor\s+de\s+|variable\s+)?/i, "");
        if (identifierRegex(`^__ID__\\s*(?:=|es|vale|como|igual|ahora es|ahora vale|sera|será|pasa a ser|se convierte en|va a ser|tiene el valor de|tiene como valor|quiero que sea|que sea|q sea|ke sea|tiene|contiene)\\s*`).test(cleanText)) {
          const { name, expression } = splitNameAndExpression(cleanText, line.number);
          context[name] = await evalExpr(expression, context, line.number);
          continue;
        }
      }

      // Asignación de propiedad de objeto: obj.prop = valor
      if (!command && /^[\p{L}_][\p{L}\p{N}_]*\.[\p{L}_][\p{L}\p{N}_]*\s*(=|es|vale)\s*/iu.test(text)) {
        const match = text.match(/^([\p{L}_][\p{L}\p{N}_]*)\.([\p{L}_][\p{L}\p{N}_]*)\s*(?:=|es|vale)\s*(.+)$/iu);
        if (match) {
          if (!context[match[1]] || typeof context[match[1]] !== "object") context[match[1]] = {};
          context[match[1]][match[2]] = await evalExpr(match[3], context, line.number);
          continue;
        }
      }

      // ── operaciones numéricas ──────────────────────────────────────────────
      if (["add","subtract","multiply","divide"].includes(command)) {
        await applyNumberChange(context, line, removeCommand(text, command), command);
        continue;
      }

      // ── append ─────────────────────────────────────────────────────────────
      if (command === "append") {
        const rest  = removeCommand(text, "append");
        const match = rest.match(identifierRegex(`^(.+)\\s+a\\s+(?:el|la|los|las)?\\s*(__ID__)$`));
        if (!match) throw friendlyError(line.number, `Agrega asi: agregar "llave" a mochila`);
        if (!Array.isArray(context[match[2]])) context[match[2]] = [];
        context[match[2]].push(await evalExpr(match[1], context, line.number));
        continue;
      }

      // ── NUEVO: insert (insertar en posición) ───────────────────────────────
      if (command === "insert") {
        // "insertar en lista posicion 2 el valor X"
        const rest = removeCommand(text, "insert");
        const match = rest.match(identifierRegex(`^(.+)\\s+en\\s+(__ID__)\\s+(?:en\\s+)?(?:posicion|posición|indice|índice)?\\s*(.+)$`));
        if (!match) throw friendlyError(line.number, `Usa: insertar en lista posicion 2 el valor "x"`);
        const lista = context[match[2]];
        if (!Array.isArray(lista)) throw friendlyError(line.number, `"${match[2]}" no es una lista.`);
        const valor = await evalExpr(match[1], context, line.number);
        const pos   = Number(await evalExpr(match[3], context, line.number));
        lista.splice(pos, 0, valor);
        continue;
      }

      // ── remove ─────────────────────────────────────────────────────────────
      if (command === "remove") {
        const rest  = removeCommand(text, "remove");
        const match = rest.match(identifierRegex(`^(.+)\\s+de\\s+(?:el|la|los|las)?\\s*(__ID__)$`));
        if (!match) throw friendlyError(line.number, `Quita asi: quitar "llave" de mochila`);
        const list = context[match[2]];
        if (!Array.isArray(list)) throw friendlyError(line.number, `Solo puedo quitar cosas de una lista.`);
        const value    = await evalExpr(match[1], context, line.number);
        const position = list.indexOf(value);
        if (position >= 0) list.splice(position, 1);
        continue;
      }

      // ── NUEVO: removeAt (quitar por índice) ────────────────────────────────
      if (command === "removeAt") {
        const rest  = removeCommand(text, "removeAt");
        const match = rest.match(identifierRegex(`^(__ID__)\\s+(?:en\\s+)?(?:posicion|posición|indice|índice)?\\s*(.+)$`));
        if (!match) throw friendlyError(line.number, `Usa: quitar en posicion lista 2`);
        const list = context[match[1]];
        if (!Array.isArray(list)) throw friendlyError(line.number, `"${match[1]}" no es una lista.`);
        const pos = Number(await evalExpr(match[2], context, line.number));
        if (pos >= 0 && pos < list.length) list.splice(pos, 1);
        continue;
      }

      // ── clear ──────────────────────────────────────────────────────────────
      if (command === "clear") { env.clear(); continue; }

      // ── if ─────────────────────────────────────────────────────────────────
      if (command === "if") {
        const block     = findBlockEnd(lines, index);
        const condition = cleanBlockOpener(removeCommand(text, "if"));
        if (await evalExpr(condition, context, line.number)) {
          const endOfTrue = block.elifIndexes.length > 0
            ? block.elifIndexes[0]
            : (block.elseIndex === -1 ? block.endIndex : block.elseIndex);
          await executeLines(lines, context, env, index + 1, endOfTrue);
        } else {
          let handled = false;
          for (let e = 0; e < block.elifIndexes.length; e++) {
            const elifLine = lines[block.elifIndexes[e]];
            const elifCond = cleanBlockOpener(removeCommand(normalizeLine(elifLine.text.trim()), "elif"));
            const nextStop = block.elifIndexes[e+1] ?? (block.elseIndex === -1 ? block.endIndex : block.elseIndex);
            if (await evalExpr(elifCond, context, elifLine.number)) {
              await executeLines(lines, context, env, block.elifIndexes[e]+1, nextStop);
              handled = true; break;
            }
          }
          if (!handled && block.elseIndex !== -1)
            await executeLines(lines, context, env, block.elseIndex+1, block.endIndex);
        }
        index = block.endIndex; continue;
      }

      // ── NUEVO: switch/según ────────────────────────────────────────────────
      if (command === "switch") {
        const block    = findBlockEnd(lines, index);
        const exprText = cleanBlockOpener(removeCommand(text, "switch"));
        const valor    = await evalExpr(exprText, context, line.number);
        let handled    = false;

        for (let c = 0; c < block.caseIndexes.length; c++) {
          const caseLine   = lines[block.caseIndexes[c]];
          const caseText   = normalizeLine(caseLine.text.trim());
          const caseVal    = await evalExpr(cleanBlockOpener(removeCommand(caseText, "case")), context, caseLine.number);
          // Si el caso tiene su propio fin, usar ese; si no, usar el inicio del siguiente caso/default/fin
          const caseEnd    = block.caseEndAt?.get(block.caseIndexes[c]) ?? null;
          const nextCaseIdx = caseEnd ??
            (block.caseIndexes[c+1] ?? (block.defaultIndex !== -1 ? block.defaultIndex : block.endIndex));
          if (valor === caseVal || String(valor) === String(caseVal)) {
            await executeLines(lines, context, env, block.caseIndexes[c]+1, nextCaseIdx);
            handled = true; break;
          }
        }
        if (!handled && block.defaultIndex !== -1) {
          const defEnd = block.caseEndAt?.get(block.defaultIndex) ?? block.endIndex;
          await executeLines(lines, context, env, block.defaultIndex+1, defEnd);
        }

        index = block.endIndex; continue;
      }

      // ── repeat ─────────────────────────────────────────────────────────────
      if (command === "repeat") {
        const block     = findBlockEnd(lines, index);
        const timesExpr = cleanBlockOpener(removeCommand(text, "repeat"))
          .replace(/\s+veces\s*$/i, "")
          .replace(/^(?:un|una|el|la)\s+/i, "");
        const times = Number(await evalExpr(timesExpr, context, line.number));
        if (!Number.isFinite(times)) throw friendlyError(line.number, `"repetir" necesita un numero. Ejemplo: repetir 5 veces`);
        for (let round = 1; round <= times; round++) {
          context.vez = round;
          try { await executeLines(lines, context, env, index+1, block.endIndex); }
          catch (e) { if (e.signal==="break") break; if (e.signal==="continue") continue; throw e; }
        }
        index = block.endIndex; continue;
      }

      // ── while ──────────────────────────────────────────────────────────────
      if (command === "while") {
        const block     = findBlockEnd(lines, index);
        const condition = cleanBlockOpener(removeCommand(text, "while"));
        let guard = 0;
        while (await evalExpr(condition, context, line.number)) {
          if (++guard > 100000) throw friendlyError(line.number, `El "mientras" dio demasiadas vueltas. La condicion nunca cambia?`);
          try { await executeLines(lines, context, env, index+1, block.endIndex); }
          catch (e) { if (e.signal==="break") break; if (e.signal==="continue") continue; throw e; }
        }
        index = block.endIndex; continue;
      }

      // ── each ───────────────────────────────────────────────────────────────
      if (command === "each") {
        const block = findBlockEnd(lines, index);
        let   inner = cleanBlockOpener(removeCommand(text, "each"));
        inner = inner.replace(/\s+de\s+(?:la|el|los|las)\s+/i, " en ");
        const match = inner.match(identifierRegex(`^(__ID__)\\s+en\\s+(.+)$`));
        if (!match) throw friendlyError(line.number, `Recorre asi: para cada cosa en lista`);
        const list = await evalExpr(match[2], context, line.number);
        if (!list || typeof list[Symbol.iterator] !== "function")
          throw friendlyError(line.number, `"${match[2]}" no se puede recorrer. Es una lista?`);
        for (const item of list) {
          context[match[1]] = item;
          try { await executeLines(lines, context, env, index+1, block.endIndex); }
          catch (e) { if (e.signal==="break") break; if (e.signal==="continue") continue; throw e; }
        }
        index = block.endIndex; continue;
      }

      // ── NUEVO: eachIndex (para cada con índice) ────────────────────────────
      if (command === "eachIndex") {
        const block = findBlockEnd(lines, index);
        let   inner = cleanBlockOpener(removeCommand(text, "eachIndex"));
        // "para cada con indice item, i en lista"
        const match = inner.match(identifierRegex(`^(__ID__)\\s*,\\s*(__ID__)\\s+en\\s+(.+)$`));
        if (!match) throw friendlyError(line.number, `Usa: para cada con indice elemento, posicion en lista`);
        const list = await evalExpr(match[3], context, line.number);
        if (!Array.isArray(list)) throw friendlyError(line.number, `"${match[3]}" no es una lista.`);
        for (let i = 0; i < list.length; i++) {
          context[match[1]] = list[i];
          context[match[2]] = i;
          try { await executeLines(lines, context, env, index+1, block.endIndex); }
          catch (e) { if (e.signal==="break") break; if (e.signal==="continue") continue; throw e; }
        }
        index = block.endIndex; continue;
      }

      // ── function ───────────────────────────────────────────────────────────
      if (command === "function") {
        const block = findBlockEnd(lines, index);
        const parts = cleanBlockOpener(removeCommand(text, "function")).split(/\s+/).filter(Boolean);
        const name  = parts.shift();
        if (!name) throw friendlyError(line.number, `Ponle nombre a la funcion. Ejemplo: funcion doble numero`);
        const bodyStart = index+1, bodyEnd = block.endIndex;
        context[name] = async (...args) => {
          const local = Object.create(context);
          parts.forEach((p,i) => { local[p] = args[i]; });
          try { await executeLines(lines, local, env, bodyStart, bodyEnd); }
          catch (e) { if (e.signal==="return") return e.returnValue; throw e; }
          return null;
        };
        index = block.endIndex; continue;
      }

      // ── try/catch ──────────────────────────────────────────────────────────
      if (command === "try") {
        const block      = findBlockEnd(lines, index);
        const catchIndex = block.elseIndex;
        try {
          await executeLines(lines, context, env, index+1, catchIndex===-1 ? block.endIndex : catchIndex);
        } catch (e) {
          if (e.signal) throw e;
          if (catchIndex !== -1) {
            const catchRest = stripLeadingDeterminer(
              removeCommand(normalizeLine(lines[catchIndex].text.trim()), "catch").trim()
            ).trim();
            context[catchRest || "error_mensaje"] = e.message;
            await executeLines(lines, context, env, catchIndex+1, block.endIndex);
          }
        }
        index = block.endIndex; continue;
      }

      // ── throw ──────────────────────────────────────────────────────────────
      if (command === "throw") {
        const msg = await evalExpr(removeCommand(text, "throw"), context, line.number);
        throw friendlyError(line.number, String(msg));
      }

      // ── señales ────────────────────────────────────────────────────────────
      if (command === "return")   throw signal("return", await evalExpr(removeCommand(text,"return"), context, line.number));
      if (command === "stop")     throw signal("break");
      if (command === "continue") throw signal("continue");

      // ── wait / frame ───────────────────────────────────────────────────────
      if (command === "wait") {
        await context.esperar(await evalExpr(removeCommand(text,"wait"), context, line.number));
        continue;
      }
      if (command === "frame") {
        await context.fotograma(await evalExpr(removeCommand(text,"frame"), context, line.number));
        continue;
      }

      // ── clase ──────────────────────────────────────────────────────────────
      if (command === "class") {
        const block = findBlockEnd(lines, index);
        const parts = cleanBlockOpener(removeCommand(text, "class")).split(/\s+/).filter(Boolean);
        const className = parts.shift();
        if (!className) throw friendlyError(line.number, `Ponle nombre a la clase. Ejemplo: clase Jugador vida nombre`);
        const fields   = parts; // nombres de campos del constructor
        const bodyStart = index + 1, bodyEnd = block.endIndex;
        // Guardamos la definición de clase en el contexto
        context[className] = async (...args) => {
          const instance = { _clase: className };
          fields.forEach((f, i) => { instance[f] = args[i] !== undefined ? args[i] : null; });
          // Ejecutar el cuerpo de la clase para definir métodos en la instancia
          const localCtx = Object.create(context);
          Object.assign(localCtx, instance);
          localCtx._self = instance;
          await executeLines(lines, localCtx, env, bodyStart, bodyEnd);
          // Copiar métodos definidos en el cuerpo hacia la instancia
          for (const key of Object.keys(localCtx)) {
            if (typeof localCtx[key] === "function" && !context[key]) instance[key] = localCtx[key];
          }
          return instance;
        };
        index = block.endIndex; continue;
      }

      // ── nuevo (instanciar clase) ────────────────────────────────────────────
      // Sintaxis: variable es nuevo NombreClase arg1 arg2
      // Esto se maneja como expresión libre porque "nuevo X(...)" ya es una llamada de función
      // Solo necesitamos que "nuevo NombreClase args" se traduzca a "NombreClase(args)"

      if (command === "saveData") {
        const rest  = removeCommand(text, "saveData");
        const match = rest.match(identifierRegex(`^(?:el|la)?\\s*(__ID__)\\s+(?:como|en|con nombre)?\\s*"?([^"]+)"?$`));
        if (match) {
          const valor = await evalExpr(match[1], context, line.number);
          try { localStorage.setItem("ic_" + match[2], JSON.stringify(valor)); } catch {}
        } else {
          const parts = rest.split(/\s+/);
          if (parts.length >= 2) {
            const valor = await evalExpr(parts[0], context, line.number);
            try { localStorage.setItem("ic_" + parts[1], JSON.stringify(valor)); } catch {}
          }
        }
        continue;
      }
      if (command === "loadData") {
        const rest  = removeCommand(text, "loadData");
        const match = rest.match(identifierRegex(`^(__ID__)\\s+(?:desde|de)?\\s*"?([^"]+)"?$`));
        if (match) {
          try {
            const v = localStorage.getItem("ic_" + match[2]);
            context[match[1]] = v !== null ? JSON.parse(v) : null;
          } catch { context[match[1]] = null; }
        }
        continue;
      }
      if (command === "deleteData") {
        const rest = removeCommand(text, "deleteData");
        try { localStorage.removeItem("ic_" + rest.trim().replace(/"/g,"")); } catch {}
        continue;
      }

      // ── debug/tabla ────────────────────────────────────────────────────────
      if (command === "debug") {
        const val = await evalExpr(removeCommand(text, "debug"), context, line.number);
        env.write(`[debug] ${JSON.stringify(val, null, 2)}`);
        continue;
      }
      if (command === "table") {
        const val = await evalExpr(removeCommand(text, "table"), context, line.number);
        context.tabla(val);
        continue;
      }

      // ── comandos visuales ──────────────────────────────────────────────────
      const visualCallNames = {
        screen:"pantalla", background:"fondo", color:"color",
        rect:"rectangulo", circle:"circulo", line:"linea",
        text:"texto_en", triangle:"triangulo", strokeRect:"marco",
        bar:"barra", sprite:"sprite", camera:"camara",
        clearScreen:"limpiar_pantalla", draw:"dibujar",
        opacity:"opacidad", rotate:"rotar_canvas", scale:"escalar_canvas",
        shadow:"sombra", gradient:"degradado", polygon:"poligono",
        star:"estrella", image:"imagen", textAlign:"alinear_texto",
        font:"fuente", arc:"arco", bezier:"curva"
      };
      if (command in visualCallNames) {
        await evalExpr(`${visualCallNames[command]}(${removeCommand(text,command)})`, context, line.number);
        continue;
      }

      // ── case/default/else/elif/catch solos ─────────────────────────────────
      if (command === "use") { await evalExpr(removeCommand(text,"use"), context, line.number); continue; }

      if (["end","else","elif","catch","case","default"].includes(command))
        throw friendlyError(line.number, `"${rawText}" aparece solo. Falta un "si", "repetir", "segun" o "funcion" antes?`);

      // ── expresión libre ────────────────────────────────────────────────────
      await evalExpr(text, context, line.number);
    }
  }

  // ─── API pública ──────────────────────────────────────────────────────────
  async function run(code, options = {}) {
    const output = [], drawCalls = [];
    const env = {
      write(v="") { output.push(String(v)); options.write?.(v); },
      clear()     { output.length=0; options.clear?.(); },
      ask(q)      { return options.ask ? options.ask(q) : ""; },
      draw(t,d)   { drawCalls.push({type:t,data:d}); options.draw?.(t,d); },
      input:      options.input || {}
    };
    const context = makeBaseBuiltins(env);
    Object.assign(context, options.globals || {});
    const lines = String(code).split(/\r?\n/).map((text,i)=>({text,number:i+1}));
    await executeLines(lines, context, env);
    return { output, drawCalls, context };
  }

  const api = { run, transformExpression, commandGroups };
  root.IsmaCodeCore = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;

})(typeof globalThis !== "undefined" ? globalThis : window);
