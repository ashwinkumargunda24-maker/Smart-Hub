const ctx=document.getElementById("tempChart");
let temps=[]
let labels=[]
const chart=new Chart(ctx,{
type:"line",
data:{
labels:labels,
datasets:[{
label:"Temperature",
data:temps,
borderWidth:2
}]
}
})
function generateData(){
const temp=Math.floor(Math.random()*45)
const humidity=Math.floor(Math.random()*100)
const energy=Math.floor(Math.random()*500)
document.getElementById("tempValue").innerText=temp+" °C"
document.getElementById("humidity").innerText=humidity+" %"
document.getElementById("energy").innerText=energy+" kWh"
const time=new Date().toLocaleTimeString()
labels.push(time)
temps.push(temp)
if(labels.length>10){
labels.shift()
temps.shift()
}
chart.update()
const table=document.getElementById("tableData")
const row=`<tr>
<td>${time}</td>
<td>${temp}</td>
<td>${humidity}</td>
<td>${energy}</td>
</tr>`
table.innerHTML=row+table.innerHTML
if(temp>35){
document.getElementById("warning").classList.remove("d-none")
const sound = document.getElementById("alertSound");
if (sound) { sound.play().catch(function() {}) }
}
}
setInterval(generateData,3000);
function toggleLight(){
const status=document.getElementById("lightStatus");
status.innerText=status.innerText==="OFF"?"ON":"OFF";
}
function toggleAC(){
const status=document.getElementById("acStatus");
status.innerText=status.innerText==="OFF"?"ON":"OFF";
}