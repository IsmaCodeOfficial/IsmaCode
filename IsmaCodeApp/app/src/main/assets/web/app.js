const codeEl      = document.querySelector("#code");
const outputEl    = document.querySelector("#output");
const statusEl    = document.querySelector("#status");
const gutterEl    = document.querySelector("#gutter");
const runButton   = document.querySelector("#runButton");
const clearButton = document.querySelector("#clearButton");
const copyButton  = document.querySelector("#copyButton");
const openButton  = document.querySelector("#openButton");
const saveButton  = document.querySelector("#saveButton");
const fileInput   = document.querySelector("#fileInput");
const examplesEl  = document.querySelector("#examples");
const canvas      = document.querySelector("#stage");
const ctx         = canvas.getContext("2d");

let currentColor = "#ff4d92";
let currentFont  = "Inter, system-ui, sans-serif";
let currentLineWidth = 4;
let currentAlpha = 1;
let cameraX = 0;
let cameraY = 0;
const inputState = {
  keys:    new Set(),
  newKeys: new Set(),
  mouse:   { x: 0, y: 0, down: false, clicked: false, right: false },
  screen:  { width: 640, height: 360 }
};
const imageCache = new Map();

const examples = [
  {
    title: "Hola IC",
    hint:  "Variables, textos y fechas",
    code:
`guardar nombre = "Ismael"
mostrar "Hola " + nombre
mostrar "Hoy es " + fecha()
mostrar mayusculas("IsmaCode despierta")`
  },
  {
    title: "Con articulos",
    hint:  "Escribe como hablas",
    code:
`# Puedes usar el, la, un, una... donde quieras

el nombre es "Ismael"
la edad es 17
un saludo es "Hola, " + el nombre

muestra el saludo
muestra la edad

la mochila es ["agua", "mapa"]
agregar "linterna" a la mochila
quitar "mapa" de la mochila

para cada objeto en la mochila:
  muestra "Llevas: " + objeto
fin

muestra "Total: " + largo(la mochila)`
  },
  {
    title: "Signos con palabras",
    hint:  "Comparaciones faciles",
    code:
`año es 2026
puntos es 12

si puntos mayor o igual que 10 entonces
  mostrar "Nivel alto en " + año
sino
  mostrar "Nivel bajo"
fin

mostrar "Doble: " + puntos * 2`
  },
  {
    title: "Inventario",
    hint:  "Listas editables",
    code:
`mochila es ["agua", "mapa"]
agregar "linterna" a mochila
agregar "llave" a mochila
quitar "mapa" de mochila

para cada objeto en mochila:
  mostrar "Llevas: " + objeto
fin

mostrar "Total: " + largo(mochila)`
  },
  {
    title: "Varias condiciones",
    hint:  "Si / sino si / sino",
    code:
`# Cambia el numero para probar

la nota es 7

si la nota >= 9 entonces
  mostrar "Sobresaliente"
sino si la nota >= 7
  mostrar "Notable"
sino si la nota >= 5
  mostrar "Aprobado"
sino
  mostrar "Suspenso"
fin`
  },
  {
    title: "Objetos",
    hint:  "Guardar datos juntos",
    code:
`jugador.nombre es "Ismael"
jugador.vida    es 100
jugador.puntos  es 0

mostrar "Jugador: " + jugador.nombre
mostrar "Vida: "    + jugador.vida
mostrar "Puntos: "  + jugador.puntos

sumar jugador.puntos por 50
mostrar "Puntos tras bonus: " + jugador.puntos`
  },
  {
    title: "Intentar / Si falla",
    hint:  "Manejo de errores",
    code:
`intentar
  un numero es numero("hola")
  mostrar el numero + 5
si falla el problema
  mostrar "Algo salio mal: " + el problema
fin

mostrar "El programa sigue aunque hubo un error"`
  },
  {
    title: "Frases naturales",
    hint:  "Escribe como si explicaras",
    code:
`# Puedes escribir casi como hablas

el nombre es "Ismael"
la puntuacion es 0
la mochila es []

agregar "espada" a la mochila
agregar "escudo" a la mochila
agregar "pocion" a la mochila

sumar la puntuacion por 100

muestra "Jugador: " + el nombre
muestra "Puntuacion: " + la puntuacion

si la puntuacion mayor que 50
  muestra "Buen resultado"
sino
  muestra "Sigue intentando"
fin

muestra "Objetos:"
para cada objeto en la mochila
  muestra "  - " + objeto
fin`
  },
  {
    title: "Estilo informal",
    hint:  "Con q, xq y frases del dia a dia",
    code:
`# IC entiende formas de escribir informales

el nombre es "Isma"
los puntos es 0

# "ponme" funciona igual q "mostrar"
ponme "Hola " + el nombre

# sumar de forma normal
sumar los puntos por 10
sumar los puntos por 5

ponme "Puntos: " + los puntos

# condicion informal
si los puntos mayor que 12
  ponme "Superaste los 12, bien hecho"
sino
  ponme "Aun por debajo de 13"
fin

# lista con agregar
la lista es []
agregar "cosa1" a la lista
agregar "cosa2" a la lista
agregar "cosa3" a la lista

ponme "Total en la lista: " + largo(la lista)`
  },
  {
    title: "Texto con {variables}",
    hint:  "Interpolación dentro de comillas",
    code:
`nombre es "Ismael"
edad es 17
ciudad es "Madrid"

mostrar "Hola, soy {nombre} y tengo {edad} años"
mostrar "Vivo en {ciudad} y nací en {2026 - edad}"

puntos es 850
nivel es "Oro" si puntos > 800 sino "Plata"
mostrar "Nivel: {nivel} con {puntos} puntos"`
  },
  {
    title: "Ternario natural",
    hint:  "A si condicion sino B",
    code:
`nota es 8
resultado es "Aprobado" si nota >= 5 sino "Suspenso"
mostrar resultado

vida es 30
estado es "Critico" si vida < 25 sino "Bien" si vida < 60 sino "Perfecto"
mostrar "Estado: " + estado

# En una línea
mostrar "Par" si 10 % 2 == 0 sino "Impar"`
  },
  {
    title: "Clases",
    hint:  "Objetos con constructor y métodos",
    code:
`clase Jugador nombre vida:
  funcion saludar:
    mostrar "Soy " + nombre + " con " + vida + " de vida"
  fin
  funcion curar cantidad:
    sumar vida por cantidad
    mostrar nombre + " curado. Vida: " + vida
  fin
fin

j1 es nuevo Jugador "Ismael" 80
j2 es nuevo Jugador "Ada" 100

j1.saludar()
j2.saludar()
j1.curar(15)
mostrar "Vida final de Ismael: " + j1.vida`
  },
  {
    title: "Pipe |>",
    hint:  "Encadenar funciones",
    code:
`numeros es [5, 2, 8, 1, 9, 3, 7, 4, 6]

# Sin pipe
resultado es ordenar_numeros(filtrar(numeros, n => n > 4))
mostrar resultado

# Con pipe (mismo resultado, más claro)
resultado2 es numeros |> filtrar(n => n > 4) |> ordenar_numeros
mostrar resultado2

palabras es ["hola", "mundo", "ismael", "codigo"]
resultado3 es palabras |> ordenar |> invertir
mostrar resultado3`
  },
  {
    title: "Según / casos",
    hint:  "Switch en español",
    code:
`dia es 3

segun dia:
  caso 1:
    mostrar "Lunes"
  fin
  caso 2:
    mostrar "Martes"
  fin
  caso 3:
    mostrar "Miércoles"
  fin
  caso 4:
    mostrar "Jueves"
  fin
  caso 5:
    mostrar "Viernes"
  fin
  por defecto:
    mostrar "Fin de semana"
  fin
fin`
  },
  {
    title: "Dibujo básico",
    hint:  "Formas, colores y barra",
    code:
`pantalla 640, 360
fondo "#130812"
color "#cf0050"
rectangulo 40, 60, 170, 110
color "#ffffff"
texto_en "IC dibuja", 62, 120, 28
color "#ff4d92"
circulo 430, 170, 70
linea 300, 300, 540, 70
marco 38, 58, 174, 114
barra 60, 290, 240, 24, 75, 100
triangulo 520, 270, 570, 320, 470, 320`
  },
  {
    title: "Juego base",
    hint:  "Interactivo con teclado",
    code:
`pantalla 640, 360
jugador_x es 80
jugador_y es 250
velocidad es 7
vida es 100
puntos es 0
monedas es []

repetir 6 veces
  moneda es [azar(120, 570), azar(50, 260)]
  agregar moneda a monedas
fin

repetir 600 veces
  limpiar pantalla
  fondo "#0a0a0f"

  si tecla("derecha") entonces
    sumar jugador_x por velocidad
  fin
  si tecla("izquierda") entonces
    restar jugador_x por velocidad
  fin
  si tecla("arriba") entonces
    restar jugador_y por velocidad
  fin
  si tecla("abajo") entonces
    sumar jugador_y por velocidad
  fin

  jugador_x es limitar(jugador_x, 0, ancho_pantalla() - 55)
  jugador_y es limitar(jugador_y, 45, alto_pantalla() - 55)

  color "#ffd166"
  para cada moneda en monedas
    circulo primero(moneda), ultimo(moneda), 12
    si choca(jugador_x, jugador_y, 55, 55, primero(moneda) - 12, ultimo(moneda) - 12, 24, 24) entonces
      sumar puntos por 1
      quitar moneda de monedas
    fin
  fin

  color "#ff4d92"
  sprite "IC", jugador_x, jugador_y, 55, 55
  marco jugador_x - 4, jugador_y - 4, 63, 63

  color "#ffffff"
  texto_en "Mueve con flechas", 28, 28, 22
  texto_en "Puntos: " + puntos, 28, 56, 22
  barra 28, 70, 180, 16, vida, 100
  fotograma 60
fin

mostrar "Puntos conseguidos: " + puntos`
  }
];

function updateGutter() {
  const count = codeEl.value.split("\n").length;
  gutterEl.textContent = Array.from({ length: count }, (_, i) => i + 1).join("\n");
}

function write(text = "") {
  outputEl.textContent += String(text) + "\n";
}

function setStatus(text, type = "") {
  statusEl.textContent = text;
  statusEl.className   = type;
}

function resizeCanvas(width, height) {
  canvas.width  = Number(width)  || 640;
  canvas.height = Number(height) || 360;
  inputState.screen.width  = canvas.width;
  inputState.screen.height = canvas.height;
  ctx.fillStyle = "#07080c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function sx(value) { return Number(value) - cameraX; }
function sy(value) { return Number(value) - cameraY; }

function draw(type, data) {
  if (type === "screen")      { resizeCanvas(data.width, data.height); return; }
  if (type === "clearScreen") { cameraX = 0; cameraY = 0; inputState.mouse.clicked = false; ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
  if (type === "camera")      { cameraX = Number(data.x) || 0; cameraY = Number(data.y) || 0; return; }
  if (type === "background")  { ctx.save(); ctx.globalAlpha = 1; ctx.fillStyle = data.color; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.restore(); return; }
  if (type === "color")       { currentColor = data.color; return; }
  if (type === "opacity")     { currentAlpha = Math.max(0, Math.min(1, Number(data.alpha))); ctx.globalAlpha = currentAlpha; return; }
  if (type === "lineWidth")   { currentLineWidth = Number(data.width) || 2; return; }
  if (type === "font")        { currentFont = `${data.family || "Inter, system-ui, sans-serif"}`; return; }
  if (type === "textAlign")   { ctx.textAlign = data.align || "start"; return; }
  if (type === "save")        { ctx.save(); return; }
  if (type === "restore")     { ctx.restore(); return; }
  if (type === "shadow")      {
    ctx.shadowColor = data.color || "transparent";
    ctx.shadowBlur  = Number(data.blur) || 0;
    ctx.shadowOffsetX = Number(data.ox) || 0;
    ctx.shadowOffsetY = Number(data.oy) || 0;
    return;
  }
  if (type === "rotate") {
    ctx.save();
    const cx = sx(data.cx || 0), cy = sy(data.cy || 0);
    ctx.translate(cx, cy); ctx.rotate(Number(data.angle)); ctx.translate(-cx, -cy);
    return;
  }
  if (type === "scale") {
    ctx.save(); ctx.scale(Number(data.sx) || 1, Number(data.sy) || 1); return;
  }
  if (type === "rect")       { ctx.fillStyle = currentColor; ctx.fillRect(sx(data.x), sy(data.y), Number(data.width), Number(data.height)); return; }
  if (type === "roundRect")  {
    const x = sx(data.x), y = sy(data.y), w = Number(data.width), h = Number(data.height), r = Number(data.radius) || 0;
    ctx.fillStyle = currentColor; ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
    ctx.fill(); return;
  }
  if (type === "circle")     { ctx.fillStyle = currentColor; ctx.beginPath(); ctx.arc(sx(data.x), sy(data.y), Number(data.radius), 0, Math.PI * 2); ctx.fill(); return; }
  if (type === "arc")        {
    ctx.strokeStyle = currentColor; ctx.lineWidth = currentLineWidth;
    ctx.beginPath(); ctx.arc(sx(data.x), sy(data.y), Number(data.radius), Number(data.start), Number(data.end));
    data.fill ? (ctx.fillStyle = currentColor, ctx.fill()) : ctx.stroke(); return;
  }
  if (type === "line")       { ctx.strokeStyle = currentColor; ctx.lineWidth = currentLineWidth; ctx.beginPath(); ctx.moveTo(sx(data.x1), sy(data.y1)); ctx.lineTo(sx(data.x2), sy(data.y2)); ctx.stroke(); return; }
  if (type === "bezier")     {
    ctx.strokeStyle = currentColor; ctx.lineWidth = currentLineWidth;
    ctx.beginPath(); ctx.moveTo(sx(data.x1), sy(data.y1));
    ctx.bezierCurveTo(sx(data.cx1), sy(data.cy1), sx(data.cx2), sy(data.cy2), sx(data.x2), sy(data.y2));
    ctx.stroke(); return;
  }
  if (type === "text")       {
    ctx.fillStyle = currentColor;
    ctx.font = `${Number(data.size) || 20}px ${currentFont}`;
    ctx.fillText(String(data.text), sx(data.x), sy(data.y));
    return;
  }
  if (type === "triangle")   { ctx.fillStyle = currentColor; ctx.beginPath(); ctx.moveTo(sx(data.x1), sy(data.y1)); ctx.lineTo(sx(data.x2), sy(data.y2)); ctx.lineTo(sx(data.x3), sy(data.y3)); ctx.closePath(); ctx.fill(); return; }
  if (type === "polygon")    {
    const sides = Number(data.sides) || 6, r = Number(data.radius), cx2 = sx(data.x), cy2 = sy(data.y);
    ctx.fillStyle = currentColor; ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
      i === 0 ? ctx.moveTo(cx2 + r * Math.cos(a), cy2 + r * Math.sin(a))
              : ctx.lineTo(cx2 + r * Math.cos(a), cy2 + r * Math.sin(a));
    }
    ctx.closePath(); ctx.fill(); return;
  }
  if (type === "star")       {
    const pts = Number(data.points) || 5, ro = Number(data.outerRadius), ri = Number(data.innerRadius);
    const cx2 = sx(data.x), cy2 = sy(data.y);
    ctx.fillStyle = currentColor; ctx.beginPath();
    for (let i = 0; i < pts * 2; i++) {
      const a = (i / (pts * 2)) * Math.PI * 2 - Math.PI / 2;
      const rad = i % 2 === 0 ? ro : ri;
      i === 0 ? ctx.moveTo(cx2 + rad * Math.cos(a), cy2 + rad * Math.sin(a))
              : ctx.lineTo(cx2 + rad * Math.cos(a), cy2 + rad * Math.sin(a));
    }
    ctx.closePath(); ctx.fill(); return;
  }
  if (type === "strokeRect") { ctx.strokeStyle = currentColor; ctx.lineWidth = currentLineWidth; ctx.strokeRect(sx(data.x), sy(data.y), Number(data.width), Number(data.height)); return; }
  if (type === "gradient")   {
    const g = ctx.createLinearGradient(sx(data.x1), sy(data.y1), sx(data.x2), sy(data.y2));
    g.addColorStop(0, data.color1); g.addColorStop(1, data.color2);
    currentColor = g; return;
  }
  if (type === "bar") {
    const x = sx(data.x), y = sy(data.y), width = Number(data.width), height = Number(data.height);
    const max = Number(data.max) || 100, value = Math.max(0, Math.min(max, Number(data.value)));
    ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(x, y, width, height);
    ctx.fillStyle = currentColor; ctx.fillRect(x, y, width * (value / max), height);
    ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, width, height);
    return;
  }
  if (type === "sprite") {
    const x = sx(data.x), y = sy(data.y), width = Number(data.width), height = Number(data.height);
    ctx.fillStyle = currentColor; ctx.fillRect(x, y, width, height);
    ctx.fillStyle = "white"; ctx.font = `${Math.max(12, Math.min(width, height) * 0.35)}px ${currentFont}`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(String(data.name), x + width / 2, y + height / 2);
    ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
    return;
  }
  if (type === "image") {
    const src = String(data.src);
    const doRender = (img) => {
      const x = sx(data.x), y = sy(data.y);
      const w = data.width  ? Number(data.width)  : img.naturalWidth;
      const h = data.height ? Number(data.height) : img.naturalHeight;
      ctx.drawImage(img, x, y, w, h);
    };
    if (imageCache.has(src)) { doRender(imageCache.get(src)); }
    else {
      const img = new Image(); img.crossOrigin = "anonymous";
      img.onload = () => { imageCache.set(src, img); doRender(img); };
      img.src = src;
    }
    return;
  }
}

async function runCode() {
  outputEl.textContent = "";
  resizeCanvas(canvas.width, canvas.height);
  currentColor = "#ff4d92"; currentFont = "Inter, system-ui, sans-serif";
  currentLineWidth = 4; currentAlpha = 1;
  ctx.globalAlpha = 1; ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
  ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
  cameraX = 0; cameraY = 0;
  imageCache.clear();
  setStatus("Ejecutando..."); runButton.disabled = true;
  try {
    await IsmaCodeCore.run(codeEl.value, {
      write,
      clear: () => { outputEl.textContent = ""; },
      ask:   question => prompt(question) ?? "",
      draw,
      input: inputState
    });
    setStatus("Terminado", "ok");
  } catch (error) {
    write(error.isIsmaCode ? error.message : `Algo fallo: ${error.message}`);
    setStatus("Revisar error", "bad");
  } finally {
    runButton.disabled = false;
  }
}

function loadExamples() {
  examplesEl.innerHTML = "";
  examples.forEach((example, index) => {
    const button = document.createElement("button");
    button.className = "example-card"; button.type = "button";
    button.innerHTML = `<strong>${example.title}</strong><span>${example.hint}</span>`;
    button.addEventListener("click", () => {
      codeEl.value = example.code; updateGutter();
      setStatus(`Ejemplo ${index + 1} cargado`);
    });
    examplesEl.append(button);
  });
}

function saveIcFile() {
  const blob = new Blob([codeEl.value], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob); link.download = "programa.ic"; link.click();
  URL.revokeObjectURL(link.href); setStatus("Archivo .ic guardado", "ok");
}

runButton.addEventListener("click", runCode);
clearButton.addEventListener("click", () => { outputEl.textContent = ""; setStatus("Salida limpia"); });
copyButton.addEventListener("click", async () => { await navigator.clipboard.writeText(codeEl.value); setStatus("Codigo copiado", "ok"); });
openButton.addEventListener("click", () => fileInput.click());
saveButton.addEventListener("click", saveIcFile);
fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0]; if (!file) return;
  codeEl.value = await file.text(); updateGutter(); setStatus(`${file.name} abierto`, "ok");
});
window.addEventListener("keydown", event => {
  const k = event.key.toLowerCase();
  if (!inputState.keys.has(k)) inputState.newKeys.add(k);
  inputState.keys.add(k);
  if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(event.key)) event.preventDefault();
});
window.addEventListener("keyup", event => {
  const k = event.key.toLowerCase();
  inputState.keys.delete(k);
  inputState.newKeys.delete(k);
});
canvas.addEventListener("pointermove", event => {
  const rect = canvas.getBoundingClientRect();
  inputState.mouse.x = (event.clientX - rect.left) * (canvas.width / rect.width);
  inputState.mouse.y = (event.clientY - rect.top)  * (canvas.height / rect.height);
});
canvas.addEventListener("pointerdown", event => {
  inputState.mouse.down    = true;
  inputState.mouse.clicked = true;
  inputState.mouse.right   = event.button === 2;
  canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener("pointerup", () => {
  inputState.mouse.down  = false;
  inputState.mouse.right = false;
});
canvas.addEventListener("contextmenu", e => e.preventDefault());
// Resetear clicked cada frame (se pone a false tras cada ejecución de fotograma)
// Se gestiona internamente: clicked dura solo 1 frame
// mouse.clicked se resetea en clearScreen (cada frame de juego limpia la pantalla)
codeEl.addEventListener("input", updateGutter);
codeEl.addEventListener("keydown", event => {
  if (event.key === "Tab") {
    event.preventDefault();
    const start = codeEl.selectionStart, end = codeEl.selectionEnd;
    codeEl.value = codeEl.value.slice(0, start) + "  " + codeEl.value.slice(end);
    codeEl.selectionStart = codeEl.selectionEnd = start + 2; updateGutter();
  }
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") runCode();
});

resizeCanvas(640, 360);
loadExamples();
codeEl.value = examples[0].code;
updateGutter();
