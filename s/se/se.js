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
    algorithms: {
      divs: $('.algorithms > div')
    },
    ctrl: {
      algorithm: {
        btn: $('#algorithm-menu-btn'),
        li: $('#algorithm-menu li a')
      },
      frequency: {
        slider: $('#frequency-slider'),
        label: $('#frequency')
      },
      measurement_noise: {
        slider: $('#measurement-noise-slider'),
        label: $('#measurement-noise')
      },
      size: {
        slider: $('#size-slider'),
        label: $('#size')
      }
    },
    space: $('#space')
  };

  // The search algorithms.
  var algorithms = {
    // Random search algorithm.
    'random': {
      data: {},
      init: function(history, data, dimen) {}, // Stateless search.
      predict: function(history, data, dimen) {
        return [Math.floor(Math.random() * dimen[0]),
                Math.floor(Math.random() * dimen[1])];
      }
    },
    // Exhaustive search algorithm.
    'exhaustive': {
      data: { index: 0 },
      init: function(history, data, dimen) { data.index = -1 },
      predict: function(history, data, dimen) {
        data.index++; // Update location counter.
        return [Math.floor(data.index / dimen[0]) % dimen[0],
                data.index % dimen[1]];
      }
    }
  }


  // Class repesenting a square 2D search space.
  var Space = function(size) {
    this.size = size; // The size of the space.
    this.area = size * size; // The area of the space.
    this.dimen = [size, size] // Dimensions as array.
    this.data = new Uint8Array(this.area) // Height data.

    // Generate the height data.
    var noise = new ImprovedNoise().noise;
    var quality = 1;
    var z = Math.random() * 100;

    for (var j = 0; j < 4; j ++) {
      for (var i = 0; i < this.area; i ++) {
        var x = i % this.size;
        var y = ~~ (i / this.size);
        this.data[i] += Math.abs(noise(x / quality, y / quality, z) *
                                 quality * 1.75);
      }

      quality *= 5;
    }
  };


  // Return the uint8 height at location [x,y].
  Space.prototype.height = function(x, y) {
    var index = y * this.size + x; // X,Y coordinates to 1D index
    return data[index];
  };


  // Class which renders a 3D visualisation of "space" in "container".
  var Renderer = function(container, space) {
    // Renderer background color.
    var bg = new THREE.Color(0xfefefe);

    // WebGL browser compatability check.
    if (!Detector.webgl) {
      container[0].innerHTML = "";
      Detector.addGetWebGLMessage();
    }

    // The Renderer container.
    this.container = container;
    this.width = container.width();
    this.height = container.height();

    // Explorered points.
    this.points = []

    // Create camera. Params: FOV, aspect, z-near, z-far.
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 30000);
    this.controls = new THREE.OrbitControls(this.camera);
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();

    // Set the space.
    this.setSpace(space);

    // Create renderer.
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(bg);
    this.renderer.setSize(this.width, this.height);

    // Create DOM element.
    this.container[0].innerHTML = "";
    this.container[0].appendChild(this.renderer.domElement);

    // Register a resize callback.
    window.addEventListener('resize', (function(self) {
      return function() { self.resizeCallback(); }
    })(this), false);
  };


  // Render optimisation space.
  Renderer.prototype.render = function() {
    this.controls.update(this.clock.getDelta());
    this.renderer.render(this.scene, this.camera);
  }


  // Handle a resize.
  Renderer.prototype.resizeCallback = function() {
    // Update width and height.
    this.width = this.container.width();
    this.height = this.container.height();

    // Update camera and renderer.
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  };


  // Generate terrain texture.
  Renderer.prototype.getTexture = function(data) {
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
    canvas.width = this.size;
    canvas.height = this.size;

    context = canvas.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect(0, 0, this.size, this.size);

    image = context.getImageData(0, 0, canvas.width, canvas.height);
    imageData = image.data;

    for (var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++) {
      vector3.x = data[j - 2] - data[j + 2];
      vector3.y = 2;
      vector3.z = data[j - this.size * 2] - data[j + this.size * 2];
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
    canvasScaled.width = this.size * 4;
    canvasScaled.height = this.size * 4;

    context = canvasScaled.getContext('2d');
    context.scale(4, 4);
    context.drawImage(canvas, 0, 0);

    image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
    imageData = image.data;

    for (var i = 0, l = imageData.length; i < l; i += 4) {
      var v = ~~ (Math.random() * 5);
      imageData[i    ] += v;
      imageData[i + 1] += v;
      imageData[i + 2] += v;
    }

    context.putImageData(image, 0, 0);

    return canvasScaled;
  };


  // Generate terrain.
  Renderer.prototype.getMesh = function(data) {
    var geometry, vertices, texture, material;

    // 1. Geometry.
    geometry = new THREE.PlaneBufferGeometry(7500, 7500,
                                             this.size - 1,
                                             this.size - 1);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    // 2. Vertices.
    vertices = geometry.attributes.position.array;
    for (var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3)
      vertices[j + 1] = data[i] * 10;

    // 3. Texture.
    texture = new THREE.Texture(this.getTexture(data),
                                new THREE.UVMapping(),
                                THREE.ClampToEdgeWrapping,
                                THREE.ClampToEdgeWrapping);
    texture.needsUpdate = true;

    // 4. Material.
    material = new THREE.MeshBasicMaterial({ map: texture });
    material.side = THREE.DoubleSide; // Double sided material.

    // 5. Mesh.
    return new THREE.Mesh(geometry, material);
  };


  // Se the optimisation space.
  Renderer.prototype.setSpace = function(space) {
    this.size = space.size;
    this.area = space.area;

    // Generate a new mesh.
    var newMesh = this.getMesh(space.data);

    // Remove old mesh.
    if (this.mesh)
      this.scene.remove(this.mesh);

    // Add new mesh.
    this.mesh = newMesh;
    this.scene.add(this.mesh);

    // Update camera position.
    var distanceFactor = 6144 / this.size;
    this.camera.position.x = -distanceFactor * this.size;
    this.camera.position.y = distanceFactor * this.size;
    this.camera.position.z = distanceFactor * this.size;
  };


  // Add an explored point.
  Renderer.prototype.addPoint = function(x, y, z) {
    // TODO: push a new point at x,y,z
  };


  // Our simulation object.
  var Simulation = function() {
    this.jiffies = 0; // Number of iterations in simulation.
    this.isRunning = false; // "true" if simulation running.
    this.frequency = 4; // Frequency (in Hz) of running.
    this.measurement_noise = 0; // Measurement noise, [0,1].
    this.history = []; // Array of chronological event outcomes and inputs.
    this.space = new Space(256) // The space to search.

    // Set a default algorithm.
    this.setAlgorithm(algorithms['random']);
  };


  // Set the current algorithm.
  Simulation.prototype.setAlgorithm = function(algorithm) {
    this.algorithm = algorithm;
    this.algorithm.init(this.history, this.algorithm.data,
                        [this.space.size, this.space.size]);
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
    // Erase progress.
    this.jiffies = 0;
    this.history = [];

    // Update the GUI.
    disableBtn(gui.btn.reset);
  };

  // Single step through simulation.
  Simulation.prototype.evaluate = function(prediction) {
    // TODO: Something interesting here!
    return 0;
  };

  // Single step through simulation.
  Simulation.prototype.step = function() {
    this.jiffies++;

    // Get the predicted best next move.
    var event = this.algorithm.predict(this.history,
                                       this.algorithm.data,
                                       this.space.dimen);

    // Evaluate the move and prepend the outcome.
    event.unshift(this.evaluate(event));

    // Add this event to history.
    this.history.push(event);

    console.log(event);

    // Update the GUI.
    enableBtn(gui.btn.reset);
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
    disableBtn(gui.btn.step);
    gui.btn.run.text('Pause');

    return this.callback();
  };


  // Animate optimisation space.
  var animate = function() {
    requestAnimationFrame(animate); // Request next animation frmae
    renderer.render();
  }


  // INITIALISATION.

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

  // Algorithm selector handler.
  gui.ctrl.algorithm.li.click(function() {
    var btn = gui.ctrl.algorithm.btn; // Button.
    var val = $(this).text(); // Algorithm name.
    var id = val.toLowerCase().replace(/ /g, '-'); // Algorithm ID.
    var algorithm = algorithms[id]; // The Algorithm.
    var selector = '#' + id; // Algorithm div selector.

    // Set the simulation algorithm.
    simulation.setAlgorithm(algorithm);

    // Update GUI.
    btn.text(val);
    gui.algorithms.divs.removeClass('active');
    $(selector).addClass('active');
  });

  // Frequency slider initialise.
  gui.ctrl.frequency.slider.slider({
    range: 'min',
    min: 1,
    max: 30,
    step: 1,
    value: parseInt(gui.ctrl.frequency.label.text()),
    slide: function(event, ui) {
      gui.ctrl.frequency.label.text(ui.value + ' Hz');
      simulation.frequency = ui.value;
    }
  });

  // Initialise Measurement noise slider.
  gui.ctrl.measurement_noise.slider.slider({
    range: 'min',
    min: 0,
    max: 200,
    step: 5,
    value: parseInt(gui.ctrl.measurement_noise.label.text()),
    slide: function(event, ui) {
      gui.ctrl.measurement_noise.label.text(ui.value + ' %');
      simulation.measurement_noise = ui.value / 100;
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

      var space = new Space(ui.value);

      // Update simulation and renderer
      simulation.space = space;
      renderer.setSpace(space);
    }
  });

  // Enable buttons.
  enableBtn(gui.btn.step);
  enableBtn(gui.btn.run);

  // The simulation and renderer objects.
  var simulation = new Simulation();
  var renderer = new Renderer(gui.space, simulation.space);

  // Start animation loop.
  animate();
};


// Delay intialisation until page is loaded.
window.onload = SpaceExplorer;
