var canvasWidth=window.innerWidth;
var canvasHeight=window.innerHeight;

var canvas=document.getElementById('canvas');
var ctx=canvas.getContext('2d');

canvas.width=canvasWidth;
canvas.height=canvasHeight;

var magTimer;
var cr=80;
var clipRegion={x:400,y:200,r:cr};

var img=new Image();
img.src="1_1.jpg";
img.onload=function(){
	$(".blur-wrapper").css('width',canvas.width);
	$(".blur-wrapper").css('height',canvas.height);
	$("#image").css('width',img.width);
	$("#image").css('height',img.height);
	var imgLeft=(canvas.width-img.width)/2;
	var imgTop=(canvas.height-img.height)/2;
	$("#image").css('left',imgLeft);
	$("#image").css('top',imgTop);
	var theleft=Math.max(imgLeft,0);
	var thetop=Math.max(imgTop,0);
	clipRegion.x=cr+theleft+Math.random()*(canvasWidth-2*theleft-2*cr);
	clipRegion.y=cr+thetop+Math.random()*(canvasHeight-2*thetop-2*cr);
	initCanvas();
}

function initCanvas() {
	draw();
}
function draw() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.save();
	ctx.beginPath();
	ctx.arc(clipRegion.x,clipRegion.y,clipRegion.r,0,Math.PI*2,false);
	ctx.clip();
	var imgLeft=(canvas.width-img.width)/2;
	var imgTop=(canvas.height-img.height)/2;
	// console.log('imgLeft:'+imgLeft+',imgTop:'+imgTop);

	ctx.drawImage(img,Math.max(-imgLeft,0),Math.max(-imgTop,0),
		Math.min(img.width,canvas.width),Math.min(img.height,canvas.height),
		Math.max(imgLeft,0),Math.max(imgTop,0),
		Math.min(img.width,canvas.width),Math.min(img.height,canvas.height));
	ctx.restore();
}

$('.btn-reset').on('click',function(){
	clipRegion.r=cr;
	var imgLeft=(canvas.width-img.width)/2;
	var imgTop=(canvas.height-img.height)/2;
	var theleft=Math.max(imgLeft,0);
	var thetop=Math.max(imgTop,0);
	clipRegion.x=cr+theleft+Math.random()*(canvasWidth-2*theleft-2*cr);
	clipRegion.y=cr+thetop+Math.random()*(canvasHeight-2*thetop-2*cr);
	if(magTimer){
		clearInterval(magTimer);
		magTimer=0;
	}
	initCanvas();
});

$(".btn-show").on('click',function() {
	if(!magTimer){
		magTimer=setInterval(function() {	
			clipRegion.r+=20;
			if(clipRegion.r>canvas.width+canvas.height){
				clearInterval(magTimer);
			}
			draw();
		}, 50);
	}
});

canvas.onmouseup=function(e) {
	e.preventDefault();

}
canvas.onmousedown=function(e) {
	e.preventDefault();

}
canvas.onmousemove=function(e) {
	e.preventDefault();

}
canvas.onmouseout=function(e) {
	e.preventDefault();

}

