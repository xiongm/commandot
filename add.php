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
  $str_content = isset($_POST['content']) ? $_POST['content'] : NULL;

  $str_content = get_magic_quotes_gpc() ? stripslashes($str_content) : $str_content;
  $json_content = json_decode($str_content, true);

  $random_cmd = 'LC_ALL=C; dd if=/dev/urandom bs=256 count=1 2> /dev/null | tr -dc "A-Z0-9" | head -c 8; echo';
  exec($random_cmd, $output, $return);
  $dir_name=$output[0];
  $new_dir = $dir."/".$dir_name;
  mkdir($new_dir);
  copy("_template/index.php", $new_dir."/index.php");
  copy("_template/commandot.cfg", $new_dir."/commandot.cfg");
  copy("_template/user.js", $new_dir."/user.js");
  copy("_template/generate.sh", $new_dir."/generate.sh");
  chmod($new_dir."/generate.sh",0755); 
}

$response['return'] = 0;
$response['name'] = $dir_name;
echo json_encode($response);

?>
