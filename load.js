var confirm_commandot_delete_notice=
  "Are you sure to remove all configs/codes associated with this commandot?";

// main
$(document).ready(function () {
    $.ajax({
        type: "post",
        url: "./get_commandots.php",
        dataType: "json",
        data: {
            dir: "./"
        },
        success: function (json) {
	  handle_get_commandots(json);
        },
        complete: function () {
          init();
        },
        error: function (xhr, status, error) {
          console.log("fail to get commandot lists");
        }
    });
});


// handle return from get_commandots.php
function handle_get_commandots (json)
{
  $("#commandotlist-wrapper").empty();
  $("#commandotlist-wrapper").html('<ul id="commandotlist"></ul>');
  $.each(json, function (key, value) {
      var config = $.parseJSON(value);                
      var html = '<li class="item"><h3><a href="./' + key + '">' + key + '</a></h3>';
      html +='<p class="info">' + config.summary + '</p>';
      html += '<ul class="actions"><li class="delete"><a class="icon-delete" href="#" title="Remove this commandot"></a></li></ul></li>';
      $("#commandotlist").append(html);
  });
}

// helper functions
function show_add_commandot_form()
{
  $(".overlay").show();
  $(".form-container").fadeIn();
}

function close_add_commandot_form()
{
  $(".form-container").fadeOut();
  $(".overlay").hide();
}

// initialize dynamic components after initial ajax call
function init() {
    // initialize form validator using jquery validate
    var validate =   $("#add_commandot_form").validate({
      rules: {
      commandot_name: {
         required: true,
	 // can only use alphabetic, numeric
	 // except for '-','_','.'. Can only
	 // start with alphabetic or numeric
         pattern:"^[a-zA-Z0-9][a-zA-Z0-9-_. ]*$"
       }            
      },
      messages: {
       commandot_name: {
         required:" please specify a name",
         pattern:" Invalid format"
       }
      },
      submitHandler: function (form) { 
       return false;
      }         
    });

    // hovering each commandot item will 
    // trigger display of actions,e.g. trash
    $("#commandotlist .item").hover(function () {
        $(this).find(".actions").fadeTo("fast", 1);
    }, function () {
        $(this).find(".actions").fadeTo("fast", 0);
    });
    
    // set up add commandot actions
    $("#add-commandot").click(function () {
	validate.resetForm();
	$("#add_commandot_form").get(0).reset();
	show_add_commandot_form();
	$("#add_commandot_form").find("#commandot_name").focus();

        $("#cancel_btn").click(function () {
	  close_add_commandot_form();
	  return false;
        });

        $("#save_btn").click(function () {
	    if (!$("#add_commandot_form").valid())
	    {
	      return;
	    }
            var result = {
              name: $("#commandot_name").val().replace(/ /g, "_")
            };

            var data = {
                dir: "./",
                content: JSON.stringify(result)
            };
            $.ajax({
                type: "post",
                url: "./add.php",
                dataType: "json",
                data: data,
                success: function (json) {
                    if (json.return ==0) {
		        window.location.href = './' + result.name;
                    }
                },
                complete: function () {
		  close_add_commandot_form();
                },
                error: function (xhr, status, error) {
                    console.log("fail to set configs:" + "[error:" + error + "][xhr:" + xhr.responseText + "][status:" + status + "]");
                }
            });
        });
        return false;
    });

    // set up delete actions
    $("#commandotlist li.delete a").click(function () {
        if (confirm(confirm_commandot_delete_notice) == true) {
            var item = $(this).closest(".item");
            var name = item.find('h3 a').text();
            $.ajax({
                type: "post",
                url: "./delete_commandot.php",
                dataType: "json",
                data: {
                    dir: "./",
                    name:name
                },
                success: function (json) {
                    if (json.return == 0)
                    {
                      item.slideUp("normal", function () {
                        $(this).remove();
                      });
                    }
                    else
                    {
                       alert("Fail to delete:" + json.output);
                    }
                },
                complete: function () {},
                error: function (xhr, status, error) {
                    console.log("fail to set configs:" + "[error:" + error + "][xhr:" + xhr.responseText + "][status:" + status + "]");
                }
            });
        }
        return false;
    });
}
