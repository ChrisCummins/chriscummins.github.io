<?php

/*
 * $_POST superglobal wrapper.
 *
 * Provides a sane API for dealing with $_POST variables.
 */

/*
 * The names of valid POST variables. All accessing of POST variables should be
 * done indirectly using the cc_{get,set}_post_var() API and using the values
 * found in this class.
 */
abstract class PostVariables {
	const Username = "user";
	const Password = "pass";
	const Action  = "action";
	const Filename = "f";

	static function val() {
		return array(
			self::Username,
			self::Password,
			self::Action,
			self::Filename
			);
	}
}

/*
 * Legal values for the POST['action'] variable.
 */
abstract class PostActionValues {
	const Login = "login";
	const Register = "register";
	const Upload = "upload";
}

/*
 * Returns whether a given POST variable is valid, i.e. whether it has been
 * defined in the PostVariables class. If the variable name is found, return
 * true, else false.
 */
function cc_post_is_valid( $var ) {
	foreach ( PostVariables::val() as $val ) {
		if ( $val == $var )
			return true;
	}

	return false;
}

/*
 * Ensure that the given variable has an entry in the PostVariables class.
 */
function cc_post_fail_if_not_valid( $var ) {
	if ( !cc_post_is_valid( $var ) ) {
		throw new IllegalSuperglobalException( $var, '_POST',
						       PostVariables::val() );
	}
}

/*
 * Returns wheteher a particular POST variable is set or not.
 */
function cc_post_isset( $var ) {
	cc_post_fail_if_not_valid( $var );

	return isset( $_POST[$var] );
}

/*
 * Return a particular POST variable if defined, else an empty string.
 */
function cc_post_get( $var ) {
	cc_post_fail_if_not_valid( $var );

	if ( cc_post_isset( $var ) )
		return $_POST[$var];
	else
		return "";
}
