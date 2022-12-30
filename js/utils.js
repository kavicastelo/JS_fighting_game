function rectangular_collision( {rec1, rec2} ){
    return(
        rec1.attackBox.position.x + rec1.attackBox.width >= rec2.position.x &&
        rec1.attackBox.position.x <= rec2.position.x + rec2.width &&
        rec1.attackBox.position.y + rec1.height >= rec2.position.y &&
        rec1.attackBox.position.y <= rec2.position.y + rec2.height
    )
}

function determineWinner({player,enemy,timerId}){
    clearTimeout(timerId)
    document.querySelector('#display_text').style.display = 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#display_text').innerHTML = 'Tie'
        player.timeOver = true
        enemy.timeOver = true
    } else if (player.health > enemy.health) {
        document.querySelector('#display_text').innerHTML = 'Player 1 Wins'
    } else if (enemy.health > player.health) {
        document.querySelector('#display_text').innerHTML = 'Player 2 Wins'
    }
}

let timer = 30
let timerId

function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer,1000)
        timer--
        document.querySelector('#time').innerHTML = timer
    }
//end game timeout
    if (timer===0) {
        determineWinner({player,enemy,timerId})
    }
}