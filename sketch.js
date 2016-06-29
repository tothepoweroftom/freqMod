

var carrier; // this is the oscillator we will hear
var modulator; // this oscillator will modulate the frequency of the carrier

var envelope, env2;
// the carrier frequency pre-modulation
var carrierBaseFreq = 400;

// min/max ranges for modulator
var modMaxFreq = 120;
var modMinFreq = 0;
var modMaxDepth = 1500;
var modMinDepth = -1500;

var attackLevel = 1.0;
var releaseLevel = 0;

var attackTime = 0.001
var decayTime = 0.7;
var susPercent = 0.2;
var releaseTime = 0.2;

var attackTime2 = 0.1
var decayTime2 = 0.3;
var susPercent2 = 0.5;
var releaseTime2 = 0.9;
function setup() {
  var cnv = createCanvas(1000,800);
  noFill();
  cnv.mousePressed(trigger);
  cnv.touchStarted(trigger);


  
  envelope = new p5.Env();
  envelope.setADSR(attackTime, decayTime, susPercent, releaseTime);
  
  envelope.setRange(attackLevel, releaseLevel);
  
    
  env2 = new p5.Env();
  env2.setADSR(attackTime2, decayTime2, susPercent2, releaseTime2);
  
  env2.setRange(1000, 0);
  
    carrier = new p5.Oscillator('sine');
  carrier.amp(envelope); // set amplitude
  carrier.freq(400); // set frequency
  carrier.start(); // start oscillating

  // try changing the type to 'square', 'sine' or 'triangle'
  modulator = new p5.Oscillator('sine');
  modulator.start();
  modulator.amp(env2);

  // add the modulator's output to modulate the carrier's frequency
  modulator.disconnect();
  carrier.freq( modulator );
  

  // create an FFT to analyze the audio
  analyzer = new p5.FFT();

  // fade carrier in/out on mouseover / touch start
  //toggleAudio(cnv);
}

function draw() {
  background(30);

  // map mouseY to modulator freq between a maximum and minimum frequency
  //var modFreq = map(mouseY, height, 0, modMinFreq, modMaxFreq);
  //carrier.freq(modFreq);

  // change the amplitude of the modulator
  // negative amp reverses the sawtooth waveform, and sounds percussive
  // 
 // var modDepth = map(mouseX, 0, width, modMinDepth, modMaxDepth);
  //modulator.amp(modDepth);

  // analyze the waveform
  waveform = analyzer.waveform();

  // draw the shape of the waveform
  stroke(255);
  strokeWeight(10);
  beginShape();
  for (var i = 0; i < waveform.length; i++){
    var x = map(i, 0, waveform.length, 0, width);
    var y = map(waveform[i], -1, 1, -height/2, height/2);
    vertex(x, y + height/2);
  }
  endShape();


}

function trigger() {

  envelope.play();
  env2.play();
}
// helper function to toggle sound
function toggleAudio(cnv) {
  cnv.mouseOver(function() {
    carrier.amp(1.0, 0.01);
  });
  cnv.touchStarted(function() {
    carrier.amp(1.0, 0.01);
  });
  cnv.mouseOut(function() {
    carrier.amp(0.0, 1.0);
  });
}