<?php

function set_error_response(&$response, $error_msg)
{
  $response['error'] = $error_msg;
  $response['return'] = 1;
}
?>
