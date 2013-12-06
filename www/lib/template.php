<?php

/*
 * Content templating.
 *
 * Provides an API for creating and rendering templates.
 */

class Pip_Template
{
	private $name;
	private $template;

	public function __construct( $name, $engine = null ) {

		$this->name = $name;

		if ( null == $engine )
			$engine = new Pip_Template_Engine();

		$this->template = $engine->get_template( $name );

	}

	/*
	 * Renders a given template.
	 */
	public function render( $content = array() ) {

		if ( $this->is_private() ) {
			throw new Pip_Template_Exception( $this->name,
							  'private template ' .
							  'cannot be ' .
							  'rendered!' );
		}

		/* Add user session to content */
		$session = cc_login_get_user_details();
		if ( null !== $session )
			$content['session'] = $session;

		/* Add site links to content */
		$content['_links'] = Pip_Links::val();

		$this->template->display( $content );
	}

	/*
	 * Returns true if a template is private, else false.
	 */
	public function is_private() {
		return '_' == $this->name[0];
	}
}

class Pip_Template_Engine
{
	private $loader;
	private $environment;

	public function __construct() {
		require_once( $_SERVER['PHP_ROOT'] . 'Twig/Autoloader.php' );

		Twig_Autoloader::register();

		$this->loader = new Twig_Loader_Filesystem(
			$_SERVER['HTML_ROOT'] );
		$this->environment = new Twig_Environment( $this->loader,
							   array() );
	}

	/*
	 * Returns a given template.
	 */
	public function get_template( $name ) {
		if ( !$this->template_exists( $name ) ) {
			throw new Pip_Template_Exception( $name,
							  'file not found!' );
		}

		$path = $this->get_template_file( $name );

		return $this->environment->loadTemplate( $path );
	}

	/*
	 * Returns whether a template has a corresponding source file.
	 */
	private function template_exists( $name ) {
		return file_exists( $this->get_template_path( $name ) );
	}

	/*
	 * Returns the path to a template file in the form:
	 *
	 *      <dir>/<name>.<ext>
	 */
	private function get_template_path( $name ) {
		return $_SERVER['HTML_ROOT'] . $this->get_template_file( $name );
	}

	/*
	 * For a given template name, return the template source file.
	 */
	private function get_template_file( $name ) {
		return $name . '.html';
	}

}

/*
 * This exception is thrown by the templating engine if there's a problem.
 */
class Pip_Template_Exception extends Exception {

	public function __construct( $name, $reason ) {
		$message = 'Illegal template "' . $name . '": ' . $reason;

		parent::__construct($message);
	}

}
