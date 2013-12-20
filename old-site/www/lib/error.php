<?php

/*
 * Error handling.
 *
 * Provides error and exception handling.
 */

/*
 * Don't show errors.
 */
function cc_error_disable() {
	ini_set( 'display_errors', 'Off' );
}

/*
 * Enable strict error handling.
 */
function cc_error_enable_strict() {
	error_reporting( E_ALL | E_STRICT );
}

/*
 * Exception handler.
 */
function _exception_handler( Exception $e ) {
	print "<div style='text-align: center;'>";
	print "<h2 style='color: rgb(190, 50, 50);'>Exception Occured:</h2>";
	print "<table style='width: 800px; display: inline-block;'>";
	print "<tr style='background-color:rgb(230,230,230);'><th style='width: 80px;'>Type</th><td>" . get_class( $e ) . "</td></tr>";
	print "<tr style='background-color:rgb(240,240,240);'><th>Message</th><td>{$e->getMessage()}</td></tr>";
	print "<tr style='background-color:rgb(230,230,230);'><th>File</th><td>{$e->getFile()}</td></tr>";
	print "<tr style='background-color:rgb(240,240,240);'><th>Line</th><td>{$e->getLine()}</td></tr>";
	print "</table></div>";

	exit();
}

/*
 * Error handler.
 */
function _error_handler( $num, $str, $file, $line, $context = null )
{
	_exception_handler( new ErrorException( $str, 0, $num,
							 $file, $line ) );
}

/*
 * Shutdown handler.
 */
function _shutdown_handler() {
	$e = error_get_last();

	if ( $e['type'] == E_ERROR ) {
		cc_error_handler( $e['type'], $e['message'],
				   $e['file'], $e['line'] );
	}
}

/*
 * Register our custom error handlers.
 */
function cc_error_enable_error_handlers() {
	set_error_handler( '_error_handler' );
	set_exception_handler( '_exception_handler' );
	register_shutdown_function( '_shutdown_handler' );
}
