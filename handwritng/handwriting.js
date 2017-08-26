var canvasWidth=Math.min(800,$(window).width()-20);
var canvasHeight=canvasWidth;

var canvas=document.getElementById('canvas');
var ctx=canvas.getContext('2d');

canvas.width=canvasWidth;
canvas.height=canvasHeight;

drawGrid();

var isMousedown=false;
var isMouseout=true;
var lastLoc={x:0,y:0};
var lastTimestamp=0;
var lastLinewidth=-1;

var maxLineWidth=30;
var minLineWidth=1;
var maxSpeed=10;
var minSpeed=0.1;

var strokeColor='black';

$(".btn-color").on('click',function(){
	$(this).addClass('btn-selected').siblings().removeClass('btn-selected');
	strokeColor=$(this).css('background-color');
})

$(".btn-clear").on('click',function() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawGrid();
})

canvas.onmousemove=function(e) {
	e.preventDefault();
	if(isMousedown==true){
		startStroke({x:e.clientX,y:e.clientY});
	}
	isMouseout=false;
}
canvas.onmousedown=function(e) {
	e.preventDefault();
	beginStroke({x:e.clientX,y:e.clientY});
}
canvas.onmouseup=function(e) {
	e.preventDefault();
	endStroke();
}

canvas.onmouseout=function(e) {
	e.preventDefault();
	isMouseout=true;
}
document.onmouseup=function(e){
	e.preventDefault();
	isMousedown=false;
}
document.onmousedown=function(e){
	e.preventDefault();
	isMousedown=true;
}

canvas.addEventListener('touchstart',function(e){
	e.preventDefault();
	beginStroke({x:e.touches[0].pageX,y:e.touches[0].pageY});
});
canvas.addEventListener('touchmove',function(e) {
	e.preventDefault();
	if(isMousedown==true){
		startStroke({x:e.touches[0].pageX,y:e.touches[0].pageY});
	}
	isMouseout=false;
})
canvas.addEventListener('touchend',function(e) {
	e.preventDefault();
	endStroke();
})

function beginStroke(point) {
	isMousedown=true;
	lastLoc=winToCanvas(point.x,point.y);
	lastTimestamp=new Date().getTime();
	isMouseout=false;
}
function startStroke(point) {
	var curLoc=winToCanvas(point.x,point.y);
	var s=calcDistance(lastLoc,curLoc);
	var curTimestamp=new Date().getTime();
	var t=curTimestamp-lastTimestamp;
	var curLinewidth=slideLinewidth(s,t)
	ctx.lineWidth=curLinewidth;
	ctx.strokeStyle=strokeColor;
	ctx.lineCap='round';
	ctx.lineJoin='round';
	ctx.beginPath();
	if(isMouseout==true){
		ctx.moveTo(curLoc.x,curLoc.y);
	}else{
		ctx.moveTo(lastLoc.x,lastLoc.y);
	}
	ctx.lineTo(curLoc.x,curLoc.y);
	ctx.stroke();
	lastLoc=curLoc;
	lastTimestamp=curTimestamp;
	lastLinewidth=curLinewidth;
}
function endStroke() {
	isMousedown=false;
	isMouseout=false;
}
function slideLinewidth(s,t) {
	var v=s/t,lineWidth;
	if(v>maxSpeed){
		lineWidth=minLineWidth;
	}else if(v<minSpeed){
		lineWidth=maxLineWidth;
	}else{
		// lineWidth=maxLineWidth-(v-minSpeed)*(maxLineWidth-minLineWidth)/(maxSpeed-minSpeed);
		lineWidth=minLineWidth+(maxSpeed-v)*(maxLineWidth-minLineWidth)/(maxSpeed-minSpeed);
	}
	if(lastLinewidth==-1){
		return lineWidth;
	}else{
		return lastLinewidth*2/3+lineWidth*1/3;
	}
}
function calcDistance(lastLoc,curLoc) {
	return Math.sqrt((lastLoc.x-curLoc.x)*(lastLoc.x-curLoc.x)+(lastLoc.y-curLoc.y)*(lastLoc.y-curLoc.y));
}












function winToCanvas(x,y) {
	var box=canvas.getBoundingClientRect();
	return {x:Math.round(x-box.left),y:Math.round(y-box.top)}
}

function drawGrid() {
	ctx.save();

	ctx.strokeStyle='rgb(230,11,9)';
	ctx.lineWidth=6;

	ctx.beginPath();
	ctx.moveTo(3,3);
	ctx.lineTo(canvas.width-3,3);
	ctx.lineTo(canvas.width-3,canvas.height-3);
	ctx.lineTo(3,canvas.height-3);
	ctx.closePath();
	ctx.stroke();

	ctx.lineWidth=1;

	ctx.beginPath();
	ctx.moveTo(3,3);
	ctx.lineTo(canvas.width-3,canvas.height-3);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(canvas.width-3,3);
	ctx.lineTo(3,canvas.height-3);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(3,canvas.height/2);
	ctx.lineTo(canvas.width-3,canvas.height/2);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(canvas.width/2,3);
	ctx.lineTo(canvas.width/2,canvas.height-3);
	ctx.stroke();

	ctx.restore();
}