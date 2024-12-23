//I've tried to explain each JavaScript line with comments....Hope you'll understand

//selecting all required elements
const selectBox = document.querySelector(".select-box"),
  selectBtnX = selectBox.querySelector(".options .playerX"),
  selectBtnO = selectBox.querySelector(".options .playerO"),
  playBoard = document.querySelector(".play-board"),
  players = document.querySelector(".players"),
  allBox = document.querySelectorAll("section span"),
  resultBox = document.querySelector(".result-box");
let team_name_arr = [];
let team_name_auto_arr = [];
let number_row = [];
var h = 0,
  m = 0,
  s = 0,
  run = null,
  h1 = 0,
  m1 = 0,
  text = "",
  n = 0,
  c = 0;
let runBot = true; //this also a global variable with boolen value..we used this variable to stop the bot once match won by someone or drawn
let team_array_count = 0;
click_count = 0;
playerSign_next = "";
selected_row = [];
$(".setting_menu,.play_game_btn,.play-board,.select_team").hide();

$(document).on("click", ".singleplayer", function (e) {
  restart_game();
  $(".singleplayer").attr("single_player", "on");
  $(".select_team").show();
});

$(document).on("click", ".multiplayer", function (e) {
  restart_game();
  $(".multiplayer").attr("multi_player", "on");
  $(".select_team").show();
});

// user click function
function clickedBox(element) {
  $(element).removeClass("remove_icon");
  selected_row.push(
    parseInt($(element).attr("class").split(" ")[0].replace("box", ""))
  );
  click_count++;
  var single_player = $(".singleplayer").attr("single_player");

  if (team_name_arr.length == team_array_count) {
    team_array_count = 0;
  }

  if (
    team_name_arr.length == 1 &&
    click_count == 2 &&
    $(".multiplayer").attr("multi_player") == "on"
  ) {
    click_count = 0;
    playerSign = $(".team_list:not(:checked)")[0].defaultValue;
  }
  if (team_name_arr.length == 1 && click_count == 2) {
    $(".reset_box").attr("data-team_turn", team_array_count);
  }
  team_array_count++;
  if (team_name_arr.length == team_array_count && single_player == "on") {
    element.style.translateY = "0px";

    playBoard.style.pointerEvents = "none"; //add pointerEvents none to playboard so user can't immediately click on any other box until bot select
    //let randomTimeDelay = (Math.random() * 1000 + 200).toFixed(); //generating random number so bot will randomly delay to select unselected box
    setTimeout(() => {
      bot(runBot); //calling bot function
    }, 1000); //passing random delay value
  }
  if (team_name_arr.length > 1) {
    $(".reset_box").attr("data-team_turn", team_array_count);
  }
  playerSign_next = team_name_arr[team_array_count];
  if (click_count == 0 && team_array_count == 1) {
    playerSign_next = team_name_arr[0];
  }
  if (playerSign_next == undefined) {
    if (team_array_count > 1) {
      playerSign_next = team_name_arr[0];
    } else {
      playerSign_next = $(".team_list:not(:checked)")[0].defaultValue;
    }
  }
  $(".reset_active_btn").removeClass("active");
  team_icon = generate_icon(playerSign);
  element.innerHTML = team_icon; //adding circle icon tag inside user clicked element/box
  element.setAttribute("id", playerSign); //set id attribute in span/box with player choosen sign
  $("." + playerSign_next + "turn").addClass(" active");
  element.style.pointerEvents = "none"; //once user select any box then that box can'be clicked again
  selectWinner(); //calling selectWinner function
}
// bot auto select function
function bot() {
  if (runBot) {
    //if runBot is true
    var randombox_arr = $(".reset_box")
      .filter(function () {
        return $.trim($(this).html()) === "";
      })
      .map(function () {
        return $(this).attr("class").replace("box", "").split(" ")[0];
      })
      .get();
    for (i = 0; i < team_name_auto_arr.length; i++) {
      playerSign = team_name_auto_arr[i];
      team_icon = generate_icon(playerSign);
      if (randombox_arr.length > 0) {
        //if array length is greater than 0
        for (j = 0; j <= randombox_arr.length; j++) {
          let randomBox =
            randombox_arr[Math.floor(Math.random() * randombox_arr.length)];
          if ($(".box" + randomBox).html() == "") {
            $(".box" + randomBox).removeClass("remove_icon");
            randombox_arr.push(randomBox + 1);
            $(".box" + randomBox).html(team_icon); //adding cross icon tag inside bot selected element
            $(".box" + randomBox).attr("id", playerSign); //set id attribute in span/box with player choosen sign
            $(".box" + randomBox).css({
              translateY: "0px",
              "pointer-events": "none"
            });
            selected_row.push($(".box" + randomBox).attr("id"));
            $("." + team_name_auto_arr[i] + "turn").removeClass(" active");
            if (i + 1 == team_name_auto_arr.length) {
              console.log(i, j, team_name_arr[0]);
              $("." + team_name_arr[0] + "trun").addClass("active");
              playBoard.style.pointerEvents = "auto";
            } else {
              $("." + team_name_auto_arr[i + 1] + "turn").addClass(" active");
            }
            selectWinner();
            break;
          }
        }
      }
    }
  }
}
function selectWinner() {
  //if the one of following winning combination match then select the winner
  var emptyResetBoxes = $(".reset_box").filter(function () {
    return $.trim($(this).html()) === "";
  });
  if (emptyResetBoxes.length == 0) {
    if ($(".singleplayer").attr("single_player") == "on") {
      runBot = false; //passing the false boolen value to runBot so bot won't run again
      bot(runBot); //calling bot function
    }
    stop();
    swal
      .fire({
        html: `<p style='font-size:50px;'>&#128552;</p> Match has been drawn. <br>Total time taken ${$(
          ".play_time"
        )
          .html()
          .replace("Time : ", "")}`,
        allowOutsideClick: false,
        showCancelButton: false,
        confirmButtonText: "Play Again"
      })
      .then((result) => {
        restart_game();
      });
  } else {
    $.each(number_row, function (index, win) {
      final_result(win);
    });
  }
}

function final_result(win) {
  var find_winner = [];
  win.forEach(function (FinalResult) {
    if ($(".box" + FinalResult).attr("id") != undefined) {
      find_winner.push($(".box" + FinalResult).attr("id"));
    }
  });
  var consecutiveCount = 0;
  var lenght_check_box = parseInt($(".game_level_range").val());
  for (var i = 0; i < find_winner.length; i++) {
    if (find_winner[i] === playerSign) {
      consecutiveCount++;

      if (consecutiveCount == lenght_check_box) {
        // console.log("Array has at least three consecutive 'o' values.");
        break; // No need to continue checking once the condition is met
      }
    } else {
      consecutiveCount = 0; // Reset the count if the consecutive condition is broken
    }
  }

  if (consecutiveCount == lenght_check_box) {
    team_icon = generate_icon(playerSign);
    stop();
    swal
      .fire({
        html: `<p style='font-size:50px;'>&#129395;</p>Player <b>${team_icon}</b> emerged victorious in the game.<br>Total time taken ${$(
          ".play_time"
        )
          .html()
          .replace("Time : ", "")}`,
        allowOutsideClick: false,
        showCancelButton: false,
        confirmButtonText: "Play Again"
      })
      .then((result) => {
        restart_game();
      });
  }
}

var image_file_name = [
  "https://i.postimg.cc/P5qwW90c/city-park.jpg",
  "https://i.postimg.cc/Zn3Xv3sQ/cascade-ban.jpg",
  "https://i.postimg.cc/cCSrPpj5/water-fall.jpg",
  "https://i.postimg.cc/2yx9WBZj/wet-vietnam.jpg",
  "https://i.postimg.cc/tTNqtJpC/vertical-shot.jpg",
  "https://i.postimg.cc/05K3GMCk/morskie-oko-tatry.jpg",
  "https://i.postimg.cc/VNVNpKy5/wooden-bench-park.jpg",
  "https://i.postimg.cc/yYyctCLd/forest-with-grass.jpg"
];
image_file_name.forEach(function (src) {
  $addActiveClass = "";
  if ($("body").css("background-image").includes(src)) {
    $addActiveClass = "active";
  }
  $(".background_image_list").append(
    '<img  class="all_background_image ' +
      $addActiveClass +
      '" src=' +
      src +
      ' alt="background_image" width="50" height="50"/>'
  );
});
var game_image_file_name = [
  "https://i.postimg.cc/NGkKJhW2/Game-Template8.png;",
  "https://i.postimg.cc/L6WQ1PCD/Game-Template9-png.png",
  "https://i.postimg.cc/W4Mcb87x/IMG-20231121-075434.png",
  "https://i.postimg.cc/xjzRcdND/Game-Template3.png"
];
game_image_file_name.forEach(function (src) {
  Class = "";
  if (src.includes("Game-Template8.png")) {
    Class = "active set_default_themes";
  }
  $(".game_image_list").append(
    '<img  class="all_game_background_image ' +
      Class +
      '" src=' +
      src +
      ' alt="background_image" width="50" height="50"/>'
  );
});
$(document).on("change", "#background_color", function (e) {
  var color = $(this).val();
  $("body").css({ "background-color": color, "background-image": "none" });
});
function restart_game() {
  $(".multiplayer").attr("multi_player", "off");
  $(".singleplayer").attr("single_player", "off");
  $(".select_team").hide();
  $(".reset_box").html("");
  $(".reset_box").css("pointer-events", "auto");
  $(".play-board").hide();
  $(".Oturn").html('<i class="fa-solid fa-user"></i> O\'s Turn');
  $(".Xturn").html('<i class="fa-solid fa-user"></i> X\'s Turn');
  $(".reset_box").attr("id", "");
  $(".background_image_list").html("");
  runBot = true;
  $(".setting_menu").hide();
  $(".select-box").show();
  $(".team_list").prop("checked", false);
  $(".play_game_btn").hide();
  team_name_arr = [];
  addTeamToPlay();
  click_count = 0;
  $(".reset_box").attr("data-team_turn", 0);
  selected_row = [];
  team_name_auto_arr = [];
  number_row = [];
  (h = 0),
    (m = 0),
    (s = 0),
    (run = null),
    (h1 = 0),
    (m1 = 0),
    (text = ""),
    (n = 0),
    (c = 0);
}

$(document).on("click", ".all_background_image", function (e) {
  $(".all_background_image").removeClass("active");
  $(this).addClass("active");
  var src = $(this).attr("src");
  $(this).val("#FFFFFF");
  $("body").css({
    "background-image": 'url("' + src + '")',
    "background-color": "white"
  });
});
$(document).on("click", ".all_game_background_image", function (e) {
  var title = "";
  if ($(this).hasClass("active")) {
    title = "The board themes were successfully removed.";
    $(".all_game_background_image").removeClass("active");
    $(".set_default_themes").addClass(" active");
  } else {
    title = "The board themes were set successfully.";
    $(".all_game_background_image").removeClass("active");
    $(this).addClass("active");
  }

  Swal.fire({ icon: "success", html: title });
  set_game_themes();
  // var src=$(this).attr('src');
});

function set_game_themes() {
  var src = $(".game_image_list .active")[0]
    ? $(".game_image_list .active")[0].currentSrc
    : "";
  if (src == "") {
    return false;
  }
  if (src.includes("Game-Template8.png")) {
    $(".play-area section span").css({
      border: "none",
      margin: "2px",
      "border-radius": "5px"
    });
    $(".play-area section").css({
      "margin-bottom": "1px",
      border: "none",
      padding: "0px"
    });
    $(".play-area").css({ "border-radius": "0px", background: "none" });
  } else if (src.includes("IMG-20231121-075434.png")) {
    $(".play-area section span").css({ border: "1px solid #e64d48" });
    $(".play-area section").css({
      border: "1px solid #989c9d",
      padding: "5px"
    });
    $(".play-area").css({ "border-radius": "10px", background: "ghostwhite" });
  } else if (src.includes("Game-Template3.png")) {
    $(".play-area section span").css({
      border: "2px solid black",
      margin: "0px",
      "border-radius": "0px",
      background: "linear-gradient(45deg, rgb(233 66 66), rgb(10 47 226))"
    });
    $(".play-area section").css({ "margin-bottom": "0px" });
    $(".play-area section .left").css({ "border-left": "none" });
    $(".play-area section .top").css({ "border-top": "none" });
    $(".play-area section .right").css({ "border-right": "none" });
    $(".play-area section .bottom").css({ "border-bottom": "none" });
  } else if (src.includes("Game-Template9-png")) {
    $(".play-area section span").css({
      border: "1px solid darkgrey",
      margin: "0px",
      "border-radius": "0px"
    });
    $(".play-area section").css({ "margin-bottom": "0px" });
  }
}

// $(document).on('keypress change','.game_level_range',function(e){
//     addRowColumn($(this).val());
// });
function addRowColumn(GameLevel) {
  var first_row = [],
    last_row = [],
    full_row = [],
    right_row = [],
    center_row = [],
    left_row = [];
  var classes = "",
    set_class = 1;
  one_class = "";
  one_class_count = 1;
  var game_play_content = "",
    count = 0,
    row_right_count = 0,
    game_count_right_row = GameLevel;
  let chunkSize = GameLevel; // Set the size of each chunk;
  game_count_left_row = GameLevel - GameLevel + 1;
  left_right_count = 0;
  row_column_count = 0;
  row_left_count = 0;
  var get_center_row = GameLevel - 2;
  (level = []), (game_level_range = $(".game_level_range").val());
  for (i = 1; i <= GameLevel * GameLevel; i++) {
    count++;
    left_right_count++;
    row_right_count++;
    row_left_count++;
    full_row.push(i);
    if (count == 1) {
      if (one_class_count != 1) {
        one_class = "set_margin";
      }
      first_row.push(i);
      game_play_content += `<section class="${one_class}">`;
      get_center_row = GameLevel - 2;
      if (set_class == 1) {
        classes = " top left";
      } else if (set_class == GameLevel) {
        classes = " bottom left";
      } else {
        classes = " left";
      }
    }
    if (
      row_right_count == game_count_right_row &&
      right_row.length < GameLevel
    ) {
      right_row.push(i);
      row_right_count = 0;
    }
    if (count != 1 && count != GameLevel) {
      if (set_class == 1) {
        classes = " top";
      } else if (set_class == GameLevel) {
        classes = " bottom";
      } else {
        classes = " ";
      }
      center_row.push(i);
      get_center_row = get_center_row - 1;

      // Check if the array already exists in level
      if (!level[get_center_row]) {
        level[get_center_row] = [];
      }
      level[get_center_row].push(i);
      // console.log(level);
    }
    if (row_left_count == game_count_left_row && left_row.length < GameLevel) {
      left_row.push(i);
      game_count_left_row = Math.abs(game_count_left_row) + 5;
      if (row_left_count == game_count_left_row && row_left_count != i) {
        row_left_count++;
      }
    }
    if (row_left_count == GameLevel) {
      row_left_count = 0;
      game_count_left_row = Math.abs(game_count_left_row) - 1;
    }
    if (count == GameLevel) {
      if (set_class == 1) {
        classes = " top right";
      } else if (set_class == GameLevel) {
        classes = " bottom right";
      } else {
        classes = " right";
      }
    }
    row_column_count++;
    game_play_content += `<span onclick="clickedBox(this);" class="box${i} reset_box ${classes}"></span>`;
    if (count == GameLevel) {
      set_class++;
      one_class_count++;
      last_row.push(i);
      game_play_content += `</section>`;
      count = 0;
      number_row.push(full_row);
      full_row = [];
      game_count_right_row = GameLevel - 1;
      game_count_left_row = game_count_left_row - 3;
    }
  }
  level.forEach((element) => {
    number_row.push(element);
  });
  // console.log((GameLevel-1),game_level_range);
  if (GameLevel - 1 == 3 && game_level_range == 3) {
    number_row.push([3, 6, 9], [8, 11, 14]);
  }
  if (GameLevel - 1 == 4 && game_level_range == 3) {
    number_row.push(
      [3, 7, 11],
      [4, 8, 12, 16],
      [10, 14, 18, 22],
      [15, 19, 23],
      [3, 9, 15],
      [2, 8, 14, 20],
      [6, 12, 18, 25],
      [11, 17, 23]
    );
  }
  if (GameLevel - 1 == 5 && game_level_range == 3) {
    number_row.push(
      [3, 8, 13],
      [4, 9, 14, , 19],
      [5, 10, 15, 20, 25],
      [12, 17, 22, 27, 32],
      [18, 23, 28, 33],
      [24, 29, 34],
      [4, 11, 18],
      [3, 10, 17, 24],
      [2, 9, 16, 23, 30],
      [7, 14, 21, 28, 35],
      [13, 20, 27, 34],
      [19, 26, 33]
    );
  }
  if (GameLevel - 1 == 4 && game_level_range == 4) {
    number_row.push(
      [4, 8, 12, 16],
      [10, 14, 18, 22],
      [2, 8, 14, 20],
      [6, 12, 18, 25]
    );
  }
  if (GameLevel - 1 == 5 && game_level_range == 4) {
    number_row.push(
      [4, 9, 14, , 19],
      [5, 10, 15, 20, 25],
      [12, 17, 22, 27, 32],
      [18, 23, 28, 33],
      [3, 10, 17, 24],
      [2, 9, 16, 23, 30],
      [7, 14, 21, 28, 35],
      [13, 20, 27, 34]
    );
  }
  if (GameLevel - 1 == 5 && game_level_range == 5) {
    number_row.push(
      [5, 10, 15, 20, 25],
      [12, 17, 22, 27, 32],
      [2, 9, 16, 23, 30],
      [7, 14, 21, 28, 35]
    );
  }
  number_row.push(first_row);
  number_row.push(last_row);
  number_row.push(right_row);
  number_row.push(left_row);
  $(".play-area").html(game_play_content);
  set_game_themes();
  // console.log(number_row);
}
// addRowColumn(5)
$(document).on("click", ".close_setting_icon,.back_to_home", function (e) {
  stop();
  restart_game();
});
$(document).on("click", ".open_setting", function (e) {
  $(".play-board").hide();
  $(".select-box").hide();
  $(".setting_menu").show();
});
function addTeamToPlay() {
  var team_selection_option = "";
  for (i = 0; i < $(".team_member .active").length; i++) {
    var team_name = $(".team_member .active")[i].dataset.team_name;
    var team_icon = generate_icon(team_name);
    team_selection_option += `<div class="btn btn-info text-white form-switch">
        <input style="margin-left:0px;"class="form-check-input team_list" type="checkbox" value="${team_name}" id="team_${team_name}">
        <label class="form-check-label" for="team_${team_name}">
          ${team_icon}
        </label>
      </div>`;
  }
  $(".select_team .options").html(team_selection_option);
}
addTeamToPlay();
function generate_icon(team_name) {
  if (team_name == "x") {
    return '<i style="color: #74a7f2;" class="fa-solid fa-x"></i>';
  } else if (team_name == "o") {
    return '<i style="color: #e75b49;" class="fa-solid fa-o"></i>';
  } else if (team_name == "s") {
    return '<i style="color: #d074f2;" class="fa-regular fa-square"></i>';
  } else if (team_name == "h") {
    return '<i style="color: #f53085;" class="fa-regular fa-heart"></i>';
  } else if (team_name == "st") {
    return '<i style="color: #8be749;" class="fa-regular fa-star"></i>';
  }
}
$(document).on("click", ".team_list", function (e) {
  if ($(".team_list:checked").length != 0) {
    $(".play_game_btn").show();
  } else {
    $(".play_game_btn").hide();
  }
});

$(document).on("click", ".set_team", function (e) {
  var clickedElement = $(this);
  var team_class = clickedElement.attr("class");
  var team_name = clickedElement.attr("data-team_name"); // Use 'data-' attribute for team name
  var title = "";
  if (team_class.includes("active")) {
    title = "The team has successfully deactivated.";
    clickedElement.removeClass("active");
  } else {
    title = "The team has successfully activated.";
    clickedElement.addClass("active");
  }

  Swal.fire({ icon: "success", html: title });
});

$(document).on("click", ".play_game_btn", function (e) {
  var checked = 0,
    Notchecked = 0;
  checked = $(".team_list:checked").length;
  game_level_range = $(".game_level_range").val();
  if ($(".team_list:not(:checked)").length == 0 && checked == 0) {
    swal.fire({
      icon: "info",
      text:
        "All teams are inactive; please activate another team. We need a maximum of two teams to play the game."
    });
  } else if ($(".team_list:not(:checked)").length == 0 && checked == 0) {
    swal.fire({
      icon: "info",
      text:
        "Only one team is active; please activate another team. We need a maximum of two teams to play the game."
    });
  } else {
    $(".team_list:checked").each(function () {
      team_name_arr.push($(this).val());
    });
    if ($(".singleplayer").attr("single_player") == "on") {
      Notchecked = $(".team_list:not(:checked)").length;
      $(".team_list:not(:checked)").each(function () {
        team_name_auto_arr.push($(this).val());
      });
      if (Notchecked == 0) {
        swal.fire({
          icon: "info",
          text: "Unselect any team to play against the computer."
        });
        return false;
      }
    }
    total_row_column = 3;
    if (checked + Notchecked > 2) {
      total_row_column = checked + Notchecked + 1;
    }
    if (total_row_column != game_level_range) {
      if (total_row_column < game_level_range) {
        total_row_column =
          total_row_column +
          Math.abs(total_row_column - parseInt(game_level_range));
      }
    }
    addRowColumn(total_row_column);
    team_turn();
    $(".select-box").hide();
    $(".play-board").show();
    $(".reset_active_btn").removeClass("active");
    $("." + team_name_arr[0] + "turn").addClass(" active");
    $(".reset_box").attr("data-team_turn", 0);
    start();
  }
});
function team_turn() {
  var team_turn_content = "";
  $(".team_list:checked").each(function () {
    team_turn_content += `<span  class="reset_active_btn ${$(
      this
    ).val()}turn"><i class="fa-solid fa-user"></i> ${generate_icon(
      $(this).val()
    )} 's Turn</span>`;
  });
  if ($(".singleplayer").attr("single_player") == "on") {
    $(".team_list:not(:checked)").each(function () {
      team_turn_content += `<span class="reset_active_btn ${$(
        this
      ).val()}turn"><i class="fa-solid fa-robot"></i> ${generate_icon(
        $(this).val()
      )} 's Turn</span>`;
    });
  } else if (
    $(".multiplayer").attr("multi_player") == "on" &&
    $(".team_list:checked").length == 1
  ) {
    team_name = $(".team_list:not(:checked)")[0].defaultValue;
    team_turn_content += `<span class="reset_active_btn ${team_name}turn"><i class="fa-solid fa-user"></i> ${generate_icon(
      team_name
    )} 's Turn</span>`;
  }
  $(".players").html(team_turn_content);
}

$(document).on("mouseenter", ".reset_box", function (e) {
  $(".reset_active_btn").removeClass("active");
  $(".remove_icon").html("");
  team_array_count = $(this).attr("data-team_turn");
  playerSign = team_name_arr[team_array_count];
  if (playerSign == undefined) {
    if (team_array_count > 1) {
      playerSign = team_name_arr[0];
    } else {
      playerSign = $(".team_list:not(:checked)")[0].defaultValue;
    }
  }
  if (
    team_name_arr.length == 1 &&
    click_count == 1 &&
    $(".multiplayer").attr("multi_player") == "on" &&
    team_array_count == 0
  ) {
    playerSign = $(".team_list:not(:checked)")[0].defaultValue;
  }
  team_icon = generate_icon(playerSign);
  $(this).addClass(" remove_icon");
  $(this).html(team_icon);
  $("." + playerSign + "turn").addClass(" active");
});

$(document).on("mouseleave", ".play-area", function (e) {
  $(".remove_icon").html("");
  $(".remove_icon").removeClass("remove_icon");
});
/******************************************* game play time ************************************/
function start() {
  s++;
  if (s >= 60) {
    s = 0;
    m++;
  }
  if (m >= 60) {
    m = 0;
    h++;
  }
  h1 = h < 10 ? "0" + h : h;
  m1 = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  $(".play_time").html("Time : " + h + ":" + m + ":" + s);
  run = setTimeout("start()", 1200);
}

function stop() {
  clearTimeout(run);
}

