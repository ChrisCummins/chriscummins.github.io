<?php

/*
 * Initialisation.
 *
 * The purpose of this file is to setup the website controller, exposing
 * functions to communicate with the data backend and an API for rendering the
 * frontend. The PHP file for every page should include this script, as it acts
 * as a gateway to the full website API.
 */

require_once( $_SERVER['PHP_ROOT'] . 'config.php' );

/*********************************************************/
/* Enable debugging, error handling, and server-side API */
/*********************************************************/
require_once( $_SERVER['PHP_ROOT'] . 'server.php' );
require_once( $_SERVER['PHP_ROOT'] . 'debug.php' );
require_once( $_SERVER['PHP_ROOT'] . 'error.php' );

cc_error_disable();

if ( cc_debugging() ) {
	cc_error_enable_strict();
	cc_error_enable_error_handlers();
}


/*************************************************/
/* Provide controlled access to PHP superglobals */
/*************************************************/
require_once( $_SERVER['PHP_ROOT'] . 'superglobals.php' );
require_once( $_SERVER['PHP_ROOT'] . 'get.php' );
require_once( $_SERVER['PHP_ROOT'] . 'post.php' );
require_once( $_SERVER['PHP_ROOT'] . 'files.php' );


/******************************************************/
/* Libraries and functions for rendering the frontend */
/******************************************************/
require_once( $_SERVER['PHP_ROOT'] . 'goto.php' );
require_once( $_SERVER['PHP_ROOT'] . 'history.php' );
require_once( $_SERVER['PHP_ROOT'] . 'template.php' );
