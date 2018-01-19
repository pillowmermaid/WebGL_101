//Globals
var gl;

//Shader vars
var vertexShader;
var fragmentShader;
var program;

//Shader attribute vars
var positionLocation;
var resolutionLocation;
var colorLocation;
var translationLocation;
var rotationLocation;

var positionBuffer;

var mouseX = 0;
var mouseY = 0;
var frame = 0;

var shape = {
  translation: [0, 0],
  rotation: [0, -1],
  width: 100,
  height: 30,
  color: [Math.random(), Math.random(), Math.random(), 1]
}


function init() {
  var canvas = document.getElementById("c");
  canvas.width = 400;
  canvas.height = 300;

  gl = canvas.getContext("webgl");
  if (!gl) {
    //i guess you aint got it
  }

  vertexShader = createShaderFromEl(gl, "2d-vertex-shader");
  fragmentShader = createShaderFromEl(gl, "2d-fragment-shader");

  program = createProgram(gl, vertexShader, fragmentShader);

  positionLocation = gl.getAttribLocation(program, "a_position");
  resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  colorLocation = gl.getUniformLocation(program, "u_color");
  translationLocation = gl.getUniformLocation(program, "u_translation");
  rotationLocation = gl.getUniformLocation(program, "u_rotation");

  positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  createLetterF(gl);

  render();

  canvas.addEventListener('mousemove', updatePosition);
  window.addEventListener('resize', resize);
}

function updatePosition(evt) {
  mouseX = evt.clientX;
  mouseY = evt.clientY;
}

function createRectangle(gl, x, y, w, h) {
  var x1 = x;
  var x2 = x + w;
  var y1 = y;
  var y2 = y + h;

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]), gl.STATIC_DRAW);
}

function createLetterF(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      //Left column
      0, 0,
      30, 0,
      0, 150,
      0, 150,
      30, 0,
      30, 150,

      //Top row
      30, 0,
      100, 0,
      30, 30,
      30, 30,
      100, 0,
      100, 30,

      //Middle row
      30, 60,
      67, 60,
      30, 90,
      30, 90,
      67, 60,
      67, 90
    ]), gl.STATIC_DRAW);
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~ RENDERING AND UPDATE LOOPS ~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function update() {
  frame++;
  // if(frame % 20 === 0){
  //   shape.color = [Math.random(), Math.random(), Math.random(), 1];
  // }
  shape.translation = [mouseX, mouseY];


  render();
}

function render() {
  // rendering below
  resize(gl);

  gl.useProgram(program);

  gl.enableVertexAttribArray(positionLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  //Sets an iterator to go through the buffer data
  var size = 2; //how many values to return per iteration
  var type = gl.FLOAT; //what type they are
  var normalize = false;
  var stride = 0; //how many spots to jump per iteration
  var offset = 0; //how many spots to offset the start by

  // passes an array of 2d vectors to the positionAttribute}
  gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

  // sets the 2d vector that resolutionLocation points at to {canvasW, canvasH}
  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

  gl.uniform4fv(colorLocation, shape.color);

  gl.uniform2fv(translationLocation, shape.translation);
  gl.uniform2fv(rotationLocation, shape.rotation);

  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 18;
  gl.drawArrays(primitiveType, offset, count);

  //~~~~~~~~~~~~~~~~
  //~~~OLD BUSTED~~~
  //~~~~~~~~~~~~~~~~
  // for (var i = 0; i < 1; i++){
  //   createRectangle(gl, shape.translation[0], shape.translation[1], shape.width, shape.height);
  //   gl.uniform4f(colorLocation, shape.color[0], shape.color[1], shape.color[2], shape.color[3]);
  //   var primitiveType = gl.TRIANGLES;
  //   var offset = 0;
  //   var count = 6;
  //   gl.drawArrays(primitiveType, offset, count);
  // }

  requestAnimationFrame(update);
}


init();
