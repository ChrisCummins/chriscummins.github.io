var Gol = Gol || {};

(function() {
  'use strict';

  /*
   * A proper modulus operator.
   */
  Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
  };

  /*
   * A mouse object, which maintains an internal state and is responsible for
   * attaching the relevant mouse event handlers.
   */
  var Mouse = function() {
    this.x = 0,
    this.y = 0,
    this.leftDown = false;

    /*
     * Create a new cell if the mouse is positioned over a cell.
     */
    function spawnCell(mouse) {
      var cell;

      /*
       * Returns the cell at the mouse point, or null if the mouse is not over
       * one.
       */
      function getCellAtPos(x, y) {
        /* Get the i, j coordinates of the cell. */
        var col = Math.floor((x - tile.offX) / (tile.size + tile.margin));
        var row = Math.floor((y - tile.offY) / (tile.size + tile.margin));

        /* Return nothing if the coordinates are invalid */
        if (col > grid.w || col < 0 || row > grid.h || row < 0)
          return null;

        /* Return the cell */
        return cells[row * grid.w + col];
      }

      /* Spawn a cell if possible. */
      if ((cell = getCellAtPos(mouse.x, mouse.y)) !== null)
        cell.spawn();
    };

    /* Event listeners */
    canvas.addEventListener('mousemove', function(event) {
      this.x = event.clientX - bounds.left;
      this.y = event.clientY - bounds.top;

      if (this.leftDown)
        spawnCell(this);
    }, false);

    canvas.addEventListener('mousedown', function(event) {
      if (event.button == 0) {
        this.leftDown = true;
        spawnCell(this);
      } else if (event.button == 2)
        paused = true;
    }, false);

    canvas.addEventListener('mouseup', function(event) {
      if (event.button == 0)
        this.leftDown = false;
      else if (event.button == 2)
        paused = false;
    }, false);
  }

  /*
   * A cell object.
   */
  var Cell = function(i, j) {
    /* Grid coordinates */
    this.i = i, this.j = j;

    /* Geometry coordinates */
    this.x = i * (tile.size + tile.margin) + tile.offX;
    this.y = j * (tile.size + tile.margin) + tile.offY;

    this.xMax = this.x + tile.size;
    this.yMax = this.y + tile.size;

    /* The current state of the cell. 'true' for alive, else 'false' if dead. */
    this.current = false;

    /* The state of the cell at the next turn. 'true' for alive, else 'false' if
     * dead. */
    this.next = false;

    this.timestamp = new Date().getTime();

    /* The eight neighbouring cells */
    this.neighbours = [];

    /* The number of alive neighbours */
    this.aliveNeighbours = 0;
  }

  /*
   * Initialise a cell. This must be called after all of the cells in a grid
   * have been instantiated.
   */
  Cell.prototype.init = function() {
    /* Index into cells array */
    var n = grid.w * this.j + this.i;

    /* Top row */
    this.neighbours.push(cells[(n - grid.w - 1).mod(grid.size)]);
    this.neighbours.push(cells[(n - grid.w).mod(grid.size)]);
    this.neighbours.push(cells[(n - grid.w + 1).mod(grid.size)]);

    /* Current row */
    this.neighbours.push(cells[(n - 1).mod(grid.size)]);
    this.neighbours.push(cells[(n + 1).mod(grid.size)]);

    /* Bottom row */
    this.neighbours.push(cells[(n + grid.w - 1).mod(grid.size)]);
    this.neighbours.push(cells[(n + grid.w).mod(grid.size)]);
    this.neighbours.push(cells[(n + grid.w + 1).mod(grid.size)]);
  }

  Cell.prototype.spawn = function() {
    this.create();
    this.current = this.next;
  }

  Cell.prototype.create = function() {
    this.next = true;
    this.timestamp = new Date().getTime();
  }

  Cell.prototype.destroy = function() {
    this.next = false;
    this.timestamp = new Date().getTime();
  }

  Cell.prototype.isAlive = function() {
    return this.current;
  }

  Cell.prototype.update = function() {

    /* Get the number of living neighbours */
    this.aliveNeighbours = 0;
    for (var i = 0; i < 8; i++) {
      if (this.neighbours[i].isAlive())
        this.aliveNeighbours++;
    }

    if (this.current === true) {

      /* RULE: Any live cell with fewer than two live neighbours dies, as if
       * caused by under-population.
       */
      if (this.aliveNeighbours < 2)
        this.destroy();

      /*
       * RULE: Any live cell with more than three live neighbours dies, as if by
       * overcrowding.
       */
      if (this.aliveNeighbours > 3)
        this.destroy();

      /* RULE: Any live cell with two or three live neighbours lives on to the
       * next generation. */
    } else {

      /* RULE: Any dead cell with exactly three live neighbours becomes a live
       * cell, as if by reproduction.
       */
      if (this.aliveNeighbours === 3)
        this.create();
    }
  }

  Cell.prototype.draw = function() {

    /**
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h, s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     *
     * @param   Number  h       The hue
     * @param   Number  s       The saturation
     * @param   Number  l       The lightness
     * @return  Array           The RGB representation
     */
    function hslToRgb(h, s, l) {
      function hue2rgb(p, q, t) {
        if (t < 0)
          t += 1;

        if (t > 1)
          t -= 1;

        if (t < 1/6)
          return p + (q - p) * 6 * t;

        if (t < 1/2)
          return q;

        if (t < 2/3)
          return p + (q - p) * (2/3 - t) * 6;

        return p;
      }

      var r, g, b;

      if (s == 0) {
        r = g = b = l;
      } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }

      return [r * 255, g * 255, b * 255];
    }

    var h = 0, s = 0.7, l = 0.7;
    var stateTime = time.current - this.timestamp;

    if (this.isAlive()) {
      h = (stateTime * tile.hueRate).mod(1);
    } else {
      l = Math.max(0, l - (stateTime * tile.decayRate));
    }

    l += this.aliveNeighbours * tile.lumInfluence;

    /* Optimise for zero-luminosity cells, by checking first to see that the
     * luminosity is not zero (i.e. black) before performing the HSL
     * conversion. */
    if (l > 0) {
      var rgb = hslToRgb(h, s, l);

      renderer.fillStyle = 'rgb(' + Math.round(rgb[0]) + ',' +
        Math.round(rgb[1]) + ',' +
        Math.round(rgb[2]) + ')';

      renderer.fillRect(this.x, this.y, tile.size, tile.size);
    } else {
      /* Empty (black) square */
      renderer.clearRect(this.x, this.y, tile.size, tile.size);
    }
  }

  /*
   * A time object, responsible for keeping track of the simulation clocks and
   * rate of simulation.
   */
  var Time = function(fps) {
    this.fps = fps;
    this.minFps = Math.max(0, Math.floor(this.fps / 2));
    this.dt = 1000 / this.fps;
    this.maxTickTime = 1000 / this.minFps;
    this.current = new Date().getTime();
    this.accumulator = 0;
  }

  /*
   * Run time variables.
   */
  var container = document.getElementById('container');
  var canvas = document.createElement('canvas')
  var renderer = canvas.getContext('2d');
  var bounds = canvas.getBoundingClientRect()
  var mouse = new Mouse();
  var paused = false;
  var time = new Time(4);
  var tile = {
    size: 10,
    margin: 1,
    offX: 5,
    offY: 5,
    decayRate: 0.0015,
    hueRate: 0.0002,
    lumInfluence: 0.025
  };
  var grid = {
    i: 0,
    j: 0,
    size: 0
  };
  var cells = [];

  /*
   * The main event loop. This updates the simulation state by the desired
   * amount, then draws the new state to the canvas, before queuing up another
   * tick.
   *
   * @timestamp A numerical timestamp provided by the requestAnimationFrame()
   * API.
   */
  function tick(timestamp) {

    /*
     * Update simulation state by one step.
     */
    function update() {

      /* First we advance each cell to its next state. */
      for (var i = 0; i < cells.length; i++)
        cells[i].current = cells[i].next;

      /* Update each cell in turn */
      for (var i = 0; i < cells.length; i++)
        cells[i].update();
    }

    /*
     * Draw the simulation state.
     */
    function draw() {
      for (var i = 0; i < cells.length; i++)
        cells[i].draw();
    }

    /* Update the clocks */
    var newTime = new Date().getTime();
    var tickTime = newTime - time.current;

    /* Enforce a maximum frame time to prevent the "spiral of death" when
     * operating under heavy load */
    if (tickTime > time.maxTickTime)
      tickTime = time.maxTickTime;

    time.current = newTime;

    /* Update the simulation state as required. If the simulation is paused, we
     * don't update the state or increase the accumulator. */
    if (paused !== true) {
      time.accumulator += tickTime;

      for ( ; time.accumulator >= time.dt; time.accumulator -= time.dt)
        update();
    }

    draw();
    requestAnimationFrame(tick);
  }

  /*
   * Initialisation function. Set global variables, initialise canvas and attach
   * resize handlers etc.
   */
  function init() {

    /*
     * Event handler for window resizes.
     */
    function onWindowResize() {

      /*
       * Clear the current grid and create a new one.
       */
      function newGrid() {

        /* Clear any existing cells. */
        cells = [];

        for (var j = 0; j < grid.h; j++) {
          for (var i = 0; i < grid.w; i++) {
            cells.push(new Cell(i, j));

            /* Randomly populate the starting grid. */
            if (Math.random() > 0.85)
              cells[j * grid.w + i].create();
          }
        }

        /* Now that we have created the cells, we must initialise them. */
        for (var i = 0; i < cells.length; i++) {
          cells[i].init();
        }
      }

      var w = window.innerWidth - 2 * tile.offX;
      var h = window.innerHeight - 2 * tile.offY;

      grid.w = Math.floor(w / (tile.size + tile.margin)) - 1;
      grid.h = Math.floor(h / (tile.size + tile.margin)) - 1;
      grid.size = grid.w * grid.h;

      canvas.width = w;
      canvas.height = h;

      bounds = canvas.getBoundingClientRect();
      newGrid();
    }

    canvas.id = 'canvas';
    container.appendChild(canvas);
    window.addEventListener('resize', onWindowResize, false);
    onWindowResize();
  }

  /*
   * Initialisation and setup phase:
   */
  init();

  /* Bootstrap the event loop */
  tick();

}).call(Gol);
