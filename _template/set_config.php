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
  $dir = $_POST['dir'];
  $str_content = isset($_POST['content']) ? $_POST['content'] : NULL;

  $str_content = get_magic_quotes_gpc() ? stripslashes($str_content) : $str_content;
  $json_content = json_decode($str_content, true);

  if (isset($json_content['config']))
  {
    file_put_contents($dir."/commandot.cfg", json_encode($json_content['config']));
  }
  if (isset($json_content['command']))
  {
    file_put_contents($dir."/generate.sh", $json_content['command']);
  }

  if (isset($json_content['user_js']))
  {
    file_put_contents($dir."/user.js", $json_content['user_js']);
  }
  
}

$response['return'] = 0;
$response['result'] = $str_content;

echo json_encode($response);

?>
