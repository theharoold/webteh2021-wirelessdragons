// Drawing with text. Ported from Generative Design book - http://www.generative-gestaltung.de - Original licence: http://www.apache.org/licenses/LICENSE-2.0
var downloadBtn;
var canvas = document.getElementById('text-canvas');
var canvasX = canvas.getBoundingClientRect().left;
var canvasY = canvas.getBoundingClientRect().top;
var canvasWidth = canvas.getBoundingClientRect().right - canvas.getBoundingClientRect().left;
var canvasHeight = canvas.getBoundingClientRect().bottom - canvas.getBoundingClientRect().top;
// Application variables
var position = { x: 0, y: 0 };
var counter = 0;
var minFontSize = 3;
var angleDistortion = 0;

// Drawing variables

var context = canvas.getContext('2d');
canvas.width = canvasWidth;
canvas.height = canvasHeight;
context.fillStyle = "white";
context.fillRect(0, 0, canvasWidth, canvasHeight);
var mouse = { x: 0, y: 0, down: false }

function init() {

    canvas.addEventListener('mousemove', mouseMove, false);
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('mouseout', mouseUp, false);
    canvas.addEventListener('dblclick', doubleClick, false);

    window.onresize = function (event) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    }
}

function mouseMove(event) {
    mouse.x = event.pageX;
    mouse.y = event.pageY;
    draw();
}

function draw() {
    if (mouse.down) {
        var d = distance(position, mouse);
        var fontSize = minFontSize + d / 2;
        var letters = document.querySelector("#drawText").value;
        var letter = letters[counter];
        var stepSize = textWidth(letter, fontSize);

        if (letter == undefined) {
            alert("Enter text to draw!");
        }

        if (d > stepSize) {
            var angle = Math.atan2(mouse.y - position.y, mouse.x - position.x);

            context.font = fontSize + "px Georgia";
            context.fillStyle = colorPicker();
            context.save();
            context.translate(position.x - canvasX, position.y - canvasY);
            context.rotate(angle);
            context.fillText(letter, 0, 0);
            context.restore();
            counter++;

            if (counter > letters.length - 1) {
                counter = 0;
            }
            position.x = position.x + Math.cos(angle) * stepSize;
            position.y = position.y + Math.sin(angle) * stepSize;

        }
    }
}

function distance(pt, pt2) {

    var xs = 0;
    var ys = 0;

    xs = pt2.x - pt.x;
    xs = xs * xs;

    ys = pt2.y - pt.y;
    ys = ys * ys;

    return Math.sqrt(xs + ys);
}

function mouseDown(event) {
    mouse.down = true;
    position.x = event.pageX;
    position.y = event.pageY;

    document.getElementById('info').style.display = 'none';
}

function mouseUp(event) {
    mouse.down = false;
}

function doubleClick(event) {
    canvas.width = canvas.width;
}

function textWidth(string, size) {
    context.font = size + "px Georgia";

    return context.measureText(string).width;
};

init();


function colorPicker() {
    var colors = document.querySelectorAll(".colorRadio");
    var color = "black";

    colors.forEach(radio => {
        if (radio.checked) {
            color = radio.value;
        }

    });

    return color;

}


function exportCanvas() {
    var exportBtn = document.querySelector("#exportBtn");
    var exportImage = document.querySelector(".exportImage");
    exportBtn.addEventListener('click', () => {
        var canvas = document.getElementById("text-canvas");
        var img = canvas.toDataURL("image/png");
        exportImage.innerHTML = '<img src="' + img + '"/> <input type="button" class="btn btn-primary mt-2" value="Download" id="downloadBtn" onClick="downloadCanvas()">';
        downloadBtn = document.querySelector(".downloadBtn");
    })
}

function downloadCanvas() {

    console.log(1);
    var canvas = document.getElementById('text-canvas');
    var img = canvas.toDataURL("image/png");
    var a = document.createElement('a');
    a.href = img;
    a.download = 'yourImage.png';

    a.click()
}

exportCanvas();
