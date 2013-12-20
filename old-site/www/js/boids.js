var Boids = Boids || {};

(function() {
  'use strict';

  /* The configuration */
  var config = {

    SIMULATION: {
      /* The minimum target frame rate */
      minFps: 30,

      /* A higher physics frame rate will increase the granularity of the
       * simulation at the expense of greater computational costs. */
      physicsFps: 50
    },

    BOUNDARY: {
      /* The size of the bounding area: */
      size: new THREE.Vector3(600, 400, 600),
      /* The threshold at which boids steer to
       * avoid the boundaries: */
      threshold: 0.30,
      /* The rate at which boids are repelled
       * from the boundaries: */
      rate: 0.0003
    },

    BOIDS: {
      /* The number of boids: */
      count: 80,
      /* Rules determining the boids behaviour: */
      behaviour: {
        /* The rate at which boids are
         * attracted: */
        cohesion: 0.0012,
        /* The amount that boids align
         * their flights: */
        alignment: 0.006,
        separation: {
          /* The distance at which boids
           * steer to avoid each other: */
          distance: 120,
          /* The rate at which boids are
           * repelled from one another: */
          rate: 0.0020
        }
      },
      /* The speed limits for boids: */
      speed: {
        min: 2,
        max: 5
      },
      /* The distance that boids can see: */
      los: 320,
      /* The rate at which boids can manoeuvre (higher value means more agile
       * boids): */
      agility: 0.1
    },

    MOUSE: {
      los: 500,
      repel: 0.0070,
      attract: 0.0030
    }
  };

  var _dt = 1000 / config.SIMULATION.physicsFps;

  /* The context */
  var context = {

    container: document.getElementById('container'),

    boids: [],

    SCENE: {
      /* The scene and associated entities and geometries: */
      s: null,
      camera: null,
      cameraTarget: null,
      cameraHeight: 0,
      projector: null,
      lights: [],
      firstPerson: false,
      stats: null
    },

    RENDERER: {
      /* The renderer and associated properties: */
      r: new THREE.CanvasRenderer()
    },

    TIME: {
      /* The delta time, aka. the size of the chunk of time to process for each
       * update of the simulation. */
      dt: _dt,
      /* The maximum amount of time to process for a given iteration of the
       * render loop. The time is capped at this value, meaning that the
       * simulation will begin to slow down if the tick time exceeds this
       * value.  */
      maxTickTime: 1000 / config.SIMULATION.minFps,
      /* The current time */
      current: new Date().getTime(),
      /* The accumulated error between the frequency of ticks and render
       * updates */
      accumulator: 0
    },

    MOUSE: {
      active: false,
      /* Whether the mouse is a foe or a friend: */
      foe: false,
      position: null,
      timeout: null
    }
  };

  /* Boid behaviour */
  function Boid() {

    /* Bird.js - from the three.js birds demo */
    var Bird = function(size) {

      function v(x, y, z) {
        scope.vertices.push(new THREE.Vector3(x, y, z));
      }

      function f3(a, b, c) {
        scope.faces.push(new THREE.Face3(a, b, c));
      }

      function r(a) {
        return a * size;
      }

      var scope = this;

      THREE.Geometry.call(this);

      /* Body vertices */
      v(r(10), r(0), r(0));
      v(r(-10), r(-2), r(2));
      v(r(-10), r(0), r(0));
      v(r(-10), r(-2), r(-2));

      /* Wing vertices */
      v(r(0), r(4), r(-12));
      v(r(0), r(4), r(12));

      /* Wing vertices */
      v(r(4), r(0), r(0));
      v(r(-6), r(0), r(0));

      /* Faces */
      f3(0, 2, 1);
      f3(4, 7, 6);
      f3(5, 6, 7);

      this.computeCentroids();
      this.computeFaceNormals();
    };

    Bird.prototype = Object.create(THREE.Geometry.prototype);

    this.size = Math.random() + 0.5;

    var geometry = new Bird(this.size);

    this.mesh = new THREE.Mesh(geometry,
                               new THREE.MeshLambertMaterial({
                                 color: 0xffffff,
                                 shading: THREE.FlatShading,
                                 side: THREE.DoubleSide,
                                 overdraw: true
                               }));
    this.phase = Math.floor(Math.random() * 62.83);
    this.speed = 1;

    this.position = new THREE.Vector3(Math.random() * boundaries.x,
                                      Math.random() * boundaries.y,
                                      Math.random() * boundaries.z)
      .multiplyScalar(2).sub(boundaries);

    this.velocity = new THREE.Vector3(Math.random() - 0.5,
                                      Math.random() - 0.5,
                                      Math.random() - 0.5)
      .multiplyScalar(4); /* This multiplication by a magic constant
                           * determines the maximum starting speed. */

    this.updateMesh();
    context.SCENE.s.add(this.mesh);
  };

  Boid.prototype.updateMesh = function() {
    /* Position */
    this.mesh.position.copy(this.position);

    /* Heading and pitch */
    this.mesh.rotation.y = Math.atan2(-this.velocity.z, this.velocity.x);
    this.mesh.rotation.z = Math.asin(this.velocity.y / this.speed);

    /* FIXME: what a total hack (!) */
    if (isNaN(this.mesh.rotation.z))
      this.mesh.rotation.z = 0;

    /* Wing flapping */
    this.phase += Math.max(0, this.mesh.rotation.z * 0.4 / this.size) + 0.03;
    this.phase %= 62.83;

    var wingY = Math.sin(this.phase) * 10 * this.size;

    this.mesh.geometry.vertices[4].y = wingY;
    this.mesh.geometry.vertices[5].y = wingY;
  };

  var boundaries;

  function createBoid() {
    context.boids.push(new Boid());
  }

  function destroyBoid() {
    var b = context.boids.pop();

    context.SCENE.s.remove(b.mesh);
  }

  /* Update function */
  function tick(timestamp) {

    function update() {

      function updateBoid(index) {

        function enforceSpeedLimits(v) {
          var speed = v.length();

          b.speed = speed;

          var limits = {
            min: config.BOIDS.speed.min / b.size,
            max: config.BOIDS.speed.max / b.size
          };

          if (speed > limits.max) {

            /* Maximum speed */
            b.speed = limits.max;

            v.multiplyScalar(limits.max / speed);
          } else if (speed < limits.min) {

            /* Minimum speed */
            b.speed = limits.min;
            speed = Math.max(speed, 0.0001);

            v.multiplyScalar(limits.min / speed);
          }
        }

        var b = context.boids[index];
        var dv = new THREE.Vector3(0, 0, 0); // Change in velocity
        var centerOfMass = new THREE.Vector3(0, 0, 0);
        var velocityAvg = new THREE.Vector3(0, 0, 0);
        var swarmSize = 0;
        var mouse = context.MOUSE;

        for (var i = 0; i < config.BOIDS.count; i++) {
          if (i !== index) {
            var otherBoid = context.boids[i];

            /* Difference between the positions of the current and other boid */
            var dp = new THREE.Vector3().subVectors(b.position,
                                                    otherBoid.position);

            /* Get the distance between the other Boid and this Boid */
            var distance = dp.length();

            /*
             * COLLISION AVOIDANCE
             *
             * Boids try to keep a small distance away from other boids to
             * prevent them bumping into each other and reduce the density of
             * the flock:
             */
            if (distance < config.BOIDS.behaviour.separation.distance) {
              dv.sub(new THREE.Vector3()
                     .subVectors(otherBoid.position, b.position)
                     .multiplyScalar(config.BOIDS.behaviour.separation.rate));
            }

            /* We total up the velocity and positions of any particles that are
             * within the range of visibility of the current particle:
             */
            if (distance < config.BOIDS.los && b.size < otherBoid.size) {
              centerOfMass.add(otherBoid.position);
              velocityAvg.add(otherBoid.velocity);

              swarmSize++;
            }
          }
        }

        /* Mouse behaviour */
        if (mouse.active) {
          var dp = new THREE.Vector3().subVectors(b.position, mouse.position);
          var distance = dp.length();

          if (distance < config.MOUSE.los) {
            if (mouse.foe) {
              dv.sub(new THREE.Vector3()
                     .subVectors(mouse.position, b.position)
                     .multiplyScalar(config.MOUSE.repel));
            } else {
              dv.add(new THREE.Vector3()
                     .subVectors(mouse.position, b.position)
                     .multiplyScalar(config.MOUSE.attract));
            }
          }
        }

        /* We must always have a flock to compare against, even
         * if a Boid is on it's own: */
        if (swarmSize < 1) {
          centerOfMass.copy(b.position);
          swarmSize = 1;
        }

        centerOfMass.divideScalar(swarmSize);
        velocityAvg.divideScalar(swarmSize);

        /*
         * PARTICLE COHESION
         *
         * Boids try to fly towards the centre of mass of neighbouring
         * boids. We do this by first calculating a 'center of mass' for the
         * flock, and moving the boid by an amount proportional to it's
         * distance from that center:
         */
        dv.add(new THREE.Vector3()
               .subVectors(centerOfMass, b.position)
               .multiplyScalar(config.BOIDS.behaviour.cohesion / b.size));

        /*
         * FLOCK ALIGNMENT
         *
         * Boids try to match velocity with other boids nearby, this creates a
         * pattern of cohesive behaviour, with the flock moving in unison:
         */
        dv.add(new THREE.Vector3()
               .subVectors(velocityAvg, b.velocity)
               .multiplyScalar(config.BOIDS.behaviour.alignment * b.size));

        /*
         * BOUNDARY AVOIDANCE
         *
         * Boids avoid boundaries by being negatively accelerated away from
         * them when the distance to the boundary is less than a known
         * threshold:
         */
        if (b.position.x < -boundaries.x)
          dv.x += (-boundaries.x - b.position.x) *
              config.BOUNDARY.rate * b.speed;
        else if (b.position.x > boundaries.x)
          dv.x += (boundaries.x - b.position.x) *
              config.BOUNDARY.rate * b.speed;

        if (b.position.y < -boundaries.y)
          dv.y += (-boundaries.y - b.position.y) *
              config.BOUNDARY.rate * b.speed;
        else if (b.position.y > boundaries.y)
          dv.y += (boundaries.y - b.position.y) *
              config.BOUNDARY.rate * b.speed;

        if (b.position.z < -boundaries.z)
          dv.z += (-boundaries.z - b.position.z) *
              config.BOUNDARY.rate * b.speed;
        else if (b.position.z > boundaries.z)
          dv.z += (boundaries.z - b.position.z) *
              config.BOUNDARY.rate * b.speed;

        /* Apply the velocity change */
        b.velocity.add(dv.multiplyScalar(b.speed * config.BOIDS.agility));

        /* Control the rate of boids movement */
        enforceSpeedLimits(b.velocity);

        /* Update position */
        b.position.add(b.velocity);

        b.updateMesh();
      }

      for (var i = 0; i < config.BOIDS.count; i++)
        updateBoid(i);
    }

    function render() {
      var camera = context.SCENE.camera;

      if (context.SCENE.firstPerson) {
        /* First person camera mode. We use the first boid as our "cameraman",
         * since he is always guaranteed to be around (if there was only 1 boid,
         * he'd be the only one left). We point the camera in the direction of
         * flight by using the boid's velocity to calculate its next position
         * and pointing that camera at it.
         */
        var b = context.boids[0];
        var nextPos = new THREE.Vector3().copy(b.position).add(b.velocity);

        camera.position = new THREE.Vector3().copy(b.position);
        camera.lookAt(nextPos);
      } else {
        /* Normal (3rd person) camera mode. Gently pan the camera around */
        var timer = Date.now() * 0.00005;
        var x = Math.cos(timer) * config.BOUNDARY.size.x * 1.25;
        var z = Math.sin(timer) * config.BOUNDARY.size.z * 1.25;

        camera.position = new THREE.Vector3(x, context.SCENE.cameraHeight, z);
        camera.lookAt(context.SCENE.cameraTarget);
      }

      context.RENDERER.r.render(context.SCENE.s, camera);
    }

    /* Update the clocks */
    var t = context.TIME;
    var newTime = new Date().getTime();
    var tickTime = newTime - t.current;

    /* Enforce a maximum frame time to prevent the "spiral of death" when
     * operating under heavy load */
    if (tickTime > t.maxTickTime)
      tickTime = t.maxTickTime;

    t.current = newTime;
    t.accumulator += tickTime;

    /* Update the simulation state as required */
    for ( ; t.accumulator >= t.dt; t.accumulator -= t.dt)
      update();

    context.SCENE.stats.update();

    /* Render the new state */
    render();

    /* Request a new tick */
    requestAnimationFrame(tick);
  }

  function initLighting() {

    var lights = context.SCENE.lights;
    var scene = context.SCENE.s;

    if (lights.length > 0) {
      /* Clear lights */
      for (var i = lights.length - 1; i >= 0; i--)
        scene.remove(lights.pop());
    }

    var ambientLight = new THREE.AmbientLight(0x5481a4);
    scene.add(ambientLight);
    lights.push(ambientLight);

    var light = new THREE.DirectionalLight(0xffc67a);
    light.position.set(Math.random() - 0.5,
                       Math.random() - 0.5,
                       Math.random() - 0.5);
    light.position.normalize();
    scene.add(light);

    lights.push(light);

    var light = new THREE.DirectionalLight(0xffa07a);
    light.position.set(Math.random() - 0.5,
                       Math.random() - 0.5,
                       Math.random() - 0.5);
    light.position.normalize();
    scene.add(light);

    lights.push(light);
  }

  function setRendererSize() {
    /* NOTE: The -5 adjustment is a hack to prevent scrollbars appearing under
     * Chrome. */
    var w = window.innerWidth - 5;
    var h = window.innerHeight - 5;
    var aspect = window.innerWidth / window.innerHeight;

    context.RENDERER.r.setSize(w, h);
    context.SCENE.camera.aspect = aspect;
  }

  function initCamera() {
    if (context.SCENE.firstPerson) {
      /* 1st-person camera configuration */
      var fov = 120;
      var aspect = window.innerWidth / window.innerHeight;
      var zNear = 1;
      var zFar = 10000;

      context.SCENE.camera = new THREE.PerspectiveCamera(fov, aspect,
                                                         zNear, zFar);
      context.SCENE.cameraTarget = new THREE.Vector3(context.SCENE.s.position.x,
                                                     context.SCENE.s.position.y,
                                                     context.SCENE.s.position.z);
      context.SCENE.cameraHeight = config.BOUNDARY.size.y * 0.4;
    } else {
      /* 3rd-person camera configuration */
      var fov = 60;
      var aspect = window.innerWidth / window.innerHeight;
      var zNear = 1;
      var zFar = 10000;

      context.SCENE.camera = new THREE.PerspectiveCamera(fov, aspect,
                                                         zNear, zFar);
      context.SCENE.cameraTarget = new THREE.Vector3(context.SCENE.s.position.x,
                                                     context.SCENE.s.position.y,
                                                     context.SCENE.s.position.z);
      context.SCENE.cameraHeight = config.BOUNDARY.size.y * 0.4;
    }
  }

  /* Initialisation function */
  function init() {

    function onWindowResize() {
      context.SCENE.camera.left = window.innerWidth / - 2;
      context.SCENE.camera.right = window.innerWidth / 2;
      context.SCENE.camera.top = window.innerHeight / 2;
      context.SCENE.camera.bottom = window.innerHeight / - 2;

      setRendererSize();
      context.SCENE.camera.updateProjectionMatrix();
    }

    var w = config.BOUNDARY.size.x;
    var h = config.BOUNDARY.size.y;
    var d = config.BOUNDARY.size.z;

    context.SCENE.s = new THREE.Scene();
    context.SCENE.projector = new THREE.Projector();

    initCamera();
    initLighting();

    setRendererSize();
    context.container.appendChild(context.RENDERER.r.domElement);
    window.addEventListener('resize', onWindowResize, false);

    context.SCENE.stats = new Stats();
    context.SCENE.stats.domElement.style.position = 'absolute';
    context.SCENE.stats.domElement.style.bottom = '0';
    context.SCENE.stats.domElement.style.left = '0';
    context.SCENE.stats.domElement.style.visibility = 'hidden';
    context.container.appendChild(context.SCENE.stats.domElement);

    function disableMouse() {
      context.MOUSE.active = false;
      context.MOUSE.timeout = null;
    }

    /* Update mouse position and enable */
    $(context.container).mousemove(function() {
      var camera = context.SCENE.camera;
      var projector = context.SCENE.projector;

      var vector = new THREE.Vector3(
          (event.clientX / window.innerWidth) * 2 - 1,
          - (event.clientY / window.innerHeight) * 2 + 1,
          0.5);

      projector.unprojectVector(vector, camera);

      var dir = vector.sub(camera.position).normalize();
      var ray = new THREE.Raycaster(camera.position, dir);
      var distance = - camera.position.z / dir.z;

      context.MOUSE.active = true;
      context.MOUSE.position = camera.position.clone()
          .add(dir.multiplyScalar(distance));
      if (context.MOUSE.timeout !== null)
        clearTimeout(context.MOUSE.timeout);
      setTimeout(function() {
        disableMouse();
      }, 3000);
    });

    /* Disable mouse when not active */
    $(context.container).mouseleave(function() {
      disableMouse();
    });

    boundaries =
        new THREE.Vector3(w - w * config.BOUNDARY.threshold,
                          h - h * config.BOUNDARY.threshold,
                          d - d * config.BOUNDARY.threshold);

    for (var i = 0; i < config.BOIDS.count; i++)
      createBoid();

    tick(1);
  }

  /* Setup and begin */
  init();

  /* UI COMPONENTS */

  var COHESION_MULTIPLIER = 10000;
  $('#cohesion').text(Math.round(config.BOIDS.behaviour.cohesion *
                                 COHESION_MULTIPLIER));
  $('#cohesion-slider').slider({
    range: 'min',
    min: 0,
    max: 50,
    step: 1,
    value: config.BOIDS.behaviour.cohesion * COHESION_MULTIPLIER,
    slide: function(event, ui) {
      $('#cohesion').text(ui.value);
      config.BOIDS.behaviour.cohesion = ui.value / COHESION_MULTIPLIER;
    }
  });

  var ALIGNMENT_MULTIPLIER = 1000;
  $('#alignment').text(config.BOIDS.behaviour.alignment * ALIGNMENT_MULTIPLIER);
  $('#alignment-slider').slider({
    range: 'min',
    min: 0,
    max: 50,
    step: 1,
    value: config.BOIDS.behaviour.alignment * ALIGNMENT_MULTIPLIER,
    slide: function(event, ui) {
      $('#alignment').text(ui.value);
      config.BOIDS.behaviour.alignment = ui.value / ALIGNMENT_MULTIPLIER;
    }
  });

  var SEPARATION_MULTIPLIER = 0.1;
  var SEPARATION_OFFSET = 100;
  $('#separation').text((config.BOIDS.behaviour.separation.distance -
                         SEPARATION_OFFSET) *
                        SEPARATION_MULTIPLIER);
  $('#separation-slider').slider({
    range: 'min',
    min: 0,
    max: 15,
    step: 1,
    value: (config.BOIDS.behaviour.separation.distance - SEPARATION_OFFSET) *
        SEPARATION_MULTIPLIER,
    slide: function(event, ui) {
      $('#separation').text(ui.value);
      config.BOIDS.behaviour.separation.distance = ui.value /
          SEPARATION_MULTIPLIER + SEPARATION_OFFSET;
    }
  });

  $('#no-of-boids').text(config.BOIDS.count);
  $('#no-of-boids-slider').slider({
    range: 'min',
    min: 1,
    max: 300,
    step: 1,
    value: config.BOIDS.count,
    slide: function(event, ui) {
      var n = ui.value;

      $('#no-of-boids').text(n);

      while (n != config.BOIDS.count) {
        if (n > config.BOIDS.count) {
          createBoid();
          config.BOIDS.count++;
        } else {
          destroyBoid();
          config.BOIDS.count--;
        }
      }
    }
  });

  var SPEED_MULTIPLIER = 1;
  $('#speed').text(config.BOIDS.speed.min * SPEED_MULTIPLIER + ' - ' +
                   config.BOIDS.speed.max * SPEED_MULTIPLIER);
  $('#speed-slider').slider({
    range: true,
    min: 1,
    max: 5,
    step: 0.5,
    values: [
      config.BOIDS.speed.min * SPEED_MULTIPLIER,
      config.BOIDS.speed.max * SPEED_MULTIPLIER
    ],
    slide: function(event, ui) {
      $('#speed').text(ui.values[0] + ' - ' + ui.values[1]);
      config.BOIDS.speed.min = ui.values[0] / SPEED_MULTIPLIER;
      config.BOIDS.speed.max = ui.values[1] / SPEED_MULTIPLIER;
    }
  });

  var SIGHT_MULTIPLIER = 0.1;
  $('#sight').text((config.BOIDS.los -
                    config.BOIDS.behaviour.separation.distance) *
                   SIGHT_MULTIPLIER);
  $('#sight-slider').slider({
    range: 'min',
    min: 2,
    max: 50,
    step: 1,
    value: (config.BOIDS.los - config.BOIDS.behaviour.separation.distance) *
        SIGHT_MULTIPLIER,
    slide: function(event, ui) {
      $('#sight').text(ui.value);
      config.BOIDS.los = ui.value / SIGHT_MULTIPLIER +
          config.BOIDS.behaviour.separation.distance;
    }
  });

  $('#first-person').on('switch-change', function(e, data) {
    context.SCENE.firstPerson = data.value;
    initCamera();
  });

  $('#mouse-behaviour').on('switch-change', function(e, data) {
    context.MOUSE.foe = !data.value;
  });

  $('#stats-visible').on('switch-change', function(e, data) {
    context.SCENE.stats.domElement.style.visibility = data.value ?
        'visible' : 'hidden';
  });

  $('#reset').click(function() {
    initLighting();

    for (var i = 0; i < config.BOIDS.count; i++)
      destroyBoid();

    for (var i = 0; i < config.BOIDS.count; i++)
      createBoid();
  });

  $('#show-settings').click(function() {
    if ($('#settings').is(':visible'))
      $('#settings').slideUp();
    else
      $('#settings').slideDown();
  });

  $(document).bind('keydown', 'esc', function() {
    $('#show-settings').click()
  });
}).call(Boids);
