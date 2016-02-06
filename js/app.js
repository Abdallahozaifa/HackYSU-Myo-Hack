//screen object that the pause and start screen inherit from
var Screen = function(){
    this.alpha = 1;
};

// renders the black transparent cover of the canvas
Screen.prototype.renderOverLay = function(){
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = 'black';
    ctx.fillRect(10, 60, ctx.canvas.width - 20, ctx.canvas.height - 100);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 60, ctx.canvas.width - 20, ctx.canvas.height - 100);
};

// draws a title on the canvas
Screen.prototype.drawTitle = function(title, x, y) {
    ctx.textAlign = 'center';
    ctx.font = '30pt Nunito, sans-serif';
    ctx.fillStyle = 'green';
    // put a shadow behind the title text
    ctx.fillText(title, x+3, y+3);
    ctx.fillStyle = 'white';
    ctx.fillText(title, x, y);
};

// pause screen
var PauseScreen = function(){
    this.alpha = 0.70;
    this.easy = false;
    this.medium = false;
    this.difficult = false;
};

// short hand notation for javascript inheritance
var inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};

// determines wether the game is still on the start screen or not
var startScreenMode = true;

// start screen 
var StartScreen = function(){
    this.alpha = 0.90;
};

inheritsFrom(PauseScreen,Screen); // Pause Screen inherits from Screen 
inheritsFrom(StartScreen, PauseScreen); // Start Screen inherits from Pause Screen

// The three game modes
var easyMode = false;
var mediumMode = false;
var difficultMode = false;

// takes in a game mode being easy, medium, hard and toggles the opposite and returns that value
PauseScreen.prototype.toggleGameMode = function(mode){
    mode = !mode;
    return mode;
};

// renders the pause screen and start screen on the canvas
PauseScreen.prototype.render = function() { 
        this.renderOverLay();
        this.drawTitle('GAME RULES', ctx.canvas.width/2, 100);
        this.drawGameRules();
        //gameProperties.drawCharacterSelect(21, 115, 90);
        this.drawTitle('GAME MODES', ctx.canvas.width/2, 330); 
        this.drawGameModeText('../static/images/1-icon.png', 'Easy', easyMode, 360);
        this.drawGameModeText('../static/images/2-icon.png', 'Medium', mediumMode, 430);
        this.drawGameModeText('../static/images/3-icon.png', 'Difficult', difficultMode, 500);
        this.drawEscapeMessage(595);
        //this.drawCreation(595);
};

//draws the game text on the pause and start screen
PauseScreen.prototype.drawGameModeText = function(image, modeText, isOn, y) {
    ctx.font = '700 25pt Nunito, sans-serif';
    ctx.textAlign = 'left';

    var gameModeText = modeText;
    if(isOn) {
        // if the game mode is enabled and colour text green
        ctx.fillStyle = 'green';
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 2;
        if(easyMode === true){
            ctx.strokeRect(ctx.canvas.width/2 - 90, 365, 220, 50);
        }else if(mediumMode === true){
            ctx.strokeRect(ctx.canvas.width/2 - 90, 433, 220, 50);
        }else{
            ctx.strokeRect(ctx.canvas.width/2 - 90, 501, 220, 50);
        }
    }
    else {
        // if the game mode is disabled and colour text red
        ctx.fillStyle = 'red';
    } 
    ctx.drawImage(Resources.get(image), ctx.canvas.width/2-170, y-5);
    ctx.fillText(gameModeText, ctx.canvas.width/2-80, y + 40);
};

// draws the escape method on the bottom of the pause and start screen
PauseScreen.prototype.drawEscapeMessage = function(y) {
    ctx.fillStyle = 'white';
    ctx.font = '700 25pt Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Press       to play game', ctx.canvas.width/2+20, y+20);
    ctx.drawImage(Resources.get('../static/images/esc-icon-lower.png'), ctx.canvas.width/2 - 55, y-10);
};

// draws the game rules on the pause and start screen
PauseScreen.prototype.drawGameRules = function(){
    ctx.fillStyle = 'white';
    ctx.font = '700 25pt Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("Use the arrow keys to move the player",ctx.canvas.width/2+30, 160);
    ctx.drawImage(Resources.get('../static/images/arrow-up-icon-lower.png'),ctx.canvas.width/2,190);
    ctx.drawImage(Resources.get('../static/images/arrow-down-icon-lower.png'),ctx.canvas.width/2,230);
    ctx.drawImage(Resources.get('../static/images/arrow-left-icon-lower.png'),ctx.canvas.width/2-46,208);
    ctx.drawImage(Resources.get('../static/images/arrow-right-icon-lower.png'),ctx.canvas.width/2+46,208);
};

// event handler for the pause screen
PauseScreen.prototype.handleInput = function(key){
    if(key === 'esc'){
        this.activateEscape();
    // when 1 is pressed it toggles the easy mode on and all others off
    }else if(key === '1'){
        this.activateEasy();
    // when 2 is pressed it toggles the medium mode on and all others off     
    }else if(key === '2'){
        this.activateMedium();
    // when 3 is pressed it toggles the hard mode on and all others off
    }else if(key === '3'){
        this.activateHard();
    }
};

PauseScreen.prototype.activateEasy = function(){
    mediumMode = false;
    difficultMode = false;
    easyMode = true;
};

PauseScreen.prototype.activateMedium = function(){
    easyMode = false;
    difficultMode = false;
    mediumMode = true;
};

PauseScreen.prototype.activateHard = function(){
    easyMode = false;
    mediumMode = false;
    difficultMode = true;
};

PauseScreen.prototype.activateEscape = function(){
    //if the user doesn't choose a game mode display an error message with sweet alert
        if(easyMode === false && mediumMode === false && difficultMode === false){
            swal("Oops!", "Please choose a game mode to play!", "error");
        // once the user leaves the start screen with a chosen mode turn off the start screen
        }else if(easyMode === true || mediumMode === true || difficultMode === true){
            startScreenMode = !startScreenMode;
        }
        //when game is on and the user presses esc it pauses the game
        if(gameProperties.gamePaused === true){
            gameProperties.gamePaused = !gameProperties.gamePaused;
        }
};

// game properties object that notifies other objects when the game is paused
var GameProperties = function(){
    this.gamePaused = false;
};

var BLOCK_SIZE_X = 101, // x length of each block
    BLOCK_SIZE_Y = 80, // y length of each block 

    // All the characters
    characters = [
    '../static/images/char-boy.png', 
    '../static/images/char-cat-girl.png', 
    '../static/images/char-horn-girl.png', 
    '../static/images/char-pink-girl.png',
    '../static/images/char-princess-girl.png'
    ],
    // All the different colored bugs
    enemies = [
    '../static/images/enemy-bug.png',
    '../static/images/enemy-bug-blue.png',
    '../static/images/enemy-bug-purple.png',
    '../static/images/enemy-bug-yellow.png',
    '../static/images/enemy-bug-green.png'
    ];

// Chooser object is for the character selector.
var Chooser = function() {
    this.sprite = '../static/images/Selector.png';
    this.x = 503;
    this.y = 220;
};

// For Rendering the selector image.
Chooser.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//determines weather a player is selected 
var playerSelected = false;

// outputs this to the player through sweet alert message
var rule1 = "<ol style='color:#0099ff'><span style='font-size:20px'><li>1. Obtain all 5 keys and be careful!</li><br/><br/>";
var rule2 = "<li>2. Proceed to the hidden door!</li><br/><br/>";
var rule3 = "<li>3. Avoid touching a bug or water!</li><br>";
var rule4 = "<li>4. You can gain a life every 3 levels!</li></span></ol>";
var rules = rule1 + rule2 + rule3 + rule4;

// contains weather the game is started or not
var gameStarted = false;

// event handler for the chooser when they select a character
Chooser.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
            this.moveLeft();
            break;
        case 'right':
            this.moveRight();
            break;
        case 'enter':
            this.activateEnter();
            break;
    }
};

//obtains the highlighted character
Chooser.prototype.characterHighlighted = function(){
    return chooseEntity(Math.floor(this.x / BLOCK_SIZE_X) - 1, characters);
};

Chooser.prototype.moveLeft = function () {
    if (startScreenMode === false && gameStarted === false) {
        if (this.x < 350) {
            this.x = this.x;
        } else {
            this.x = this.x - BLOCK_SIZE_X;
        }
    }
};

Chooser.prototype.moveRight = function () {
    if (startScreenMode === false && gameStarted === false) {
        if (this.x > 350 * 2) {
            this.x = this.x;
        } else {
            this.x = this.x + BLOCK_SIZE_X;
        }
    }
};

Chooser.prototype.activateEnter = function () {
    if (startScreenMode === false && gameStarted === false) {
        gameStarted = true;
        swal({
            title: "",
            text: rules,
            html: true,
            timer: 4000,
            imageUrl: "../static/images/objective.png",
            showConfirmButton: false,

        });
        setTimeout(function () {
            playerSelected = true;
        }, 4000);
    }
};

/* ENEMY CLASS */
// Enemies our player must avoid
var enemyLowestSpeed = 300, enemyHighestSpeed = 700;
var Enemy = function() {
    this.xRange = [-150,1050];
    this.yStartPos = [60,140,220];
    this.sprite = this.randomBug();
    this.startPos = this.xRange[0]; 
    this.maxPos = this.xRange[1];
    this.reset();
};

Enemy.prototype.update = function(dt) {
// multiplying by the dt parameter ensures that the game runs at the same speed for all computers
    // renders a different enemy speed for each game mode
    if(easyMode === true){
        enemyLowestSpeed = 300;
        enemyHighestSpeed = 400;
    }else if(mediumMode === true){
        enemyLowestSpeed = 400;
        enemyHighestSpeed = 700;
    }else if(difficultMode === true){
        enemyLowestSpeed = 600;
        enemyHighestSpeed = 900;
    }
    // speed at which the bug moves, without dt the bugs move impossibly fast
    this.x += this.speed * dt;

    //once the enemy leaves the field
    if(this.x >= this.maxPos){
        this.reset();
    }
};

//choses a random colored bug 
Enemy.prototype.randomBug = function(){
    return chooseEntity(Math.floor(Math.random()*6), enemies);
};

// resets the enemy back to the start position with a random speed
Enemy.prototype.reset = function(){
    this.sprite = this.randomBug();
    this.x = this.startPos;
    this.y = this.getRandomEnemy();
    this.speed  = this.getSpeed(enemyLowestSpeed, enemyHighestSpeed);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//gets a random enemy used during the reset
Enemy.prototype.getRandomEnemy = function(){
    return this.yStartPos[Math.floor(Math.random() * 3)];
};

//gets a random speed between 200 and 600
Enemy.prototype.getSpeed = function(minEnemySpeed, maxEnemySpeed){
    return Math.floor(Math.random()*(maxEnemySpeed - minEnemySpeed + 1)) + minEnemySpeed;
};

/* PLAYER CLASS */
// The user will control this player
var heart = '<img src = "../static/images/heart.png">';
var key = '<img src = "../static/images/Key.png">';
var Player = function(){
    this.xRange = [0, 1100];
    this.yRange = [-20, 480];
    this.sprite = '../static/images/char-boy.png';
    this.rotation = 0; // radians, spins player after being hit
    this.lives = [heart, heart, heart, heart];
    this.keys = [];
    this.level = 1;
    this.reset();
};

//keytaken variables that stores if the key is taken or not
var keyOneTaken = false, keyTwoTaken = false;
     keyThreeTaken = false, keyFourTaken = false, keyFiveTaken = false;

//update method that updates the field every instance invoked in engine.js
var gameOverVal = false;
Player.prototype.update = function(){
    this.checkCollisions(); // checks that the player doesn't run into the enemy
    document.getElementsByClassName('score')[0].innerHTML = 'Score:  ' + totalScore;
    document.getElementsByClassName('level')[0].innerHTML = 'Level: ' + this.level;
    document.getElementsByClassName('keys')[0].innerHTML = 'Keys:  ' + this.keys.join("");
    document.getElementsByClassName('lives')[0].innerHTML = 'Lives:  ' + this.lives.join("");
};

// if the players position is the same as the gems
Player.prototype.gemEquals = function(x,y){
    if (player.x === x && player.y === y) {
        return true;
    }
    return false;
};

// obtains the selected player image
var chooseEntity = function(characterSelected, array){
    var character;
    switch (characterSelected) {
        case 1:
            character = array[0];
            break;
        case 2:
            character = array[1];
            break;
        case 3:
            character = array[2];
            break;
        case 4:
            character = array[3];
            break;
        case 5:
            character = array[4];
            break;
        default:
            character = array[0];
            break;
    }
    return character;
};

// renders the player image on the field starting from the starting position
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

        
//handles what happens when the user presses the keys
Player.prototype.handleInput = function(key){
    if (key === 'left') {
        this.moveLeft();
    } else if (key === 'right') {
        this.moveRight();
    } else if (key === 'up') {
        this.moveUp();
    } else if (key === 'down') {
        this.moveDown();
    } else if(key === 'esc'){
        gameProperties.gamePaused = !gameProperties.gamePaused;
    }

    // var coords = this.printCoordinates();
    // console.log(coords);
};

Player.prototype.moveLeft = function(){
    if (gameStarted === true) {
        movePlayerOnePixel();
        this.x -= (this.x - 99 < this.xRange[0]) ? 0 : 101;
    }
};

Player.prototype.moveRight = function(){
    if (gameStarted === true) {
        movePlayerOnePixel();
        this.x += (this.x + 101 > this.xRange[1]) ? 0 : 101;
    }
};

Player.prototype.moveUp = function(){
    movePlayerOnePixel();
    this.y -= (this.y - 80 < this.yRange[0]) ? 0 : 80;
};

Player.prototype.moveDown = function(){
    movePlayerOnePixel();
    this.y += (this.y + 80 > this.yRange[1]) ? 0 : 80;
};

// the player was moved one pixel in the engine.js file to prevent from adding to the total score multiple times
var movePlayerOnePixel = function(){
    if(player.y === -20){
        player.x -=1;
    }
    if(player.gemEquals((blueGem.x)+1, blueGem.y)){
        player.x-=1;     
    }
    if(player.gemEquals((greenGem.x)+1, greenGem.y)){
        player.x-=1;
    }
    if(player.gemEquals((orangeGem.x)+1, orangeGem.y)){
        player.x-=1;
    }
    if(player.gemEquals((heartItem.x)+1, heartItem.y)){
        player.x-=1;
    }
};

// checks to see if the player
Player.prototype.checkCollisions = function(){
    //prohibits the player from touching the water
    this.prohibitWater();
    // prevents player from crossing the boundary of the game
    if(this.y === -15){
        this.reset();
    }

    // player is on the roads with the enemies
    else if(this.y >= 60 && this.y <=220){
        var thisPlayer = this;
        allEnemies.forEach(function(enemy){
            // when the player reaches the same row as the enemy
            if(enemy.y === thisPlayer.y){
                //when the player touches the enemy 
                if(enemy.x >= player.x - 75 && enemy.x<= player.x+30){
                    thisPlayer.reset();
                }
            }
        });
    }
};

// prohibits the player from touching the water
Player.prototype.prohibitWater = function(){
    if(this.x === -2 && this.y === -20){
        this.reset();
    }else if(this.x === 200 && this.y === -20){
        this.reset();
    }else if(this.x === 402 && this.y === -20){
        this.reset();
    }else if(this.x === 604 && this.y === -20){
        this.reset();
    }else if(this.x === 806 && this.y === -20){
        this.reset();
    }else if(this.x === 1008 && this.y === -20){
        this.reset();
    }
};

// total score variable
var totalScore = 0;

// resets the player back to the starting position
Player.prototype.reset = function(){
    this.x = 503;
    this.y = 380;
    this.lives.pop();
};

// formatter method for the coordinates
Player.prototype.sprintf = function(){
    var args = arguments,
    string = args[0],
    i = 1;
    return string.replace(/%((%)|s|d)/g, function (m) {
        // m is the matched format, e.g. %s, %d
        var val = null;
        if (m[2]) {
            val = m[2];
        } else {
            val = args[i];
            // A switch statement so that the formatter can be extended. Default is %s
            switch (m) {
                case '%d':
                    val = parseFloat(val);
                    if (isNaN(val)) {
                        val = 0;
                    }
                    break;
            }
            i++;
        }
        return val;
    });
};

// prints the coordinates for testing purposes
Player.prototype.printCoordinates = function() {
    var x = this.x;
    var y = this.y;
    return this.sprintf('(%d,%d)',x,y);
};

//Game objects!
var player = new Player();
var startScreen = new StartScreen();
var chooser = new Chooser();
var gameProperties = new GameProperties();
var pauseScreen = new PauseScreen();
var allEnemies = [new Enemy(),new Enemy(), new Enemy(),new Enemy(), new Enemy(), new Enemy()];
//var allEnemies = [];

// registers a lister to listen for keys
document.addEventListener('keyup', function(e){
    var allowedKeys = {
        13: 'enter',
        27: 'esc',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        49: '1',
        50: '2',
        51: '3'
    };

    // the player can move after a player is selected and the game is not paused, they didn't quit, and the game is not proceeding to the next level
    if(playerSelected && gameProperties.gamePaused === false && quitMode === false && leveledUp === false){
        player.handleInput(allowedKeys[e.keyCode]);
    }else{
        // when the game is paused this handler handles the buttons pressed
        pauseScreen.handleInput(allowedKeys[e.keyCode]);
    }
    /* when the start screen is turned and the game is not started the selector handler is activated giving the ability 
     select a character */
    if(startScreenMode === false  && gameStarted === false){ 
        chooser.handleInput(allowedKeys[e.keyCode]);
    }
});
