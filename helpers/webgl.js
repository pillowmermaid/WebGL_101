function createShaderFromEl(gl, scriptId, type) {
	var shaderScript = document.getElementById(scriptId);
	if(!shaderScript) {
		throw("~~~~~ Error : Unknown element" + scriptId);
	}

	var shaderSource = shaderScript.text;

	if(!type) {
		if(shaderScript.type === "x-shader/x-vertex") {
			type = gl.VERTEX_SHADER;
		}
		else if (shaderScript.type === "x-shader/x-fragment") {
			type = gl.FRAGMENT_SHADER;
		}
		else {
			throw("~~~~ Error : shader type not set")
		}
	}

	var shader = gl.createShader(type);
	gl.shaderSource(shader, shaderSource);
	gl.compileShader(shader);
	var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if(success){
		return shader;
	}
	console.log(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	var success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if(success) {
		return program;
	}

	console.log(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
}