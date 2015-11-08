<?php
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
 $response['output'] = array('No dir specified!');
 $response['return'] = 1;
}
else
{
  $dir = $_POST['dir'];
  $str_arguments = isset($_POST['arguments']) ? $_POST['arguments'] : NULL;

  $str_arguments = get_magic_quotes_gpc() ? stripslashes($str_arguments) : $str_arguments;
  $json_arguments = json_decode($str_arguments, true);

  $arguments = count($json_arguments) > 0 ? implode(' ',$json_arguments) : '';
  $command=$_POST['dir']."/generate.sh ".$arguments." 2>&1";
  exec($command, $output, $return);

  $response['return'] = $return;
  $response['output'] = $output;
}

echo json_encode($response);

?>
