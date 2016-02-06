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

var firstDoubleTap = true;

Myo.on("double_tap", function () {
    if (firstDoubleTap) {
        Myo.myos[0].zeroOrientation();
        firstDoubleTap = false;
    }
    chooser.activateEnter();
});

///// Orientation debug //////

var injectDebugData = function (elemID, str) {
    var elem = document.getElementById(elemID);
    elem.innerHTML = str.substring(0, 10);
};

var getDebugData = function (elemID) {
    var elem = document.getElementById(elemID);
    return elem.innerHTML;
};

Myo.on("orientation", function (data) {
    injectDebugData("orientation-X", "X: " + data.x);
    injectDebugData("orientation-Y", "Y: " + data.y);
    injectDebugData("orientation-Z", "Z: " + data.z);
    injectDebugData("orientation-W", "W: " + data.w);
    saveRanges(data);
});

var Xmin = 5;
var Xmax = -5;
var Ymin = 5;
var Ymax = -5;
var Zmin = 5;
var Zmax = -5;
var Wmin = 5;
var Wmax = -5;

var shiftDown = false;
var printRanges = false;
var saveRanges = function (data) {
    if (shiftDown) {
        printRanges = true;
        // record mins maxes
        if (data.x > Xmax) Xmax = data.x;
        if (data.x < Xmin) Xmin = data.x;
        if (data.y > Ymax) Ymax = data.y;
        if (data.y < Ymin) Xmin = data.y;
        if (data.z > Zmax) Zmax = data.z;
        if (data.z < Zmin) Zmin = data.z;
        if (data.w > Wmax) Wmax = data.w;
        if (data.w < Wmin) Wmin = data.w;
    } else {
        if (printRanges) {
            //console.log(JSON.stringify(X));
            //console.log(JSON.stringify(Y));
            //console.log(JSON.stringify(Z));
            //console.log(JSON.stringify(W));
            printRanges = false;
        }
        Xmin = 5;
        Xmax = -5;
        Ymin = 5;
        Ymax = -5;
        Zmin = 5;
        Zmax = -5;
        Wmin = 5;
        Wmax = -5;
    }
};

var checkShift = function (fn, self) {
    return function (event) {
        if (event.shiftKey) {
            shiftDown = true;
            //console.log(getDebugData("orientation-X"));
            //console.log(getDebugData("orientation-Y"));
            //console.log(getDebugData("orientation-Z"));
            //console.log(getDebugData("orientation-W"));
            console.log("-----");
        } else {
            shiftDown = false;
        }
        return true;
    };
};

$(document).on('keydown', checkShift(this.enterMode, this));
$(document).on('keyup', function () {
    shiftDown = false;
    console.log("X min: " + Xmin);
    console.log(" X max: " + Xmax);
    console.log("Y min: " + Ymin);
    console.log(" Y max: " + Ymax);
    console.log("Z min: " + Zmin);
    console.log(" Z max: " + Zmax);
    console.log("W min: " + Wmin);
    console.log(" W max: " + Wmax);
    Xmin = 5;
    Xmax = -5;
    Ymin = 5;
    Ymax = -5;
    Zmin = 5;
    Zmax = -5;
    Wmin = 5;
    Wmax = -5;
});
