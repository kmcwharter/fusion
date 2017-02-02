var afinn;
var socket;
var serial;
var portName = "/dev/cu.usbmodem1421";
var outMessage = 0;


var letter;
var typing = '';
var input = '';
var avg = '';
var word = [];
var words = [];
var x = '';
var average = 0;
var ts;
// var quest = ["Describe a time when you had control over someone else.", "Describe a time when someone had control over you."];

var width = 1200;
var height = 500;

var scoredWords = [];
var totalScore = 0;
var font;

function preload() {
  afinn = loadJSON('AFINN.json');
  //f = loadFont("LucidaSansRegular.ttf")

}

function setup() {
  createCanvas(width, height);
  background(255);
  socket = io.connect('https://afinn-canvas.herokuapp.com', {
    secure: true
  });
  socket.on('type', draw);

  serial = new p5.SerialPort();
  serial.open(portName);
  serial.on('data', gotData);

}

function gotData() {
  var currentString = serial.readLine();
  console.log(currentString);
}


function draw(data) {
  background(255);
  textSize(15);
  textFont("Helvetica");
  textAlign(CENTER, TOP);

  // var n = Math.round(Math.random());
  // text(quest[n], width/2, 50);



  text(totalScore / average.length, 50, 475);


  if (keyCode !== RETURN) {
    textAlign(CENTER, BOTTOM);
    textSize(20 + ((totalScore / average.length)) * 5);
    fill(0);
    text(typing, 50, 120, 540, 300);

    textAlign(CENTER, TOP);
    textSize(map((data.k / data.h.length), -1, 1, -100, 100));
    fill(255, 0, 0, 80);
    text(data.b, 50, 220, 540, 300);


  }
}


function keyReleased() {
  console.log('Sending: ' + typing + avg + totalScore);

  var data = {
    a: letter,
    b: typing,
    c: input,
    d: avg,
    e: word,
    f: words,
    g: x,
    h: average,
    j: ts,
    k: totalScore
  }

  Player2 = socket.emit('type', data);

  outByte = int(map(totalScore / average.length, -1, 1, 0, 30));
  var num = outByte + '\n';
  serial.write(num);
  serial.write('|');
  print(num);
}

function keyTyped() {
  if ((key >= 'A' && key <= 'z') || key == ' ' || key == '.' ||
    key == '!' || key == '?' || key == ',') {
    letter = key;
    typing = typing + key;
    input = input + key;
    avg = avg + key;
  }
}

function keyPressed() {

  if (key == ' ' || key == '.' || key == '!' || key == '?' || key == ',') {
    word = input;
    input = "";
    words = word.split(/\W/);

    x = avg;
    average = x.split(/\W/);


    for (var i = 0; i < words.length; i++) {
      var compare = words[i].toLowerCase();
      if (afinn.hasOwnProperty(compare)) {

        var score = afinn[compare];
        totalScore += Number(score);
        scoredWords.push(word + ':' + score + ' ');
        ts = ((totalScore / average.length) * 20);
      }
    }
  }

  if (keyCode == BACKSPACE) {
    typing = typing.substring(0, typing.length - 1);
  }


  if (keyCode == ENTER) {
    canvas.clear;

    print(average.length);
    r = average.length;
    print(random(average));
    textSize(random(100, 500));
    fill(random(255), random(255), random(255), 20);
    textAlign(LEFT);

    text(totalScore, 100, 450);


    var img = saveCanvas('images/myCanvas', 'jpg');
    console.log("images saved");
    //saveCanvas('submission', 'png');
    //window.print();
    window.location.reload();
  }
}