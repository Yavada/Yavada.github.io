

let minInputEl       = document.querySelector('input[name="min"]');
let maxInputEl       = document.querySelector('input[name="max"]');
let teprEl       = document.querySelector('#tepr');
let minEl       = document.querySelector('#min');
let maxEl       = document.querySelector('#max');
let relayEl       = document.querySelector('#relay');
let inputSetEl  = document.querySelector('input[name="set"]');
let inputGetTeprEl  = document.querySelector('input[name="get_tepr"]');
let inputGetMinEl  = document.querySelector('input[name="get_min"]');
let inputGetMaxEl  = document.querySelector('input[name="get_max"]');
let inputGetRelayEl  = document.querySelector('input[name="get_relay"]');
let spinnerEl  = document.querySelector('#spinner');
let timers = {tepr: 0, min: 0, max: 0, relay: 0}




function getUpdate(what) { return new Promise( async res => {
  spinnerEl.style.display = 'block'
  timers[what] = Date.now() / 1000
  let resF = await fetch(`https://api.particle.io/v1/devices/e00fce6852d017473ad49d7f/${what}?access_token=43e0888d3346b524646e2b5184ceec81a1428f4b`, {
    method: 'GET', 
    headers: {
      'Content-Type': 'application/json'
    }
  })

  let d = await resF.json()
  spinnerEl.style.display = 'none'
  console.log(d)
  res(d.result)
})}

async function runUpdate() {
  let min = Number(minInputEl.value);
  let max = Number(maxInputEl.value);

  if (min < -60 || min > 158 || min > max || max < -58 || max > 160 || max < min) {
    alert ("check the min and max. out of bounds")
    return
  }

  let data = { arg: `${min},${max}` }

  let res = await fetch('https://api.particle.io/v1/devices/e00fce6852d017473ad49d7f/rs_saveconfigs?access_token=43e0888d3346b524646e2b5184ceec81a1428f4b', {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) 
  })

  let dataBack = await res.json()
  
  if(dataBack.return_value === 1)
    alert ("Saved")
  else
    alert ("Unable to contact server")
}

document.body.addEventListener('load', ()=> {
}) 

inputSetEl.addEventListener('click', ()=> {
  runUpdate();
}) 

inputGetTeprEl.addEventListener('click', async ()=> {   
  teprEl.innerHTML = await getUpdate('tepr')   
}) 

inputGetMinEl.addEventListener('click', async ()=> {   
  minEl.innerHTML = await getUpdate('min')   
}) 

inputGetMaxEl.addEventListener('click', async ()=> {   
  maxEl.innerHTML = await getUpdate('max')   
}) 

inputGetRelayEl.addEventListener('click', async ()=> {   
  relayEl.innerHTML = await getUpdate('relay')   
}) 

setInterval(()=> {
  let t = Date.now() / 1000
  let ti = 60

  if (t - timers.tepr > ti)
    teprEl.innerHTML = ''

  if (t - timers.minEl > ti)
    minEl.innerHTML = ''
  
  if (t - timers.maxEl > ti)
    maxEl.innerHTML = ''

  if (t - timers.relayEl > ti)
    relayEl.innerHTML = ''

}, 1000)

