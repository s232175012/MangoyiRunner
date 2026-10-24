let fees = JSON.parse(localStorage.getItem('runnerFees')) || [
  {max:99, fee:50}, {max:500, fee:100}, {max:1000, fee:150},
  {max:1500, fee:200}, {max:2000, fee:250}, {max:2500, fee:300}
];
let orders = JSON.parse(localStorage.getItem('runnerOrders')) || [];
const ADMIN_PASSWORD = "admin123";

function getFee(price){
  for(let f of fees){ if(price <= f.max) return f.fee; }
  return 300 + Math.ceil((price-2500)/500)*50;
}
function renderFees(){
  let html=""; fees.forEach((f,i)=>{
    let label = i==0 ? `Less than R${f.max+1}` : `R${fees[i-1].max+50} - R${f.max}`;
    html+=`<tr><td>${label}</td><td>=</td><td><b>R${f.fee}</b></td></tr>`;
  });
  document.getElementById('feeDisplay').innerHTML=html;
  let edit=""; fees.forEach((f,i)=>{ edit+=`<div style="display:flex;gap:5px;margin:5px 0"><input type="number" value="${f.max}" id="max${i}"><input type="number" value="${f.fee}" id="fee${i}"></div>`; });
  document.getElementById('adminFeeEditor').innerHTML=edit;
}
function calcFee(){
  let price=parseFloat(document.getElementById('goodsPrice').value);
  if(isNaN(price)) return;
  let fee=getFee(price);
  document.getElementById('result').innerHTML=`Fee: R${fee}<br>Total: <b>R${price+fee}</b>`;
}
function saveFees(){
  fees.forEach((f,i)=>{ f.max=parseInt(document.getElementById(`max${i}`).value); f.fee=parseInt(document.getElementById(`fee${i}`).value); });
  localStorage.setItem('runnerFees', JSON.stringify(fees)); renderFees(); alert("Fees Updated!");
}
document.getElementById('runnerForm').addEventListener('submit', function(e){
  e.preventDefault();
  let price=parseFloat(document.getElementById('itemPrice').value); let fee=getFee(price);
  let order={id:Date.now(), date:new Date().toLocaleString(), name:document.getElementById('name').value, phone:document.getElementById('phone').value, shop:document.getElementById('shopName').value, price:price, fee:fee, total:price+fee, delivery:document.getElementById('delivery').value, details:document.getElementById('details').value, status:"PENDING"};
  orders.unshift(order); localStorage.setItem('runnerOrders', JSON.stringify(orders)); renderOrders();
  let msg=`Hi Mangoyi's Runner! New Order%0AName:${order.name}%0APhone:${order.phone}%0AShop:${order.shop}%0APrice:R${price} Fee:R${fee} Total:R${order.total}%0ADelivery:${order.delivery}%0A${order.details}`;
  window.open(`https://wa.me/27724517824?text=${msg}`, '_blank'); this.reset(); alert("Order Saved!");
});
function openAdmin(){ document.getElementById('adminModal').style.display='flex'; }
function closeAdmin(){ document.getElementById('adminModal').style.display='none'; }
function loginAdmin(){
  if(document.getElementById('adminPass').value===ADMIN_PASSWORD){
    document.getElementById('adminModal').style.display='none';
    document.getElementById('adminPanel').style.display='block'; renderOrders();
  } else { document.getElementById('loginError').innerText="Wrong password!"; }
}
function logoutAdmin(){ document.getElementById('adminPanel').style.display='none'; }
function renderOrders(){
  let body=document.getElementById('ordersBody'); if(!body) return; body.innerHTML="";
  let totalFee=0, pending=0;
  orders.forEach(o=>{
    totalFee+=o.fee; if(o.status==="PENDING") pending++;
    body.innerHTML+=`<tr><td>${o.date}</td><td>${o.name}<br><small>${o.phone}</small></td><td>${o.shop}</td><td>R${o.total}<br><small>Fee R${o.fee}</small></td><td><span class="badge-status ${o.status}">${o.status}</span><br><select onchange="changeStatus(${o.id},this.value)"><option ${o.status=='PENDING'?'selected':''}>PENDING</option><option ${o.status=='PAID'?'selected':''}>PAID</option><option ${o.status=='DELIVERED'?'selected':''}>DELIVERED</option></select></td><td><button onclick="deleteOrder(${o.id})" style="background:red;color:#fff;border:none;padding:4px 8px;border-radius:5px">X</button></td></tr>`;
  });
  document.getElementById('totalOrders').innerText=orders.length;
  document.getElementById('totalRevenue').innerText="R"+totalFee;
  document.getElementById('pendingOrders').innerText=pending;
}
function changeStatus(id, status){ let o=orders.find(x=>x.id===id); o.status=status; localStorage.setItem('runnerOrders', JSON.stringify(orders)); renderOrders(); }
function deleteOrder(id){ if(confirm("Delete?")){ orders=orders.filter(x=>x.id!==id); localStorage.setItem('runnerOrders', JSON.stringify(orders)); renderOrders(); } }
renderFees(); renderOrders();