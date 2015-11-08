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
      var html = '<li class="item"><h3><a href="./' + key + '">' + config.title + '</a></h3>';
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
    // hovering each commandot item will 
    // trigger display of actions,e.g. trash
    $("#commandotlist .item").hover(function () {
        $(this).find(".actions").fadeTo("fast", 1);
    }, function () {
        $(this).find(".actions").fadeTo("fast", 0);
    });
    
    // set up add commandot actions
    $("#add-commandot").click(function () {
      var data = {
        dir: "./"
      };
      $.ajax({
        type: "post",
        url: "./add.php",
        dataType: "json",
        data: data,
        success: function (json) {
          if (json.return ==0) {
            window.location.href = './' + json.name;
          }
        },
        complete: function () {
        },
        error: function (xhr, status, error) {
          console.log("fail to set configs:" + "[error:" + error + "][xhr:" + xhr.responseText + "][status:" + status + "]");
        }
      });
        return false;
    });

    // set up delete actions
    $("#commandotlist li.delete a").click(function () {
        if (confirm(confirm_commandot_delete_notice) == true) {
            var item = $(this).closest(".item");
            var name = item.find('h3 a').attr("href"); 
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
