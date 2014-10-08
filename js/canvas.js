var canvas;
var canvasChooseColor;
var ctx;
var ctxChooseColor;
var bMouseDown = false;
var selColorR = 0;
var selColorG = 0;
var selColorB = 0;

var CurveBrush = {
    // inner variables
    iPrevX : 0,
    iPrevY : 0,
    points : null,

    // initialization function
    init: function () { },

    startCurve: function (x, y) {
        this.iPrevX = x;
        this.iPrevY = y;
        this.points = new Array();
    },

    getPoint: function (iLength, a) {
        var index = a.length - iLength, i;
        for (i=index; i< a.length; i++) {
            if (a[i]) {
                return a[i];
            }
        }
    },

    draw: function (x, y) {
        if (Math.abs(this.iPrevX - x) > 5 || Math.abs(this.iPrevY - y) > 5) {
            this.points.push([x, y]);

            // draw main path stroke
            ctx.beginPath();
            ctx.moveTo(this.iPrevX, this.iPrevY);
            ctx.lineTo(x, y);

            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(' + selColorR + ', ' + selColorG + ', ' + selColorB + ', 0.9)';
            ctx.stroke();
            ctx.closePath();

            // draw extra strokes
            ctx.strokeStyle = 'rgba(' + selColorR + ', ' + selColorG + ', ' + selColorB + ', 0.2)';

            this.iPrevX = x;
            this.iPrevY = y;
        }
    }
};

$(function(){
    // creating canvas objects
    canvas = document.getElementById('panel');
    ctx = canvas.getContext('2d');

    canvasChooseColor = document.getElementById('color');
    ctxChooseColor = canvasChooseColor.getContext('2d');

    fillGradients();
    $('#pick').css('backgroundColor', "black");

    CurveBrush.init();

    $('#color').mousemove(function(e) {
        var canvasOffset = $(canvasChooseColor).offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);

        var imageData = ctxChooseColor.getImageData(canvasX, canvasY, 1, 1);
        var pixel = imageData.data;
    });

    $('#color').click(function(e) {
        var canvasOffset = $(canvasChooseColor).offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);

        var imageData = ctxChooseColor.getImageData(canvasX, canvasY, 1, 1);
        var pixel = imageData.data;

        var pixelColor = 'rgba('+pixel[0]+', '+pixel[1]+', '+pixel[2]+', '+pixel[3]+')';
        $('#pick').css('backgroundColor', pixelColor);

        selColorR = pixel[0];
        selColorG = pixel[1];
        selColorB = pixel[2];
    });

    $('#panel').mousedown(function(e) { // mouse down handler
        bMouseDown = true;
        var canvasOffset = $(canvas).offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);

        CurveBrush.startCurve(canvasX, canvasY, false, false, false, false, false, false, canvasX, canvasY, 0, 0);
    });
    $('#panel').mouseup(function(e) { // mouse up handler
        bMouseDown = false;
    });
    $('#panel').mousemove(function(e) { // mouse move handler
        if (bMouseDown) {
            var canvasOffset = $(canvas).offset();
            var canvasX = Math.floor(e.pageX - canvasOffset.left);
            var canvasY = Math.floor(e.pageY - canvasOffset.top);

            CurveBrush.draw(canvasX, canvasY, false, false, false, false, false, false, canvasX, canvasY, 0, 0);
        }
    });
});
$(function(){

})


function fillGradients() {
    var grad = ctxChooseColor.createLinearGradient(20, 0, canvasChooseColor.width - 20, 0);
    grad.addColorStop(0, 'red');
    grad.addColorStop(1 / 8, 'orange');
    grad.addColorStop(2 / 8, 'yellow');
    grad.addColorStop(3 / 8, 'green')
    grad.addColorStop(4 / 8, 'aqua');
    grad.addColorStop(5 / 8, 'blue');
    grad.addColorStop(6 / 8, 'purple');
    grad.addColorStop(7 / 8, 'black');
    grad.addColorStop(1, 'white');

    ctxChooseColor.fillStyle = grad;
    ctxChooseColor.fillRect(0, 0, canvasChooseColor.width, canvasChooseColor.height)
}