const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const background = new Image(); background.src = './Assets/Background.jpg';
const head = new Image(); head.src = './Assets/Head.png';
const shirt = new Image(); shirt.src = './Assets/Shirt.png';
const pants = new Image(); pants.src = './Assets/Pants.png';
const dew = new Image(); dew.src = './Assets/Dew.png'
const width = 14;
const hight = 14;
const margin = 17;
const cellDem = 40.5;
let snake = [17, 16, 15];
let direction = 0;
let dewPos = 25;
let eaten = false;

// disable scroll
canvas.onkeydown = function (e) {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

firstRender();
var timer=setInterval(MainLoop, 175); //main time loop

// main loop function
function MainLoop() {
    ctx.drawImage(background, 0, 0); //set background
    if (direction != 0) {
        if (checkDeath()) {
            direction = 1;
            snake = [17, 16, 15];
            dewPos = 25;
        }
        shiftSnake();
        testDew();
    }
    render();
}

//shift the snake in the direction it is moving
function shiftSnake() {
    if (eaten === true) { eaten = false; }
    else { snake.pop(); }
    snake.unshift(snake[0]+direction);
}

//render frame
function render() {
    //for the snake
    for (var i = 0; i < snake.length; i++) {
        var pos = snake[i];
        var y = Math.floor(pos/14);
        var x = pos - (14*y);
        var sprite = null;
        if (i === 0) {sprite = head;}
        else if (snake.length-1 > i > 0) {sprite = shirt;}
        else {sprite = pants;}
        ctx.drawImage(sprite, x*cellDem+margin, y*cellDem+margin, 40, 40);
    }

    // for the dew
    var y = Math.floor(dewPos/14);
    var x = dewPos - (14*y);
    ctx.drawImage(dew, x*cellDem+margin, y*cellDem+margin, 40, 40);
}

//first reader the waits for img load
function firstRender() {
    background.onload = () => {
        ctx.drawImage(background, 0, 0);
        render()
    };
}

//see if snake is dead
function checkDeath() {
    if (snake[0] % 14 === 13 && direction === 1) {return true; } //left wall dect
    else if (snake[0] % 14 === 0 && direction === -1) {return true; } //right wall dect
    else if (Array(15).fill().map((_, idx) => 182 + idx).includes(snake[0]) && direction === 14) {return true; } //bottom wall dect
    else if (Array(15).fill().map((_, idx) => 0 + idx).includes(snake[0]) && direction === -14) {return true; }  //bottom wall dect
    else {
        //hit itself
        var hasDuplicates = (arr) => arr.length !== new Set(arr).size;
        if (hasDuplicates(snake)) { return true; }
        else { return false; } //pass with all so return
    }
}

//test to see if the snake is over the dew (eaten)
function testDew() {
    if (snake.includes(dewPos)) { 
        eaten = true; 
        spawnDew();
    } 
}

//spawn a new dew
function spawnDew() {
    var ranPos = Math.floor(Math.random() * 196);
    while (snake.includes(ranPos)) {
        var ranPos = Math.floor(Math.random() * 196);
    }
    dewPos = ranPos;
}

//get key inputs
document.addEventListener('keydown', function(event) {
    if(event.keyCode === 39 && direction !== -1) { direction = 1; } //right arrow
    else if(event.keyCode === 37 && direction !== 1) { direction = -1; } //left arrow
    else if(event.keyCode === 38 && direction !== width) { direction = -width; } //up arrow
    else if(event.keyCode === 40 && direction !== -width) { direction = width; }//down arrow
    
    else if(event.keyCode === 68 && direction !== -1) { direction = 1; } //d
    else if(event.keyCode === 65 && direction !== 1) { direction = -1; } //a
    else if(event.keyCode === 87 && direction !== width) { direction = -width; } //w
    else if(event.keyCode === 83 && direction !== -width) { direction = width; }//s
});
