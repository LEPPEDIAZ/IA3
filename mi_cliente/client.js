var tournamentID=12;
var user_name='AnaLuciaDiazLeppe3';
var tileRep = ['_', 'X', 'O'],
    N = 8;
function randInt(a, b){
  return parseInt(Math.floor(Math.random() * (b - a) + b));
}
function ix(fila, col){
  console.log(fila);
  console.log(col);
  console.log('abcdefgh'.indexOf(col));
  return (fila - 1) * N + 'abcdefgh'.indexOf(col);
}
function humanBoard(board){
  var result = '    A  B  C  D  E  F  G  H';
  for(var i = 0; i < board.length; i++){
    if(i % N === 0){
      result += '\n\n ' + (parseInt(Math.floor(i / N)) + 1) + ' ';
    }
    result += ' ' + tileRep[board[i]] + ' ';
  }
  return result;
}
function validateHumanPosition(position){
  var validated = position.length === 2;
  if(validated){
    var fila = parseInt(position[0]),
        col = position[1].toLowerCase();
    return (1 <= fila && fila <= N) && ('abcdefgh'.indexOf(col) >= 0);
  }
  return false;
}
var socket = require('socket.io-client')('http://localhost:4000');
socket.on('connect', function(){
  console.log("Conectado: " + user_name);
  socket.emit('signin', {
    user_name: user_name,
    tournament_id: tournamentID,
    user_role: 'player'
  });
});

socket.on('ready', function(data){
  // Client is about to move
  socket.emit('play', {
    player_turn_id: data.player_turn_id,
    tournament_id: tournamentID,
    game_id: data.game_id,
    movement: EstrategiaMiniMax(data.board, data.player_turn_id)
  });
  console.log( humanBoard(data.board))
});

socket.on('finish', function(data) {
  // The game has finished
  console.log("Game " + data.game_id + " has finished");
  // Inform my students that there is no rematch attribute
  console.log("Ready to play again!");
  // Start again!

  socket.emit('player_ready', {
    tournament_id: tournamentID,
    game_id: data.game_id,
    player_turn_id: data.player_turn_id
  });
  
});
//SE INICIA FUNCION PARA JUGAR CON IA
function moverserandom(tablero,turnodeljugador){
  var tabladejuego = []
  for(var i=0; i<tablero.length; i+= 8){
    tabladejuego.push(tablero.slice(i,i+8))
    console.log(tabladejuego)
  }
  if(turnodeljugador==2){
    var validarturno = ValidarMovida(tabladejuego,1,2)
}
  else if(turnodeljugador==1){
      var validarturno = ValidarMovida(tabladejuego,2,1)
  }
  
  //se implementa el random
  var valoresrandom = validarturno[Math.floor(Math.random() * validarturno.length)].split(",")
  var x = parseInt(valoresrandom[1])
  var y = parseInt(valoresrandom[0])
  var jugada = (y *8) +x
  return jugada
}
function EstrategiaMiniMax  (tablero, maxjugador) {
  return ParsearTablero(MiniMax(tablero8x8(tablero), maxjugador, oponente(maxjugador), -Infinity, Infinity, 1, 4)[1])
}
function ValidarMovida(tabladejuego,turnodeljugador,buscador){
  var posiblesmovidas = []
  for(var y=0;y<tabladejuego.length;y++){
      var fila = tabladejuego[y]
      for(var x=0;x<fila.length;x++){
          if(fila[x]==turnodeljugador){
              //izquierda
              try {
                if(fila[x-1]==0){
                    var posicionentablero = 1
                    while(true){
                        try{
                            var looking = fila[x+posicionentablero]
                        }
                        catch(err) {break}
                        if (looking == null){break}
                        if(looking==buscador && !(posiblesmovidas.includes(""+(y).toString()+","+ (x-1).toString() +""))){
                            posiblesmovidas.push(""+(y).toString()+","+ (x-1).toString() +"")
                            break
                        }
                        posicionentablero += 1 
                    }
                }
            }catch(err) {}
            try {
              if(fila[x+1]==0){
                  var posicionentablero = 1
                  while(true){
                      try{
                          var looking = fila[x-posicionentablero]
                      }
                      catch(err) {break}
                      if (looking == null){break}
                      if(looking==buscador && !(posiblesmovidas.includes(""+(y).toString()+","+ (x+1).toString() +""))){
                          posiblesmovidas.push(""+(y).toString()+","+ (x+1).toString() +"")
                          break
                      }
                      posicionentablero += 1 
                  }
              }
          }catch(err) {}
              //posicion arriba
              try {
                if(tabladejuego[y-1][x]==0){
                    var posicionentablero = 1
                    while(true){
                        try{
                            var looking = tabladejuego[y+posicionentablero][x]
                        }
                        catch(err) {break}
                        if (looking == null){break}
                        if(looking==buscador && !(posiblesmovidas.includes(""+(y-1).toString()+","+ (x).toString() +""))){
                            posiblesmovidas.push(""+(y-1).toString()+","+ (x).toString() +"")
                            break
                        }
                        posicionentablero += 1 
                    }

                }
            }catch(err) {}
              //superior derecha
              try {
                  if(tabladejuego[y-1][x+1]==0){
                      var posicionentablero = 1
                      while(true){
                          try{
                              var looking = tabladejuego[y+posicionentablero][x-posicionentablero]
                          }
                          catch(err) {break}
                          if (looking == null){break}
                          if(looking==buscador && !(posiblesmovidas.includes(""+(y-1).toString()+","+ (x+1).toString() +""))){
                            posiblesmovidas.push(""+(y-1).toString()+","+ (x+1).toString() +"")
                              break
                          }
                          posicionentablero += 1 
                      }
                  }
              }catch(err) {}
              //superior izquierda
              try {
                  if(tabladejuego[y-1][x-1]==0){
                      var posicionentablero = 1
                      while(true){
                          try{
                              var looking = tabladejuego[y+posicionentablero][x+posicionentablero]
                          }
                          catch(err) {break}
                          if (looking == null){break}
                          if(looking==buscador && !(posiblesmovidas.includes(""+(y-1).toString()+","+ (x-1).toString() +""))){
                              posiblesmovidas.push(""+(y-1).toString()+","+ (x-1).toString() +"")
                              break
                          }
                          posicionentablero += 1 
                      }
                  }
              }catch(err) {}
              //izquierda para abajo
              try {
                  if(tabladejuego[y+1][x-1]==0){
                      var posicionentablero = 1
                      while(true){
                          try{
                              var looking = tabladejuego[y-posicionentablero][x+posicionentablero]
                          }
                          catch(err) {break}
                          if (looking == null){break}
                          if(looking==buscador && !(posiblesmovidas.includes(""+(y+1).toString()+","+ (x-1).toString() +""))){
                              posiblesmovidas.push(""+(y+1).toString()+","+ (x-1).toString() +"")
                              break
                          }
                          posicionentablero += 1 
                      }
                  }

              }catch(err) {}
              //abajo
              try {
                  if(tabladejuego[y+1][x]==0){
                      var posicionentablero = 1
                      while(true){
                          try{
                              var looking = tabladejuego[y-posicionentablero][x]
                          }
                          catch(err) {break}
                          if (looking == null){break}
                          if(looking==buscador && !(posiblesmovidas.includes(""+(y+1).toString()+","+ (x).toString() +""))){
                              posiblesmovidas.push(""+(y+1).toString()+","+ (x).toString() +"")
                              break
                          }
                          posicionentablero += 1 
                      }
                  }
              }catch(err) {}
              //derecha para abajo
              try {
                  if(tabladejuego[y+1][x+1]==0){
                      var posicionentablero = 1
                      while(true){
                          try{
                              var looking = tabladejuego[y-posicionentablero][x-posicionentablero]
                          }
                          catch(err) {break}
                          if (looking == null){break}
                          if(looking==buscador && !(posiblesmovidas.includes(""+(y+1).toString()+","+ (x+1).toString() +""))){
                              posiblesmovidas.push(""+(y+1).toString()+","+ (x+1).toString() +"")
                              break
                          }
                          posicionentablero += 1 
                      }
                  }
              }catch(err) {}
              //derecha
              
          }
      }
  }
  return posiblesmovidas
}
var underscore = require('underscore')
function tablero8x8 (tablero) { 
  return([
  tablero.slice(0,8),
  tablero.slice(8,16),
  tablero.slice(16,24),
  tablero.slice(24,32),
  tablero.slice(32,40),
  tablero.slice(40,48),
  tablero.slice(48,56),
  tablero.slice(56,64)
])
}
function chequearmovimientodeladversario (tablero, posicionentablero, futurasmovidas) {
  switch(futurasmovidas){
    case 0: { 
      if((posicionentablero[0]-1) >= 0){ return tablero[posicionentablero[0]-1][posicionentablero[1]]} else {return -1}
    }
    case 1: {
      if((posicionentablero[0]+1) <= 7){ return tablero[posicionentablero[0]+1][posicionentablero[1]]} else { return -1}
    }
    case 3: {
      if((posicionentablero[1]+1) <= 7){return tablero[posicionentablero[0]][posicionentablero[1]+1]} else {return -1}
    }
    case 2: {
      if((posicionentablero[1]-1) >= 0){return tablero[posicionentablero[0]][posicionentablero[1]-1]} else {return -1}
    }
    case 4: {
      if((posicionentablero[0]-1) >= 0 && (posicionentablero[1]+1) <= 7){return tablero[posicionentablero[0]-1][posicionentablero[1]+1]} else {return -1}
    }
    case 5: {
      if((posicionentablero[0]-1) >= 0 && (posicionentablero[1]-1) >= 0){return tablero[posicionentablero[0]-1][posicionentablero[1]-1]} else {return -1}
    }
    case 6: {
      if((posicionentablero[0]+1) <= 7 && (posicionentablero[1]+1) <= 7){return tablero[posicionentablero[0]+1][posicionentablero[1]+1]} else {return -1}
    }
    case 7: {
      if((posicionentablero[0]+1) <= 7 && (posicionentablero[1]-1) >= 0){return tablero[posicionentablero[0]+1][posicionentablero[1]-1]} else {return -1}
    }
  }
}
function contrapuestas (futurasmovidas){
  switch(futurasmovidas){
    case 0: {
      return 1
    }
    case 1: {
      return 0
    }
    case 2: {
      return 3
    }
    case 3: {
      return 2
    }
    case 4: {
      return 7
    }
    case 5: {
      return 6
    }
    case 6: {
      return 5
    }
    case 7: {
      return 4
    }
  }
}
function validacionfinal (posicionentablero, movidasvalidas) {
  for(let i=0; i<movidasvalidas.length; i++){
    if(posicionentablero[0] === movidasvalidas[i][0] && posicionentablero[1] === movidasvalidas[i][1]){
      return true
    }
  }
  return false
}

var todaslasdirecciones = [0, 1, 2, 3, 4, 5, 6, 7]
function movida (posicionentablero, futurasmovidas) {
  switch(futurasmovidas){
    case 0: {
      if((posicionentablero[0]-1) >= 0){
        return [posicionentablero[0]-1, posicionentablero[1]]
      } else {
        return null
      }
    }
    case 1: {
      if((posicionentablero[0]+1) <= 7){
        return [posicionentablero[0]+1, posicionentablero[1]]
      } else {
        return null
      }
    }
    case 2: {
      if((posicionentablero[1]-1) >= 0){
        return [posicionentablero[0], posicionentablero[1]-1]
      } else {
        return null
      }
    }
    case 3: {
      if((posicionentablero[1]+1) <= 7){
        return [posicionentablero[0], posicionentablero[1]+1]
      } else {
        return null
      }
    }
    case 4: {
      if((posicionentablero[0]-1) >= 0 && (posicionentablero[1]+1) <= 7){
        return [posicionentablero[0]-1, posicionentablero[1]+1]
      } else {
        return null
      }
    }
    case 5: {
      if((posicionentablero[0]-1) >= 0 && (posicionentablero[1]-1) >= 0){
        return [posicionentablero[0]-1, posicionentablero[1]-1]
      } else {
        return null
      }
    }
    case 6: {
      if((posicionentablero[0]+1) <= 7 && (posicionentablero[1]+1) <= 7){
        return [posicionentablero[0]+1, posicionentablero[1]+1]
      } else {
        return null
      }
    }
    case 7: {
      if((posicionentablero[0]+1) <= 7 && (posicionentablero[1]-1) >= 0){
        return [posicionentablero[0]+1, posicionentablero[1]-1]
      } else {
        return null
      }
    }
  }
}
//filtra los estados del oponente con espacios vacios
//chequea el extremo opuesto, si hay valor se agrega el espacio vacio a movimientos validos.
function tactica  (tablero, jugador)  {
  var oponente = jugador === 1 ? 2 : 1
  let tactica = []
  for(let y=0; y<tablero.length; y++){
    for(let x=0; x<tablero[0].length; x++){
      if(tablero[y][x] === oponente){
        todaslasdirecciones.map(futurasmovidas => {
          if(chequearmovimientodeladversario(tablero, [y,x], futurasmovidas) == '0'){
            let posiblemovida = movida([y, x], contrapuestas(futurasmovidas))
            while(posiblemovida !== null && tablero[posiblemovida[0]][posiblemovida[1]] !== 0){
              if(validacionfinal(movida([y, x], futurasmovidas),tactica)){
                break
              }
              if(tablero[posiblemovida[0]][posiblemovida[1]] === jugador){
                tactica.push(movida([y, x], futurasmovidas))
                break
              }
              posiblemovida = movida(posiblemovida, contrapuestas(futurasmovidas))
            }
          }
        })
      }
    } 
  }
  return tactica
}
//calcula el oponente, se obtienen nuevas posiciones y da la vuelta a los valores
function RealizarTactica (tablero, moverficha, jugador) {
  let nuevoborde = []
  for(let i=0; i<tablero.length; i++){
    nuevoborde.push([])
    for(let j=0; j<tablero[0].length; j++){
      nuevoborde[i].push(tablero[i][j])
    }
  }
  var oponente = jugador === 1 ? 2 : 1
  nuevoborde[moverficha[0]][moverficha[1]] = jugador
  todaslasdirecciones.map((futurasmovidas) => {
    let difmaxymin = []
    let posiblemovida = movida(moverficha, futurasmovidas)
    while(posiblemovida !== null && nuevoborde[posiblemovida[0]][posiblemovida[1]] !== 0){
      if(nuevoborde[posiblemovida[0]][posiblemovida[1]] !== oponente){
        if(nuevoborde[posiblemovida[0]][posiblemovida[1]] === jugador){
          if(difmaxymin.length !== 0){
            difmaxymin.map((posicion) => {
              nuevoborde[posicion[0]][posicion[1]] = jugador
            })
            break
          }
        }
      } else {
        difmaxymin.push(posiblemovida)
      }
      posiblemovida = movida(posiblemovida, futurasmovidas)
    }
  })
  return nuevoborde
}

function opuestos  (tipo) {
  if(tipo === 1){
    return 0
  } else {
    return 1
  }
}
function oponente (id) {
  if(id === 2){
    return 1
  } else {
    return 2
  }
}
function heuristica  (tablero, maxjugador, minjugador)  {
  var tablerodelserver = underscore.flatten(tablero)
  var contadordeespaciosvacios = underscore.countBy(tablerodelserver, (posicionentablero) => {
    if(posicionentablero === 2){
      return 2
    } else {
      if(posicionentablero === 1){
        return 1
      } else {
        return 0
      }
    }
  })
  if(contadordeespaciosvacios[maxjugador] + contadordeespaciosvacios[minjugador] != 0){
    return  (contadordeespaciosvacios[maxjugador] - contadordeespaciosvacios[minjugador]) / (contadordeespaciosvacios[maxjugador] + contadordeespaciosvacios[minjugador]) *100
  } else {
    return 0
  }
}
function MiniMax  (tablero, maxjugador, minjugador, alpha, beta, tipo,profundidad)  {
  let movimientosdelnodo
  let parentnode
  let movidasdeloponente
  //validar movidas para el jugador actual
  if(tipo === 0){
    movimientosdelnodo = tactica(tablero, minjugador)
  } else {
    movimientosdelnodo = tactica(tablero, maxjugador)
  }
  if(movimientosdelnodo.length !== 0){
    //ve si el player tiene movimientos validos
    let valordelnodo
    let movernodo
    let moverValor
    let nuevotablero
    if(tipo !== 1){
      valordelnodo = Infinity
      movernodo = -1
    } else {
      valordelnodo = -Infinity
      movernodo = -1
    }
    for(let i=0; i<movimientosdelnodo.length; i++){
      if(parentnode === 0 && tipo === 1){
        if(valordelnodo > beta){
          continue
        }
      }
      if(parentnode === 1 && tipo === 0){
        if(valordelnodo < alpha){
          continue
        }
      }
      if(tipo === 1){
        nuevotablero = RealizarTactica(tablero, movimientosdelnodo[i], maxjugador)
      } else {
        nuevotablero = RealizarTactica(tablero, movimientosdelnodo[i], minjugador)
      }
      if(profundidad !== 0){
        moverValor = MiniMax(nuevotablero, maxjugador, minjugador, alpha, beta, opuestos(tipo), tipo, profundidad - 1)
      } else {
        moverValor = [heuristica(nuevotablero, maxjugador, minjugador), movimientosdelnodo[i]]
      }
      if(tipo === 1){
        if(moverValor[0] > valordelnodo){
          //update al maximizador
          valordelnodo = moverValor[0]
          movernodo = movimientosdelnodo[i]
          if(moverValor[0] > alpha){
            alpha = moverValor[0]
          }
        }
      } else {
        if(moverValor[0] < valordelnodo){
          //update al minimizador
          valordelnodo = moverValor[0]
          movernodo = movimientosdelnodo[i]
          if(moverValor[0] < beta){
            beta = moverValor[0]
          }
        }
      }
    }
    return [valordelnodo, movernodo]
  }else {
    //chequea si el movimientos validos del oponente  entonces tenemos una hoja
    if(tipo === 0){
      movidasdeloponente = tactica(tablero, maxjugador)
    } else {
      movidasdeloponente = tactica(tablero, minjugador)
    }
    if(movidasdeloponente.length !== 0){
      return MiniMax(tablero, maxjugador, minjugador, alpha, beta, opuestos(tipo), tipo, profundidad)
    } else {
      return [heuristica(tablero, maxjugador, minjugador), -1]
    }
  }
}
function ParsearTablero (posicionentablero) {
  return(posicionentablero[1]+posicionentablero[0]*8)
}




