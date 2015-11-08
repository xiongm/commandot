var timeoutID = 0;
var interval = 15;
var dir_arr = window.location.href.split('/');
var php_dir = "../_template/"

/* Start of debug section 
   uncomment these lines for sandbox test
*/
//dir_arr = "http://q023.atdesk.com/commandot/_sandbox/".split('/');
//php_dir = "http://q023.atdesk.com/commandot/_sandbox/"

/* End of debug section */
dir_arr.pop();
var working_dir = "../" + dir_arr.pop();
console.log("dir is " + working_dir);
var js_code_mirror;
var command_code_mirror;

$(document).on({
  ajaxStart: function() { 
   $("body").addClass("loading");
  },
  ajaxStop: function() { 
   $("body").removeClass("loading"); 
  }    
});


function refresh_argument_lists() {
    $("#arguments_list_number").html($("#arguments_list li").length);
}

function init() {
    js_code_mirror = CodeMirror.fromTextArea(document.getElementById('user_defined_js'), {
        mode: "javascript",
        theme: "midnight",
        lineNumbers: true,
        lineWrapping: true,
        styleActiveLine: true
    });
    js_code_mirror.setSize("100%", "800px");
    command_code_mirror = CodeMirror.fromTextArea(document.getElementById('command'), {
        mode: "shell",
        theme: "midnight",
        lineNumbers: true,
        lineWrapping: true,
        styleActiveLine: true
    });
    command_code_mirror.setSize("100%", "400px");
    
    $(".tabs-menu a").click(function (event) {
	event.preventDefault();
	$(this).parent().addClass("current");
	$(this).parent().siblings().removeClass("current");
	var tab = $(this).attr("href");
	$(".tab-content").not(tab).css("display", "none");
        /* jquery fadeIn has some blinking
	 * had to use show() instead
          $(tab).fadeIn('slow');
	*/
	$(tab).show();
	if ($(tab).is("#tab-js"))
	{
	  js_code_mirror.refresh();
	}
	else if ($(tab).is("#tab-script"))
	{
	  command_code_mirror.refresh();
	}

	return false;
    });

    $("#vertical-menu h3").click(function () {
      //clicked menu will be applied togger, others removed
      $(this).addClass("toggler");
      $("#vertical-menu h3").not($(this)).removeClass("toggler");
      // no-ops if already opened
      if ($(this).next().find(".item").is(":visible")) return;
      // close all
      $("#vertical-menu ul .item").slideUp();
      // open this
      $(this).next().find(".item").slideDown();
    })

    
    if ($("#arguments_list li").length > 0)
    {
      $("#content-input-arguments").empty();
      $('#arguments_list li').each(function (index) {
        var arg=$(this).text();
        var html= '<p><label for="' + arg + '">' + arg + '</label>';
        html += '<input type="text" name="' + arg + '" id="' + arg + '"/> </p>';
        $("#content-input-arguments").append(html);
      });
      $("#content-input").fadeIn();
    }
    
    $("#arguments_submit_btn").click(function () {
      var args = [];
      $('#content-input-arguments input').each(function(index,data) {
         args.push($(this).val());
      });
      get_commandot_results(args)
    });

    $('#interval').on('change', function () {
        if (($(this).val() != 0) && ($("#arguments_list li").length > 0)) {
            alert("Please remove arguments before enabling refresh");
            $(this).val(0);
        }
    });

    $("#add_argument").click(function () {
        if (!$("#argument").val()) {
            return false;
        }
        var new_argument = $("#argument").val();
        $("#argument").val('');
        if ($("#interval").val() != 0) {
            alert("Failure! Auto refresh shoul be set to 'Do Not Refresh' in order to add arguments");
            return false;
        }
        var html = '<li>' + new_argument;
        html += '<a class="remove" href="#"><span class="icon-delete"</span></a></li>'
        $("#arguments_list").append(html);
        refresh_argument_lists();
        return false;
    });

    $('#arguments_list').on('click', '.remove', function () {
        $(this).closest('li').remove();
        refresh_argument_lists();
        return false;
    });

    $("#update").click(function () {

        var arguments_list = [];

        $("#arguments_list > li").each(function () {
            arguments_list.push($(this).text());
        });

        var config_json = {
            title: $("#title").val(),
            summary: $("#summary").val(),
            interval: $("#interval").val(),
            arguments: arguments_list
        }
        var result = {
            config: config_json,
            command: command_code_mirror.getValue(),
            user_js: js_code_mirror.getValue()
        };
        var data = {
            dir: working_dir,
            content: JSON.stringify(result)
        };
        $.ajax({
            type: "post",
            url: php_dir +"set_config.php",
            dataType: "json",
            data: data,
            success: function (json) {
                if (json.return ==0) {
		  //TODO:
                }
            },
            complete: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.log("fail to set configs:" + "[error:" + error + "][xhr:" + xhr.responseText + "][status:" + status + "]");
            }
        });
        return false;
    });

}
function get_commandot_results(arguments) {
    console.log("argument is" + JSON.stringify(arguments));
    $.ajax({
        type: "post",
        url: php_dir +"/generate.php",
        dataType: "json",
        data: {
            dir: working_dir,
            arguments: JSON.stringify(arguments)
        },
        success: function (json) {
	  try {
            eval(process_commandot_results(json.return, json.output));
	  } catch (err) {
	    alert("Something is wrong:" + err.message);
	    return;
	  }
        },
        complete: function () {
            console.log("setting new timeout");
            if (interval == 0) {
                if (timeoutID != 0) {
                    clearTimeout(timeoutID);
                }
            } else {
                timeoutID = setTimeout(get_commandot_results, interval * 1000);
            }
        },
        error: function (xhr, status, error) {
            console.log("fail to get semp reports");
        }
    });
};

$(document).ready(function () {
    $.ajax({
        type: "post",
        url: php_dir + "get_config.php",
        dataType: "json",
        data: {
            dir: working_dir
        },
        success: function (json) {
            var config_json = $.parseJSON(json.config);

            $("#title").val(config_json.title);
            $("#summary").val(config_json.summary);
            $("#interval").val(config_json.interval);
            $("#command").val(json.command);
            $("#user_defined_js").val(json.user_js);
            for (var i = 0; i < config_json.arguments.length; i++) {
                var html = '<li>' + config_json.arguments[i];
                html += '<a class="remove" href="#" title="Delete argument"><span class="icon-delete"</span></a></li>'
                $("#arguments_list").append(html);
            }
            refresh_argument_lists();
            interval = $("#interval").val();
            console.log(interval * 1000);
        },
        complete: function () {
            init();
            if ($("#arguments_list li").length == 0)
            {
              get_commandot_results([]);
            }
        },
        error: function (xhr, status, error) {
            console.log("fail to get configs");
        }
    });
});
