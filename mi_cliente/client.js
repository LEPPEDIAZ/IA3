var tournamentID=12;
var user_name='Ana_lucia_Diaz_Leppe';
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
socket.on('connect',function(){
  // Client has connected
  console.log("Conectado: " + user_name);
  // Signing signal
  socket.emit('signin', {
    user_name: user_name,
    tournament_id: tournamentID,  // 142857
    user_role: 'player'

  });

});

socket.on('ready', function(data){
  // Client is about to move
  socket.emit('play', {
    player_turn_id: data.player_turn_id,
    tournament_id: tournamentID,
    game_id: data.game_id,
    //movement: ix(parseInt(movement[0]), movement[1].toLowerCase())
    movement: moverse(data.board, data.player_turn_id)
  });

});

socket.on('finish', function(data){
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
function moverse(board,turnodeljugador){
  var tabladejuego = []
  for(var i=0; i<board.length; i+= 8){
    tabladejuego.push(board.slice(i,i+8))
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
function ValidarMovida(tabladejuego,turnodeljugador,buscador){
  var posiblesmovidas = []
  for(var y=0;y<tabladejuego.length;y++){
      var fila = tabladejuego[y]
      for(var x=0;x<fila.length;x++){
          if(fila[x]==turnodeljugador){
              //izquierda
              try {
                if(fila[x-1]==0){
                    var position = 1
                    while(true){
                        try{
                            var looking = fila[x+position]
                        }
                        catch(err) {break}
                        if (looking == null){break}
                        if(looking==buscador && !(posiblesmovidas.includes(""+(y).toString()+","+ (x-1).toString() +""))){
                            posiblesmovidas.push(""+(y).toString()+","+ (x-1).toString() +"")
                            break
                        }
                        position += 1 
                    }
                }
            }catch(err) {}
            try {
              if(fila[x+1]==0){
                  var position = 1
                  while(true){
                      try{
                          var looking = fila[x-position]
                      }
                      catch(err) {break}
                      if (looking == null){break}
                      if(looking==buscador && !(posiblesmovidas.includes(""+(y).toString()+","+ (x+1).toString() +""))){
                          posiblesmovidas.push(""+(y).toString()+","+ (x+1).toString() +"")
                          break
                      }
                      position += 1 
                  }
              }
          }catch(err) {}
              //posicion arriba
              try {
                if(tabladejuego[y-1][x]==0){
                    var position = 1
                    while(true){
                        try{
                            var looking = tabladejuego[y+position][x]
                        }
                        catch(err) {break}
                        if (looking == null){break}
                        if(looking==buscador && !(posiblesmovidas.includes(""+(y-1).toString()+","+ (x).toString() +""))){
                            posiblesmovidas.push(""+(y-1).toString()+","+ (x).toString() +"")
                            break
                        }
                        position += 1 
                    }

                }
            }catch(err) {}
              //superior derecha
              try {
                  if(tabladejuego[y-1][x+1]==0){
                      var position = 1
                      while(true){
                          try{
                              var looking = tabladejuego[y+position][x-position]
                          }
                          catch(err) {break}
                          if (looking == null){break}
                          if(looking==buscador && !(posiblesmovidas.includes(""+(y-1).toString()+","+ (x+1).toString() +""))){
                            posiblesmovidas.push(""+(y-1).toString()+","+ (x+1).toString() +"")
                              break
                          }
                          position += 1 
                      }
                  }
              }catch(err) {}
              //superior izquierda
              try {
                  if(tabladejuego[y-1][x-1]==0){
                      var position = 1
                      while(true){
                          try{
                              var looking = tabladejuego[y+position][x+position]
                          }
                          catch(err) {break}
                          if (looking == null){break}
                          if(looking==buscador && !(posiblesmovidas.includes(""+(y-1).toString()+","+ (x-1).toString() +""))){
                              posiblesmovidas.push(""+(y-1).toString()+","+ (x-1).toString() +"")
                              break
                          }
                          position += 1 
                      }
                  }
              }catch(err) {}
              //izquierda para abajo
              try {
                  if(tabladejuego[y+1][x-1]==0){
                      var position = 1
                      while(true){
                          try{
                              var looking = tabladejuego[y-position][x+position]
                          }
                          catch(err) {break}
                          if (looking == null){break}
                          if(looking==buscador && !(posiblesmovidas.includes(""+(y+1).toString()+","+ (x-1).toString() +""))){
                              posiblesmovidas.push(""+(y+1).toString()+","+ (x-1).toString() +"")
                              break
                          }
                          position += 1 
                      }
                  }

              }catch(err) {}
              //abajo
              try {
                  if(tabladejuego[y+1][x]==0){
                      var position = 1
                      while(true){
                          try{
                              var looking = tabladejuego[y-position][x]
                          }
                          catch(err) {break}
                          if (looking == null){break}
                          if(looking==buscador && !(posiblesmovidas.includes(""+(y+1).toString()+","+ (x).toString() +""))){
                              posiblesmovidas.push(""+(y+1).toString()+","+ (x).toString() +"")
                              break
                          }
                          position += 1 
                      }
                  }
              }catch(err) {}
              //derecha para abajo
              try {
                  if(tabladejuego[y+1][x+1]==0){
                      var position = 1
                      while(true){
                          try{
                              var looking = tabladejuego[y-position][x-position]
                          }
                          catch(err) {break}
                          if (looking == null){break}
                          if(looking==buscador && !(posiblesmovidas.includes(""+(y+1).toString()+","+ (x+1).toString() +""))){
                              posiblesmovidas.push(""+(y+1).toString()+","+ (x+1).toString() +"")
                              break
                          }
                          position += 1 
                      }
                  }
              }catch(err) {}
              //derecha
              
          }
      }
  }
  return posiblesmovidas
}

