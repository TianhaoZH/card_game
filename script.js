// css class for different card image
const CARD_TECHS = [
  'html5',
  'css3',
  'js',
  'sass',
  'nodejs',
  'react',
  'linkedin',
  'heroku',
  'github',
  'aws'
];

// only list out some of the properties,
// add more when needed
const game = {
  score: 0,
  level: 1,
  timer: 60,
  timerDisplay: null,
  scoreDisplay: null,
  levelDisplay: null,
  timerInterval: null,
  startButton: null,
  // and much more
  gameOver: true,
  cardsNumber:0,
  match:false,
  card1:null,
  cardCount:0,

};

setGame();

/*******************************************
/     game process
/******************************************/
function setGame() {
  game.gameBoard = document.querySelector('.game-board');
  game.timerDisplay = document.querySelector('.game-timer__bar');
  game.scoreDisplay = document.querySelector('.game-stats__score--value');
  game.levelDisplay = document.querySelector('.game-stats__level--value');
  game.startButton = document.querySelector('.game-stats__button');
  bindStartButton()
  // register any element in your game object
}


function startGame(){
  clearBoard();
  end=61;
  game.startButton.innerHTML = 'End Game';
  game.level = 1;
  game.score = 0;
  game.gameOver = false;
  game.levelDisplay.innerHTML = game.level;
  game.scoreDisplay.innerHTML = game.score;
  generateCards();
  updateTimerDisplay();
  bindCardClick();  
}

function clearBoard(){
  const {gameBoard} = game;
  while(gameBoard.firstChild){
    gameBoard.removeChild(gameBoard.firstChild);
  }
}

function generateCards(){
  const gameBoard = game.gameBoard;
  const gameSize = game.level*2;
  const cardsNumber = gameSize*gameSize;
  game.cardsNumber = cardsNumber;
  game.gameBoard.style["grid-template-columns"] = `repeat(${gameSize}, 1fr)`;
  const cards=[];
  for (let i = 0; i < cardsNumber / 2; i++) {
    const tech = CARD_TECHS[i%CARD_TECHS.length];
    const card = createCardElement(tech);
    cards.push(card);
    cards.unshift(card.cloneNode(true));
  }
  while(cards.length>0){
    const index = Math.floor(Math.random()*cards.length);
    const card = cards.splice(index,1)[0];
    gameBoard.appendChild(card);
  }
}
function createCardElement(tech){

  const node = document.createElement('div');
  const cardFront = document.createElement('div');
  const cardBack = document.createElement('div');
  node.classList.add('card',tech);
  cardFront.classList.add('card__face','card__face--front');
  cardBack.classList.add('card__face','card__face--back');
  node.dataset.tech = tech;
  node.appendChild(cardFront);
  node.appendChild(cardBack);
  return node;
}

function handleCardFlip() {
  if(game.match || game.gameOver){
    return;
  }
  //flip card back
  const currentCard = this;
  if(currentCard === game.card1){
    currentCard.classList.remove('card--flipped');
    game.card1= null;
    return;
  }
  //flip card
  currentCard.classList.add('card--flipped');
  //check
  if(game.card1){
    check(currentCard,game.card1);
    return;
  }
  game.card1 = currentCard;
}

function check(cardx,cardy){
  if(cardx.dataset.tech === cardy.dataset.tech){
    updateScore();
    unBindCardClick(cardx);
    unBindCardClick(cardy);
    game.card1 = null;
    game.timer += 2;
    game.cardCount += 2;
    if(game.cardCount === game.cardsNumber){
      nextLevel();
      game.cardCount = 0;
    }
  }else{
    game.checkMatching = true;
    setTimeout(()=>{
      cardx.classList.remove('card--flipped');
      cardy.classList.remove('card--flipped');
      game.card1= null;
      game.match = false;
    }, 1000);
  }
}

function nextLevel() {
  game.level+=1;
  game.levelDisplay.innerHTML=game.level;
  clearBoard();
  generateCards();
  bindCardClick();
  end=61;

}

function handleGameOver() {
  alert('Congratulations!\nYour final score is: ' + game.score);
  game.startButton.innerHTML = "Start Game";
  clearInterval(game.timerInterval);
  game.gameOver = true;
}

/*******************************************
/     UI update
/******************************************/


function updateScore() {
  game.score += game.level*2*end;
  document.getElementsByClassName("game-stats__score--value")[0].innerHTML = game.score;
}
function updateTimerDisplay() {
  if(end ==0){
    endGame();
  }else{
    end = end-1;
    document.getElementsByClassName("game-timer__bar")[0].innerHTML = end+"s";
    game.timerDisplay.style.width=end/60*100+"%";
    gametimer=setTimeout(function() {
      updateTimerDisplay()
  },1000)
  }

}

/*******************************************
/     bindings
/******************************************/
function bindStartButton() {
  game.startButton.addEventListener('click',function(event){
    gameOver = false;
    if(game.gameOver){
      startGame();
    }else{
      handleGameOver();
    }
  })
}


function unBindCardClick(card) {
  card.removeEventListener('click',handleCardFlip);
}

function bindCardClick() {
 let card = document.querySelectorAll(".card");
  for(let i = 0 ; i <card.length;i++){
    card[i].addEventListener('click',handleCardFlip)
  }
}
