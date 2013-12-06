<?php

/*
 * The GOTO statement.
 *
 * Urgh...
 */

/*
 * Load a page URL.
 */
function cc_goto( $url ) {
	header( "location: " . $url );
}
