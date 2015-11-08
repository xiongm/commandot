
/*
  callback function that handles the output and present
  it to the browser. It is exposed so that developer can
  customize the output to their own needs.
  
  * Please DO NOT change if you don't know what you are doing.
  * Never change the function name
 
*/
function process_commandot_results(result, json_output) {
    var output = "";
    $.each(json_output, function (key, val) {
      output += val + "\n";
    });
    $("#content-output").empty();
    var html = '<div id="command_return"></div>';
    html += '<pre id="command_output" class="output"></pre>';
    $("#content-output").append(html);

    var result_html = '<h2 class=' + (result == 0 ? "\"success\"" : "\"failure\"") + '>' 
                                   + (result == 0 ? "Success" : "Failure") + '</h2>';
    $("#command_return").html(result_html);
    $("#command_output").text(output);
}
