/* Bird.js - from the three.js birds demo */
var Bird = function() {

  function v(x, y, z) {
    scope.vertices.push(new THREE.Vector3(x, y, z));
  }

  function f3(a, b, c) {
    scope.faces.push(new THREE.Face3(a, b, c));
  }

  var scope = this;

  THREE.Geometry.call(this);

  v(10, 0, 0);
  v(-10, -4, 2);
  v(-10, 0, 0);
  v(-10, -4, -2);

  v(0, 4, -12);
  v(0, 4, 12);
  v(4, 0, 0);
  v(-6, 0, 0);

  f3(0, 2, 1);
  f3(4, 7, 6);
  f3(5, 6, 7);

  this.computeCentroids();
  this.computeFaceNormals();
};

Bird.prototype = Object.create(THREE.Geometry.prototype);

/* Boids */
var Boids = Boids || {};

(function() {
  'use strict';

  /* The drawing context */
  var ctx = {
    container: document.getElementById('container'),
    camera: null,
    scene: null,
    renderer: new THREE.CanvasRenderer(),
    rendererWidth: 1.0,
    rendererHeight: 0.65,
    boundary: null,
    lights: []
  };

  /* The configuration */
  var conf = {
    size: new THREE.Vector3(600, 400, 600),
    boids: {
      count: 40,
      size: 10,
      speed: {
        min: 0.15,
        max: 0.35
      },
      los: 160,
      cohesion: 0.00005,
      alignment: 0.010,
      separation: {
        distance: 100,
        rate: 0.007
      }
    },
    boundary: {
      threshold: 0.30,
      rate: 0.00003
    }
  };

  /* Boid behaviour */
  function Boid() {
    var geometry = new Bird();

    this.mesh = new THREE.Mesh(geometry,
                               new THREE.MeshLambertMaterial({
                                 color: 0xffffff,
                                 shading: THREE.FlatShading,
                                 side: THREE.DoubleSide,
                                 overdraw: true
                               }));
    this.phase = Math.floor(Math.random() * 62.83);
    this.speed = 1;
    this.shadow = new THREE.Mesh(geometry,
                                 new THREE.MeshLambertMaterial({
                                   color: 0x000000,
                                   shading: THREE.FlatShading,
                                   side: THREE.DoubleSide,
                                   opacity: 0.1,
                                   overdraw: true
                                 }));
    this.shadow.y = -conf.size.y;

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
    ctx.scene.add(this.mesh);
    ctx.scene.add(this.shadow);
  };

  Boid.prototype.updateMesh = function() {

    /* Position */
    this.mesh.position.copy(this.position);

    /* Heading */
    var nextPos = new THREE.Vector3().copy(this.position).add(this.velocity);

    this.mesh.rotation.y = Math.atan2(-this.velocity.z, this.velocity.x);
    this.mesh.rotation.z = Math.asin(this.velocity.y / this.speed);

    /* FIXME: what a total hack (!) */
    if (isNaN(this.mesh.rotation.z))
      this.mesh.rotation.z = 0;

    /* Wing flapping */
    this.phase += Math.max(0, this.mesh.rotation.z * 0.8) + 0.06;
    this.phase %= 62.83;

    var wingY = Math.sin(this.phase) * 10;

    this.mesh.geometry.vertices[4].y = wingY;
    this.mesh.geometry.vertices[5].y = wingY;

    /* The Shadow */
    if (this.mesh.position.y > -conf.size.y) {
      this.shadow.material.opacity = 0.1;

      this.shadow.position.copy(this.mesh.position);
      this.shadow.position.y = -conf.size.y;

      this.shadow.rotation.copy(this.mesh.rotation);

      this.shadow.geometry.vertices[4].y = this.mesh.geometry.vertices[4].y;
      this.shadow.geometry.vertices[5].y = this.mesh.geometry.vertices[5].y;
    } else {
      this.shadow.material.opacity = 0;
    }

  };

  /* The boids */
  var boids = [];

  var lastUpdateTime = 0;

  var forces = {
    cohesion: 0,
    boundary: 0
  };

  var speedLimits = {
    min: 0,
    max: 0
  };

  var boundaries;

  function createBoid() {
    boids.push(new Boid());
  }

  function destroyBoid() {
    var b = boids.pop();

    ctx.scene.remove(b.mesh);
    ctx.scene.remove(b.shadow);
  }

  /* Update function */
  function tick(timestamp) {

    function update(timestamp) {

      function updateBoid(index) {

        function enforceSpeedLimits(v) {
          var speed = v.length();

          b.speed = speed;

          if (speed > speedLimits.max) {

            /* Maximum speed */
            b.speed = speedLimits.max;

            v.multiplyScalar(speedLimits.max / speed);
          } else if (speed < speedLimits.min) {

            /* Minimum speed */
            b.speed = speedLimits.min;
            speed = Math.max(speed, 0.0001);

            v.multiplyScalar(speedLimits.min / speed);
          }
        }

        var b = boids[index];
        var dv = new THREE.Vector3(0, 0, 0); // Change in velocity
        var centerOfMass = new THREE.Vector3(0, 0, 0);
        var velocityAvg = new THREE.Vector3(0, 0, 0);
        var swarmSize = 0;

        for (var i = 0; i < conf.boids.count; i++) {
          if (i !== index) {
            var otherBoid = boids[i];

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
            if (distance < conf.boids.separation.distance) {
              dv.sub(new THREE.Vector3()
                     .subVectors(otherBoid.position, b.position)
                     .multiplyScalar(conf.boids.separation.rate));
            }

            /* We total up the velocity and positions of any particles that are
             * within the range of visibility of the current particle:
             */
            if (distance < conf.boids.los) {
              centerOfMass.add(otherBoid.position);
              velocityAvg.add(otherBoid.velocity);

              swarmSize++;
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
               .multiplyScalar(forces.cohesion));

        /*
         * FLOCK ALIGNMENT
         *
         * Boids try to match velocity with other boids nearby, this creates a
         * pattern of cohesive behaviour, with the flock moving in unison:
         */
        dv.add(new THREE.Vector3()
               .subVectors(velocityAvg, b.velocity)
               .multiplyScalar(conf.boids.alignment));

        /*
         * BOUNDARY AVOIDANCE
         *
         * Boids avoid boundaries by being negatively accelerated away from
         * them when the distance to the boundary is less than a known
         * threshold:
         */
        if (b.position.x < -boundaries.x)
          dv.x += (-boundaries.x - b.position.x) * forces.boundary * b.speed;
        else if (b.position.x > boundaries.x)
          dv.x += (boundaries.x - b.position.x) * forces.boundary * b.speed;

        if (b.position.y < -boundaries.y)
          dv.y += (-boundaries.y - b.position.y) * forces.boundary * b.speed;
        else if (b.position.y > boundaries.y)
          dv.y += (boundaries.y - b.position.y) * forces.boundary * b.speed;

        if (b.position.z < -boundaries.z)
          dv.z += (-boundaries.z - b.position.z) * forces.boundary * b.speed;
        else if (b.position.z > boundaries.z)
          dv.z += (boundaries.z - b.position.z) * forces.boundary * b.speed;

        /* Apply the velocity change */
        b.velocity.add(dv);

        /* Control the rate of boids movement */
        enforceSpeedLimits(b.velocity);

        /* Update position */
        b.position.add(b.velocity);

        b.updateMesh();
      }

      var tickTime = timestamp - lastUpdateTime;
      lastUpdateTime = timestamp;

      /* Update forces */
      forces.cohesion = tickTime * conf.boids.cohesion;
      forces.boundary = tickTime * conf.boundary.rate;

      /* Update speed limits */
      speedLimits.min = tickTime * conf.boids.speed.min;
      speedLimits.max = tickTime * conf.boids.speed.max;

      for (var i = 0; i < conf.boids.count; i++)
        updateBoid(i);
    }

    function render() {
      var timer = Date.now() * 0.00005;

      ctx.camera.position.x = Math.cos(timer) * conf.size.x * 1.75;
      ctx.camera.position.z = Math.sin(timer) * conf.size.z * 1.75;

      ctx.camera.lookAt(ctx.cameraTarget);

      ctx.renderer.render(ctx.scene, ctx.camera);
    }

    update(timestamp);
    render();
    requestAnimationFrame(tick);
  }

  function initLighting() {

    if (ctx.lights.length > 0) {
      /* Clear lights */
      for (var i = ctx.lights.length - 1; i >= 0; i--)
        ctx.scene.remove(ctx.lights.pop());
    }

    var ambientLight = new THREE.AmbientLight(0x111133);
    ctx.scene.add(ambientLight);
    ctx.lights.push(ambientLight);

    var light = new THREE.DirectionalLight(0x7a2338);
    light.position.set(Math.random() - 0.5,
                       Math.random() - 0.5,
                       Math.random() - 0.5);
    light.position.normalize();
    ctx.scene.add(light);

    ctx.lights.push(light);

    var light = new THREE.DirectionalLight(0x21d592);
    light.position.set(Math.random() - 0.5,
                       Math.random() - 0.5,
                       Math.random() - 0.5);
    light.position.normalize();
    ctx.scene.add(light);

    ctx.lights.push(light);
  }

  function setRendererSize() {
    ctx.renderer.setSize(container.offsetWidth * ctx.rendererWidth,
                         window.innerHeight * ctx.rendererHeight);
  }

  /* Initialisation function */
  function init() {

    function initCamera() {
      ctx.camera = new THREE.PerspectiveCamera(60,
                                               window.innerWidth /
                                               window.innerHeight,
                                               1, 10000);

      ctx.camera.position.y = conf.size.y * 0.4;

      ctx.cameraTarget = new THREE.Vector3(ctx.scene.position.x,
                                           ctx.scene.position.y,
                                           ctx.scene.position.z);
    }

    function initGrid() {
      ctx.boundary = new THREE.Geometry();

      /* Bottom face */
      ctx.boundary.vertices.push(new THREE.Vector3(-conf.size.x,
                                                   -conf.size.y,
                                                   -conf.size.z));
      ctx.boundary.vertices.push(new THREE.Vector3(conf.size.x,
                                                   -conf.size.y,
                                                   -conf.size.z));

      ctx.boundary.vertices.push(new THREE.Vector3(conf.size.x,
                                                   -conf.size.y,
                                                   -conf.size.z));
      ctx.boundary.vertices.push(new THREE.Vector3(conf.size.x,
                                                   -conf.size.y,
                                                   conf.size.z));

      ctx.boundary.vertices.push(new THREE.Vector3(conf.size.x,
                                                   -conf.size.y,
                                                   conf.size.z));
      ctx.boundary.vertices.push(new THREE.Vector3(-conf.size.x,
                                                   -conf.size.y,
                                                   conf.size.z));

      ctx.boundary.vertices.push(new THREE.Vector3(-conf.size.x,
                                                   -conf.size.y,
                                                   conf.size.z));
      ctx.boundary.vertices.push(new THREE.Vector3(-conf.size.x,
                                                   -conf.size.y,
                                                   -conf.size.z));

      /* Sides */
      ctx.boundary.vertices.push(new THREE.Vector3(-conf.size.x,
                                                   -conf.size.y,
                                                   -conf.size.z));
      ctx.boundary.vertices.push(new THREE.Vector3(-conf.size.x,
                                                   conf.size.y,
                                                   -conf.size.z));

      ctx.boundary.vertices.push(new THREE.Vector3(-conf.size.x,
                                                   -conf.size.y,
                                                   conf.size.z));
      ctx.boundary.vertices.push(new THREE.Vector3(-conf.size.x,
                                                   conf.size.y,
                                                   conf.size.z));

      ctx.boundary.vertices.push(new THREE.Vector3(conf.size.x,
                                                   -conf.size.y,
                                                   conf.size.z));
      ctx.boundary.vertices.push(new THREE.Vector3(conf.size.x,
                                                   conf.size.y,
                                                   conf.size.z));

      ctx.boundary.vertices.push(new THREE.Vector3(conf.size.x,
                                                   -conf.size.y,
                                                   -conf.size.z));
      ctx.boundary.vertices.push(new THREE.Vector3(conf.size.x,
                                                   conf.size.y,
                                                   -conf.size.z));

      /* Top face */
      ctx.boundary.vertices.push(new THREE.Vector3(-conf.size.x,
                                                   conf.size.y,
                                                   -conf.size.z));
      ctx.boundary.vertices.push(new THREE.Vector3(conf.size.x,
                                                   conf.size.y,
                                                   -conf.size.z));

      ctx.boundary.vertices.push(new THREE.Vector3(conf.size.x,
                                                   conf.size.y,
                                                   -conf.size.z));
      ctx.boundary.vertices.push(new THREE.Vector3(conf.size.x,
                                                   conf.size.y,
                                                   conf.size.z));

      ctx.boundary.vertices.push(new THREE.Vector3(conf.size.x,
                                                   conf.size.y,
                                                   conf.size.z));
      ctx.boundary.vertices.push(new THREE.Vector3(-conf.size.x,
                                                   conf.size.y,
                                                   conf.size.z));

      ctx.boundary.vertices.push(new THREE.Vector3(-conf.size.x,
                                                   conf.size.y,
                                                   conf.size.z));
      ctx.boundary.vertices.push(new THREE.Vector3(-conf.size.x,
                                                   conf.size.y,
                                                   -conf.size.z));

      var line = new THREE.Line(ctx.boundary,
                                new THREE.LineBasicMaterial({
                                  color: 0x000000,
                                  opacity: 0.1
                                }));
      line.type = THREE.LinePieces;
      ctx.scene.add(line);
    }

    function onWindowResize() {
      ctx.camera.left = window.innerWidth / - 2;
      ctx.camera.right = window.innerWidth / 2;
      ctx.camera.top = window.innerHeight / 2;
      ctx.camera.bottom = window.innerHeight / - 2;

      setRendererSize();
      ctx.camera.updateProjectionMatrix();
    }

    ctx.scene = new THREE.Scene();

    initCamera();
    initLighting();
    initGrid();

    setRendererSize();
    ctx.container.appendChild(ctx.renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);

    boundaries =
        new THREE.Vector3(conf.size.x - conf.size.x * conf.boundary.threshold,
        conf.size.y - conf.size.y * conf.boundary.threshold,
        conf.size.z - conf.size.z * conf.boundary.threshold);

    for (var i = 0; i < conf.boids.count; i++)
      createBoid();

    tick(1);
  }

  /* Setup and begin */
  init();

  /* UI COMPONENTS */

  var COHESION_MULTIPLIER = 100000;
  $('#cohesion').text(conf.boids.cohesion * COHESION_MULTIPLIER);
  $('#cohesion-slider').slider({
    range: 'min',
    min: 0,
    max: 25,
    step: 1,
    value: conf.boids.cohesion * COHESION_MULTIPLIER,
    slide: function(event, ui) {
      $('#cohesion').text(ui.value);
      conf.boids.cohesion = ui.value / COHESION_MULTIPLIER;
    }
  });

  var ALIGNMENT_MULTIPLIER = 1000;
  $('#alignment').text(conf.boids.alignment * ALIGNMENT_MULTIPLIER);
  $('#alignment-slider').slider({
    range: 'min',
    min: 0,
    max: 25,
    step: 1,
    value: conf.boids.alignment * ALIGNMENT_MULTIPLIER,
    slide: function(event, ui) {
      $('#alignment').text(ui.value);
      conf.boids.alignment = ui.value / ALIGNMENT_MULTIPLIER;
    }
  });

  var SEPARATION_MULTIPLIER = 0.1;
  $('#separation').text(conf.boids.separation.distance * SEPARATION_MULTIPLIER);
  $('#separation-slider').slider({
    range: 'min',
    min: 0,
    max: 25,
    step: 1,
    value: conf.boids.separation.distance * SEPARATION_MULTIPLIER,
    slide: function(event, ui) {
      $('#separation').text(ui.value);
      conf.boids.separation.distance = ui.value / SEPARATION_MULTIPLIER;
    }
  });

  $('#no-of-boids').text(conf.boids.count);
  $('#no-of-boids-slider').slider({
    range: 'min',
    min: 1,
    max: 200,
    step: 1,
    value: conf.boids.count,
    slide: function(event, ui) {
      var n = ui.value;

      $('#no-of-boids').text(n);

      while (n != conf.boids.count) {
        if (n > conf.boids.count) {
          createBoid();
          conf.boids.count++;
        } else {
          destroyBoid();
          conf.boids.count--;
        }
      }
    }
  });

  var SPEED_MULTIPLIER = 10;
  $('#speed').text(conf.boids.speed.min * SPEED_MULTIPLIER + ' - ' +
                   conf.boids.speed.max * SPEED_MULTIPLIER);
  $('#speed-slider').slider({
    range: true,
    min: 0.5,
    max: 5,
    step: 0.5,
    values: [
      conf.boids.speed.min * SPEED_MULTIPLIER,
      conf.boids.speed.max * SPEED_MULTIPLIER
    ],
    slide: function(event, ui) {
      $('#speed').text(ui.values[0] + ' - ' + ui.values[1]);
      conf.boids.speed.min = ui.values[0] / SPEED_MULTIPLIER;
      conf.boids.speed.max = ui.values[1] / SPEED_MULTIPLIER;
    }
  });

  var SIGHT_MULTIPLIER = 0.1;
  $('#sight').text((conf.boids.los - conf.boids.separation.distance) *
                   SIGHT_MULTIPLIER);
  $('#sight-slider').slider({
    range: 'min',
    min: 2,
    max: 50,
    step: 2,
    value: (conf.boids.los - conf.boids.separation.distance) *
        SIGHT_MULTIPLIER,
    slide: function(event, ui) {
      $('#sight').text(ui.value);
      conf.boids.los = ui.value / SIGHT_MULTIPLIER +
          conf.boids.separation.distance;
    }
  });

  $('#width').text(Math.round(ctx.rendererWidth * 100) + '%');
  $('#width-slider').slider({
    range: 'min',
    min: 0.50,
    max: 1.0,
    step: 0.01,
    value: ctx.rendererWidth,
    slide: function(event, ui) {
      $('#width').text(Math.round(ui.value * 100) + '%');
      ctx.rendererWidth = ui.value;
      setRendererSize();
    }
  });

  $('#height').text(Math.round(ctx.rendererHeight * 100) + '%');
  $('#height-slider').slider({
    range: 'min',
    min: 0.50,
    max: 1.0,
    step: 0.01,
    value: ctx.rendererHeight,
    slide: function(event, ui) {
      $('#height').text(Math.round(ui.value * 100) + '%');
      ctx.rendererHeight = ui.value;
      setRendererSize();
    }
  });

  $('#reset').click(function() {
    initLighting();

    for (var i = 0; i < conf.boids.count; i++)
      destroyBoid();

    for (var i = 0; i < conf.boids.count; i++)
      createBoid();
  });

}).call(Boids);
