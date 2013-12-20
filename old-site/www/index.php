<?php require_once( $_SERVER['PHP_ROOT'] . 'init.php' );

setcookie("visit", "1", time()+3600);

$content = array();

$template = new Pip_Template( 'index' );
$template->render( $content );
