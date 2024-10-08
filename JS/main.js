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


//  Historial de riesgos
let historial =[]

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
    switch (true) {
        case (nivelRiesgo >= 1 && nivelRiesgo <= 8):
            return "Riesgo Bajo: Monitoreo regular y uso de EPP básico.";
        case (nivelRiesgo >= 9 && nivelRiesgo <= 24):
            return "Riesgo Moderado: Implementar controles administrativos y capacitación.";
        case (nivelRiesgo >= 25 && nivelRiesgo <= 48):
            return "Riesgo Alto: Requiere medidas correctivas inmediatas.";
        case (nivelRiesgo >= 49 && nivelRiesgo <= 64):
            return "Riesgo Crítico: Detener la actividad.";
        default:
            return "Nivel de riesgo no clasificado.";
    }
}

// Función para actualizar el almacenamiento local con el historial de cambios
function actualizarStorage() {
    localStorage.setItem("riesgos", JSON.stringify(riesgos));
    localStorage.setItem("historial", JSON.stringify(historial));
}

// Función para recuperar riesgos desde storage
function cargarDesdeStorage() {
    const datosGuardados = localStorage.getItem("riesgos");
    const historialGuardado = localStorage.getItem("historial");
    if (datosGuardados) {
        riesgos = JSON.parse(datosGuardados);
    }
    if (historialGuardado) {
        historial = JSON.parse(historialGuardado);
    }
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

// Función para mostrar el historial de riesgos
function renderizarHistorial() {
    const historialDiv = document.getElementById("historial-riesgos");
    historialDiv.innerHTML = "";

    historial.forEach((entrada, index) => {
        const historialHtml = `
            <div class="riesgo-item">
                <h3>${entrada.riesgo}</h3>
                <p>Probabilidad: ${entrada.probabilidad}</p>
                <p>Impacto: ${entrada.impacto}</p>
                <p>Nivel de Riesgo: ${entrada.nivelRiesgo}</p>
                <p>Porcentaje de Riesgo: ${entrada.porcentajeRiesgo}%</p>
                <button onclick="borrarEntradaHistorial(${index})">Eliminar</button>
            </div>
        `;
        historialDiv.innerHTML += historialHtml;
    });
}

// Función para agregar o actualizar un riesgo en la lista
function actualizarRiesgoLista(riesgoSeleccionado, probabilidad, impacto) {
    const riesgo = riesgos.find(r => r.nombre === riesgoSeleccionado);

    // Si ya existe en el historial, obtener el valor más alto entre el historial y la entrada actual
    const entradasHistorial = historial.filter(h => h.riesgo === riesgoSeleccionado);
    
    let probabilidadMax = probabilidad;
    let impactoMax = impacto;
    
    entradasHistorial.forEach(h => {
        if (h.probabilidad > probabilidadMax) probabilidadMax = h.probabilidad;
        if (h.impacto > impactoMax) impactoMax = h.impacto;
    });

    // Actualizar la lista de riesgos con los valores más altos
    riesgo.probabilidad = probabilidadMax;
    riesgo.impacto = impactoMax;
}

// Función para borrar una entrada del historial y actualizar la lista de riesgos
function borrarEntradaHistorial(index) {
    const entradaEliminada = historial[index];
    historial.splice(index, 1);
    actualizarStorage();
    
    // Verificar si el riesgo eliminado sigue existiendo en el historial
    const entradasRestantes = historial.filter(h => h.riesgo === entradaEliminada.riesgo);

    if (entradasRestantes.length > 0) {
        // Si hay más entradas para este riesgo, actualizar la lista con los valores más altos
        let probabilidadMax = 0;
        let impactoMax = 0;

        entradasRestantes.forEach(h => {
            if (h.probabilidad > probabilidadMax) probabilidadMax = h.probabilidad;
            if (h.impacto > impactoMax) impactoMax = h.impacto;
        });

        // Actualizar la lista de riesgos con los valores más altos restantes
        const riesgo = riesgos.find(r => r.nombre === entradaEliminada.riesgo);
        riesgo.probabilidad = probabilidadMax;
        riesgo.impacto = impactoMax;
    } else {
        // Si no quedan entradas, restablecer el riesgo en la lista a 0
        const riesgo = riesgos.find(r => r.nombre === entradaEliminada.riesgo);
        riesgo.probabilidad = 0;
        riesgo.impacto = 0;
    }

    renderizarRiesgos();
    renderizarHistorial();
}

// Evento para agregar un riesgo
document.getElementById("agregar-riesgo").addEventListener("click", function () {
    const riesgoSeleccionado = document.getElementById("riesgo-seleccionado").value;
    const probabilidad = parseInt(document.getElementById("probabilidad").value);
    const impacto = parseInt(document.getElementById("impacto").value);
    const mensajeError = document.getElementById("mensaje-error");

    if (probabilidades.includes(probabilidad) && impactos.includes(impacto)) {
        // Agregar al historial
        historial.push({
            riesgo: riesgoSeleccionado,
            probabilidad,
            impacto,
            nivelRiesgo: calcularNivelRiesgo(probabilidad, impacto),
            porcentajeRiesgo: calcularPorcentajeRiesgo(calcularNivelRiesgo(probabilidad, impacto), maxImpacto).toFixed(2)
        });

        // Actualizar la lista de riesgos
        actualizarRiesgoLista(riesgoSeleccionado, probabilidad, impacto)
        actualizarStorage();
        renderizarRiesgos();
        renderizarHistorial();
    } else {
        // Mostrar mensaje de error en el DOM
        const errorHtml = `<p style="color: red;">Probabilidad o impacto no válidos.</p>`;
        mensajeError.innerHTML = errorHtml;
    }
});


// Evento para borrar todos los riesgos
document.getElementById("borrar-riesgos").addEventListener("click", function () {
    riesgos.forEach((riesgo) => {
        riesgo.probabilidad = 0;
        riesgo.impacto = 0;
    });

    historial = [];
    actualizarStorage();
    renderizarRiesgos();
    renderizarHistorial();
});

// Inicialización de la página cargando desde localStorage
window.onload = function () {
    cargarDesdeStorage();
    renderizarRiesgos();
    renderizarHistorial();
};