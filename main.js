const probabilidades = [1, 2, 4, 8]; // 1: Improbable, 2: Remoto, 4: Ocasional, 8: Probable
const impactos = [1, 2, 4, 8]; // 1: Insignificante, 2: Dañina, 4: Crítica, 8: Catastrófico
const maxImpacto = 64; // Nivel máximo de riesgo

// Array de objetos de riesgos
const riesgos = [
{ nombre: "Corte por objeto", probabilidad: 0, impacto: 0 },
{ nombre: "Caída de objeto", probabilidad: 0, impacto: 0 },
{ nombre: "Caída de persona en altura", probabilidad: 0, impacto: 0 },
{ nombre: "Atrapamiento", probabilidad: 0, impacto: 0 },
];

// Función para calcular el nivel de riesgo
function calcularNivelRiesgo(probabilidad, impacto) {
  return probabilidad * impacto;
}

// Función para calcular el porcentaje de riesgo
function calcularPorcentajeRiesgo(nivelRiesgo, nivelRiesgoMaximo) {
  return (nivelRiesgo / nivelRiesgoMaximo) * 100;
}

// Función para sugerir medidas preventivas basadas en el nivel de riesgo
function sugerirMedidas(nivelRiesgo) {
    if (nivelRiesgo >= 1 && nivelRiesgo <= 8) {
    return "Riesgo Bajo: Monitoreo regular y uso de EPP básico.";
}   else if (nivelRiesgo >= 9 && nivelRiesgo <= 24) {
    return "Riesgo Moderado: Implementar controles administrativos y capacitación.";
}   else if (nivelRiesgo >= 25 && nivelRiesgo <= 48) {
    return "Riesgo Alto: Requiere medidas correctivas inmediatas.";
}   else if (nivelRiesgo >= 49 && nivelRiesgo <= 64) {
    return "Riesgo Crítico: Detener la actividad.";
}   else {
    return "Nivel de riesgo no clasificado.";
}
}

// Función para actualizar el almacenamiento local
function actualizarStorage() {
    localStorage.setItem("riesgos", JSON.stringify(riesgos));
}

// Función para recuperar riesgos desde storage
function cargarDesdeStorage() {
    const datosGuardados = localStorage.getItem("riesgos");
    if (datosGuardados) {
    return JSON.parse(datosGuardados);
}
return riesgos;
}

// Función para renderizar los riesgos en HTML
function renderizarRiesgos() {
const listaRiesgos = document.getElementById("lista-riesgos");
listaRiesgos.innerHTML = "";

riesgos.forEach((riesgo, index) => {
    const nivelRiesgo = calcularNivelRiesgo(riesgo.probabilidad, riesgo.impacto);
    const porcentajeRiesgo = calcularPorcentajeRiesgo(nivelRiesgo, maxImpacto).toFixed(2);
    const medidas = sugerirMedidas(nivelRiesgo);

    const riesgoHtml = `
    <div class="riesgo-item">
        <h3>${riesgo.nombre}</h3>
        <p>Probabilidad: ${riesgo.probabilidad}</p>
        <p>Impacto: ${riesgo.impacto}</p>
        <p>Nivel de Riesgo: ${nivelRiesgo}</p>
        <p>Porcentaje de Riesgo: ${porcentajeRiesgo}%</p>
        <p>Medidas: ${medidas}</p>
    </div>
    `;

    listaRiesgos.innerHTML += riesgoHtml;
});
}

// Evento para agregar un riesgo
document.getElementById("agregar-riesgo").addEventListener("click", function () {
const riesgoSeleccionado = document.getElementById("riesgo-seleccionado").value;
const probabilidad = parseInt(document.getElementById("probabilidad").value);
const impacto = parseInt(document.getElementById("impacto").value);

if (probabilidades.includes(probabilidad) && impactos.includes(impacto)) {
    const riesgo = riesgos.find((r) => r.nombre === riesgoSeleccionado);
    riesgo.probabilidad = probabilidad;
    riesgo.impacto = impacto;

    actualizarStorage();
    renderizarRiesgos();
} else {
    alert("Valores inválidos. Deben ser: 1, 2, 4, 8.");
}
});

// Evento para cargar los riesgos guardados
document.addEventListener("DOMContentLoaded", function () {
const riesgosGuardados = cargarDesdeStorage();
riesgosGuardados.forEach((riesgoGuardado, index) => {
    riesgos[index].probabilidad = riesgoGuardado.probabilidad;
    riesgos[index].impacto = riesgoGuardado.impacto;
});

renderizarRiesgos();
});

// Evento para borrar todos los riesgos
document.getElementById("borrar-riesgos").addEventListener("click", function () {
localStorage.clear();
riesgos.forEach((riesgo) => {
    riesgo.probabilidad = 0;
    riesgo.impacto = 0;
});
renderizarRiesgos();
});
