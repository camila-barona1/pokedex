var isOn,
  haveResult,
  btn_shiny,
  btn_zoomIn,
  btn_zoomOut,
  btn_go,
  div_screen,
  div_data,
  btn_on,
  img,
  disabledElements,
  btn_clear,
  textId,
  textName,
  textAbility,
  textType,
  param,
  div_tutorial,
  arrow_left,
  arrow_rigth,
  div_error;

$(document).ready(function () {
  isOn = false;
  haveResult = false;
  img = $("#img");
  btn_front = $("#btn_front");
  btn_zoomIn = $("#btn_zoom-in");
  btn_zoomOut = $("#btn_zoom-out");
  btn_go = $("#btn_go");
  div_screen = $("#div_screen");
  div_data = $("#div_data");
  btn_on = $("#btn_on");
  btn_clear = $("#btn_clear");
  textId = $("#text_id");
  textName = $("#text_name");
  textAbility = $("#text_ability");
  textType = $("#text_type");
  param = $("#pokeInput");
  div_tutorial = $("#div_tutorial");
  div_error = $("#div_error");
  arrow_left = $("#arrow_left");
  arrow_rigth = $("#arrow_rigth");
  disabledElements = document.querySelectorAll(".turnOnOff");

  btn_zoomIn.click(function () {
    if (!isOn) {
      return;
    }
    img.addClass("zoom-in");
  });

  btn_zoomOut.click(function () {
    if (!isOn) {
      return;
    }
    img.removeClass("zoom-in");
  });
});

function enableElements() {
  for (var i = 0; i < disabledElements.length; i++) {
    disabledElements[i].classList.remove("is-disabled");
  }
}

function disableElements() {
  for (var i = 0; i < disabledElements.length; i++) {
    disabledElements[i].classList.add("is-disabled");
  }
}

function turnOnPokedex() {
  clearData();
  if (!isOn) {
    enableElements();
    randomNumbersData();
    div_screen.addClass("is-enabled");
    btn_on.html("OFF");
    isOn = true;
  } else {
    disableElements();
    div_screen.removeClass("is-enabled");
    btn_on.html("ON");
    isOn = false;
    $(".randomNumber").each(function (index, element) {
      $(element).off("click");
    });
  }
}

function clearData() {
  if (!isOn) {
    return;
  }
  haveResult = false;
  img.attr("src", "");
  textId.html("");
  textName.html("");
  textAbility.html("");
  textType.html("");
  param.val("");
}

function randomNumbersData() {
  $(".randomNumber").each(function (index, element) {
    var number = Math.floor(Math.random() * 100) + 1;
    $(element).html(number);
    $(element).click(function () {
      getRandomNumber(number);
    });
  });
}

function hideLoader() {
  $("#div_loader").fadeOut();
  img.fadeIn();
}

function pokeSubmit() {
  if (!isOn) {
    return;
  }
  var inputValue = $.trim(param.val());

  if (inputValue === "") return;
  div_error.hide();
  img.hide();
  $("#div_loader").show();
  let finalParam = param.val();

  if (parseInt(finalParam) > 0) {
    $("#arrow_left").removeClass("is-disabled");
    $("#arrow_left").addClass("is-enabled");
  } else {
    $("#arrow_left").removeClass("is-enabled");
    $("#arrow_left").addClass("is-disabled");
  }

  var pokeURL = "https://pokeapi.co/api/v2/pokemon/" + finalParam;

  $.ajax({
    type: "GET",
    url: pokeURL,
    success: function (data) {
      ajaxSuccess(data);
      myData(data);
      haveResult = true;
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      ajaxError();
      haveResult = false;
    },
  });
}

function ajaxSuccess(data) {
  var imageURI =
    data.sprites.versions["generation-v"]["black-white"].animated.front_default;

  var imageURIShiny =
    data.sprites.versions["generation-v"]["black-white"].animated.back_default;
  var id = data.id;
  var name = data.name;
  var ability = data.abilities;
  var type = data.types;
  var isShiny = false;

  img.attr("src", imageURI);
  textId.html(id);
  textName.html(name);
  textAbility.html(ability[0].ability.name);
  textType.html(type[0].type.name);

  hideLoader();

  btn_front.click(function () {
    if (!haveResult) {
      return;
    }
    if (!isShiny) {
      btn_front.html("Front");
      img.attr("src", imageURIShiny);
      isShiny = true;
    } else {
      btn_front.html("Back");
      img.attr("src", imageURI);
      isShiny = false;
    }
  });

  btn_clear.click(function () {
    clearData();
  });
}

function ajaxError(data) {
  hideLoader();
  clearData();
  div_error.show();
}

function getRandomNumber(number) {
  param.val(number);
  pokeSubmit();
}

$("#arrow_rigth").click(function () {
  param.val(function (i, val) {
    if (!val) {
      param.val(1);
      pokeSubmit();
      return 1;
    }
    param.val(parseInt(val) + 1);

    pokeSubmit();
    return parseInt(++val);
  });
});

$("#arrow_left").click(function () {
  param.val(function (i, val) {
    param.val(parseInt(val) - 1);
    pokeSubmit();
    return parseInt(--val);
  });
});
function myData(data) {
  document.onkeydown = function (e) {
    var keyCode = e.keyCode;
    if (keyCode == 39) {
      param.val(function (i, val) {
        if (!val) {
          param.val(1);
          pokeSubmit();
          return 1;
        }
        param.val(parseInt(val) + 1);
        pokeSubmit();
        return parseInt(++val);
      });
    }
    if (keyCode == 37) {
      param.val(function (i, val) {
        param.val(parseInt(val) - 1);
        pokeSubmit();
        return parseInt(--val);
      });
    }

    if (keyCode == 38) {
      btn_front.html("Back");
      img.attr(
        "src",
        data.sprites.versions["generation-v"]["black-white"].animated
          .front_default
      );
      isShiny = true;
    } else if (keyCode == 40) {
      btn_front.html("Front");
      img.attr(
        "src",
        data.sprites.versions["generation-v"]["black-white"].animated
          .back_default
      );
      isShiny = false;
    }
    if (keyCode == 32) {
      turnOnPokedex();
    }

    if (keyCode == 107) {
      if (!isOn) {
        return;
      }
      img.addClass("zoom-in");
    }

    if (keyCode == 109) {
      if (!isOn) {
        return;
      }
      img.removeClass("zoom-in");
    }
  };
}
myData();

var keys = {};
window.addEventListener(
  "keydown",
  function (e) {
    keys[e.keyCode] = true;
    switch (e.keyCode) {
      case 37:
      case 39:
      case 38:
      case 40: // Arrow keys
      case 32:
        e.preventDefault();
        break; // Space
      default:
        break; // do not block other keys
    }
  },
  false
);
window.addEventListener(
  "keyup",
  function (e) {
    keys[e.keyCode] = false;
  },
  false
);

new Vue({
  el: "#app",
  data() {
    return {
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
      tracks: [
        {
          name: "Pokémon Theme Song",
          artist: "Pokémon",
          cover: "images/1.jpg",
          source: "music/1.mp3",
          url: "https://www.youtube.com/watch?v=rg6CiPI6h2g",
          favorited: false,
        },
        {
          name: "Pokemon - S.S. Anne",
          artist: "Pokémon",
          cover: "images/2.jpg",
          source: "music/2.mp3",
          url: "https://www.youtube.com/watch?v=Aq3gneejUg4&ab_channel=pokemonmusicmaster",
          favorited: true,
        },
        {
          name: "Pueblo lavanda",
          artist: "Pokémon",
          cover: "images/3.jpg",
          source: "music/3.mp3",
          url: "https://www.youtube.com/watch?v=jVB_tmeHzl0",
          favorited: false,
        },
        {
          name: "Pokémon Rojo Fuego Opening",
          artist: "Pokémon",
          cover: "images/4.jpg",
          source: "music/4.mp3",
          url: "https://www.youtube.com/watch?v=vvBqx9QXxFg",
          favorited: false,
        },
        {
          name: "Isla Canela",
          artist: "Pokémon",
          cover: "images/5.jpg",
          source: "music/5.mp3",
          url: "https://www.youtube.com/watch?v=JiGPbYr2-qo",
          favorited: true,
        },
        {
          name: "Into The Hall Of Fame",
          artist: "Pokémon",
          cover: "images/6.jpg",
          source: "music/6.mp3",
          url: "https://www.youtube.com/watch?v=qSCmD19Cp9M",
          favorited: false,
        },
      ],
      currentTrack: null,
      currentTrackIndex: 0,
      transitionName: null,
    };
  },
  methods: {
    play() {
      if (this.audio.paused) {
        this.audio.play();
        this.isTimerPlaying = true;
      } else {
        this.audio.pause();
        this.isTimerPlaying = false;
      }
    },
    generateTime() {
      let width = (100 / this.audio.duration) * this.audio.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";
      let durmin = Math.floor(this.audio.duration / 60);
      let dursec = Math.floor(this.audio.duration - durmin * 60);
      let curmin = Math.floor(this.audio.currentTime / 60);
      let cursec = Math.floor(this.audio.currentTime - curmin * 60);
      if (durmin < 10) {
        durmin = "0" + durmin;
      }
      if (dursec < 10) {
        dursec = "0" + dursec;
      }
      if (curmin < 10) {
        curmin = "0" + curmin;
      }
      if (cursec < 10) {
        cursec = "0" + cursec;
      }
      this.duration = durmin + ":" + dursec;
      this.currentTime = curmin + ":" + cursec;
    },
    updateBar(x) {
      let progress = this.$refs.progress;
      let maxduration = this.audio.duration;
      let position = x - progress.offsetLeft;
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      this.barWidth = percentage + "%";
      this.circleLeft = percentage + "%";
      this.audio.currentTime = (maxduration * percentage) / 100;
      this.audio.play();
    },
    clickProgress(e) {
      this.isTimerPlaying = true;
      this.audio.pause();
      this.updateBar(e.pageX);
    },
    prevTrack() {
      this.transitionName = "scale-in";
      this.isShowCover = false;
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
      } else {
        this.currentTrackIndex = this.tracks.length - 1;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    nextTrack() {
      this.transitionName = "scale-out";
      this.isShowCover = false;
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
      } else {
        this.currentTrackIndex = 0;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.audio.currentTime = 0;
      this.audio.src = this.currentTrack.source;
      setTimeout(() => {
        if (this.isTimerPlaying) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }, 300);
    },
    favorite() {
      this.tracks[this.currentTrackIndex].favorited =
        !this.tracks[this.currentTrackIndex].favorited;
    },
  },
  created() {
    let vm = this;
    this.currentTrack = this.tracks[0];
    this.audio = new Audio();
    this.audio.src = this.currentTrack.source;
    this.audio.ontimeupdate = function () {
      vm.generateTime();
    };
    this.audio.onloadedmetadata = function () {
      vm.generateTime();
    };
    this.audio.onended = function () {
      vm.nextTrack();
      this.isTimerPlaying = true;
    };

    // this is optional (for preload covers)
    for (let index = 0; index < this.tracks.length; index++) {
      const element = this.tracks[index];
      let link = document.createElement("link");
      link.rel = "prefetch";
      link.href = element.cover;
      link.as = "image";
      document.head.appendChild(link);
    }
  },
});
