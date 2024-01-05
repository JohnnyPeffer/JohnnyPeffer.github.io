let iniciou = false;
let botaoResetar = false;

let container = document.getElementById("container");

let larguraContainer = container.offsetWidth;
let alturaContainer = container.offsetHeight;

function iniciar() {
  document.getElementById("audio-moeda").play();
  document.getElementById("bemvindo").pause();
  setTimeout(() => {
    location.href = "/jogo.html";
  }, 500);
}

document.addEventListener("keyup", (tecla) => {
  if ((!iniciou && tecla.key === "Enter") || (!iniciou && tecla.key === " ")) {
    iniciar();
    iniciou = true;
  }
});

document.addEventListener("keyup", (tecla) => {
  if (!botaoResetar && tecla.key === "Delete") {
    document.getElementById("resetar").style.animation =
      "resetar 1s linear forwards";
    document.getElementById("audio-moeda").play();
    setTimeout(() => {
      botaoResetar = true;
    }, 1500);
  } else if (botaoResetar && tecla.key === "Delete") {
    document.getElementById("resetar").style.animation = "none";
    document.getElementById("audio-moeda").play();
    setTimeout(() => {
      botaoResetar = false;
    }, 1500);
  }
});

function resetar() {
  sessionStorage.clear();
  document.getElementById("audio-moeda").play();
  setTimeout(() => {
    location.href = "/index.html";
  }, 500);
}

const larguraMaxima = 1352;
const alturaMaxima = 654;

function ajustarTela() {
  if (larguraContainer > larguraMaxima || alturaContainer > alturaMaxima) {
    container.style.width = larguraMaxima + "px";
    container.style.height = alturaMaxima + "px";
  } else {
    container.style.width = larguraContainer + "px";
    container.style.height = alturaContainer + "px";
  }
}

window.addEventListener("resize", ajustarTela);

window.addEventListener("load", () => {
  window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
  ajustarTela();
});
