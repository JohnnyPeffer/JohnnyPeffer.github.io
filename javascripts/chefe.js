let container = document.getElementById("container");
let cenario = document.getElementById("cenario");
let mario = document.getElementById("mario");
let chefe = document.getElementById("chefe");

let hackJogador1 = document.getElementById("hack-mario");
let hackJogador2 = document.getElementById("hack-luigi");

let larguraContainer = container.offsetWidth;
let alturaContainer = container.offsetHeight;
let larguraCenario = cenario.offsetWidth;
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

let checaColisaoInimigos;
let checaMoveAtaqueChefe;
let checaBonusAleatorio;
let checaAdicionaBonus;
let checaMoveInimigos;
let batalhaComChefe;
let bonusAleatorio;
let checaMoveMario;
let checaInimigos;
let checaTempo;

let posicao = 100;
let direcao = 0;
let velocidade = 10;
let velocidadeInimigo = 5;
let numeroAtaqueChefe = 3;

let tempoAtual = parseInt(sessionStorage.getItem("tempoAtual"));
let vidasAtual = parseInt(sessionStorage.getItem("vidasAtual"));
let bonusAtual = parseInt(sessionStorage.getItem("bonusAtual"));
let moedasAtual = parseInt(sessionStorage.getItem("moedasAtual"));
let pontosAtual = parseInt(sessionStorage.getItem("pontosAtual"));

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
let chefeVulneravel = false

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
    clearInterval(checaMoveMario);
    mario.style.backgroundImage = marioGameOver;
    mario.style.animation = "gameOver 5s forwards";
    let inimigos = document.querySelectorAll(".inimigo");
    inimigos.forEach((inimigo) => {
      inimigo.style.backgroundImage = "url(/imagens/kooparedll.png)";
    });
    document.getElementById("audio-morreu").addEventListener("ended", () => {
      document.getElementById("audio-game-over").play();
      document.getElementById("chama-fogo").style.backgroundImage = "none";
      document.getElementById("chama-fogo").style.backgroundColor = "black";
      document.getElementById("container").style.animation = "efeito 1s linear forwards";
      document.getElementById("game").style.animation = "game 2s linear forwards";
      document.getElementById("over").style.animation = "over 2s linear forwards";
      document.getElementById("audio-game-over").addEventListener("ended", () => {
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
      } else if (!pulando && tecla.key === "ArrowUp") {
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
      } else if (!pulando && tecla.key === "ArrowDown") {
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

function moveMario() {
  posicao += direcao * velocidade;
    posicao < 0 ? posicao = 0 : posicao;
    posicao + larguraMario > larguraContainer
     ? posicao = larguraContainer - larguraMario : posicao;
  mario.style.left = `${posicao}px`;
}

document.addEventListener("keydown", (tecla) => {
  if (!botaoResetar && tecla.key === "Delete") {
    document.getElementById("resetar").style.animation = "animarBotoes 1s linear forwards";
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
  if (!painelHack && !botaoEditar && tecla.key === "Insert") {
    document.getElementById("editar").style.animation = "animarBotoes 1s linear forwards";
    document.getElementById("audio-moeda").play();
    setTimeout(() => {
      botaoEditar = true;
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
  clearInterval(checaMoveMario);
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
  checaMoveMario = setInterval(moveMario, 50);
  checaTempo = setInterval(tempo, 1000);
  let todosInimigos = document.querySelectorAll(".inimigo");
  todosInimigos.forEach((inimigo) => {
    inimigo.style.backgroundImage = "url(/imagens/kooparedl.gif)";
  });
  invencivel = false;
  mario.classList.remove("invencivel");
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
      clearInterval(checaMoveMario);
      mario.style.backgroundImage = iniciarMarioLuigi;
      document.getElementById("menu").style.backgroundImage = menuMarioOuLuigi;
      document.getElementById("vidas").textContent = hackVidas;
      document.getElementById("tempo").textContent = hackTempo;
      document.getElementById("moedas").textContent = hackMoedas;
      document.getElementById("pontos").textContent = hackPontos;
      tempo();
      document.addEventListener("keydown", teclaKeyDown);
      document.addEventListener("keyup", teclaKeyUp);
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
  clearInterval(checaMoveMario);
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
      clearInterval(checaMoveMario);
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
    document.body.style.cursor = "auto";
    cursor = false;
  }
});

function ataqueChefe(x, y) {
  const ataque1 = document.createElement("div");
  ataque1.className = "ataque1";
  ataque1.style.position = "absolute";
  ataque1.style.width = "60px";
  ataque1.style.height = "40px";
  ataque1.style.backgroundImage = "url(/imagens/fogo-chefe-left.gif)";
  ataque1.style.backgroundPosition = "center center";
  ataque1.style.backgroundRepeat = "no-repeat";
  ataque1.style.backgroundSize = "100% 100%";
  ataque1.style.left = x + "px";
  ataque1.style.top = y + "px";
  cenario.appendChild(ataque1);
  numeroAtaqueChefe--;
  chefe.style.backgroundImage = "url(/imagens/chefe-one-atack-left.gif)";
  setTimeout(() => {
    chefe.style.backgroundImage = "url(/imagens/chefe-one.png)";
  }, 500);
}

function moveAtaqueChefe() {
  const todosAtaque1 = document.querySelectorAll(".ataque1");
  for (let i = 0; i < todosAtaque1.length; i++) {
    if (todosAtaque1[i]) {
      let atk = todosAtaque1[i].offsetLeft;
      atk -= 10;
      todosAtaque1[i].style.left = atk + "px";
      if (atk < 0) {
        todosAtaque1[i].remove();
      }
    }
  }
}

window.addEventListener("load", () => {
  clearInterval(checaTempo);
  clearInterval(checaMoveMario);
  document.getElementById("menu").style.backgroundImage = menuMarioOuLuigi;
  mario.style.backgroundImage = iniciarMarioLuigi;
  mario.style.bottom = "138px";
  document.getElementById("vidas").textContent = vidasAtual;
  document.getElementById("tempo").textContent = tempoAtual;
  document.getElementById("bonus").textContent = bonusAtual;
  document.getElementById("moedas").textContent = moedasAtual;
  document.getElementById("pontos").textContent = pontosAtual;
  document.addEventListener("keydown", teclaKeyDown);
  document.addEventListener("keyup", teclaKeyUp);
  checaMoveMario = setInterval(moveMario, 50);
  checaTempo = setInterval(tempo, 1000);
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
  ajustarTela();
  setTimeout(() => {
    batalhaComChefe = setInterval(() => {
      if (numeroAtaqueChefe > 0) {
      ataqueChefe(chefe.offsetLeft - 40, chefe.offsetTop + 20);
      } else {
        chefe.style.backgroundImage = "url(/imagens/chefe-one-atack2-left.gif)";
        chefe.style.backgroundPosition = "bottom center";
        chefe.style.backgroundRepeat = "no-repeat";
        chefe.style.backgroundSize = "100% 100%";
        chefe.style.width = "70px";
        chefe.style.height = "60px";
        chefe.classList.add("luta1");
      }
    }, 3000);
  }, 2000);
  checaMoveAtaqueChefe = setInterval(moveAtaqueChefe, 50);
});

const larguraMaxima = 1352;
const alturaMaxima = 654;

function ajustarTela() {
  if (larguraContainer > larguraMaxima || 
    alturaContainer > alturaMaxima) {
    container.style.width = larguraMaxima + "px";
    container.style.height = alturaMaxima + "px";
  } else {
    container.style.width = larguraContainer + "px";
    container.style.height = alturaContainer + "px";
  }
}

window.addEventListener("resize", ajustarTela);
