<?php
   mail("chrisc.101@gmail.com",
        "[chriscummins.cc] Message from " . $_POST["email"],
        "IP: " . $_SERVER['REMOTE_ADDR'] . "\r\n\r\n" . $_POST["message"]);
?>
