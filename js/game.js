// Those are global variables, they stay alive and reflect the state of the game
var elPreviousCard = null;
var flippedCouplesCount = 0;
var isLock = false;

// This is a constant that we dont change during the game (we mark those with CAPITAL letters)
var TOTAL_COUPLES_COUNT = 3;

// Load an audio file
var again = document.getElementById("again");
var audioWin = new Audio("sound/win.mp3");
var audioWorng = new Audio("sound/wrong.mp3");
var audioRight = new Audio("sound/right.mp3");
var count = 1;
var start = null;
var end = null;
var score = 1;
var user = null;
var best_result = 0;

class Flipper {
  constructor(
    target,
    {
      degMax = 180,
      degMin = 0,
      degStart = 0,
      vilocity = 10,
      direction = "up",
      callback,
      finish
    }
  ) {
    this.direction = direction;
    this.DIRECTIONS = {
      UP: "up",
      DOWN: "down",
    };
    this.finish = finish;
    this.target = target;
    this.degMax = degMax;
    this.degMin = degMin;
    this.currectDeg = degStart;
    this.callback = callback;
    this.volocity = vilocity;
    this.stoped = false; // create start valiadtion to check the min, max and currect;
    this.flip();
  }
  stop() {
    this.stoped = true;
  }
  flip() {
    if (this.stoped) {
      console.log("flip stopped by client..");
      return;
    }
    // do you put here an anonymos function?
    if (typeof this.callback === "function") {
      this.callback(this.currectDeg);
    }
    if (this.currectDeg <= this.degMax) {
      setTimeout(() => {
        this.flip(this.target);
      }, this.volocity);
    } else {
      // here im assain it to the first deg after it loop
      this.currectDeg = this.degStart;
      // here im release lock 
      this.stoped = false;
      // this is fot for return the Previous card back to Null
      if(typeof this.finish ==="function"){
        this.finish();
      }
      return;
    }
    if (this.direction === this.DIRECTIONS.UP) {
      this.currectDeg++;
    } else {
      this.currectDeg--;
    }
  }
}

// at start set player name
window.addEventListener("DOMContentLoaded", () => {
  var user = prompt("Please Enter Your name");
  while (user == null) {
    user = prompt("Please Enter Your name");
  }
  localStorage.setItem("playerName", `${user}`);
  var getPlayer = localStorage.getItem("playerName");
  // document.getElementById("userName").innerHTML = "Welcome, " + `${getPlayer}`;
  document.querySelector(".userName").innerHTML = "Welcome, " + `${getPlayer}`;
});

// change name of a play by click button
function changeClicked() {
  var user = null;
  while (user == null) {
    user = prompt("Please Enter Your name");
  }
  document.querySelector(".userName").innerHTML = "Welcome, " + `${user}`;

  localStorage.setItem("playerName" + `${count}`, `${user}`);
  again.style.display = "block";
  return count++;
}
function Shuffle() {
  var board = document.querySelector(".board");
  for (var i = board.children.length; i >= 0; i--) {
    board.appendChild(board.children[(Math.random() * i) | 0]);
  }
}
// set time in millsecond
function Time() {
  var c = new Date();
  var result = c.getTime();
  return result;
}
// relese Lock when finish
function done() {
  isLock = false;
}
// function toggle_visibility(id) {
//   var e = document.getElementById(id);
//   if (e.style.display == "block") e.style.display = "none";
//   else e.style.display = "block";
// }
// This function is called whenever the user click a card
function CalculateTime(a, b) {
  var sum = b - a;
  if (sum < best_result) {
    localStorage.setItem("score", sum);
    document.querySelector(".best").innerHTML = sum;
  }
  best_result = sum;
  start = null;
  end = null;
  return best_result;
}
function cardClicked(elCard) {
  const back = elCard.querySelector(".back");
  const front = elCard.querySelector(".front");
  // when the game is start
  if (isLock === true) {
    return;
  }
  isLock = true;
  // first click
  // first click here...
  // If the user clicked an already flipped card - do nothing and return from the function
  if (elCard.classList.contains("flipped")) {
    return;
  }

  let degreeUp = 0;
  let degreeDown = 180;
  const volocity = 10;
  const flippedUp = (card) => {
    if (degreeUp === 90) {
      // replace the z-indx
      back.style.zIndex = 0;
      front.style.zIndex = 2;
    }
    if (degreeUp <= 180) {
      setTimeout(() => {
        elCard.style.transform = `rotateY(${degreeUp}deg)`;
        flippedUp(card);
      }, volocity);
    }
    degreeUp++;
  };
  const flippedDown = (card) => {
    if (degreeDown === 90) {
      // replace the z-indx
      back.style.zIndex = 2;
      front.style.zIndex = 0;
    }
    if (degreeDown >= 0) {
      setTimeout(() => {
        elCard.style.transform = `rotateY(${degreeDown}deg)`;
        flippedDown(card);
      }, volocity);
    }
    degreeDown--;
  };
  // Flip it
  new Flipper(elCard, {
    degMin: 0,
    degMax: 180,
    callback: (deg) => {
      if (deg === 90) {
        // replace the z-indx
        const back = elCard.querySelector(".back");
        const front = elCard.querySelector(".front");
        back.style.zIndex = 0;
        front.style.zIndex = 2;
      }
      if (deg >= 0) {
        elCard.style.transform = `rotateY(${deg}deg)`;
      }
    },
  });
  // flippedUp(elCard);
  elCard.classList.add("flipped");

  if (start == null) {
    start = Time();
  }
  // This is a first card, only keep it in the global variable
  if (elPreviousCard === null) {
    elPreviousCard = elCard;
    done();
    return;
  }
  // get the data-card attribute's value from both cards
  var card1 = elPreviousCard.getAttribute("data-card");
  var card2 = elCard.getAttribute("data-card");

  // No match, schedule to flip them back in 1 second
  if (card1 !== card2) {
    audioWorng.play();
    setTimeout(function () {
      debugger
      new Flipper(elCard, {
        degMin: 0,
        degMax: 180,
        callback: (deg) => {
          if (deg === 90) {
            // replace the z-indx
            const back = elCard.querySelector(".back");
            const front = elCard.querySelector(".front");
            back.style.zIndex = 2;
            front.style.zIndex = 0;
          }
          if (deg >= 0) {
            elCard.style.transform = `rotateY(${deg}deg)`;
          }
        },
      });
      new Flipper(elPreviousCard, {
        degMin: 0,
        degMax: 180,
        callback: (deg) => {
          if (deg === 90) {
            // replace the z-indx
            const back = elPreviousCard.querySelector(".back");
            const front = elPreviousCard.querySelector(".front");
            back.style.zIndex = 2;
            front.style.zIndex = 0;
          }
          if (deg >= 0) {
            elPreviousCard.style.transform = `rotateY(${deg}deg)`;
          }
        },
        finish:()=>{
          elPreviousCard = null;
        }
      });
      elCard.classList.remove("flipped");
      elPreviousCard.classList.remove("flipped");
      done();
    }, 1000);
  } else {
    // Yes! a match!
    audioRight.play();
    flippedCouplesCount++;
    elPreviousCard = null;
    done();

    // All cards flipped!
    if (TOTAL_COUPLES_COUNT === flippedCouplesCount) {
      again.style.display = "block";

      audioWin.play();

      if (end == null) end = Time();
      flippedCouplesCount = 0;
      done();
      CalculateTime(start, end);
      Shuffle();
    }
  }
}

function clickAgain() {
  var elDivs = document.querySelectorAll(".card");

  for (var i = 0; i < elDivs.length; ++i) {
    elDivs[i].classList.remove("flipped");
  }
  again.style.display = "none";
}
