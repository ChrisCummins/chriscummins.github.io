<?php
$filename = 'uploads/' . date('YmdHis') . '-' . $_SERVER['REMOTE_ADDR'] . '-webcam.jpg';
$result = file_put_contents($filename, file_get_contents('php://input'));
if (!$result) {
  print "ERROR: Failed to write data image file!\n";
  exit();
}

$url = 'http://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI']) . '/' . $filename;
print "$url\n";
?>
