<?php

include ('functions.php');

// Allow access from anywhere. Can be domains or * (any)
header('Access-Control-Allow-Origin: http://fiddle.jshell.net');
 
// Allow these methods of data retrieval
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
 
// Allow these header types
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

// This will allow us to pass post parameters
// from commandline
// e.g. php ./generate.php 'dir=.'
if (!isset($_SERVER["HTTP_HOST"]) && $argc > 1) {
  parse_str($argv[1], $_POST);
}

$response = array ();

if (!isset($_POST['dir'])) {
  set_error_response($response, "No dir specified!");
}
else
{
  $dir=$_POST['dir'];
  $basic_config_json = file_get_contents($dir."/commandot.cfg");
  $command = file_get_contents($dir."/generate.sh");
  $user_js = file_get_contents($dir."/user.js");

  $response['config'] = $basic_config_json;
  $response['command'] = $command;
  $response['user_js'] = $user_js;
  $response['return'] = 0;
}

echo json_encode($response);

?>
