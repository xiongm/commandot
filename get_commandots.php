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
  $files = glob($dir."/*", GLOB_NOSORT);
  array_multisort(array_map('filemtime', $files), SORT_NUMERIC, SORT_DESC, $files);
  foreach($files as $file)
  {
    if (is_dir($file) && file_exists($file."/commandot.cfg"))
    {
      $base_name = basename($file);
      if (substr($base_name,0,1) != '_')
      {
        $config = file_get_contents($file."/commandot.cfg");

        $response[$base_name] = $config;
      }
    }
  }
}

echo json_encode($response);

?>
