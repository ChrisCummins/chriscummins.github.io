<?php require_once( $_SERVER['PHP_ROOT'] . 'init.php' );

$content = array();

$template = new Pip_Template( 'boids' );
$template->render( $content );
