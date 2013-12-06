<?php

/*
 * The exception which is thrown when an attempt is made to access an illegal
 * superglobal.
 *
 * @param string $value The name of the illegal variable.
 * @param string $super_type The type of superglobal (e.g. _POST).
 * @param array(string) $legal_values An array of legal variable names.
 */
class IllegalSuperglobalException extends Exception {
	public function __construct($value, $super_type = "",
				    $legal_values = null) {
		$message = 'Illegal ';
		$message .= ( '' == $super_type ) ? 'superglobal' : $super_type;
		$message .= ' variable: "' . $value . '".';

		if ( null !== $legal_values ) {
			$message .= ' Legal values: [ ';

			foreach ($legal_values as $val) {
				$message .= '"' . $val . '" ';
			}

			$message .= '].';
		}

		parent::__construct($message);
	}
}