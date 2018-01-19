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
var matrixLocation;

var positionBuffer;

var angleInRadians;
var rateOfRotation = 2;
var mouseX = 500;
var mouseY = 200;
var frame = 0;

var shape = {
  translation: [mouseX, mouseY],
  rotation: 0,
  scale: [0.8, 0.8],
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

  vertexShader        = createShaderFromEl(gl, "2d-vertex-shader");
  fragmentShader      = createShaderFromEl(gl, "2d-fragment-shader");

  program             = createProgram(gl, vertexShader, fragmentShader);

  positionLocation    = gl.getAttribLocation(program, "a_position");
  resolutionLocation  = gl.getUniformLocation(program, "u_resolution");
  colorLocation       = gl.getUniformLocation(program, "u_color");
  matrixLocation      = gl.getUniformLocation(program, "u_matrix");



  positionBuffer      = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  createLetterF(gl);

  render();

  //canvas.addEventListener('mousemove', updatePosition);
  window.addEventListener('resize', resize);
}

function updatePosition(evt) {
  mouseX = evt.clientX * 2;
  mouseY = evt.clientY * 2;
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

    if(shape.rotation < 360){
      shape.rotation+=rateOfRotation;
    }
    else if(shape.rotation === 360){
      shape.rotation = 0;
    }
    angleInRadians = shape.rotation * Math.PI / 180;
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

    gl.uniform4fv(colorLocation, shape.color);

    // sets a projection matrix to convert pixels into clipspace
    var projectionMatrix = m3.projection(gl.canvas.width, gl.canvas.height);

    // transformation matrices
    var translationMatrix = m3.translation(shape.translation[0], shape.translation[1]);
    var rotationMatrix    = m3.rotation(angleInRadians);
    var scaleMatrix       = m3.scaling(shape.scale[0], shape.scale[1]);

    var originMatrix      = m3.translation(-50, -75);


    //~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~FOR MULTIPLE OBJECTS~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~
    //var identity          = m3.identity();

    // for (var i = 0; i < 1; ++i){
    //   identity = m3.multiply(identity, translationMatrix);
    //   identity = m3.multiply(identity, rotationMatrix);
    //   identity = m3.multiply(identity, scaleMatrix);
    //
    //   gl.uniformMatrix3fv(matrixLocation, false, identity);
    //
    //   var primitiveType = gl.TRIANGLES;
    //   var offset = 0;
    //   var count = 18;
    //   gl.drawArrays(primitiveType, offset, count);
    // }

    var matrix = m3.multiply(projectionMatrix, translationMatrix);
    matrix = m3.multiply(matrix, rotationMatrix);
    matrix = m3.multiply(matrix, scaleMatrix);
    matrix = m3.multiply(matrix, originMatrix);

    gl.uniformMatrix3fv(matrixLocation, false, matrix);

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
