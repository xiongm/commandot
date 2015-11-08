<?php

include ('_template/functions.php');

// Allow access from anywhere. Can be domains or * (any)
header('Access-Control-Allow-Origin: http://fiddle.jshell.net');
 
// Allow these methods of data retrieval
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
 
// Allow these header types
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

$response = array ();

// This will allow us to pass post parameters
// from commandline
// e.g. php ./generate.php 'dir=.'
if (!isset($_SERVER["HTTP_HOST"]) && $argc > 1) {
  parse_str($argv[1], $_POST);
}

if (!isset($_POST['dir'])) {
  set_error_response($response, "No dir specified!");
}
else
{
  $dir=$_POST['dir'];
  if (isset($_POST['name']))
  {
    $name = $_POST['name'];
    exec("rm -fr ./".$name, $output, $return);
    
    $response['return'] = $return;
    $response['output'] = $output;
  }
  else
  {
   $response['return'] = 1;
   $response['output'] = "No dir specified";
  }
}

echo json_encode($response);

?>
