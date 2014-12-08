/*
 *                Space Exploerer
 *
 * Written by Chris Cummins <chrisc.101@gmail.com>
 * Copyright (c) 2014 Chris Cummins
 * License: http://opensource.org/licenses/MIT
 * Source code: https://github.com/ChrisCummins/chriscummins.github.io
 * http://chriscummins.cc
 *
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
      }
    }
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
  
  // Enable buttons.
  enableBtn(gui.btn.step);
  enableBtn(gui.btn.run);
};


// Delay intialisation until page is loaded.
window.onload = SpaceExplorer;
