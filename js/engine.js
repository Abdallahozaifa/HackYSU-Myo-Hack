/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */
var quitMode = false;
var leveledUp = false;
var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * created the canvas element, grabed the 2D context for that canvas
     * set the canvas elements height/width and added it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width =  document.documentElement.clientWidth-744;
    canvas.height = document.documentElement.clientHeight-300;
    doc.body.appendChild(canvas);

    /* Testing audio, and still looking for good game audio
    var audio = document.getElementsByTagName("audio")[0];
    audio.play();*/
    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if this game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Below the update/render functions are called, and passed along is the time delta to
         * our update function since it may be used for smooth animation.
         */

        
        // if the player is not selected render the characters screen
        if(playerSelected === false){
            renderCharacterChooser();

            // only render the start screen when the start screen mode is on
            if(startScreenMode === true){
                startScreen.render();
            }

            //changes the players image according to the users selection
            playerChanger();

            // stores that image
            currentPlayerSprite = playerChanger();

        }else{

            // allow the bugs to move if the game isn't over
            if(quitMode === false){
                update(dt);
            }
            render(); // render the playing field

            // renders the keys on the field unless the game is paused so the keys do not overlap the pause screen
            if(gameProperties.gamePaused === false){
                renderKeys();
            }
            player.sprite = currentPlayerSprite;

            // once the player loses all their lives call the gameOver method and stop the game
            if(player.lives < 1){
                gameOver();
                window.quitMode = true;
            }
        }
        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    // contains the current players image
    var currentPlayerSprite;

    // changes the player to which ever player is highlighted
    var playerChanger = function(){
        player.sprite = chooser.characterHighlighted();
        return player.sprite;
    }

    
    // outputs a game over message and asks the user if they want to continue
    var gameOver = function(){
        swal({
            title: "Game Over!",
            text: "Ready to give it another try?",
            imageUrl: '../static/images/sad.jpeg',
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Play again!",
            cancelButtonText: "No",
            closeOnConfirm: false,
            closeOnCancel: false
        },

        //handles what happens with each user choice
        function(isConfirm){
            if(isConfirm){
                // if the user wants to play again out put this message
                swal({
                    title: "On your Marks, Get Set, Go!",
                    text: "Good Luck!",
                    imageUrl: '../static/images/go.jpg',
                    timer: 1500,
                    showConfirmButton: false
                });
                //delay the bugs from moving until after the message above disappears
                setTimeout(function(){
                    window.quitMode = false;
                },1500);
                reset(); // resets the players lives, keys, position, and level
            }else{
                window.quitMode = true; 
                swal({
                    title: "Thank You For Playing!",
                    imageUrl: "../static/images/smile.jpg",
                    showConfirmButton: false
                });                      
                window.setTimeout(function(){
                    window.location.reload();
                },2000);
                player.lives.push(heart);
            }
        });
    };
        /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();

    }

    /* This function is called by main (the game loop) and itself calls all
     * of the functions which may need to update entity's data. 
     */
    function update(dt) {
        updateEntities(dt);
    }

    /* This is called by the update function and loops through all of the
     * objects within the allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for the
     * player object. These update methods focus purely on updating
     * the data/properties related to the object. 
     */
    function updateEntities(dt) {

        // stop the bugs and player from moving during the pause screen
        if(gameProperties.gamePaused === false){
            allEnemies.forEach(function(enemy) {
                enemy.update(dt);
            });
            player.update();
        }
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. This function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */

    
     //arrays with images for the gameboard 
     var rowImages = [
                '../static/images/water-block.png',   // Top row is water
                '../static/images/stone-block.png',   // Row 1 of 3 of stone
                '../static/images/stone-block.png',   // Row 2 of 3 of stone
                '../static/images/stone-block.png',   // Row 3 of 3 of stone
                '../static/images/grass-block.png',   // Row 1 of 2 of grass
                '../static/images/grass-block.png',
                '../static/images/grass-block.png'    // Row 2 of 2 of grass
            ],
            otherRowImages = [
                '../static/images/grass-block.png',
                '../static/images/stone-block.png',   // Top row is water   // Row 1 of 3 of stone
                '../static/images/stone-block.png',   // Row 2 of 3 of stone
                '../static/images/stone-block.png',   // Row 3 of 3 of stone
                '../static/images/grass-block.png',   // Row 1 of 2 of grass
                '../static/images/grass-block.png',
                '../static/images/grass-block.png'    // Row 2 of 2 of grass
            ];

    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        
            var numRows = 7,
            numCols = 18,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                 var image;
                 if(col % 2 == 0){
                    image = rowImages[row];
                 }else if(col % 2 !=0){
                    image = otherRowImages[row];
                 }
                ctx.drawImage(Resources.get(image), col * 101, row * 83);
            }
        }

        // renders the door when all keys are obtained    
        renderDoor();

        // repaints the key columns after each key is obtained
        repaintKeyCol(99);
        repaintKeyCol(301);
        repaintKeyCol(503);
        repaintKeyCol(705);
        repaintKeyCol(907);

        // renders the keys on the field
        renderKeys();

        // renders the entities such as the bugs and the player
        renderEntities();

        // when the user request to pause the screen render the pause screen 
        if(gameProperties.gamePaused === true) {
            pauseScreen.render();
        }

        // renders the gems on the field    
        renderGems();

        // renders the points for each gem
        renderGemPoints();
    }

    // Function for generate random position of the gem.
    var gemPosition = function() {
        this.x = (Math.floor(Math.random() * 11) * BLOCK_SIZE_X)-2;
        var randY = Math.floor(Math.random() * 6);
        // continue to generate a new random y value so that a gem isn't placed on the player's row
        while(randY === 4){
            randY = Math.floor(Math.random() * 6);
        }
        this.y = (randY * BLOCK_SIZE_Y) + 60;
    }

    //global gem and heart variables to notify the player handle input
    window.blueGem = new gemPosition(); 
    window.orangeGem = new gemPosition(); 
    window.greenGem = new gemPosition();
    window.heartItem = new gemPosition();

    // variables to know when each gem is taken to notify the repaint method
    var blueGemTaken = false, greenGemTaken = false, orangeGemTaken = false, heartItemTaken = false;

    //renders the gems on the field as long as they are not already taken and the pause screen is not on 
    //so it doesn't interfere with the pause screen
    var renderGems = function(){
        if(playerSelected === true && gameProperties.gamePaused === false){
            if(blueGemTaken === false){
                ctx.drawImage(Resources.get('../static/images/blueGem.png'), blueGem.x, blueGem.y);
            }
            if(greenGemTaken === false){
                ctx.drawImage(Resources.get('../static/images/greenGem.png'), greenGem.x, greenGem.y);
            }
            if(orangeGemTaken === false){
                ctx.drawImage(Resources.get('../static/images/orangeGem.png'), orangeGem.x, orangeGem.y);
            }
            preventHeart();
            if(heartItemTaken === false){
                ctx.drawImage(Resources.get('../static/images/heart.png'), heartItem.x, heartItem.y);
            }
        }
    }

    //only allows the heart to appear every 3 levels
    var preventHeart = function(){
        if(player.level % 3 != 0){
            heartItemTaken = true;
        }
    }

    // adds 100 points for each gem then removes it from the field after shifting the players x position to 
    //remove adding 100 mulitple times
    var removeGem = function(){
        totalScore+=100;
        player.x+=1;
        repaintGemCol(player.x);
    }

    //renders the points for the gems then removes them from the field with repaint
    var renderGemPoints = function(){
        if(player.gemEquals(blueGem.x, blueGem.y) && blueGemTaken === false){
            blueGemTaken = true;
            removeGem();      
        }
        if(player.gemEquals(greenGem.x, greenGem.y) && greenGemTaken === false){
            removeGem();
            greenGemTaken = true;
        }
        if(player.gemEquals(orangeGem.x, orangeGem.y) && orangeGemTaken === false){
            removeGem();
            orangeGemTaken = true;
        }
        if(player.gemEquals(heartItem.x, heartItem.y) && heartItemTaken === false){
            player.lives.push(heart);
            player.x+=1;
            repaintGemCol(player.x);
            heartItemTaken = true;
        }    
    }

    // renders the doors only when all the keys are taken
    var renderDoor = function(){
        if(keyOneTaken === true && keyTwoTaken === true && keyThreeTaken === true && keyFourTaken === true && keyFiveTaken === true){
            ctx.drawImage(Resources.get('../static/images/door.png'), 503, -60);
            finishLevel();
        }    
    }
    
    // After you finish the level the game updates the field, the player, and the keys
    var finishLevel = function(){
        if(player.x === 503 && player.y === -20){
            player.level++; // proceed to the next level
            swal({
                title: "Great job!",
                text: "Now on to level " + player.level + "!",
                type: "success",
                timer: 2000,
                showConfirmButton: false
            });
            //returns the keys, gems, and player in the playfield
            returnItems();
            window.leveledUp = true; // proceeded to the next level
            newGems(); // randomize the location of the new gems
            // reset the player back to the original location of the game
            player.x = 503;
            player.y = 380;
            player.keys.length = 0; // reset the keys to 0
            setTimeout(function(){
                window.leveledUp = false;
            },2000);
        }
    }

    // generates new gems and a heart for each level or gameover
    var newGems = function(){
        window.blueGem = new gemPosition(); 
        window.orangeGem = new gemPosition(); 
        window.greenGem = new gemPosition();
        window.heartItem = new gemPosition();
    }
    //renders the keys on the playing field as long as they are not already taken
    var renderKeys = function(){
        if(keyOneTaken === false){
            ctx.drawImage(Resources.get('../static/images/Key.png'), 101, -35);
        }
        if(keyTwoTaken === false){
            ctx.drawImage(Resources.get('../static/images/Key.png'), 303, -35);
        }
        if(keyThreeTaken === false){
            ctx.fillStyle = 'black';
            ctx.fillRect(500,-20, 115, 70);
            ctx.drawImage(Resources.get('../static/images/Key.png'), 505, -35);
        }
        if(keyFourTaken === false){
            ctx.drawImage(Resources.get('../static/images/Key.png'), 707, -35);
        }
        if(keyFiveTaken === false){
            ctx.drawImage(Resources.get('../static/images/Key.png'), 909, -35);
        }
    }

    // determines which key is taken and sets that to true so that it is removed from the field
    var removeKeys = function(key){
        if(key === 99){
            keyOneTaken = true;
        }else if(key === 301){
            keyTwoTaken = true;
        }else if(key === 503){
            keyThreeTaken = true;
        }else if(key === 705){
            keyFourTaken = true;
        }else if(key === 907){
            keyFiveTaken = true;
        }
    }
    
    // Adds points only when the key is there and the player arrives at the spot 
    var addPointsForKeys = function(playerX,keyFound,keyTaken){
        if(playerX === keyFound && keyTaken === false){
            totalScore+=100; // adds 100 points for each key
            player.keys.push(key); // adds keys to player keys array
        }
    }

    // All the possible key points
    var addPoints = function(x){
            addPointsForKeys(x,99,keyOneTaken);
            addPointsForKeys(x,301, keyTwoTaken);
            addPointsForKeys(x,503, keyThreeTaken);
            addPointsForKeys(x,705,keyFourTaken);
            addPointsForKeys(x,907,keyFiveTaken);
    }

    //repaints the key column that player touches to make it appear that the key disappears 
    var repaintKeyCol = function(x){     
        if(player.x === x && player.y === -20){
            addPoints(x);
            removeKeys(x);
            x+=2;
            // repaints the key column
            for (row = 0; row < 7; row++){
                ctx.drawImage(Resources.get(otherRowImages[row]), x, row * 83);
            }
            ctx.fillStyle = 'black';
            ctx.fillRect(x,-20, 90, 70); // paints a black square for the top of the key
            player.x +=1; // moves the players position by one pixel so the score doesn't continue to add 100 points
        }
    }

    // repaints the gem column starting from the row after the keys
    var repaintGemCol = function(x){
        x+=1;
        for (row = 1; row < 7; row++){
                ctx.drawImage(Resources.get(otherRowImages[row]), x, row * 83);
        }
    }

    // Renders The character chooser screen.
    function renderCharacterChooser() {
        render();    
        chooser.render();
        ctx.drawImage(Resources.get('../static/images/char-boy.png'), 300, 220);
        ctx.drawImage(Resources.get('../static/images/char-cat-girl.png'), 401, 220);
        ctx.drawImage(Resources.get('../static/images/char-horn-girl.png'), 502, 220);
        ctx.drawImage(Resources.get('../static/images/char-pink-girl.png'), 603, 220);
        ctx.drawImage(Resources.get('../static/images/char-princess-girl.png'), 704, 220);
        ctx.fillStyle = "#000000";
        ctx.font = "30px Courier New";
        var text = "Choose a character with the arrow keys and press enter!";
        ctx.fillText(text, 540, 250);     
    }
    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions that are defined
     * on the enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loops through all of the objects within the allEnemies array and calls
         * the render function that is defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        player.render();
    }

    // returns the keys, gems, and heart to false in order for them to be placed back on to the field
    var returnItems = function(){
        keyOneTaken = false;
        keyTwoTaken = false;
        keyThreeTaken = false;
        keyFourTaken = false;
        keyFiveTaken = false;
        blueGemTaken = false;
        greenGemTaken = false;
        orangeGemTaken = false;
        heartItemTaken = false;
    }

    /* Resets the total score back to 0
     * Resets the player
     * Resets the playingfield with the keys
     */
    function reset() {
        totalScore = 0;
        player = new Player();
        playerChanger();
        returnItems();
        newGems();
    }

    /*loads all of the images we know we're going to need to
     * draw our game level. Then sets init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        '../static/images/stone-block.png',
        '../static/images/water-block.png',
        '../static/images/grass-block.png',
        '../static/images/enemy-bug.png',
        '../static/images/char-boy.png',
        '../static/images/char-cat-girl.png',
        '../static/images/char-horn-girl.png',
        '../static/images/char-pink-girl.png',
        '../static/images/char-princess-girl.png',
        '../static/images/Selector.png',
        '../static/images/p-icon.png',
        '../static/images/enemy-bug-blue.png',
        '../static/images/enemy-bug-purple.png',
        '../static/images/enemy-bug-yellow.png',
        '../static/images/enemy-bug-green.png',
        '../static/images/Star.png',
        '../static/images/esc-icon-lower.png',
        '../static/images/arrow-up-icon-lower.png',
        '../static/images/arrow-down-icon-lower.png',
        '../static/images/arrow-left-icon-lower.png',
        '../static/images/arrow-right-icon-lower.png',
        '../static/images/1-icon.png',
        '../static/images/2-icon.png',
        '../static/images/3-icon.png',
        '../static/images/Key.png',
        '../static/images/door.png',
        '../static/images/heart.png',
        '../static/images/blueGem.png',
        '../static/images/orangeGem.png',
        '../static/images/greenGem.png',
        '../static/images/objective.png'
    ]);
    Resources.onReady(init);

    /* Assigns the canvas' context object to the global variable (the window
     * object when run in a browser) so that I can use it more easily
     * from within app.js files.
     */
    global.ctx = ctx;
    global.init = init;
})(this);
