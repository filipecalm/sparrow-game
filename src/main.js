function start() {
  $("#inicio").hide()

  $("#fundoGame").append("<div id='jogador' class='rotacao'></div>")
  $("#fundoGame").append("<div id='inimigo1' class='rotacaoInimigo'></div>")
  $("#fundoGame").append("<div id='inimigo2'></div>")
  $("#fundoGame").append(`<div id='aliado' class='movimento'></div>`)
  $("#fundoGame").append("<div id='placar'></div>")
  $("#fundoGame").append("<div id='energia'></div>")

  jogo = {}
  pontos = 0
  salvos = 0
  perdidos = 0
  energiaAtual = 3
  velocidade = 5
  podeAtirar = true
  fimdejogo = false
  posicaoY = parseInt(Math.random() * 334)
  tecla = {
    W: 87,  
    S: 83,
    D: 68
  }

  jogo.pressionou = [];

  somDisparo = document.getElementById("somDisparo")
  somExplosao  =document.getElementById("somExplosao")
  musica = document.getElementById("musica")
  somGameover  =document.getElementById("somGameover")
  somPerdido = document.getElementById("somPerdido")
  somResgate = document.getElementById("somResgate")

  musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play() }, false)
  musica.play()

  $(document).keydown(function (e) {
    jogo.pressionou[e.which] = true;
  })


  $(document).keyup(function (e) {
    jogo.pressionou[e.which] = false;
  })

  jogo.timer = setInterval(loop, 30)

  function loop() {
    movefundo();
    movejogador();
    moveinimigo1();
    moveinimigo2();
    movealiado();
    colisao();
    placar();
    energia();
  }

  function movefundo() {

    esquerda = parseInt($("#fundoGame").css("background-position"));
    $("#fundoGame").css("background-position", esquerda - 1);

  }

  function movejogador() {

    if (jogo.pressionou[tecla.W]) {
      let topo = parseInt($("#jogador").css("top"))
      $("#jogador").css("top", topo - 10)

      if (topo <= 0) {
        $("#jogador").css("top", topo + 10)
      }
    }

    if (jogo.pressionou[tecla.S]) {

      topo = parseInt($("#jogador").css("top"))
      $("#jogador").css("top", topo + 10)

      if (topo >= 434) {
        $("#jogador").css("top", topo - 10)
      }
    }

    if (jogo.pressionou[tecla.D]) {
      disparo()
    }

  }

  function moveinimigo1() {

    posicaoX = parseInt($("#inimigo1").css("left"))
    $("#inimigo1").css("left", posicaoX - velocidade)
    $("#inimigo1").css("top", posicaoY)

    if (posicaoX <= 0) {
      posicaoY = parseInt(Math.random() * 334)
      $("#inimigo1").css("left", 694)
      $("#inimigo1").css("top", posicaoY)
    }
  }

  function moveinimigo2() {
    posicaoX = parseInt($("#inimigo2").css("left"))
    $("#inimigo2").css("left", posicaoX - 3)

    if (posicaoX <= 0) {
      $("#inimigo2").css("left", 775)
    }
  }

  function movealiado() {

    posicaoX = parseInt($("#aliado").css("left"))
    $("#aliado").css("left", posicaoX + 1)

    if (posicaoX > 906) {
      $("#aliado").css("left", 0)
    }
  }

  function disparo() {

    if (podeAtirar == true) {
      somDisparo.play()
      podeAtirar = false

      topo = parseInt($("#jogador").css("top"))
      posicaoX = parseInt($("#jogador").css("left"))
      tiroX = posicaoX + 190
      topoTiro = topo + 37
      $("#fundoGame").append("<div id='disparo'></div")
      $("#disparo").css("top", topoTiro)
      $(`#disparo`).css("left", tiroX)

      tempoDisparo = window.setInterval(executaDisparo, 30)

    }

    function executaDisparo() {
      posicaoX = parseInt($("#disparo").css("left"))
      $("#disparo").css("left", posicaoX + 50)

      if (posicaoX > 900) {
        window.clearInterval(tempoDisparo)
        tempoDisparo = null
        $("#disparo").remove()
        podeAtirar = true
      }
    }
  }

  function colisao() {
    colisao1 = ($("#jogador").collision($("#inimigo1")))
    colisao2 = ($("#jogador").collision($("#inimigo2")))
    colisao3 = ($("#disparo").collision($("#inimigo1")))
    colisao4 = ($("#disparo").collision($("#inimigo2")))
    colisao5 = ($("#jogador").collision($("#aliado")))
    colisao6 = ($("#inimigo2").collision($("#aliado")))

    if (colisao1.length > 0) {
      energiaAtual--
      pontos -=50
      inimigo1X = parseInt($("#inimigo1").css("left"))
      inimigo1Y = parseInt($("#inimigo1").css("top"))
      explosao1(inimigo1X, inimigo1Y)

      posicaoY = parseInt(Math.random() * 400)
      $("#inimigo1").css("left", 820)
      $("#inimigo1").css("top", posicaoY)
    }

    if (colisao2.length > 0) {
      energiaAtual--
      pontos -=50
      inimigo2X = parseInt($("#inimigo2").css("left"))
      inimigo2Y = parseInt($("#inimigo2").css("top"))
      explosao2(inimigo2X, inimigo2Y)

      $("#inimigo2").remove()

      reposicionaInimigo2()

    }

    if (colisao3.length > 0) {
      velocidade += 0.3
      pontos += 100
      inimigo1X = parseInt($("#inimigo1").css("left"))
      inimigo1Y = parseInt($("#inimigo1").css("top"))

      explosao1(inimigo1X, inimigo1Y)
      $("#disparo").css("left", 950)

      posicaoY = parseInt(Math.random() * 334)
      $("#inimigo1").css("left", 694)
      $("#inimigo1").css("top", posicaoY)

    }

    if (colisao4.length > 0) {
      pontos += 50
      inimigo2X = parseInt($("#inimigo2").css("left"))
      inimigo2Y = parseInt($("#inimigo2").css("top"))
      $("#inimigo2").remove()

      explosao2(inimigo2X, inimigo2Y)
      $("#disparo").css("left", 950)

      reposicionaInimigo2()
    }

    if (colisao5.length > 0) {
      salvos++
      pontos += 200
      somResgate.play()
      reposicionaaliado()
      $("#aliado").remove()
      pontuacao += 200
    }

    if (colisao6.length > 0) {
      perdidos++
      pontos -= 300
      aliadoX = parseInt($("#aliado").css("left"))
      aliadoY = parseInt($("#aliado").css("top"))
      explosao3(aliadoX, aliadoY)
      $("#aliado").remove()

      reposicionaaliado()
    }
  }

  function explosao1(inimigo1X, inimigo1Y) {
    somExplosao.play()
    $("#fundoGame").append("<div id='explosao1'></div")
    $("#explosao1").css("background-image", "url(img/explosao.png)")
    let div = $("#explosao1")
    div.css("top", inimigo1Y)
    div.css("left", inimigo1X)
    div.animate({ width: 200, opacity: 0 }, "slow")

    tempoExplosao = window.setInterval(removeExplosao, 500)

    function removeExplosao() {

      div.remove()
      window.clearInterval(tempoExplosao)
      tempoExplosao = null
    }
  }

  function reposicionaInimigo2() {

    tempoColisao4 = window.setInterval(reposiciona4, 5000)

    function reposiciona4() {
      window.clearInterval(tempoColisao4)
      tempoColisao4 = null

      if (fimdejogo == false) {

        $("#fundoGame").append("<div id=inimigo2></div")
      }
    }
  }

  function explosao2(inimigo2X, inimigo2Y) {
    somExplosao.play()
    $("#fundoGame").append("<div id='explosao2'></div")
    $("#explosao2").css("background-image", "url(img/explosao.png)")
    div2 = $("#explosao2")
    div2.css("top", inimigo2Y)
    div2.css("left", inimigo2X)
    div2.animate({ width: 200, opacity: 0 }, "slow")

    tempoExplosao2 = window.setInterval(removeExplosao2, 1000)

    function removeExplosao2() {
      div2.remove()
      window.clearInterval(tempoExplosao2)
      tempoExplosao2 = null
    }
  }

  function reposicionaaliado() {

    tempoaliado = window.setInterval(reposiciona6, 6000)

    function reposiciona6() {
      window.clearInterval(tempoaliado)
      tempoaliado = null

      if (fimdejogo == false) {

        $("#fundoGame").append("<div id='aliado' class='movimento'></div>")

      }
    }
  }

  function explosao3(aliadoX, aliadoY) {
    somPerdido.play()
    $("#fundoGame").append("<div id='explosao3' class='aliadoMorte'></div")
    $("#explosao3").css("top", aliadoY)
    $("#explosao3").css("left", aliadoX)
    tempoExplosao3 = window.setInterval(resetaExplosao3, 1000)
    function resetaExplosao3() {
      $("#explosao3").remove()
      window.clearInterval(tempoExplosao3)
      tempoExplosao3 = null

    }
  }

  function placar() {
	
    $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>")
    
  }

  function energia() {
	
		if (energiaAtual == 3) {
			
			$("#energia").css("background-image", "url(img/energia3.png)")
		}
	
		if (energiaAtual == 2) {
			
			$("#energia").css("background-image", "url(img/energia2.png)")
		}
	
		if (energiaAtual == 1) {
			
			$("#energia").css("background-image", "url(img/energia1.png)")
		}
	
		if (energiaAtual == 0) {
			
			$("#energia").css("background-image", "url(img/energia0.png)")
      gameOver()
		}	
	}

  function gameOver() {
    fimdejogo = true
    musica.pause()
    somGameover.play()
    
    window.clearInterval(jogo.timer)
    jogo.timer = null
    
    $("#jogador").remove()
    $("#inimigo1").remove()
    $("#inimigo2").remove()
    $("#aliado").remove()
    
    $("#fundoGame").append("<div id='fim'></div>")
    
    $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><button class='button'>Jogar Novamente</button></div>")
  }

}

function reiniciaJogo() {
	somGameover.pause()
	$("#fim").remove()
	start()
	
} 


