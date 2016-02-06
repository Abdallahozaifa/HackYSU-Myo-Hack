/**
 * Created by yehyaawad on 2/6/16.
 */

////////////////////////////////
////    MYO POSE LOGGING    ////
////////////////////////////////

var log = function (msg) {
    var bod = document.getElementById("bodeh");
    var elem = document.createElement("h1");
    elem.innerHTML = msg;
    console.log(msg);
};

Myo.on('connected', function () {
    log("-- MYO CONNECTED --");
    this.streamEMG(true);
});

//Myo.connect('com.myojs.BehrendHack');
Myo.connect('com.myojs.emgGraphs');

var allPoses = ["fist", "fist_off", "fingers_spread", "fingers_spread_off", "wave_in", "wave_in_off",
    "wave_out", "wave_out_off", "wave_out_off", "double_tap_off", "double_tap"];

var poseHandlers = [];

function handlePose(k) {
    poseHandlers[i] = function () {
        log(allPoses[k] + " pose triggered");
    };

    Myo.on(allPoses[k], poseHandlers[k]);
}
for (var i = 0; i < allPoses.length; i += 1) {
    handlePose(i);
}

Myo.on('disconnect', function () {
    log("-- MYO DISCONNECTED --");
});

////////////////////////////////
////    MYO CONTROLS        ////
////////////////////////////////


///// LEVEL SELECTION /////

var difficultySelector = [pauseScreen.activateEasy, pauseScreen.activateMedium, pauseScreen.activateHard];

var selectedDifficultyIndex = 0; // 0 is easy, 1 is medium, 2 is hard

var goToNextLevel = function () {
    selectedDifficultyIndex = (selectedDifficultyIndex + 1) % difficultySelector.length;
    difficultySelector[selectedDifficultyIndex]();
};

var goToPrevLevel = function () {
    selectedDifficultyIndex = (selectedDifficultyIndex - 1);
    if (selectedDifficultyIndex < 0) selectedDifficultyIndex = difficultySelector.length - 1;
    difficultySelector[selectedDifficultyIndex]();
};

var completeLevelSelection = function () {
    pauseScreen.activateEscape();
};

Myo.on("fingers_spread", function () {
    completeLevelSelection();
});

Myo.on("wave_in", function () {
    goToNextLevel();
});

Myo.on("wave_out", function () {
    goToPrevLevel();
});

difficultySelector[selectedDifficultyIndex]();

///// PLAYER SELECTION /////

var LEFT_KEY = 37;
var RIGHT_KEY = 39;

var moveSelectorLeft = function(){
    chooser.moveLeft();
};

var moveSelectorRight = function () {
    chooser.moveRight();
};

Myo.on("wave_in", function () {
    moveSelectorLeft();
});

Myo.on("wave_out", function () {
    moveSelectorRight();
});


///// PLAYER MOVEMENT /////

var movePlayerLeft = function(){
    player.moveLeft();
};

var movePlayerRight = function(){
    player.moveRight();
};
Myo.on("wave_in", function () {
    movePlayerLeft();
});

Myo.on("wave_out", function () {
    movePlayerRight();
});

Myo.on("double_tap", function () {
    chooser.activateEnter();
});

///// Orientation debug //////

var injectDebugData = function (elemID, str) {
    var elem = document.getElementById(elemID);
    elem.innerHTML = str;
};

Myo.on("orientation", function (data) {
    injectDebugData("orientation-X", data.x);
    injectDebugData("orientation-Y", data.y);
    injectDebugData("orientation-Z", data.z);
    injectDebugData("orientation-W", data.w);
});
