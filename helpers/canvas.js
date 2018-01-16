function resizeCanvas(canvas) {
	var dpr = window.devicePixelRatio;

	var dw = Math.floor(canvas.clientWidth * dpr);
	var dh = Math.floor(canvas.clientHeight * dpr);

	if(canvas.width != dw || canvas.height != dh) {
		canvas.width = dw;
		canvas.height = dh;
	}
}

function resize(gl) {
	resizeCanvas(gl.canvas);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);
}
