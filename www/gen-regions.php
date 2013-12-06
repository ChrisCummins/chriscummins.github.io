<?php require_once( $_SERVER['PHP_ROOT'] . 'init.php' );

$content = array();

$template = new Pip_Template( 'gen-regions' );
$template->render( $content );
