<?php

/*
 * Debugging.
 *
 * Debugging-specific functionality.
 */

/*
 * Returns whether the site is in debugging mode or not.
 */
function cc_debugging() {
	return 'yes' == cc_server_get_debug();
}
