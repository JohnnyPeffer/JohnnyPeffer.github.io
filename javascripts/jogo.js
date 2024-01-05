let container = document.getElementById("container");
let cenario = document.getElementById("cenario");
let mario = document.getElementById("mario");
let ceu = document.getElementById("ceu");

let hackJogador1 = document.getElementById("hack-mario");
let hackJogador2 = document.getElementById("hack-luigi");

let larguraContainer = container.offsetWidth;
let alturaContainer = container.offsetHeight;

let larguraCenario = cenario.offsetWidth;
let alturaCenario = cenario.offsetHeight;

let larguraMario = mario.offsetWidth;

let menuMarioOuLuigi = sessionStorage.getItem("menuMarioOuLuigi");
let iniciarMarioLuigi = sessionStorage.getItem("marioOuLuigi");
let marioPequenoParadoDireito = sessionStorage.getItem("marioPequenoParadoDireito");
let marioPequenoParadoEsquerdo = sessionStorage.getItem("marioPequenoParadoEsquerdo");
let marioPequenoAndandoDireito = sessionStorage.getItem("marioPequenoAndandoDireito");
let marioPequenoAndandoEsquerdo = sessionStorage.getItem("marioPequenoAndandoEsquerdo");
let marioOlhandoCimaDireito = sessionStorage.getItem("marioOlhandoCimaDireito");
let marioOlhandoCimaEsquerdo = sessionStorage.getItem("marioOlhandoCimaEsquerdo");
let marioAgachadoDireito = sessionStorage.getItem("marioAgachadoDireito");
let marioAgachadoEsquerdo = sessionStorage.getItem("marioAgachadoEsquerdo");
let marioPulandoDireito = sessionStorage.getItem("marioPulandoDireito");
let marioPulandoEsquerdo = sessionStorage.getItem("marioPulandoEsquerdo");
let marioMorreu = sessionStorage.getItem("marioMorreu");
let marioGameOver = sessionStorage.getItem("marioGameOver");
let marioPassouMissao = sessionStorage.getItem("marioPassouMissao");

let ladoDirecao = "direito";

let checaColisaoMoedasYoshi;
let checaColisaoPontoFinal;
let checaColisaoInimigos;
let checaBonusAleatorio;
let checaColisaoMoedas;
let checaColisaoBlocos;
let checaAdicionaBonus;
let checaMoveInimigos;
let checaMoveCenarios;
let bonusAleatorio;
let checaMoveMario;
let checaInimigos;
let checaCenario;
let checaTempo;

let posicaoMaxCenario = 14150;
let posicaoCenario = 0;

let posicaoCenarioAnterior = posicaoCenario;

let posicao = 300;
let direcao = 0;
let velocidade = 10;

let velocidadeInimigo = 5;

let bonusFinal = 0;

let tempoAtual = parseInt(sessionStorage.getItem("tempoAtual"));
let vidasAtual = parseInt(sessionStorage.getItem("vidasAtual"));
let bonusAtual = parseInt(sessionStorage.getItem("bonusAtual"));
let moedasAtual = parseInt(sessionStorage.getItem("moedasAtual"));
let pontosAtual = parseInt(sessionStorage.getItem("pontosAtual"));
let moedasYoshiAtual = parseInt(sessionStorage.getItem("moedasYoshiAtual")) || 0;

let pulando = false;
let pressionada = false;

let gameOver = false;
let botaoResetar = false;
let botaoEditar = false;
let atualizar = false;
let cursor = false;
let painelHack = false;
let completouMissao = false;
let invencivel = false;

let minPosicaoCenario = false;
let maxPosicaoCenario = false;

let teclaAtual = null;

function tempo() {
  tempoAtual = parseInt(sessionStorage.getItem("tempoAtual"));
  document.getElementById("tempo").textContent = tempoAtual;
  tempoAtual--;
  sessionStorage.setItem("tempoAtual", tempoAtual);
  if (tempoAtual === 100) {
    document.getElementById("audio-jogo-normal").volume = 0.5;
    document.getElementById("audio-rapido").play();
    document.getElementById("audio-rapido").addEventListener("ended", () => {
      document.getElementById("audio-jogo-normal").pause();
      document.getElementById("audio-jogo-rapido").play();
    });
  }
  if (tempoAtual < 0) {
    gameOver = true;
    document.removeEventListener("keydown", teclaKeyDown);
    document.removeEventListener("keyup", teclaKeyUp);
    document.getElementById("audio-jogo-normal").pause();
    document.getElementById("audio-jogo-rapido").pause();
    document.getElementById("audio-morreu").play();
    clearInterval(checaTempo);
    clearInterval(checaInimigos);
    clearInterval(checaMoveMario);
    clearInterval(checaMoveCenarios);
    clearInterval(checaMoveInimigos);
    clearInterval(checaColisaoBlocos);
    clearInterval(checaColisaoMoedas);
    clearInterval(checaColisaoInimigos);
    clearInterval(checaColisaoPontoFinal);
    clearInterval(checaColisaoMoedasYoshi);
    mario.style.backgroundImage = marioGameOver;
    mario.style.animation = "gameOver 5s forwards";
    mario.style.width = "70px";
    mario.style.height = "70px";
    let inimigos = document.querySelectorAll(".inimigo");
    inimigos.forEach((inimigo) => {
      inimigo.style.backgroundImage = "url(/imagens/kooparedll.png)";
    });
    document.getElementById("audio-morreu").addEventListener("ended", () => {
      document.getElementById("audio-game-over").play();
      document.getElementById("container").style.animation = "efeito 1s linear forwards";
      document.getElementById("game").style.animation = "game 2s linear forwards";
      document.getElementById("over").style.animation = "over 2s linear forwards";
      document.getElementById("audio-game-over").addEventListener("ended", () => {
        sessionStorage.clear();
          location.href = "/index.html";
        });
    });
  }
}

function teclaKeyDown(tecla) {
  if (!teclaAtual) {
    if (
      tecla.key === "ArrowLeft" ||
      tecla.key === "ArrowRight" ||
      tecla.key === "ArrowUp" ||
      tecla.key === "ArrowDown"
    ) {
      teclaAtual = tecla.key;
      if (tecla.key === "ArrowLeft") {
        direcao = -1;
        ladoDirecao = "esquerdo";
        mario.style.backgroundImage = marioPequenoAndandoEsquerdo;
        pressionada = true;
      } else if (tecla.key === "ArrowUp") {
        if (ladoDirecao === "direito") {
          mario.style.backgroundImage = marioOlhandoCimaDireito;
        } else {
          mario.style.backgroundImage = marioOlhandoCimaEsquerdo;
        }
        pressionada = true;
      } else if (tecla.key === "ArrowRight") {
        direcao = 1;
        ladoDirecao = "direito";
        mario.style.backgroundImage = marioPequenoAndandoDireito;
        pressionada = true;
      } else if (tecla.key === "ArrowDown") {
        if (ladoDirecao === "direito") {
          mario.style.backgroundImage = marioAgachadoDireito;
          mario.style.width = "50px";
          mario.style.height = "50px";
        } else {
          mario.style.backgroundImage = marioAgachadoEsquerdo;
          mario.style.width = "50px";
          mario.style.height = "50px";
        }
        pressionada = true;
      }
    }
  }
  if (!pulando && tecla.key === " ") {
    if (ladoDirecao === "direito") {
      mario.style.backgroundImage = marioPequenoAndandoDireito;
    } else {
      mario.style.backgroundImage = marioPequenoAndandoEsquerdo;
    }
    mario.classList.add("pulo");
    document.getElementById("audio-pulo").play();
    pulando = true;
    mario.addEventListener("animationend", () => {
      if (pulando && gameOver) {
        mario.style.backgroundImage = marioMorreu;
        setTimeout(() => {
          mario.style.backgroundImage = marioGameOver;
        }, 1000);
      } else {
        if (!gameOver && !completouMissao) {
          if (!pressionada) {
          if (ladoDirecao === "direito") {
            mario.style.backgroundImage = marioPequenoParadoDireito;
          } else {
            mario.style.backgroundImage = marioPequenoParadoEsquerdo;
          }
        } else {
          if (ladoDirecao === "direito") {
            mario.style.backgroundImage = marioPequenoAndandoDireito;
          } else {
            mario.style.backgroundImage = marioPequenoAndandoEsquerdo;
          }
        }
        mario.classList.remove("pulo");
        pulando = false;
      }
      }
    });
  }
}

function teclaKeyUp(tecla) {
  if (tecla.key === teclaAtual) {
    teclaAtual = null;
    if (tecla.key === "ArrowLeft") {
      direcao = 0;
      mario.style.backgroundImage = marioPequenoParadoEsquerdo;
      pressionada = false;
    } else if (tecla.key === "ArrowUp") {
      if (ladoDirecao === "direito") {
        mario.style.backgroundImage = marioPequenoParadoDireito;
      } else {
        mario.style.backgroundImage = marioPequenoParadoEsquerdo;
      }
      pressionada = false;
    } else if (tecla.key === "ArrowRight") {
      direcao = 0;
      mario.style.backgroundImage = marioPequenoParadoDireito;
      pressionada = false;
    } else if (tecla.key === "ArrowDown") {
      if (ladoDirecao === "direito") {
        mario.style.backgroundImage = marioPequenoParadoDireito;
        mario.style.width = "70px";
        mario.style.height = "70px";
      } else {
        mario.style.backgroundImage = marioPequenoParadoEsquerdo;
        mario.style.width = "70px";
        mario.style.height = "70px";
      }
      pressionada = false;
    }
  }
}

function inimigos() {
  let inimigo = document.createElement("div");
  inimigo.className = "inimigo";
  document.getElementById("cenario").appendChild(inimigo);
}

function moveInimigos() {
  let todosInimigos = document.querySelectorAll(".inimigo");
  for (let i = 0; i < todosInimigos.length; i++) {
    if (todosInimigos[i]) {
      let x = todosInimigos[i].offsetLeft;
      if (!todosInimigos[i].classList.contains("morto")) {
      x -= velocidadeInimigo;
      }
      todosInimigos[i].style.left = `${x}px`;
      x < -100 ? todosInimigos[i].remove() : x;
    }
  }
}

function colisaoInimigos() {
  let todosInimigos = document.querySelectorAll(".inimigo");
  todosInimigos.forEach((inimigo) => {
    let retanguloInimigo = inimigo.getBoundingClientRect();
    let retanguloMario = mario.getBoundingClientRect();
    let topInimigo = parseInt(inimigo.offsetTop);
    if (
      invencivel && !inimigo.classList.contains("morto") &&
      retanguloInimigo.left < retanguloMario.right &&
      retanguloInimigo.right > retanguloMario.left &&
      retanguloInimigo.top < retanguloMario.bottom &&
      retanguloInimigo.bottom > retanguloMario.top
    ) {
      inimigo.classList.add("morto");
      inimigo.style.backgroundImage = "url(/imagens/cascovazio.png)";
      let audioDanoInvencivel = new Audio("/audios/kick.wav");
      audioDanoInvencivel.play();
      inimigo.style.animation = "danoInvencivel 1s linear forwards";
      inimigo.addEventListener("animationend", () => {
        inimigo.remove();
      });
     } else if (
      !invencivel &&
      retanguloInimigo.left < retanguloMario.right &&
      retanguloInimigo.right > retanguloMario.left &&
      retanguloInimigo.top < retanguloMario.bottom &&
      retanguloInimigo.bottom > retanguloMario.top
    ) {
      gameOver = true;
      vidasAtual--;
      document.getElementById("vidas").textContent = vidasAtual;
      sessionStorage.setItem("vidasAtual", vidasAtual);
      document.removeEventListener("keydown", teclaKeyDown);
      document.removeEventListener("keyup", teclaKeyUp);
      document.getElementById("audio-jogo-normal").pause();
      document.getElementById("audio-jogo-rapido").pause();
      document.getElementById("audio-morreu").play();
      clearInterval(checaTempo);
      clearInterval(checaInimigos);
      clearInterval(checaMoveMario);
      clearInterval(checaMoveCenarios);
      clearInterval(checaMoveInimigos);
      clearInterval(checaColisaoBlocos);
      clearInterval(checaColisaoMoedas);
      clearInterval(checaColisaoInimigos);
      clearInterval(checaColisaoPontoFinal);
      clearInterval(checaColisaoMoedasYoshi);
      if (pulando) {
      mario.style.top = (topInimigo - inimigo.offsetHeight) + "px";
      }
      mario.style.backgroundImage = marioMorreu;
      setTimeout(() => {
        mario.style.backgroundImage = marioGameOver;
        mario.style.animation = "gameOver 5s forwards";
      }, 1000);
      inimigo.style.backgroundImage = "url(/imagens/kooparedll.png)";
      document.getElementById("audio-morreu").addEventListener("ended", () => {
        if (vidasAtual > 0) {
          location.reload();
        } else {
          document.getElementById("audio-game-over").play();
          document.getElementById("container").style.animation = "efeito 1s linear forwards";
          document.getElementById("game").style.animation = "game 2s linear forwards";
          document.getElementById("over").style.animation = "over 2s linear forwards";
          gameOver = true;
          document.getElementById("audio-game-over").addEventListener("ended", () => {
              sessionStorage.clear();
              location.href = "/index.html";
            });
        }
      });
    }
  });
}

function moveMario() {
  posicao += direcao * velocidade;
  if (minPosicaoCenario) {
    if (posicao < 0) {
      posicao = 0;
    }
  }
  if (!minPosicaoCenario) {
    if (posicao < 300) {
      posicao = 300;
    }
  }
  if (maxPosicaoCenario) {
    if (posicao + larguraMario > larguraContainer) {
      posicao = larguraContainer - larguraMario;
    }
  }
  if (!maxPosicaoCenario) {
    if (posicao + larguraMario > larguraContainer - 400) {
      posicao = larguraContainer - larguraMario - 400;
    }
  }
  mario.style.left = `${posicao}px`;
}

function moveCenarios() {
  if (
    (!minPosicaoCenario && posicao <= 300) ||
    (!maxPosicaoCenario && posicao + larguraMario >= larguraContainer - 400)
  ) {
    posicaoCenario += direcao * velocidade;
  }
  if (posicaoCenario <= 0) {
    posicaoCenario = 0;
    minPosicaoCenario = true;
  }
  if (posicaoCenario > posicaoMaxCenario) {
    posicaoCenario = posicaoMaxCenario;
    maxPosicaoCenario = true;
  }
  if (posicaoCenario > 300) {
    minPosicaoCenario = false;
  }
  if (posicaoCenario < posicaoMaxCenario) {
    maxPosicaoCenario = false;
  }

  if (
    pressionada &&
    ladoDirecao === "direito" &&
    posicaoCenarioAnterior !== posicaoCenario
  ) {
    velocidadeInimigo = 15;
  } else if (
    pressionada &&
    ladoDirecao === "esquerdo" &&
    posicaoCenarioAnterior !== posicaoCenario
  ) {
    velocidadeInimigo = 2;
  } else {
    velocidadeInimigo = 5;
  }
  posicaoCenarioAnterior = posicaoCenario;

  cenario.style.backgroundPositionX = `-${posicaoCenario}px`;
  ceu.style.backgroundPositionX = `-${posicaoCenario}px`;

  document.getElementById("poste1").style.left = 14550 - posicaoCenario + "px";
  document.getElementById("ponto").style.left = 14580 - posicaoCenario + "px";
  document.getElementById("poste2").style.left = 14700 - posicaoCenario + "px";

  let posicaoFrutas = [
    520, 3200, 3500, 4230, 4460, 4750, 5430, 7200, 8830, 10030, 11230, 11470,
    11990, 12570, 14950, 14990, 15280,
  ];

  document.querySelectorAll(".fruta-vermelha").forEach((fruta, inicio) => {
    if (inicio < posicaoFrutas.length) {
      fruta.style.left = posicaoFrutas[inicio] - posicaoCenario + "px";
    }
  });

  document.getElementById("fruta-roxa").style.left = 12750 - posicaoCenario + "px";

  let posicaoBlocos = [1850, 3800, 6000, 6500];

  document.querySelectorAll(".bloco").forEach((bloco, inicio) => {
    if (inicio < posicaoBlocos.length) {
      bloco.style.left = posicaoBlocos[inicio] - posicaoCenario + "px";
    }
  });

  let posicaoMoedasYoshi = [2750, 5150, 8000, 9600, 12300];

  document.querySelectorAll(".moeda-yoshi").forEach((moedaYoshi, inicio) => {
    if (inicio < posicaoMoedasYoshi.length) {
      moedaYoshi.style.left =
        posicaoMoedasYoshi[inicio] - posicaoCenario + "px";
    }
  });

  let posicaoMoedas = [
    2550, 2650, 2870, 2970, 5000, 5070, 5270, 5350, 7500, 7600, 7700, 7800,
    8200, 8300, 8400, 8500, 10500, 10600, 10700, 10800, 11650, 11750, 11850,
    12150, 12220, 12420, 12500, 13000, 13100, 13200, 13300, 13400, 13800, 13880,
    13960, 14040, 14120, 14200, 14280, 14360
  ];

  document.querySelectorAll(".moeda").forEach((moeda, inicio) => {
    if (inicio < posicaoMoedas.length) {
      moeda.style.left = posicaoMoedas[inicio] - posicaoCenario + "px";
    }
  });
}

function colisaoMoedasYoshi() {
  let moedasYoshi = document.querySelectorAll(".moeda-yoshi");
  moedasYoshi.forEach((moedaYoshi) => {
    let retanguloMoedaYoshi = moedaYoshi.getBoundingClientRect();
    let retanguloMario = mario.getBoundingClientRect();
    if (
      retanguloMoedaYoshi.left < retanguloMario.right &&
      retanguloMoedaYoshi.right > retanguloMario.left &&
      retanguloMoedaYoshi.top < retanguloMario.bottom &&
      retanguloMoedaYoshi.bottom > retanguloMario.top
    ) {
      moedaYoshi.style.display = "none";
      moedasYoshiAtual++;
      moedasAtual++;
      pontosAtual += 5000;
      document.getElementById("moedas").textContent = moedasAtual;
      document.getElementById("pontos").textContent = pontosAtual;
      sessionStorage.setItem("moedasAtual", moedasAtual);
      sessionStorage.setItem("pontosAtual", pontosAtual);
      document.getElementById("audio-moeda-yoshi").play();
      if (moedasYoshiAtual === 5) {
        clearInterval(checaColisaoMoedasYoshi);
        vidasAtual++;
        document.getElementById("vidas").textContent = vidasAtual;
        sessionStorage.setItem("vidasAtual", vidasAtual);
        let audioGanhouVida = new Audio("/audios/extraup.wav");
        audioGanhouVida.play();
      }
      if (moedasAtual >= 100) {
        moedasAtual = 0;
        vidasAtual++;
        document.getElementById("moedas").textContent = moedasAtual;
        document.getElementById("vidas").textContent = vidasAtual;
        sessionStorage.setItem("moedasAtual", moedasAtual);
        sessionStorage.setItem("vidasAtual", vidasAtual);
        let audioGanhouVida = new Audio("/audios/extraup.wav");
        audioGanhouVida.play();
      }
    }
  });
}

function colisaoMoedas() {
  let moedas = document.querySelectorAll(".moeda");
  moedas.forEach((moeda) => {
    let retanguloMoeda = moeda.getBoundingClientRect();
    let retanguloMario = mario.getBoundingClientRect();
    if (
      retanguloMoeda.left < retanguloMario.right &&
      retanguloMoeda.right > retanguloMario.left &&
      retanguloMoeda.top < retanguloMario.bottom &&
      retanguloMoeda.bottom > retanguloMario.top
    ) {
      moeda.style.display = "none";
      moedasAtual++;
      pontosAtual += 100;
      document.getElementById("moedas").textContent = moedasAtual;
      document.getElementById("pontos").textContent = pontosAtual;
      sessionStorage.setItem("moedasAtual", moedasAtual);
      let audioMoeda = new Audio("/audios/coin.wav");
      audioMoeda.play();
      if (moedasAtual >= 100) {
        moedasAtual = 0;
        vidasAtual++;
        document.getElementById("moedas").textContent = moedasAtual;
        document.getElementById("vidas").textContent = vidasAtual;
        sessionStorage.setItem("moedasAtual", moedasAtual);
        sessionStorage.setItem("vidasAtual", vidasAtual);
        let audioGanhouVida = new Audio("/audios/extraup.wav");
        audioGanhouVida.play();
      }
    }
  });
}

function colisaoBlocos() {
  let blocos = document.querySelectorAll(".bloco");
  blocos.forEach((bloco) => {
    let retanguloBloco = bloco.getBoundingClientRect();
    let retanguloMario = mario.getBoundingClientRect();
    let colisaoMaxima = parseInt(bloco.getAttribute("data-colisao"));
    if (
      retanguloBloco.left < retanguloMario.right &&
      retanguloBloco.right > retanguloMario.left &&
      retanguloBloco.top < retanguloMario.bottom &&
      retanguloBloco.bottom > retanguloMario.top
    ) {
      clearInterval(checaColisaoBlocos);
      bloco.style.bottom = "370px";
      setTimeout(() => {
        bloco.style.bottom = "350px";
      }, 100);
      if (colisaoMaxima > 0) {
        document.getElementById("audio-moeda").play();
        colisaoMaxima--;
        bloco.setAttribute("data-colisao", colisaoMaxima);
        moedasAtual++;
        pontosAtual += 100;
        document.getElementById("moedas").textContent = moedasAtual;
        document.getElementById("pontos").textContent = pontosAtual;
        sessionStorage.setItem("moedasAtual", moedasAtual);
        sessionStorage.setItem("pontosAtual", pontosAtual);
        if (moedasAtual >= 100) {
          moedasAtual = 0;
          vidasAtual++;
          document.getElementById("moedas").textContent = moedasAtual;
          document.getElementById("vidas").textContent = vidasAtual;
          sessionStorage.setItem("moedasAtual", moedasAtual);
          sessionStorage.setItem("vidasAtual", vidasAtual);
          let audioGanhouVida = new Audio("/audios/extraup.wav");
          audioGanhouVida.play();
        }
      } else if (colisaoMaxima === 0) {
        document.getElementById("audio-efeito").play();
        bloco.style.backgroundImage = "url(/imagens/emptyblock.png)";
      }
      setTimeout(() => {
        checaColisaoBlocos = setInterval(colisaoBlocos, 50);
      }, 500);
    }
  });
}

function criaMoedasYoshi() {
  for (let i = 0; i < 5; i++) {
    let moedaYoshi = document.createElement("div");
    moedaYoshi.className = "moeda-yoshi";
    container.appendChild(moedaYoshi);
  }
}

function criaBlocos() {
  for (let i = 0; i < 4; i++) {
    let bloco = document.createElement("div");
    bloco.className = "bloco";
    bloco.setAttribute("data-colisao", 5);
    container.appendChild(bloco);
  }
}

function criaFrutas() {
  for (let i = 0; i < 17; i++) {
    let frutas = document.createElement("div");
    frutas.className = "fruta-vermelha";
    container.appendChild(frutas);
  }
}

function criaMoedas() {
  for (let i = 0; i < 40; i++) {
    let moeda = document.createElement("div");
    moeda.className = "moeda";
    container.appendChild(moeda);
  }
}

function colisaoPontoFinal() {
  let ponto = document.getElementById("ponto");
  let retanguloPonto = ponto.getBoundingClientRect();
  let retanguloMario = mario.getBoundingClientRect();
  if (
    retanguloPonto.left < retanguloMario.right &&
    retanguloPonto.right > retanguloMario.left &&
    retanguloPonto.top < retanguloMario.bottom &&
    retanguloPonto.bottom > retanguloMario.top
  ) {
    completouMissao = true;
    document.getElementById("poste2").style.zIndex = "0";
    document.querySelectorAll(".inimigo").forEach((inimigo) => {
      inimigo.style.display = "none";
    });
    document.querySelectorAll(".fruta-vermelha").forEach((frutas) => {
      frutas.style.display = "none";
    });
    document.querySelectorAll(".moeda").forEach((moeda) => {
      moeda.style.display = "none";
    });
    document.getElementById("missao-completa").style.display = "flex";
    document.removeEventListener("keydown", teclaKeyDown);
    document.removeEventListener("keyup", teclaKeyUp);
    document.getElementById("audio-jogo-normal").pause();
    document.getElementById("audio-jogo-rapido").pause();
    document.getElementById("audio-missao-completa").play();
    clearInterval(checaTempo);
    clearInterval(checaInimigos);
    clearInterval(checaMoveMario);
    clearInterval(checaMoveCenarios);
    clearInterval(checaMoveInimigos);
    clearInterval(checaColisaoBlocos);
    clearInterval(checaColisaoMoedas);
    clearInterval(checaColisaoInimigos);
    clearInterval(checaColisaoPontoFinal);
    clearInterval(checaColisaoMoedasYoshi);
    container.removeChild(ponto);
    mario.classList.remove("invencivel");
    mario.style.backgroundImage = marioPequenoAndandoDireito;
    checaBonusAleatorio = setInterval(() => {
      bonusAleatorio = Math.floor((Math.random() * 99) + 1);
      document.getElementById("bonus-final").textContent = bonusAleatorio;
    }, 20);
    setTimeout(() => {
      clearInterval(checaBonusAleatorio);
      checaAdicionaBonus = setInterval(() => {
        bonusFinal++;
        bonusAleatorio--;
        document.getElementById("bonus-final").textContent = bonusAleatorio;
        document.getElementById("bonus").textContent = bonusFinal;
        sessionStorage.setItem("bonusAtual", bonusFinal);
        if (bonusAleatorio <= 0) {
          clearInterval(checaAdicionaBonus);
        }
      }, 30);
    }, 2000);
    document.getElementById("audio-missao-completa").addEventListener("ended", () => {
        mario.style.backgroundImage = marioPassouMissao;
        if (tempoAtual <= 200) {
        tempoAtual = 400;
        sessionStorage.setItem("tempoAtual", tempoAtual);
        document.getElementById("tempo").textContent = tempoAtual;
        }
        document.getElementById("audio-efeito-final").play();
        setTimeout(() => {
          setInterval(() => { location.href = "/chefe.html" }, 500);
        }, 5000);
      });
  }
}

document.addEventListener("keydown", (tecla) => {
  if (!botaoResetar && tecla.key === "Delete") {
    document.getElementById("resetar").style.animation = "animarBotoes 1s linear forwards";
    document.getElementById("editar").style.animation = "none";
    document.getElementById("audio-moeda").play();
    setTimeout(() => {
      botaoResetar = true;
      botaoEditar = false;
    }, 1500);
  } else if (botaoResetar && tecla.key === "Delete") {
    document.getElementById("resetar").style.animation = "none";
    document.getElementById("audio-moeda").play();
    setTimeout(() => {
      botaoResetar = false;
    }, 1500);
  }
  if (!painelHack && !botaoEditar && tecla.key === "Insert") {
    document.getElementById("editar").style.animation = "animarBotoes 1s linear forwards";
    document.getElementById("resetar").style.animation = "none";
    document.getElementById("audio-moeda").play();
    setTimeout(() => {
      botaoEditar = true;
      botaoResetar = false;
    }, 1500);
  } else if (!painelHack && botaoEditar && tecla.key === "Insert") {
    document.getElementById("editar").style.animation = "none";
    document.getElementById("audio-moeda").play();
    setTimeout(() => {
      botaoEditar = false;
    }, 1500);
  }
});

document.getElementById("editar").addEventListener("click", () => {
  painelHack = true;
  botaoEditar = true;
  document.getElementById("editar").style.animation = "none";
  document.getElementById("audio-jogo-rapido").pause();
  document.getElementById("audio-jogo-normal").pause();
  document.getElementById("audio-moeda").play();
  document.getElementById("painel-hack").style.display = "flex";
  document.removeEventListener("keydown", teclaKeyDown);
  document.removeEventListener("keyup", teclaKeyUp);
  clearInterval(checaTempo);
  clearInterval(checaInimigos);
  clearInterval(checaMoveMario);
  clearInterval(checaMoveCenarios);
  clearInterval(checaMoveInimigos);
  clearInterval(checaColisaoBlocos);
  clearInterval(checaColisaoMoedas);
  clearInterval(checaColisaoInimigos);
  clearInterval(checaColisaoPontoFinal);
  clearInterval(checaColisaoMoedasYoshi);
  let todosInimigos = document.querySelectorAll(".inimigo");
  todosInimigos.forEach((inimigo) => {
    inimigo.style.backgroundImage = "url(/imagens/kooparedl.png)";
  });
  hackJogador1.addEventListener("change", function () {
    if (hackJogador1.checked) {
      hackJogador2.checked = false;
    }
  });

  hackJogador2.addEventListener("change", function () {
    if (hackJogador2.checked) {
      hackJogador1.checked = false;
    }
  });
  let hackInvencivel = document.getElementById("invencivel");
  hackInvencivel.addEventListener("change", function () {
    if (hackInvencivel.checked) {
      invencivel = true;
      mario.classList.add("invencivel");
    } else if (!hackInvencivel.checked) {
      invencivel = false;
      mario.classList.remove("invencivel");
    }
  });
});

document.getElementById("hack-fechar").addEventListener("click", () => {
  document.getElementById("audio-jogo-normal").play();
  document.getElementById("audio-moeda").play();
  document.getElementById("editar").style.animation = "none";
  document.getElementById("painel-hack").style.display = "none";
  document.addEventListener("keydown", teclaKeyDown);
  document.addEventListener("keyup", teclaKeyUp);
  checaInimigos = setInterval(inimigos, 10000);
  checaColisaoInimigos = setInterval(colisaoInimigos, 50);
  checaMoveInimigos = setInterval(moveInimigos, 50);
  checaColisaoPontoFinal = setInterval(colisaoPontoFinal, 50);
  checaColisaoBlocos = setInterval(colisaoBlocos, 50);
  checaColisaoMoedasYoshi = setInterval(colisaoMoedasYoshi, 50);
  checaColisaoMoedas = setInterval(colisaoMoedas, 50);
  checaMoveCenarios = setInterval(moveCenarios, 50);
  checaMoveMario = setInterval(moveMario, 50);
  checaTempo = setInterval(tempo, 1000);
  let todosInimigos = document.querySelectorAll(".inimigo");
  todosInimigos.forEach((inimigo) => {
    inimigo.style.backgroundImage = "url(/imagens/kooparedl.gif)";
  });
  invencivel = false;
  mario.classList.remove(".invencivel");
  botaoEditar = false;
  painelHack = false;
  botaoEditar = false;
});

document.getElementById("hack-confirmar").addEventListener("click", () => {
  let hackVidas = document.getElementById("hack-vidas").value;
  let hackTempo = document.getElementById("hack-tempo").value;
  let hackMoedas = document.getElementById("hack-moedas").value;
  let hackPontos = document.getElementById("hack-pontos").value;
  if (
    hackVidas === "" ||
    hackTempo === "" ||
    hackMoedas === "" ||
    hackPontos === ""
  ) {
    alert("Digite os campos para editar");
  } else {
    sessionStorage.setItem("vidasAtual", hackVidas);
    sessionStorage.setItem("tempoAtual", hackTempo);
    sessionStorage.setItem("moedasAtual", hackMoedas);
    sessionStorage.setItem("pontosAtual", hackPontos);
    tempoAtual = parseInt(sessionStorage.getItem("tempoAtual"));
    vidasAtual = parseInt(sessionStorage.getItem("vidasAtual"));
    moedasAtual = parseInt(sessionStorage.getItem("moedasAtual"));
    pontosAtual = parseInt(sessionStorage.getItem("pontosAtual"));
      if (hackJogador1.checked) {
        sessionStorage.setItem("menuMarioOuLuigi", "url(/imagens/curseclearmarionew.png)");
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
        menuMarioOuLuigi = sessionStorage.getItem("menuMarioOuLuigi");
        iniciarMarioLuigi = sessionStorage.getItem("marioOuLuigi");
        marioPequenoParadoDireito = sessionStorage.getItem("marioPequenoParadoDireito");
        marioPequenoParadoEsquerdo = sessionStorage.getItem("marioPequenoParadoEsquerdo");
        marioPequenoAndandoDireito = sessionStorage.getItem("marioPequenoAndandoDireito");
        marioPequenoAndandoEsquerdo = sessionStorage.getItem("marioPequenoAndandoEsquerdo");
        marioOlhandoCimaDireito = sessionStorage.getItem("marioOlhandoCimaDireito");
        marioOlhandoCimaEsquerdo = sessionStorage.getItem("marioOlhandoCimaEsquerdo");
        marioAgachadoDireito = sessionStorage.getItem("marioAgachadoDireito");
        marioAgachadoEsquerdo = sessionStorage.getItem("marioAgachadoEsquerdo");
        marioMorreu = sessionStorage.getItem("marioMorreu");
        marioGameOver = sessionStorage.getItem("marioGameOver");
        marioPassouMissao = sessionStorage.getItem("marioPassouMissao");
      }
      if (hackJogador2.checked) {
        sessionStorage.setItem("menuMarioOuLuigi", "url(/imagens/curseclearluiginew.png)");
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
        menuMarioOuLuigi = sessionStorage.getItem("menuMarioOuLuigi");
        iniciarMarioLuigi = sessionStorage.getItem("marioOuLuigi");
        marioPequenoParadoDireito = sessionStorage.getItem("marioPequenoParadoDireito");
        marioPequenoParadoEsquerdo = sessionStorage.getItem("marioPequenoParadoEsquerdo");
        marioPequenoAndandoDireito = sessionStorage.getItem("marioPequenoAndandoDireito");
        marioPequenoAndandoEsquerdo = sessionStorage.getItem("marioPequenoAndandoEsquerdo");
        marioOlhandoCimaDireito = sessionStorage.getItem("marioOlhandoCimaDireito");
        marioOlhandoCimaEsquerdo = sessionStorage.getItem("marioOlhandoCimaEsquerdo");
        marioAgachadoDireito = sessionStorage.getItem("marioAgachadoDireito");
        marioAgachadoEsquerdo = sessionStorage.getItem("marioAgachadoEsquerdo");
        marioMorreu = sessionStorage.getItem("marioMorreu");
        marioGameOver = sessionStorage.getItem("marioGameOver");
        marioPassouMissao = sessionStorage.getItem("marioPassouMissao");
      }
      document.getElementById("editar").style.animation = "none";
      document.getElementById("painel-hack").style.display = "none";
      clearInterval(checaTempo);
      clearInterval(checaInimigos);
      clearInterval(checaMoveMario);
      clearInterval(checaMoveCenarios);
      clearInterval(checaMoveInimigos);
      clearInterval(checaColisaoBlocos);
      clearInterval(checaColisaoMoedas);
      clearInterval(checaColisaoInimigos);
      clearInterval(checaColisaoPontoFinal);
      clearInterval(checaColisaoMoedasYoshi);
      mario.style.backgroundImage = iniciarMarioLuigi;
      document.getElementById("menu").style.backgroundImage = menuMarioOuLuigi;
      document.getElementById("vidas").textContent = hackVidas;
      document.getElementById("tempo").textContent = hackTempo;
      document.getElementById("moedas").textContent = hackMoedas;
      document.getElementById("pontos").textContent = hackPontos;
      tempo();
      document.addEventListener("keydown", teclaKeyDown);
      document.addEventListener("keyup", teclaKeyUp);
      checaInimigos = setInterval(inimigos, 10000);
      checaColisaoInimigos = setInterval(colisaoInimigos, 50);
      checaMoveInimigos = setInterval(moveInimigos, 50);
      checaColisaoPontoFinal = setInterval(colisaoPontoFinal, 50);
      checaColisaoBlocos = setInterval(colisaoBlocos, 50);
      checaColisaoMoedasYoshi = setInterval(colisaoMoedasYoshi, 50);
      checaColisaoMoedas = setInterval(colisaoMoedas, 50);
      checaMoveCenarios = setInterval(moveCenarios, 50);
      checaMoveMario = setInterval(moveMario, 50);
      checaTempo = setInterval(tempo, 1000);
      let todosInimigos = document.querySelectorAll(".inimigo");
      todosInimigos.forEach((inimigo) => {
        inimigo.style.backgroundImage = "url(/imagens/kooparedl.gif)";
      });
      document.getElementById("audio-jogo-normal").play();
  }
  painelHack = false;
  botaoEditar = false;
});

function resetar() {
  clearInterval(checaTempo);
  clearInterval(checaInimigos);
  clearInterval(checaMoveMario);
  clearInterval(checaMoveCenarios);
  clearInterval(checaMoveInimigos);
  clearInterval(checaColisaoBlocos);
  clearInterval(checaColisaoMoedas);
  clearInterval(checaColisaoInimigos);
  clearInterval(checaColisaoPontoFinal);
  clearInterval(checaColisaoMoedasYoshi);
  sessionStorage.clear();
  document.getElementById("audio-moeda").play();
  setTimeout(() => {
    location.href = "/index.html";
  }, 500);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "F5" || e.key === "f5") {
    e.preventDefault();
    if (!atualizar && !completouMissao && !gameOver) {
      clearInterval(checaTempo);
      clearInterval(checaInimigos);
      clearInterval(checaMoveMario);
      clearInterval(checaMoveCenarios);
      clearInterval(checaMoveInimigos);
      clearInterval(checaColisaoBlocos);
      clearInterval(checaColisaoMoedas);
      clearInterval(checaColisaoInimigos);
      clearInterval(checaColisaoPontoFinal);
      clearInterval(checaColisaoMoedasYoshi);
      document.getElementById("audio-jogo-rapido").pause();
      document.getElementById("audio-jogo-normal").pause();
    document.getElementById("aviso").style.display = "block";
    let todosInimigos = document.querySelectorAll(".inimigo");
    todosInimigos.forEach((inimigo) => {
      inimigo.style.backgroundImage = "url(/imagens/kooparedll.png)";
    });
    document.getElementById("audio-pause").play();
    document.getElementById("botao-confirmar").addEventListener("click", () => {
      sessionStorage.clear();
      setTimeout(() => { location.href = "/index.html" }, 500);
    });
    document.getElementById("botao-cancelar").addEventListener("click", () => {
    document.getElementById("aviso").style.display = "none";
    document.getElementById("audio-pause").play();
    document.addEventListener("keydown", teclaKeyDown);
    document.addEventListener("keyup", teclaKeyUp);
    checaInimigos = setInterval(inimigos, 10000);
    checaColisaoInimigos = setInterval(colisaoInimigos, 50);
    checaMoveInimigos = setInterval(moveInimigos, 50);
    checaColisaoPontoFinal = setInterval(colisaoPontoFinal, 50);
    checaColisaoBlocos = setInterval(colisaoBlocos, 50);
    checaColisaoMoedasYoshi = setInterval(colisaoMoedasYoshi, 50);
    checaColisaoMoedas = setInterval(colisaoMoedas, 50);
    checaMoveCenarios = setInterval(moveCenarios, 50);
    checaMoveMario = setInterval(moveMario, 50);
    checaTempo = setInterval(tempo, 1000);
    let todosInimigos = document.querySelectorAll(".inimigo");
    todosInimigos.forEach((inimigo) => {
      inimigo.style.backgroundImage = "url(/imagens/kooparedl.gif)";
    });
    if (tempoAtual > 100) {
      document.getElementById("audio-jogo-rapido").pause();
      document.getElementById("audio-jogo-normal").play();
    } else if (tempoAtual < 100) {
      document.getElementById("audio-jogo-normal").pause();
      document.getElementById("audio-jogo-rapido").play();
    }
    atualizar = false;
  });
  }
  atualizar = true;
  }
});

document.addEventListener("keydown", (e) => {
  if (!cursor && e.key === "T" || !cursor && e.key === "t") {
    document.body.style.cursor = "none";
    cursor = true;
  } else if (cursor && e.key === "T" || cursor && e.key === "t") {
    document.body.style.cursor = "url(/imagens/mario-cursor.cur), auto";
    cursor = false;
  }
});

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
  clearInterval(checaTempo);
  clearInterval(checaInimigos);
  clearInterval(checaMoveMario);
  clearInterval(checaMoveCenarios);
  clearInterval(checaMoveInimigos);
  clearInterval(checaColisaoBlocos);
  clearInterval(checaColisaoMoedas);
  clearInterval(checaColisaoInimigos);
  clearInterval(checaColisaoPontoFinal);
  clearInterval(checaColisaoMoedasYoshi);
  document.getElementById("menu").style.backgroundImage = menuMarioOuLuigi;
  mario.style.backgroundImage = iniciarMarioLuigi;
  document.getElementById("vidas").textContent = vidasAtual;
  document.getElementById("tempo").textContent = tempoAtual;
  document.getElementById("bonus").textContent = bonusAtual;
  document.getElementById("moedas").textContent = moedasAtual;
  document.getElementById("pontos").textContent = pontosAtual;
  document.addEventListener("keydown", teclaKeyDown);
  document.addEventListener("keyup", teclaKeyUp);
  checaInimigos = setInterval(inimigos, 10000);
  checaColisaoInimigos = setInterval(colisaoInimigos, 50);
  checaMoveInimigos = setInterval(moveInimigos, 50);
  checaColisaoPontoFinal = setInterval(colisaoPontoFinal, 50);
  checaColisaoBlocos = setInterval(colisaoBlocos, 50);
  checaColisaoMoedasYoshi = setInterval(colisaoMoedasYoshi, 50);
  checaColisaoMoedas = setInterval(colisaoMoedas, 50);
  checaMoveCenarios = setInterval(moveCenarios, 50);
  checaMoveMario = setInterval(moveMario, 50);
  checaTempo = setInterval(tempo, 1000);
  criaFrutas();
  criaBlocos();
  criaMoedas();
  criaMoedasYoshi();
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
  ajustarTela();
});
