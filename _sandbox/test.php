<html>
<body>
<?php
  $command="ssh -q -o BatchMode=yes -o StrictHostKeyChecking=no -i /home/titeam/.ssh/id_dsa pops-ibtest05.pops.atdesk.com 'ls&&date' 2>&1";
//  $command="ssh -o 'StrictHostKeyChecking no' mxiongpops-ibtest05.pops.atdesk.com date; 2>&1";
  exec($command, $output, $return);
  echo "command is ".$command."<br>";

  echo "output is <br>";
  foreach($output as $line)
  {
    echo $line."<br>";
  }

  echo "return is ".$return."<br>";
?>
</body>
</html>
