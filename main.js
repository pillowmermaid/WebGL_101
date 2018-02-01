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
var colorBuffer;

var angleInRadians = [0, 0, 0];
var rateOfRotation = 2;
var mouseX = 500;
var mouseY = 200;
var z = 0;
var frame = 0;

var shape = {
  translation: [mouseX, mouseY, z],
  rotation: [40, 25, 325],
  scale: [0.8, 0.8, 0.8],
  width: 100,
  height: 30,
  color: [Math.random(), Math.random(), Math.random(), 1]
}

function degToRad(d) {
  return d * Math.PI / 180;
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

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2
    ]), gl.STATIC_DRAW);
}

function setCubeGeometry(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      //Screen Front
      0, 0, 0,
      150, 0, 0,
      0, 150, 0,
      0, 150, 0,
      150, 0, 0,
      150, 150, 0,

      //Screen Right
      150, 0, 0,
      150, 150, 0,
      150, 0, 150,
      150, 0, 150,
      150, 150, 0,
      150, 150, 150,

      //Screen Left
      0, 0, 0,
      0, 0, 150,
      0, 150, 0,
      0, 150, 0,
      0, 0, 150,
      0, 150, 150,

      //Screen Back
      0, 0, 150,
      0, 150, 150,
      150, 150, 150,
      150, 150, 150,
      0, 0, 150,
      150, 0, 150,

      //Screen Top
      0, 0, 0,
      150, 0, 0,
      0, 0, 150,
      0, 0, 150,
      150, 0, 0,
      150, 0, 150,

      //Screen Bottom
      0, 150, 0,
      150, 150, 0,
      150, 150, 150,
      150, 150, 150,
      150, 150, 0,
      0, 150, 150,
    ]), gl.STATIC_DRAW);
  }
  function setCubeColors(gl) {
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array([
        //Screen Front
        255, 0, 0,
        255, 0, 0,
        255, 0, 0,
        255, 0, 0,
        255, 0, 0,
        255, 0, 0,

        //Screen Right
        0, 255, 0,
        0, 255, 0,
        0, 255, 0,
        0, 255, 0,
        0, 255, 0,
        0, 255, 0,

        //Screen Left
        0, 0, 255,
        0, 0, 255,
        0, 0, 255,
        0, 0, 255,
        0, 0, 255,
        0, 0, 255,

        //Screen Back
        0, 0, 150,
        0, 150, 150,
        150, 150, 150,
        150, 150, 150,
        0, 0, 150,
        150, 0, 150,

        //Screen Top
        0, 0, 0,
        150, 0, 0,
        0, 0, 150,
        0, 0, 150,
        150, 0, 0,
        150, 0, 150,

        //Screen Bottom
        0, 150, 0,
        150, 150, 0,
        150, 150, 150,
        150, 150, 150,
        150, 150, 0,
        0, 150, 150,
      ]), gl.STATIC_DRAW);
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
  colorLocation       = gl.getAttribLocation(program, "a_color");
  matrixLocation      = gl.getUniformLocation(program, "u_matrix");

  positionBuffer      = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setCubeGeometry(gl);

  colorBuffer         = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setCubeColors(gl);

  render();

  //canvas.addEventListener('mousemove', updatePosition);
  window.addEventListener('resize', resize);
}
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ~~~~~ RENDERING AND UPDATE LOOPS ~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function update() {
    frame++;
    // if(frame % 20 === 0){
    //   shape.color = [Math.random(), Math.random(), Math.random(), 1];
    // }

    if(shape.rotation[1] < 360){
      shape.rotation[1] += rateOfRotation;
    }
    else {
      shape.rotation[1] = 0;
    }
    angleInRadians[1] = degToRad(shape.rotation[1]);

    if(shape.rotation[2] < 360){
      shape.rotation[2] += rateOfRotation;
    }
    else {
      shape.rotation[2] = 0;
    }
    angleInRadians[2] = degToRad(shape.rotation[2]);


    shape.translation = [mouseX, mouseY, z];

    render();
  }

  function render() {
    // rendering below
    resize(gl);

    gl.useProgram(program);

    gl.enableVertexAttribArray(positionLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    //Sets an iterator to go through the buffer data
    var size = 3; //how many values to return per iteration
    var type = gl.FLOAT; //what type they are
    var normalize = false;
    var stride = 0; //how many spots to jump per iteration
    var offset = 0; //how many spots to offset the start by
    gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

    gl.enableVertexAttribArray(colorLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    //Sets an iterator to go through the buffer data
    var size = 3; //how many values to return per iteration
    var type = gl.UNSIGNED_BYTE; //what type they are
    var normalize = true;
    var stride = 0; //how many spots to jump per iteration
    var offset = 0; //how many spots to offset the start by

    // passes an array of 2d vectors to the positionAttribute}
    gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);

    // gl.uniform4fv(colorLocation, shape.color);

    // sets a projection matrix to convert pixels into clipspace
    // WILL REQUIRE RETROFITTING OF THE CODE BELOW
    //var projectionMatrix = m4.projection(gl.canvas.width, gl.canvas.height);

    // transformation matrices
    // var translationMatrix = m4.translation(shape.translation[0], shape.translation[1]);
    // var rotationMatrix    = m4.rotation(angleInRadians);
    // var scaleMatrix       = m4.scaling(shape.scale[0], shape.scale[1]);
    //
    // var originMatrix      = m4.translation(-50, -75);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~FOR MULTIPLE OBJECTS~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~
    // var identity          = m4.identity();

    var matrix = projection(gl.canvas.width, gl.canvas.height, 400);

    matrix = m4.translate(matrix, shape.translation[0], shape.translation[1], shape.translation[2]);
    matrix = m4.xRotate(matrix, angleInRadians[0]);
    matrix = m4.yRotate(matrix, angleInRadians[1]);
    matrix = m4.zRotate(matrix, angleInRadians[2]);
    matrix = m4.scale(matrix, shape.scale[0], shape.scale[1], shape.scale[2]);
    // tranlate origin
    // matrix = m4.translate(matrix, -75, -75);

    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6 * 6;
    gl.drawArrays(primitiveType, offset, count);



    requestAnimationFrame(update);
  }

  function projection(width, height, depth) {
    // Note: This matrix flips the Y axis so 0 is at the top.
    return [
      2 / width, 0, 0, 0,
      0, -2 / height, 0, 0,
      0, 0, 2 / depth, 0,
      -1, 1, 0, 1,
    ];
  }


  init();
