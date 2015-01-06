/*
 *                Space Exploerer
 *
 * Written by Chris Cummins <chrisc.101@gmail.com>
 * Copyright (c) 2014, 2015 Chris Cummins
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


  // Generate a random point withim "dimen".
  var randomPoint = function(dimen) {
    return [Math.floor(Math.random() * dimen[0]),
            Math.floor(Math.random() * dimen[1])]
  };


  // Permute "point" in space "dimen" by a random distance within
  // "range".
  var permutePoint = function(point, range, dimen) {
    var direction = Math.random() * 2 * Math.PI;
    var distance = range[0] + Math.random() * range[1];

    // Get new coordinates.
    var x2 = point[0] + Math.floor(Math.cos(direction) * distance);
    var y2 = point[1] + Math.floor(Math.sin(direction) * distance);

    // Bound the coordinates to prevent mutating outside of the
    // search space.
    x2 = Math.max(0, Math.min(x2, dimen[0] - 1));
    y2 = Math.max(0, Math.min(y2, dimen[1] - 1));

    return [x2, y2];
  };


  // Scramble the elements of an array.
  //+ Jonas Raoni Soares Silva
  //@ http://jsfromhell.com/array/shuffle [v1.0]
  var shuffle = function(o){ //v1.0
    for (var j, x, i = o.length; i;
         j = Math.floor(Math.random() * i),
         x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  };


  // Rank the elements of "history" from best to worst.
  var sortHistory = function(history) {
    return history.sort(function(a, b) { return b[0]- a[0]; });
  };


  // GUI elements.
  var gui = {
    btn: {  // Buttons.
      randomise: $('button.btn-randomise'),
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
    space: $('#space'),
    analytics: {
      iterations: $('#iterations'),
      progress: {
        explored: {
          label: $('#progress-explored')
        },
        current: {
          label: $('#progress-current')
        },
        best: {
          label: $('#progress-best')
        },
        worst: {
          label: $('#progress-worst')
        },
        avg: {
          label: $('#progress-avg')
        }
      }
    }
  };

  // The search algorithms.
  var algorithms = {
    // Random search algorithm.
    'random': {
      data: {},
      init: function(history, data, dimen) {}, // Stateless search.
      predict: function(history, data, dimen) {
        return randomPoint(dimen);
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
    },
    // Hill climber search.
    'hill-climber': {
      data: { minDist: 1, maxDist: 5, stochastic: 0 },
      gui: {
        permute: {
          slider: $('#hill-climber-permute-slider'),
          label: $('#hill-climber-permute')
        },
        stochastic: {
          slider: $('#hill-climber-stochastic-slider'),
          label: $('#hill-climber-stochastic')
        }
      },
      init: function(history, data, dimen) {},
      predict: function(history, data, dimen) {

        // Pick a random starting point.
        if (!history.length)
          return randomPoint(dimen);

        var last = history[history.length - 1]; // Last event
        var permuteRange = [data.minDist, data.maxDist];

        // If this is the second iteration, *always* randomly permute.
        if (history.length === 1)
          return permutePoint(last.slice(1), permuteRange, dimen);

        var secondToLast = history[history.length - 2]; // Second to last event

        // If the last move was an *worse* than the previous point,
        // then return to the previous point, with probability
        // "data.stochastic". Else, permute to a new random point.
        if (last[0] < secondToLast[0] && Math.random() > data.stochastic)
          return [secondToLast[1], secondToLast[2]];
        else
          return permutePoint(last.slice(1), permuteRange, dimen);
      }
    },
    'genetic': {
      data: {
        pop: [],
        popSize: 25,
        nextPopSize: 25,
        tournamentSize: 0.5,
        crossoverRate: 0.9,
        mutationRate: 0.01
      },
      gui: {
        size: {
          slider: $('#genetic-size-slider'),
          label: $('#genetic-size')
        },
        tournament: {
          slider: $('#genetic-tournament-slider'),
          label: $('#genetic-tournament')
        },
        crossover: {
          slider: $('#genetic-crossover-slider'),
          label: $('#genetic-crossover')
        },
        mutation: {
          slider: $('#genetic-mutation-slider'),
          label: $('#genetic-mutation')
        }
      },
      init: function(history, data, dimen) {
        data.pop = [];
      },
      predict: function(history, data, dimen) {

        // Crossover two individuals using uniform crossover.
        var crossover = function(a, b) {
          if (Math.random < 0.5)
            return [a[1], b[2]];
          else
            return [b[1], a[2]];
        }

        // Mutate an individual.
        var mutate = function(a) {
          return permutePoint(a.slice(1), [1, 10], dimen);
        }

        var replicate = function(a) {
          return a.slice(1);
        }

        //+ Jonas Raoni Soares Silva
        //@ http://jsfromhell.com/array/shuffle [v1.0]
        var shuffle = function(o){ //v1.0
          for (var j, x, i = o.length; i;
               j = Math.floor(Math.random() * i),
               x = o[--i], o[i] = o[j], o[j] = x);
          return o;
        };

        // Generate a new population from "lastPop". If not given,
        // generate a random population.
        var genPop = function(lastPop) {
          var pop = []; // The new population
          data.popSize = data.nextPopSize; // Set the next population size

          if (lastPop && data.tournamentSize) {
            // Breed a new population using tournament selection.
            var poolSize = Math.max(data.tournamentSize * lastPop.length, 1);

            while (pop.length < data.popSize) {
              // Generate a ranked tournament.
              var tournament = sortHistory(shuffle(lastPop).slice(0, poolSize));

              // Crossver, mutate, or replicate.
              if (Math.random() < data.crossoverRate && poolSize > 1)
                pop.push(crossover(tournament[0], tournament[1]));
              else if (Math.random() < data.mutationRate)
                pop.push(mutate(tournament[0])); // Mutate
              else
                pop.push(replicate(tournament[0])) // Replicate
            }
          } else {
            // Generate a random population.
            for (var i = 0; i < data.popSize; i++)
              pop.push(randomPoint(dimen));
          }

          return pop;
        }

        // Generate a starting population.
        if (!history.length)
          data.pop = genPop();
        else if (!data.pop.length)
          data.pop = genPop(history.slice(0, data.popSize));

        return data.pop.pop();
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

    this.max = Math.max.apply(Math, this.data);
  };


  // Return the normalized height at location [x,y].
  Space.prototype.height = function(x, y) {
    var index = y * this.size + x; // X,Y coordinates to 1D index
    return Number(this.data[index]) / this.max; // Noramlize.
  };


  // Class which renders a 3D visualisation of "space" in "container".
  var Renderer = function(container, space) {
    // Renderer background color.
    var bg = new THREE.Color(0x000000);

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
    this.vertices = geometry.attributes.position.array;
    for (var i = 0, j = 0, l = this.vertices.length; i < l; i++, j += 3)
      this.vertices[j + 1] = data[i] * 10;

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


  // Set the optimisation space.
  Renderer.prototype.setSpace = function(space) {

    // Clear the point space if necessary.
    if (space.size !== this.size)
      this.removeAllPoints();

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
    // Normalize the height into an "intensity" value.
    var intensity = z / simulation.space.max;
    // Use the intensity to determine the size and colour of the
    // point.
    var radius = 30 - 10 * intensity;
    var color = new THREE.Color().setHSL((.7 + .5 * intensity) % 1,
                                         .7, .1 + .8 * intensity);

    // Create a new point at [x,y,z].
    var geometry = new THREE.SphereGeometry(radius, 4, 4);
    var material = new THREE.MeshBasicMaterial({color: color});
    var point = new THREE.Mesh(geometry, material);

    // Get the vertices at [x,y].
    var index = y * 3 * this.size + x * 3;
    point.position.x = this.vertices[index];
    point.position.y = z * 10;
    point.position.z = this.vertices[index + 2];

    this.points.push(point);
    this.scene.add(point);
  };


  // Remove all points.
  Renderer.prototype.removeAllPoints = function() {
    for (var i = 0, l = this.points.length; i < l; i++)
      this.scene.remove(this.points[i]);

    this.points = []
  }


  // Simulation progress analytics class.
  var Analytics = function() {
    this.best = 0; // The % best outcome (initialise low).
    this.worst = 100; // The % worst outcome (intialise high).
    this.sum = 0; // A running total of all outcomes.
  };


  // Update the analytics.
  Analytics.prototype.set = function(simulation) {
    var history = simulation.history;
    var currentProgress = 0;
    var average = 0;
    var explored = 0;

    if (history.length) { // Update statistics.
      var last = simulation.history[simulation.history.length - 1];
      this.sum += last[0];

      currentProgress = Math.round(last[0] * 100);
      average = Math.round((this.sum / history.length) * 100);
      explored = Math.min((history.length / simulation.space.area) * 100,
                          100).toFixed(2);

      this.worst = currentProgress < this.worst ? currentProgress : this.worst;
      this.best = currentProgress > this.best ? currentProgress : this.best;
    } else { // Reset.
      this.best = 0;
      this.worst = 100;
      this.sum = 0;
    }

    // Update GUI.
    gui.analytics.iterations.text(history.length);
    gui.analytics.progress.explored.label.text(explored + '%');
    gui.analytics.progress.current.label.text(currentProgress + '%');
    gui.analytics.progress.best.label.text(this.best + '%');
    gui.analytics.progress.worst.label.text(this.worst + '%');
    gui.analytics.progress.avg.label.text(average + '%');
  };


  // Our simulation object.
  var Simulation = function() {
    this.jiffies = 0; // Number of iterations in simulation.
    this.isRunning = false; // "true" if simulation running.
    this.frequency = 4; // Frequency (in Hz) of running.
    this.measurement_noise = 0; // Measurement noise, [0,1].
    this.history = []; // Array of chronological event outcomes and inputs.
    this.space = new Space(128) // The space to search.

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
    renderer.removeAllPoints();

    // Update the GUI.
    disableBtn(gui.btn.reset);
    analytics.set(this);
  };

  // Single step through simulation.
  Simulation.prototype.evaluate = function(prediction) {

    // Add gaussian noise.
    var add_noise = function(mean, stdev) {

      // Gaussian distribution.
      var rnd_snd = function() {
        return ((Math.random() * 2 - 1) +
                (Math.random() * 2 - 1) +
                (Math.random() * 2 - 1));
      };

      return mean + rnd_snd() * stdev;
    };

    // Return a noisy observation using gaussian noise of strength
    // "measurement_noise".
    return add_noise(this.space.height(prediction[0], prediction[1]), // Height
                     this.measurement_noise); // User set measurement noise
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

    // Render the new point.
    renderer.addPoint(event[1], event[2], event[0] * this.space.max);

    // Add this event to history.
    this.history.push(event);

    // Update the GUI.
    enableBtn(gui.btn.reset);
    analytics.set(this);
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


  // Set a new simulation space.
  var setSpace = function(space) {
    gui.ctrl.size.label.text(space.size + ' x ' + space.size);
    simulation.space = space;
    renderer.setSpace(space);
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
    max: 25,
    step: 1,
    value: parseInt(gui.ctrl.measurement_noise.label.text()),
    slide: function(event, ui) {
      gui.ctrl.measurement_noise.label.text(ui.value + ' %');
      simulation.measurement_noise = ui.value / 100;
    }
  });

  // Randmoise button handler.
  gui.btn.randomise.click(function() {
    setSpace(new Space(simulation.space.size));
  });

  // Size slider initialise.
  gui.ctrl.size.slider.slider({
    range: 'min',
    min: 16,
    max: 512,
    step: 16,
    value: parseInt(gui.ctrl.size.label.text()),
    slide: function(event, ui) { setSpace(new Space(ui.value)); }
  });

  // Hill climber permute distance slider.
  algorithms['hill-climber'].gui.permute.slider.slider({
    range: true,
    min: 1,
    max: 20,
    step: 1,
    values: [1, 5],
    slide: function(event, ui) {
      var algorithm = algorithms['hill-climber'];
      algorithm.data.minDist = ui.values[0];
      algorithm.data.maxDist = ui.values[1];

      // Update slider label.
      algorithm.gui.permute.label.text(ui.values[0] + ' - ' + ui.values[1]);
    }
  });

  // Hill climber stochastic slider.
  algorithms['hill-climber'].gui.stochastic.slider.slider({
    range: 'min',
    min: 0,
    max: 50,
    step: 1,
    value: 0,
    slide: function(event, ui) {
      var algorithm = algorithms['hill-climber'];
      algorithm.data.stochastic = ui.value / 100;

      // Update slider label.
      algorithm.gui.stochastic.label.text(ui.value + '%');
    }
  });

  // Genetic algorithm population size slider.
  algorithms['genetic'].gui.size.slider.slider({
    range: 'min',
    min: 1,
    max: 50,
    step: 1,
    value: 25,
    slide: function(event, ui) {
      var algorithm = algorithms['genetic'];
      algorithm.data.nextPopSize = ui.value;

      // Update slider label.
      algorithm.gui.size.label.text(ui.value);
    }
  });

  // Genetic algorithm population size slider.
  algorithms['genetic'].gui.size.slider.slider({
    range: 'min',
    min: 1,
    max: 100,
    step: 1,
    value: 25,
    slide: function(event, ui) {
      var algorithm = algorithms['genetic'];
      algorithm.data.nextPopSize = ui.value;

      // Update slider label.
      algorithm.gui.size.label.text(ui.value);
    }
  });

  // Genetic algorithm tournament size slider.
  algorithms['genetic'].gui.tournament.slider.slider({
    range: 'min',
    min: 0,
    max: 100,
    step: 5,
    value: 50,
    slide: function(event, ui) {
      var algorithm = algorithms['genetic'];
      algorithm.data.tournament = ui.value / 100;

      // Update slider label.
      algorithm.gui.tournament.label.text(ui.value + '%');
    }
  });

  // Genetic algorithm population crossover slider.
  algorithms['genetic'].gui.crossover.slider.slider({
    range: 'min',
    min: 0,
    max: 100,
    step: 5,
    value: 90,
    slide: function(event, ui) {
      var algorithm = algorithms['genetic'];
      algorithm.data.crossoverRate = ui.value / 100;

      // Update slider label.
      algorithm.gui.crossover.label.text(ui.value + '%');
    }
  });

  // Genetic algorithm population mutation slider.
  algorithms['genetic'].gui.mutation.slider.slider({
    range: 'min',
    min: 0,
    max: 10,
    step: 1,
    value: 1,
    slide: function(event, ui) {
      var algorithm = algorithms['genetic'];
      algorithm.data.mutationRate = ui.value / 100;

      // Update slider label.
      algorithm.gui.mutation.label.text(ui.value + '%');
    }
  });

  // Enable buttons.
  enableBtn(gui.btn.step);
  enableBtn(gui.btn.run);

  // The simulation and renderer objects.
  var simulation = new Simulation();
  var analytics = new Analytics();
  var renderer = new Renderer(gui.space, simulation.space);

  // Start animation loop.
  animate();
};


// Delay intialisation until page is loaded.
window.onload = SpaceExplorer;
