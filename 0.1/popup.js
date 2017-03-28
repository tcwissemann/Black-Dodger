/* global $, ctx, gameCanvas, image*/
//Main variables
var ship;
var asteroid;
var score;

//Functions of main variables and components
function start() {
    // this is run by the html at <body onload="start()">
    gameCanvas.start();
    ship     = new component(15, 15, "black", 100, 100);
    asteroid = new component(25, 25, "gray", 0, 0);
    score = new component("24px", "consolas", "black", 315, 40, "text");
    
}

var gameCanvas = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameCanvas, 20);
        window.addEventListener('keydown', function (e) {
            e.preventDefault();
            gameCanvas.keys = (gameCanvas.keys || []);
            gameCanvas.keys[e.keyCode] = (e.type == "keydown");
        });
        window.addEventListener('keyup', function (e) {
            gameCanvas.keys[e.keyCode] = (e.type == "keydown");
        });
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
};

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.angle = 0; 
    this.moveAngle = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = gameCanvas.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else { 
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.fillStyle = color;
            ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
            ctx.restore();
        }
    };
    this.newPos = function() {
        this.angle += this.moveAngle * Math.PI / 180;
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    };
    this.crash = function(obj) {
        var left = this.x;
        var right = this.x + (this.width);
        var top = this.y;
        var bottom = this.y + (this.height);
        var left2 = obj.x;
        var right2 = obj.x + (obj.width);
        var top2 = obj.y;
        var bottom2 = obj.y + (obj.height);
        var crash = true;
        if ((bottom < top2) ||
                (top > bottom2) ||
                (right < left2) ||
                (left > right2)) {
            crash = false;
        }
        return crash;
    };
}

function updateGameCanvas(){
    if (ship.crash(asteroid)) {
        gameCanvas.stop();
    } else {
    gameCanvas.clear();
    gameCanvas.frameNo += 1;
    score.text = "SCORE: " + gameCanvas.frameNo;
    score.update();
    ship.moveAngle = 0; 
    ship.speed = 0;
    asteroid.speed = 0;
    asteroid.moveAngle = 0;
    if (gameCanvas.keys && gameCanvas.keys[37]) {ship.moveAngle = -3; }
    if (gameCanvas.keys && gameCanvas.keys[39]) {ship.moveAngle = 3; }
    if (gameCanvas.keys && gameCanvas.keys[38]) {ship.speed = 1.5; } 
    ship.newPos();
    ship.update();
    asteroid.newPos();
    asteroid.update();
    }
} 

