class PDW {
  constructor(tstart,pwidth,freq,pow,phas,iqstat,iqseg){
    this.tstart = tstart;
    this.pwidth = pwidth;
    this.freq = freq;
    this.pow = pow;
    this.phas = phas;
    this.iqstat = iqstat;
    this.iqseg = iqseg;
    this.info_bw = 10e6; // default 10 MHz bandwith = CW
    while(this.phas < 0){
      this.phas = this.phas + 2*Math.PI;
    }
  }

  set_info_bw(bw){
    this.info_bw = bw;
  }

  as_csv(){
    var delimiter = ";";
    let str = "";
    str += this.iqstat + delimiter;
    str += this.tstart.toFixed(9) + delimiter;
    str += "0" + delimiter;
    str += this.pwidth.toFixed(9) + delimiter;
    str += this.iqseg + delimiter;
    str += "1" + delimiter;
    str += this.freq.toFixed(6) + delimiter;
    str += this.pow.toFixed(2) + delimiter;
    str += this.phas.toFixed(2) + delimiter;
    str += "\n"
    return str;
  }
}

function antennaPhi2PowDipole(phi){
phi += Math.PI /2;
if (Math.abs(Math.sin(phi)) > 0.00001) {
    return Math.abs(Math.cos((Math.PI / 2.0) * Math.cos(phi)) / Math.sin(phi));
} else {
    return 0;
}
}

function antennaPhi2PowCardioid(phi){
return 0.5*(1-Math.cos(phi + Math.PI));
}

function getPolarAntennaIsotrope(N){
var out = new Array(N);
for(let i = 0; i < N; i++) {
    out[i] = 1.0;
}
return out;
}

function getPolarAntennaDipole(N){
var out = new Array(N);
for(let i = 0; i < N; i++) {
    var phi = i * 2*Math.PI / N;
    out[i] = antennaPhi2PowDipole(phi);
}
return out;
}

function getPolarAntennaCardioid(N){
var out = new Array(N);
for(let i = 0; i < N; i++) {
    var phi = i * 2*Math.PI / N;
    out[i] = antennaPhi2PowCardioid(phi);
}
return out;
}
  function exportPDWList(pdwlist){
    var pdwFormatIndex = 0; // todo hardcoded. inSelFormatPDW.selectedIndex;
    let txtContent;
    txtContent = "WAVE_STATE;START_TIME;MARKER;PULSE_WIDTH;WAVE_WSEG;OUTP_STATE;FREQ;POW;PHASE\n";
    for(let i = 0; i < N_PDW; i++) {
      txtContent += pdwlist[i].as_csv();
    }
    const file = new Blob([txtContent], { type: 'text/csv' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "pdw_list.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }

// https://easings.net/#easeInOutSine
function easeInOutSine(x){
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

