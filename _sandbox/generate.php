<?php
set_include_path(get_include_path() . PATH_SEPARATOR . '../php/phpseclib');

include('Net/SSH2.php');

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
  $command_dir = $_POST['dir']."/generate.sh";
  $str_content = isset($_POST['content']) ? $_POST['content'] : NULL;

  $str_content = get_magic_quotes_gpc() ? stripslashes($str_content) : $str_content;
  $json_content = json_decode($str_content);

  $arguments = count($json_content->arguments) > 0 ? implode(' ',$json_content->arguments) : '';

  if (isset($json_content->remote) && $json_content->remote->enabled)
  {
    if ($json_content->remote->type == "ssh")
    {
      $command = "ssh -q -oBatchMode=yes -oStrictHostKeyChecking=no -i ".$json_content->remote->ssh->key_path." ".$json_content->remote->user."@".$json_content->remote->host." 'bash -s' -- < ".$command_dir." ".$arguments." 2>&1";
      exec($command, $output, $return);
    }
    else
    {
      $ssh = new Net_SSH2($json_content->remote->host);
      if (!$ssh->login($json_content->remote->user, $json_content->ssh->password))
      {
        exit("Login failed");
      }
      $command = 'date';
      $output = $ssh->exec($command);
      $return = $ssh->getExitStatus();
    }
  }
  else
  {
    $command=$command_dir." ".$arguments." 2>&1";
    exec($command, $output, $return);
  }

  $response['return'] = $return;
  $response['output'] = $output;
  $response['command'] = $command;
}

echo json_encode($response);

?>
