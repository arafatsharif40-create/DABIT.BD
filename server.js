const express = require('express');
const app = express();
app.use(express.json());

let users = {};
let otps = {};

app.get('/', (req,res) => {
  res.send(`
  <html><head><meta name="viewport" content="width=device-width, initial-scale=1">
  <style>body{font-family:sans-serif;text-align:center;background:#f0f9f0;padding:15px}
  .card{background:white;max-width:500px;margin:auto;padding:20px;border-radius:15px;box-shadow:0 4px 10px #ccc}
  h1{color:green} input{padding:12px;width:85%;margin:8px;border-radius:8px;border:1px solid #ccc}
  button{padding:12px;width:90%;background:#2e7d32;color:white;border:none;border-radius:8px;font-size:18px}
  .h{background:#e8f5e9;padding:10px;border-radius:8px;margin:10px 0;font-weight:bold}
  </style></head><body>
  <div class="card">
  <h1>DABIT.BD</h1>
  <h3>Admin: SF.AKASH</h3>
  <div class="h">Helpline: 01707607781 - 24 Hour Service</div>
  <p style="color:green"><b>Status: LIVE - Official Public Link</b></p>
  <p>Chatting | Voice Call | Video Call | Book Collection</p><hr>
  <input id="phone" placeholder="Phone Number">
  <input id="otp" placeholder="OTP" style="display:none">
  <input id="pass" placeholder="Password" type="password" style="display:none">
  <button id="btn" onclick="go()">Send OTP via 01707607781</button>
  <p id="msg"></p>
  </div>
  <script>
  let step='send';
  function go(){
    const phone=document.getElementById('phone').value;
    const otp=document.getElementById('otp').value;
    const pass=document.getElementById('pass').value;
    const msg=document.getElementById('msg');
    if(step=='send'){
      fetch('/send-otp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone})})
      .then(r=>r.json()).then(d=>{
        if(d.error){msg.innerHTML='<span style=color:red>'+d.error+'</span>'}
        else{msg.innerHTML='<span style=color:green>OTP Sent (Test: '+d.otp+')</span>';document.getElementById('otp').style.display='block';document.getElementById('btn').innerText='Verify OTP';step='verify'}
      })
    } else if(step=='verify'){
      fetch('/verify-otp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone,otp})})
      .then(r=>r.json()).then(d=>{
        if(d.error){msg.innerHTML='<span style=color:red>'+d.error+'</span>'}
        else{msg.innerHTML='<span style=color:green>Verified, set password</span>';document.getElementById('pass').style.display='block';document.getElementById('btn').innerText='Register';step='reg'}
      })
    } else {
      fetch('/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone,otp,password:pass})})
      .then(r=>r.json()).then(d=>{msg.innerHTML=d.error?'<span style=color:red>'+d.error+'</span>':'<span style=color:green>Welcome to DABIT.BD!</span>'})
    }
  }
  </script></body></html>`);
});

app.post('/send-otp',(req,res)=>{
  const {phone}=req.body;
  if(users[phone]) return res.json({error:"এই নাম্বার দিয়ে already registered!"});
  otps[phone]=Math.floor(100000+Math.random()*900000);
  console.log("OTP for "+phone+": "+otps[phone]);
  res.json({success:true,otp:otps[phone]});
});
app.post('/verify-otp',(req,res)=>{
  if(String(otps[req.body.phone])!==String(req.body.otp)) return res.json({error:"ভুল OTP"});
  res.json({success:true});
});
app.post('/register',(req,res)=>{
  const {phone,otp,password}=req.body;
  if(users[phone]) return res.json({error:"এই নাম্বার দিয়ে already registered!"});
  if(String(otps[phone])!==String(otp)) return res.json({error:"OTP Error"});
  users[phone]={password};
  delete otps[phone];
  res.json({success:true});
});
app.listen(process.env.PORT||10000);
