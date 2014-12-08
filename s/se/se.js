/*
 *                Space Exploerer
 *
 * Written by Chris Cummins <chrisc.101@gmail.com>
 * Copyright (c) 2014 Chris Cummins
 * License: http://opensource.org/licenses/MIT
 * Source code: https://github.com/ChrisCummins/chriscummins.github.io
 * http://chriscummins.cc
 *
 *
 * Space generator based on webgl terrain demo. See:
 *
 *    http://threejs.org/examples/webgl_geometry_terrain.html
 */

var SpaceExplorer = function() {
  'use strict';

  // Enable user to interact with "btn".
  var enableBtn = function(btn) {
    btn.removeAttr('disabled', false);
  };


  // Disable user from interacting with "btn".
  var disableBtn = function(btn) {
    btn.attr('disabled', 'disabled');
  };


  // GUI elements.
  var gui = {
    btn: {  // Buttons.
      reset: $('button.ctrl.btn-reset'),
      step:  $('button.ctrl.btn-step'),
      run:   $('button.ctrl.btn-run')
    },
    btns: {  // Button collections.
      ctrl:  $('button.ctrl')
    },
    ctrl: {
      frequency: {
        slider: $('#frequency-slider'),
        label: $('#frequency')
      },
      size: {
        slider: $('#size-slider'),
        label: $('#size')
      }
    },
    space: $('#space')
  };


  // Our simulation object.
  var Simulation = function() {
    this.jiffies = 0; // Number of iterations in simulation.
    this.isRunning = false; // "true" if simulation running.
    this.frequency = 4; // Frequency (in Hz) of running.
  };


  // Returns whether the simulation is running.
  Simulation.prototype.running = function() {
    return this.isRunning;
  };


  // Returns whether the simulation is paused.
  Simulation.prototype.paused = function() {
    return this.jiffies && !this.isRunning;
  };


  // Pause the simulation.
  Simulation.prototype.pause = function() {
    this.isRunning = false;

    // Update the GUI.
    enableBtn(gui.btn.step);
    gui.btn.run.text('Run');
  };

  // Returns whether the simulation is stopped.
  Simulation.prototype.stopped = function() {
    return !this.running() && !this.paused();
  };


  Simulation.prototype.reset = function() {
    this.pause();

    this.jiffies = 0;

    // Update the GUI.
    disableBtn(gui.btn.reset);
  };

  // Single step through simulation.
  Simulation.prototype.step = function() {
    this.jiffies++;

    // TODO: Interesting stuff here!
    console.log(this.jiffies);
  };


  // Callback for each "tick" of running simulation.
  Simulation.prototype.callback = function() {
    if (!this.isRunning) // Exit if we're no longer running.
      return;

    this.step();

    // Set next callback for 1 / frequency seconds.
    setTimeout((function(self) {
      return function() { self.callback(); }
    })(this), 1000 / this.frequency);
  };


  // Start the simulation running.
  Simulation.prototype.run = function() {
    this.isRunning = true;

    // Update the GUI.
    enableBtn(gui.btn.reset);
    disableBtn(gui.btn.step);
    gui.btn.run.text('Pause');

    return this.callback();
  };

  // INITIALISATION.

  // WebGL browser compatability check.
  if (!Detector.webgl) {
    gui.space[0].innerHTML = "";
    Detector.addGetWebGLMessage();
  }

  // Our simulation instance.
  var simulation = new Simulation();

  // Enable tooltips.
  $('.conf-option').tooltip('hide');

  // "Run" button event handler.
  gui.btn.run.click(function() {
    if (simulation.running())
      simulation.pause();
    else
      simulation.run();
  });
  // "Step" button event handler.
  gui.btn.step.click(function() { simulation.step(); });

  // "Reset" button event handler.
  gui.btn.reset.click(function() { simulation.reset(); });

  // Frequency slider initialise.
  gui.ctrl.frequency.slider.slider({
    range: 'min',
    min: 1,
    max: 30,
    step: 1,
    value: Math.max(gui.ctrl.frequency.label.text()),
    slide: function(event, ui) {
      gui.ctrl.frequency.label.text(Math.max(1, ui.value));
      simulation.frequency = ui.value;
    }
  });

  // Size slider initialise.
  gui.ctrl.size.slider.slider({
    range: 'min',
    min: 16,
    max: 512,
    step: 16,
    value: parseInt(gui.ctrl.size.label.text()),
    slide: function(event, ui) {
      gui.ctrl.size.label.text(ui.value + ' x ' + ui.value);
      worldSize = ui.value;
      generateTerrain();
    }
  });

  // Enable buttons.
  enableBtn(gui.btn.step);
  enableBtn(gui.btn.run);


  // Update WebGL space rendering.
  var onWindowResize = function() {
    var width = gui.space.width();
    var height = gui.space.height();

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    controls.handleResize();
  };


  // Generate terrain height map.
  var createData = function(size) {
    var area = size * size;
    var data = new Uint8Array(area);
    var noise = new ImprovedNoise().noise;
    var quality = 1;
    var z = Math.random() * 100;

    for (var j = 0; j < 4; j ++) {
      for (var i = 0; i < area; i ++) {
	var x = i % size;
        var y = ~~ (i / size);
	data[i] += Math.abs(noise(x / quality, y / quality, z) * quality * 1.75);
      }

      quality *= 5;
    }

    return data;
  };


  // Generate terrain texture.
  var generateTexture = function(data, width, height) {
    var canvas;
    var canvasScaled;
    var context;
    var image;
    var imageData;
    var level;
    var diff;
    var vector3 = new THREE.Vector3(0, 0, 0);
    var ambience = .2;
    var sun = new THREE.Vector3(ambience, ambience, ambience);
    var shade;

    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);

    image = context.getImageData(0, 0, canvas.width, canvas.height);
    imageData = image.data;

    for (var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++) {
      vector3.x = data[j - 2] - data[j + 2];
      vector3.y = 2;
      vector3.z = data[j - width * 2] - data[j + width * 2];
      vector3.normalize();

      shade = vector3.dot(sun);

      // R,G,B values:
      imageData[i]     = (110 + shade * 128)  * (0.5 + data[j]  * 0.007);
      imageData[i + 1] = (32  + shade * 96)   * (0.5 + data[j]  * 0.007);
      imageData[i + 2] = (0   + shade * 50)   * (0.5 + data[j]  * 0.007);
    }

    context.putImageData(image, 0, 0);

    // Scaled 4x

    canvasScaled = document.createElement('canvas');
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;

    context = canvasScaled.getContext('2d');
    context.scale(4, 4);
    context.drawImage(canvas, 0, 0);

    image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
    imageData = image.data;

    for (var i = 0, l = imageData.length; i < l; i += 4) {
      var v = ~~ (Math.random() * 5);
      imageData[i] += v;
      imageData[i + 1] += v;
      imageData[i + 2] += v;
    }

    context.putImageData(image, 0, 0);

    return canvasScaled;
  }


  var generateTerrain = function() {
    if (mesh)
      scene.remove(mesh);

    // Terrain data.
    data = createData(worldSize);

    // Terrain geometry.
    var geometry = new THREE.PlaneBufferGeometry(7500, 7500,
                                                 worldSize - 1,
                                                 worldSize - 1);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    var vertices = geometry.attributes.position.array;

    for (var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3)
      vertices[j + 1] = data[i] * 10;

    // Terain texture.
    texture = new THREE.Texture(generateTexture(data, worldSize, worldSize),
                                 new THREE.UVMapping(),
                                 THREE.ClampToEdgeWrapping,
                                 THREE.ClampToEdgeWrapping);
    texture.needsUpdate = true;

    // Terrain material.
    var material = new THREE.MeshBasicMaterial({ map: texture });

    // Terrain mesh.
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Update camera.
    distanceFactor = 6144 / worldSize;
    camera.position.x = -distanceFactor * worldSize;
    camera.position.y = distanceFactor * worldSize;
    camera.position.z = distanceFactor * worldSize;
  };


  // Animate optimisation space.
  var animate = function() {
    requestAnimationFrame(animate);
    render();
  }


  // Render optimisation space.
  var render = function() {
    controls.update(clock.getDelta());
    renderer.render(scene, camera);
  }


  var worldSize = 256;
  var distanceFactor = 6144 / worldSize;
  var bg = new THREE.Color(0xfefefe);

  var camera = new THREE.PerspectiveCamera(45, gui.space.width()
                                           / gui.space.height(), 1, 30000);
  var clock = new THREE.Clock();
  var container = gui.space[0];
  var controls = new THREE.OrbitControls(camera);
  var data;
  var mesh;
  var renderer;
  var scene = new THREE.Scene();
  var texture;


  // Initialise WebGL optimisation space.
  var init = function() {
    var width = gui.space.width();
    var height = gui.space.height();

    generateTerrain();

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(bg);
    renderer.setSize(width, height);

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
  }

  init();
  animate();
};


// Delay intialisation until page is loaded.
window.onload = SpaceExplorer;
