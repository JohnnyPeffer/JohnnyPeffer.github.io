let iniciou = false;
let comecou = false;
let botaoIniciar = false;
let botaoResetar = false;
let marioSelecionado = false;
let luigiSelecionado = false;

let container = document.getElementById("container");
let video = document.getElementById("video-tema");

let larguraContainer = container.offsetWidth;
let alturaContainer = container.offsetHeight;

document.addEventListener("keyup", (tecla) => {
  if (!botaoResetar && tecla.key === "Delete") {
    document.getElementById("resetar").style.animation =
      "resetar 1s linear forwards";
    document.getElementById("audio-moeda").play();
    setTimeout(() => {
      botaoResetar = true;
    }, 1500);
  }
  if (botaoResetar && tecla.key === "Delete") {
    document.getElementById("resetar").style.animation = "none";
    document.getElementById("audio-moeda").play();
    setTimeout(() => {
      botaoResetar = false;
    }, 1500);
  }
});

function mostrarBotao() {
  setTimeout(() => {
    document.getElementById("botao-iniciar").style.display = "block";
    document.getElementById("botao-iniciar").removeAttribute("disabled");
    botaoIniciar = true;
  }, 5500);
}

function iniciar() {
  document.getElementsByTagName("video")[0].pause();
  document.getElementById("botao-iniciar").style.display = "none";
  document.getElementById("botao-jogar1").style.display = "block";
  document.getElementById("botao-jogar2").style.display = "block";
  document.getElementById("audio-moeda").play();
  iniciou = true;
}

function iniciarJogoComMario() {
  sessionStorage.setItem("menuMarioOuLuigi", "url(/imagens/curseclearmarionew.png");
  sessionStorage.setItem("marioOuLuigi", "url(/imagens/mario-small-right.png)");
  sessionStorage.setItem("marioPequenoParadoDireito", "url(/imagens/mario-small-right.png)");
  sessionStorage.setItem("marioPequenoParadoEsquerdo", "url(/imagens/mario-small-left.png)");
  sessionStorage.setItem("marioPequenoAndandoDireito", "url(/imagens/mario-small-right.gif)");
  sessionStorage.setItem("marioPequenoAndandoEsquerdo", "url(/imagens/mario-small-left.gif)");
  sessionStorage.setItem("marioOlhandoCimaDireito", "url(/imagens/mario-up-right.png)");
  sessionStorage.setItem("marioOlhandoCimaEsquerdo", "url(/imagens/mario-up-left.png)");
  sessionStorage.setItem("marioAgachadoDireito", "url(/imagens/mario-down-right.png)");
  sessionStorage.setItem("marioAgachadoEsquerdo", "url(/imagens/mario-down-left.png)");
  sessionStorage.setItem("marioMorreu", "url(/imagens/mario-morreu.png)");
  sessionStorage.setItem("marioGameOver", "url(/imagens/mario-death.gif)");
  sessionStorage.setItem("marioPassouMissao", "url(/imagens/mariosmallmissionclear.png)");
  sessionStorage.setItem("vidasAtual", 5);
  sessionStorage.setItem("tempoAtual", 400);
  sessionStorage.setItem("bonusAtual", 0);
  sessionStorage.setItem("moedasAtual", 0);
  sessionStorage.setItem("pontosAtual", 0);
  sessionStorage.setItem("bonusAtual", 0);
  document.getElementById("audio-moeda").play();
  setTimeout(() => {
    location.href = "/bemvindo.html";
  }, 500);
}

function iniciarJogoComLuigi() {
  sessionStorage.setItem("menuMarioOuLuigi", "url(/imagens/curseclearluiginew.png");
  sessionStorage.setItem("marioOuLuigi", "url(/imagens/luigi-small-right.png)");
  sessionStorage.setItem("marioPequenoParadoDireito", "url(/imagens/luigi-small-right.png)");
  sessionStorage.setItem("marioPequenoParadoEsquerdo", "url(/imagens/luigi-small-left.png)");
  sessionStorage.setItem("marioPequenoAndandoDireito", "url(/imagens/luigi-small-right.gif)");
  sessionStorage.setItem("marioPequenoAndandoEsquerdo", "url(/imagens/luigi-small-left.gif)");
  sessionStorage.setItem("marioOlhandoCimaDireito", "url(/imagens/luigi-up-right.png)");
  sessionStorage.setItem("marioOlhandoCimaEsquerdo", "url(/imagens/luigi-up-left.png)");
  sessionStorage.setItem("marioAgachadoDireito", "url(/imagens/luigi-down-right.png)");
  sessionStorage.setItem("marioAgachadoEsquerdo", "url(/imagens/luigi-down-left.png)");
  sessionStorage.setItem("marioMorreu", "url(/imagens/luigi-morreu.png)");
  sessionStorage.setItem("marioGameOver", "url(/imagens/luigi-death.gif)");
  sessionStorage.setItem("marioPassouMissao", "url(/imagens/luigismallmissionclear.png)");
  sessionStorage.setItem("vidasAtual", 5);
  sessionStorage.setItem("tempoAtual", 400);
  sessionStorage.setItem("bonusAtual", 0);
  sessionStorage.setItem("moedasAtual", 0);
  sessionStorage.setItem("pontosAtual", 0);
  sessionStorage.setItem("bonusAtual", 0);
  document.getElementById("audio-moeda").play();
  setTimeout(() => {
    location.href = "/bemvindo.html";
  }, 500);
}

document.getElementById("botao-jogar1").addEventListener("click", () => {
  iniciarJogoComMario();
});

document.getElementById("botao-jogar2").addEventListener("click", () => {
  iniciarJogoComLuigi();
});

document.addEventListener("keyup", (tecla) => {
  if ((botaoIniciar && !iniciou && !comecou && tecla.key === "Enter") ||
    (botaoIniciar && !iniciou && !comecou && tecla.key === " ")) {
    iniciar();
    iniciou = true;
    setTimeout(() => {
      comecou = true;
    }, 2500);
  }
});

document.addEventListener("keyup", (tecla) => {
  if (tecla.key === "ArrowUp") {
    document.getElementById("botao-jogar1").style.color = "#ff4b37";
    document.getElementById("botao-jogar1").style.textShadow = "2px 2px 1px black";
    document.getElementById("botao-jogar2").style.color = "black";
    document.getElementById("botao-jogar2").style.textShadow = "none";
    let audioFogo = new Audio("/audios/fireball.wav");
    audioFogo.play();
    marioSelecionado = true;
    luigiSelecionado = false;
  }
  if (tecla.key === "ArrowDown") {
    document.getElementById("botao-jogar2").style.color = "#fdc32a";
    document.getElementById("botao-jogar2").style.textShadow = "2px 2px 1px black";
    document.getElementById("botao-jogar1").style.color = "black";
    document.getElementById("botao-jogar1").style.textShadow = "none";
    let audioFogo = new Audio("/audios/fireball.wav");
    audioFogo.play();
    luigiSelecionado = true;
    marioSelecionado = false;
  }
  if (marioSelecionado && !luigiSelecionado && tecla.key === "Enter") {
    iniciarJogoComMario();
  } else if (luigiSelecionado && !marioSelecionado && tecla.key === "Enter") {
    iniciarJogoComLuigi();
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
  video.addEventListener("ended", function () {
    location.reload();
  });
  document.addEventListener("contextmenu", (evento) => {
    evento.preventDefault();
  });
  mostrarBotao();
  ajustarTela();
});

