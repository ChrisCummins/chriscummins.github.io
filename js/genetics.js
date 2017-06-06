/*
 *                Genetics Algorithm to Grow Your Own Picture
 *
 * Written by Chris Cummins <chrisc.101@gmail.com>
 * Copyright (c) 2013 Chris Cummins
 * https://chriscummins.cc
 * https://chriscummins.cc/genetics
 *
 * Based on `JavaScript Genetic Algorithm' - Copyright (c) 2009 Jacob Seidelin.
 *   jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 */

/*
 * We lump the API in a `Genetics' namespace.
 */
var Genetics = Genetics || {};

(function() {
  'use strict';

  /* The analytics pane elements */
  var ap;

  /* The working area, used by the fitness function to determine an individuals
   * fitness.
   */
  var workingCanvas;
  var workingCtx;
  var workingData = [];

  /* The output area, where we display the fittest population.
   */
  var outputCanvas;
  var outputCtx;

  /* The reference area, where we display the target image that we are
   * selecting towards.
   */
  var referenceCanvas;
  var referenceCtx;
  var referenceImage;

  /* Genetics options.
   */
  var populationSize;
  var selectionCutoff;
  var mutationChance;
  var mutateAmount;
  var fittestSurvive;
  var randomInheritance;
  var diffSquared;

  /* Graphics options.
   */
  var workingSize;
  var polygons;
  var vertices;
  var fillPolygons;

  /* Simulation session variables.
   */
  var clock;
  var jiffies;
  var numberOfImprovements;
  var geneSize;
  var dnaLength;
  var lowestFitness;
  var highestFitness;
  var population;
  var startTime;

  /*
   * When the simulation is paused, this variable is set to the currently
   * elapsed time (in milliseconds). Upon resume, this value is subtracted from
   * the new start time so as to account for the time spent paused. This
   * maintains the accuracy of the elapsed time feedback, as otherwise all time
   * spent in a paused state would still count towards elpased time, which is
   * instead used to measure the active time.
   */
  var resumedTime = 0;

  /*
   * Determines whether the genetics program is compatible with the host
   * browser. Returns true if yes, else false.
   */
  function isSupported() {
    var isSupported = false;

    /* Perform a simple check to verify that getContext() and getImageData() are
     * supported:
     */
    if (referenceCanvas.getContext &&
        referenceCanvas.getContext('2d').getImageData) {
      isSupported = true;
    }

    return isSupported;
  }


  /*
   * Convert a seconds value to a human-redable string.
   */
  function secondsToString(s) {
    var h = Math.floor(s / 3600);
    var m = Math.floor(s % 3600 / 60);

    s = Math.floor(s % 3600 % 60);

    return ((h > 0 ? h + ':' : '') +
            (m > 0 ? (h > 0 && m < 10 ? '0' : '') +
             m + ':' : '0:') + (s < 10 ? '0' : '') + s);
  }

  /*
   * Creates a new individual. Each individual comprises of their string of DNA,
   * and their fitness. In addition, a draw() method is provided for visualising
   * the individual. If mother and father are omitted, a random individual is
   * generated.
   */
  function Individual(mother, father) {

    /* The individual's genetic composition */
    this.dna = [];

    if (mother && father) {

      /*
       * Breed from mother and father:
       */

      /* Used in random inheritance */
      var inheritSplit = (Math.random() * dnaLength) >> 0;

      for (var i = 0; i < dnaLength; i += geneSize) {

        /* The parent's gene which will be inherited */
        var inheritedGene;

        if (randomInheritance) {
          /* Randomly inherit genes from parents in an uneven manner */
          inheritedGene = (i < inheritSplit) ? mother : father;
        } else {
          /* Inherit genes evenly from both parents */
          inheritedGene = (Math.random() < 0.5) ? mother : father;
        }

        /*
         * Create the genes:
         */
        for (var j = 0; j < geneSize; j++) {

          /* The DNA strand */
          var dna = inheritedGene[i + j];

          /* Mutate the gene */
          if (Math.random() < mutationChance) {

            /* Apply the random mutation */
            dna += Math.random() * mutateAmount * 2 - mutateAmount;

            /* Keep the value in range */
            if (dna < 0)
              dna = 0;

            if (dna > 1)
              dna = 1;
          }

          this.dna.push(dna);
        }
      }

    } else {

      /*
       * Generate a random individual:
       */

      for (var g = 0; g < dnaLength; g += geneSize) {

        /* Generate RGBA color values */
        this.dna.push(Math.random(), // R
                      Math.random(), // G
                      Math.random(), // B
                      Math.max(Math.random() * Math.random(), 0.2)); // A

        /* Generate XY positional values */
        var x = Math.random();
        var y = Math.random();

        for (var j = 0; j < vertices; j++) {
          this.dna.push(x + Math.random() - 0.5, // X
                        y + Math.random() - 0.5); // Y
        }
      }
    }

    /*
     * Determine the individual's fitness:
     */

    this.draw(workingCtx, workingSize, workingSize);

    var imageData = workingCtx.getImageData(0, 0,
                                            workingSize,
                                            workingSize).data;
    var diff = 0;

    /*
     * Sum up the difference between the pixel values of the reference
     * image and the current individual. Subtract the ratio of this
     * difference and the largest possible difference from 1 in order
     * to get the fitness.
     */
    if (diffSquared) {  // Sum squared differences.
      for (var p = 0; p < workingSize * workingSize * 4; p++) {
        var dp = imageData[p] - workingData[p];
        diff += dp * dp;
      }

    this.fitness = 1 - diff / (workingSize * workingSize * 4 * 256 * 256);
    } else {  // Sum differences.
      for (var p = 0; p < workingSize * workingSize * 4; p++)
        diff += Math.abs(imageData[p] - workingData[p]);

      this.fitness = 1 - diff / (workingSize * workingSize * 4 * 256);
    }
  }

  /*
   * Draw a representation of a DNA string to a canvas.
   */
  Individual.prototype.draw = function(ctx, width, height) {

    /* Set the background */
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    /*
     * Draw each gene sequentially:
     */
    for (var g = 0; g < dnaLength; g += geneSize) {

      /* Draw the starting vertex */
      ctx.beginPath();
      ctx.moveTo(this.dna[g + 4] * width, this.dna[g + 5] * height);

      /* Create each vertices sequentially */
      for (var i = 0; i < vertices - 1; i++) {
        ctx.lineTo(this.dna[g + i * 2 + 6] * width,
                   this.dna[g + i * 2 + 7] * height);
      }

      ctx.closePath();

      var styleString = 'rgba(' +
          ((this.dna[g] * 255) >> 0) + ',' + // R - int [0,255]
          ((this.dna[g + 1] * 255) >> 0) + ',' + // G - int [0,255]
          ((this.dna[g + 2] * 255) >> 0) + ',' + // B - int [0,255]
          this.dna[g + 3] + ')'; // A - float [0,1]

      if (fillPolygons) {

        /*
         * Create a polygon:
         */
        ctx.fillStyle = styleString;
        ctx.fill();

      } else {

        /*
         * Trace an outline:
         */
        ctx.lineWidth = 1;
        ctx.strokeStyle = styleString;
        ctx.stroke();

      }
    }
  };

  /*
   * This object represents a entire population, composed of a number of
   * individuals. It provides a iterate() function to breed a new generation.
   */
  function Population(size) {
    this.individuals = [];

    /* Generate our random starter culture */
    for (var i = 0; i < size; i++)
      this.individuals.push(new Individual());

  }

  /*
   * Breed a new generation.
   */
  Population.prototype.iterate = function() {

    if (this.individuals.length > 1) {

      /*
       * Breed a new generation:
       */

      var size = this.individuals.length;
      var offspring = [];

      /* The number of individuals from the current generation to select for
       * breeding
       */
      var selectCount = Math.floor(this.individuals.length * selectionCutoff);

      /* The number of individuals to randomly generate */
      var randCount = Math.ceil(1 / selectionCutoff);

      this.individuals = this.individuals.sort(function(a, b) {
        return b.fitness - a.fitness;
      });

      if (fittestSurvive)
        randCount--;

      for (var i = 0; i < selectCount; i++) {

        for (var j = 0; j < randCount; j++) {
          var randIndividual = i;

          while (randIndividual == i)
            randIndividual = (Math.random() * selectCount) >> 0;

          offspring.push(new Individual(this.individuals[i].dna,
                                        this.individuals[randIndividual].dna));
        }
      }

      if (fittestSurvive) {
        this.individuals.length = selectCount;
        this.individuals = this.individuals.concat(offspring);
      } else {
        this.individuals = offspring;
      }

      this.individuals.length = size;

    } else {

      /*
       * Asexual reproduction:
       */

      var parent = this.individuals[0];
      var child = new Individual(parent.dna, parent.dna);

      if (child.fitness > parent.fitness)
        this.individuals = [child];

    }
  };


  /*
   * Return the fittest individual from the population.
   */
  Population.prototype.getFittest = function() {

    return this.individuals.sort(function(a, b) {
      return b.fitness - a.fitness;
    })[0];

  };

  /*
   * Determines whether the genetics simulation is currently running.
   */
  function isRunning() {
    return clock;
  }

  /*
   * Determines whether the genetics simulation is currently paused.
   */
  function isPaused() {
    return jiffies && !clock;
  }

  /*
   * Determines whether the genetics simulation is currently stopped.
   */
  function isStopped() {
    return !isRunning() && !isPaused();
  }

  /*
   * Upload a new file to use as a reference image.
   */
  function fileSelectCb(e) {
    var file = e.target.files[0];

    /* FIXME: AJAX */
    $('#image-upload-form').submit();

    console.log(file.name);
  }

  /*
   * Set a new image to use as the reference image.
   */
  function setImage(src) {
    referenceImage.onload = prepareImage;
    referenceImage.src = src;
  }


  /*
   * Prepare an image for use as the reference image.
   */
  function prepareImage() {
    /* FIXME: add support for images of size other than 350x350. This requires
     * scaling the image and cropping as needed */

    referenceCanvas.width = workingSize;
    referenceCanvas.height = workingSize;

    referenceCtx.drawImage(referenceImage,
                           0, 0, 350, 350, 0, 0,
                           workingSize, workingSize);

    var imageData = referenceCtx.getImageData(0, 0,
                                              workingSize,
                                              workingSize).data;

    workingData = [];
    var p = workingSize * workingSize * 4;

    for (var i = 0; i < p; i++) {
      workingData[i] = imageData[i];
    }

    referenceCanvas.width = 350;
    referenceCanvas.height = 350;
    referenceCtx.drawImage(referenceImage, 0, 0);
    highestFitness = 0;
    lowestFitness = 100;
  }


  /*
   * Initialise the configuration panel.
   */
  function initConfiguration() {

    /*
     * Prepare the sliders:
     */
    $('#population-size-slider').slider({
      range: 'min', min: 0, max: 100, step: 1,
      slide: function(event, ui) {
        $('#population-size').text(Math.max(1, ui.value));
      }
    });

    $('#cutoff-slider').slider({
      range: 'min', min: 1, max: 100, step: 1,
      slide: function(event, ui) {
        $('#cutoff').text(ui.value + '%');
      }
    });

    $('#mutation-chance-slider').slider({
      range: 'min', min: 0, max: 5, step: 0.1,
      slide: function(event, ui) {
        $('#mutation-chance').text(ui.value.toFixed(1) + '%');
      }
    });

    $('#mutation-amount-slider').slider({
      range: 'min', min: 0, max: 100, step: 1,
      slide: function(event, ui) {
        $('#mutation-amount').text(ui.value + '%');
      }
    });

    $('#polygons-slider').slider({
      range: 'min', min: 0, max: 500, step: 5,
      slide: function(event, ui) {
        $('#polygons').text(Math.max(1, ui.value));
      }
    });

    $('#vertices-slider').slider({
      range: 'min', min: 1, max: 30, step: 1,
      slide: function(event, ui) {
        $('#vertices').text(ui.value);
      }
    });

    $('#resolution-slider').slider({
      range: 'min', min: 0, max: 350, step: 5,
      slide: function(event, ui) {
        var resolution = Math.max(1, ui.value);

        $('#resolution').text(resolution + 'x' + resolution);
      }
    });
  };

  /*
   * Set a new configuration. If any parameter is missing, default values are
   * used.
   */
  function setConfiguration(_populationSize,
                            _cutoffSlider,
                            _fittestSurvive,
                            _mutationChance,
                            _mutationAmount,
                            _polygons,
                            _vertices,
                            _resolution,
                            _fillPolygons,
                            _randomInheritance,
                            _diffSquared) {

    if (_populationSize === undefined)
      var _populationSize = 50;
    $('#population-size-slider').slider('value', _populationSize);
    $('#population-size').text(_populationSize);

    if (_cutoffSlider === undefined)
      var _cutoffSlider = 15;
    $('#cutoff-slider').slider('value', _cutoffSlider);
    $('#cutoff').text(_cutoffSlider + '%');

    if (_fittestSurvive === undefined)
      var _fittestSurvive = false;
    $('#fittest-survive').prop('checked', _fittestSurvive);

    if (_mutationChance === undefined)
      var _mutationChance = 1.0;
    $('#mutation-chance-slider').slider('value', _mutationChance);
    $('#mutation-chance').text(_mutationChance.toFixed(1) + '%');

    if (_mutationAmount === undefined)
      var _mutationAmount = 10;
    $('#mutation-amount-slider').slider('value', _mutationAmount);
    $('#mutation-amount').text(_mutationAmount + '%');

    if (_polygons === undefined)
      var _polygons = 125;
    $('#polygons-slider').slider('value', _polygons);
    $('#polygons').text(_polygons);

    if (_vertices === undefined)
      var _vertices = 3;
    $('#vertices-slider').slider('value', _vertices);
    $('#vertices').text(_vertices);

    if (_resolution === undefined)
      var _resolution = 75;
    $('#resolution-slider').slider('value', _resolution);
    $('#resolution').text(_resolution + 'x' + _resolution);

    if (_fillPolygons === undefined)
      var _fillPolygons = true;
    $('#fill-polygons').prop('checked', _fillPolygons);

    if (_randomInheritance === undefined)
      var _randomInheritance = false;
    $('#random-inheritance').prop('checked', _randomInheritance);

    if (_diffSquared === undefined)
      var _diffSquared = true;
    $('#diff-squared').prop('checked', _diffSquared);
  }

  /*
   * Retrieve the session from the configuration panel
   */
  function getConfiguration() {

    populationSize = parseInt($('#population-size').text());
    selectionCutoff = parseFloat($('#cutoff').text()) / 100;
    fittestSurvive = $('#fittest-survive')[0].checked;
    mutationChance = parseFloat($('#mutation-chance').text()) / 100;
    mutateAmount = parseFloat($('#mutation-amount').text()) / 100;
    polygons = parseInt($('#polygons').text());
    vertices = parseInt($('#vertices').text());
    workingSize = parseInt($('#resolution').text());
    fillPolygons = $('#fill-polygons')[0].checked;
    randomInheritance = $('#random-inheritance')[0].checked;
    diffSquared = $('#diff-squared')[0].checked;

    /* Derive certain state variables */
    geneSize = (4 + vertices * 2);
    dnaLength = polygons * (4 + vertices * 2);

    /* Set the working canvas dimensions */
    workingCanvas.width = workingSize;
    workingCanvas.height = workingSize;
    workingCanvas.style.width = workingSize;
    workingCanvas.style.height = workingSize;
  }


  /*
   * Run the simulation.
   */
  function runSimulation() {
    document.body.classList.remove('genetics-inactive');
    document.body.classList.add('genetics-active');

    if (isPaused())
      startTime = new Date().getTime() - resumedTime;

    if (isStopped()) {
      jiffies = 0;
      numberOfImprovements = 0;
      startTime = new Date().getTime();
      population = new Population(populationSize);
    }

    /* Each tick produces a new population and new fittest */
    function tick() {

      /* Breed a new generation */
      population.iterate();
      jiffies++;

      var fittest = population.getFittest();
      var totalTime = ((new Date().getTime() - startTime) / 1000);
      var timePerGeneration = (totalTime / jiffies) * 1000;
      var timePerImprovment = (totalTime / numberOfImprovements) * 1000;
      var currentFitness = (fittest.fitness * 100);

      if (currentFitness > highestFitness) {
        highestFitness = currentFitness;
        /* Improvement was made */
        numberOfImprovements++;
      } else if (currentFitness < lowestFitness) {
        lowestFitness = currentFitness;
      }

      /* Draw the best fit to output */
      fittest.draw(outputCtx, 350, 350);

      /* Write out the internal state to analytics panel */
      ap.elapsedTime.text(secondsToString(Math.round(totalTime)));
      ap.numberOfGenerations.text(jiffies);
      ap.timePerGeneration.text(timePerGeneration.toFixed(2) + ' ms');
      ap.timePerImprovment.text(timePerImprovment.toFixed(2) + ' ms');
      ap.currentFitness.text(currentFitness.toFixed(2) + '%');
      ap.highestFitness.text(highestFitness.toFixed(2) + '%');
      ap.lowestFitness.text(lowestFitness.toFixed(2) + '%');
    }

    /* Begin the master clock */
    clock = setInterval(tick, 0);
  }

  /*
   * Start the simulation.
   */
  function startSimulation() {
    if (isStopped()) {
      getConfiguration();
      prepareImage();
    }

    $('.conf-slider').slider('option', 'disabled', true);
    $('input[type="checkbox"]').attr('disabled', true);
    $('#start').text('Pause');
    $('.results-btn').attr('disabled', 'disabled');
    runSimulation();
  }

  /*
   * Pause the simulation.
   */
  function pauseSimulation() {
    clearInterval(clock);
    clock = null;
    resumedTime = new Date().getTime() - startTime;
    $('#start').text('Resume');
    $('.results-btn').removeAttr('disabled');
  }

  /*
   * End the simulation.
   */
  function stopSimulation() {
    clearInterval(clock);
    clock = null;
    jiffies = null;
    startTime = null;
    population = null;
    highestFitness = 0;
    lowestFitness = 100;
    resumedTime = 0;
    $('#elapsed-time').text('0:00');
    $('.conf-slider').slider('option', 'disabled', false);
    $('input[type="checkbox"]').attr('disabled', false);
    $('.results-btn').attr('disabled', 'disabled');

    document.body.classList.remove('genetics-active');
    document.body.classList.add('genetics-inactive');

    /* Clear the drawing */
    outputCtx.clearRect(0, 0, 350, 350);
    workingCtx.clearRect(0, 0, workingSize, workingSize);

    $('#start').text('Start');
  }

  /*
   * Stock image dropdown item selected.
   */
  $('#stock-image-menu li a').click(function() {
    setImage('/images/genetics/' +
             $(this).text().toLowerCase().replace(/ /g, '-') +
             '.jpg');
  });

  /*
   * Start button callback.
   */
  $('#start').click(function() {
    if (isRunning()) {
      pauseSimulation();
    } else {
      startSimulation();
    }
  });

  /*
   * Stop button callback.
   */
  $('#stop').click(function() {
    if (isRunning() || isPaused()) {
      stopSimulation();
    }
  });

  /*
   * 'Get URL' button on results pane
   */
  $('#get-url').click(function() {
    var urlBox = $('#share-url')[0];
    // NOTE THIS MUST BE UPDATED IF THE PAGE MOVES:
    var location = 'https://chriscummins.cc/s/genetics/';

    urlBox.value = location + '#' + configurationToString();
    $('#share').show();
    urlBox.focus();
    urlBox.select();
    urlBox.setSelectionRange(0, 250);
  });

  $('#close-url').click(function() {
    $('#share').hide();
  });

  /*
   * 'Export to PNG' button on results pane
   */
  $('#save-png').click(function() {
    window.open(outputCanvas.toDataURL());
  });

  /*
   * Decode a configuration from a string.
   */
  function configurationFromString(str) {
    var args = str.split('&');

    try {
      var _populationSize = parseInt(args[0]);
      var _cutoffSlider = parseInt(args[1]);
      var _fittestSurvive = (args[2]) ? true : false;
      var _mutationChance = parseFloat(args[3]);
      var _mutationAmount = parseInt(args[4]);
      var _polygons = parseInt(args[5]);
      var _vertices = parseInt(args[6]);
      var _resolution = parseInt(args[7]);
      var _fillPolygons = (args[8]) ? true : false;
      var _randomInheritance = (args[9]) ? true : false;
      var _diffSquared = (args[10]) ? true : false;

      setConfiguration(_populationSize,
                       _cutoffSlider,
                       _fittestSurvive,
                       _mutationChance,
                       _mutationAmount,
                       _polygons,
                       _vertices,
                       _resolution,
                       _fillPolygons,
                       _randomInheritance,
                       _diffSquared);
    } catch (e) {
      /* Do nothing, we're not actually interested in recovering from bad
       * states. It either works, or it doesn't.
       */
    }
  }

  /*
   * Returns a string representing the current configuration.
   */
  function configurationToString() {
    return populationSize + '&' +
        selectionCutoff * 100 + '&' +
        ((fittestSurvive) ? 1 : 0) + '&' +
        mutationChance * 100 + '&' +
        mutateAmount * 100 + '&' +
        polygons + '&' +
        vertices + '&' +
        workingSize + '&' +
        ((fillPolygons) ? 1 : 0) + '&' +
        ((randomInheritance) ? 1 : 0) + '&' +
        ((diffSquared) ? 1 : 0);
  }

  $('#get-in-touch').click(function () {
    $('.feedback-overlay').fadeIn('slow');
    $('.feedback-form').fadeIn('fast');
  });

  /*
   * Document ready preparations.
   */
  this.init = function() {

    /* Set our page element variables */
    outputCanvas = $('#outputCanvas')[0];
    outputCtx = outputCanvas.getContext('2d');

    workingCanvas = $('#workingCanvas')[0];
    workingCtx = workingCanvas.getContext('2d');

    referenceImage = $('#referenceImage')[0];
    referenceCanvas = $('#referenceCanvas')[0];
    referenceCtx = referenceCanvas.getContext('2d');

    /* Analytics panel */
    ap = {
      elapsedTime: $('#elapsed-time'),
      numberOfGenerations: $('#number-of-generations'),
      timePerGeneration: $('#time-per-generation'),
      timePerImprovment: $('#time-per-improvement'),
      currentFitness: $('#current-fitness'),
      highestFitness: $('#highest-fitness'),
      lowestFitness: $('#lowest-fitness')
    };

    /* Check that we can run the program */
    if (!isSupported())
      alert('Unable to run genetics program!'); /* FIXME: better alert */

    initConfiguration();

    /* Set default configuration */
    setConfiguration();

    getConfiguration();
    prepareImage();

    /* prepare our tooltips */
    $('.conf-option').tooltip('hide');

    /* enable our buttons */
    $('#start').attr('disabled', false);
    $('#stop').attr('disabled', false);

    /* Load configuration from hash, if any */
    if (location.hash.split('&').length > 5)
      configurationFromString(location.hash.replace(/#/, ''));
  };
}).call(Genetics);


/**
 * Bootstrap the page with our initialisation code.
 */
window.onload = Genetics.init;
