import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth,onAuthStateChanged,signOut } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getDatabase,ref,get } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getDatabase(app);
let user=null;
const owner=['dashboard','orders','tables','reservations','customers','menu','inventory','expenses','revenue','reports','staff','attendance','equipment','settings'];
const staff=['dashboard','orders','tables','reservations','customers','menu','inventory','staff','attendance','equipment','settings'];
const labels={
 dashboard:['⌂','Dashboard'],orders:['▣','Orders'],tables:['▦','Tables'],reservations:['▣','Reservations'],
 customers:['♟','Customers'],menu:['▤','Menu'],inventory:['▣','Inventory'],expenses:['◈','Expenses'],
 revenue:['▥','Revenue'],reports:['▥','Reports'],staff:['♟','Staff'],attendance:['▣','Attendance'],
 equipment:['▣','Equipment'],settings:['⚙','Settings']
};
let page='dashboard',content=document.querySelector('#content');

onAuthStateChanged(auth,async u=>{
 if(!u){location.href='login.html';return}
 const s=await get(ref(db,`users/${u.uid}`));
 if(!s.exists()||!['owner','staff'].includes(s.val().role)){await signOut(auth);location.href='login.html';return}
 user={...s.val(),uid:u.uid,email:u.email};render();
});

window.go=x=>{
 if(x==='menu'){location.href='menu.html';return}
 if(x==='orders'){location.href='orders.html';return}
 page=x;render();
};

function render(){
 const list=user.role==='owner'?owner:staff;
 document.querySelector('#nav').innerHTML=list.map(x=>{
   const count=x==='orders'?'<span class="count">5</span>':'';
   return `<button class="nav ${page===x?'active':''}" onclick="window.go('${x}')">${labels[x][0]}&nbsp;&nbsp;${labels[x][1]}${count}</button>`;
 }).join('');
 document.querySelector('#userName').textContent=user.name||'Admin';
 document.querySelector('#roleText').textContent=user.role==='owner'?'Owner':'Staff';
 document.querySelector('#avatar').textContent=(user.name||'A')[0].toUpperCase();
 if(page==='dashboard')return dashboard();
 if(['expenses','revenue','reports'].includes(page)&&user.role!=='owner'){page='dashboard';return dashboard()}
 generic(labels[page][1]);
}

function greeting(){
 const h=new Date().getHours();
 return h<12?'Good Morning':h<17?'Good Afternoon':'Good Evening';
}

function dashboard(){
 const financial=user.role==='owner';
 content.innerHTML=`
 <div class="hero">
   <h1>${greeting()}, ${escapeHtml(user.name||'Admin')} 👋</h1>
   <p>Here’s what’s happening at your restaurant today.</p>
   <div class="hero-meta"><span>▣ &nbsp; ${new Date().toLocaleDateString('en-GB',{weekday:'short',day:'2-digit',month:'short',year:'numeric'})}</span><span>◷ &nbsp; ${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span></div>
 </div>

 <div class="kpis" style="margin-top:12px">
   <div class="card kpi"><div class="round gold">♨</div><h4>Today’s Orders</h4><strong>48</strong><span class="trend">↑ 12.5%</span></div>
   ${financial?`<div class="card kpi"><div class="round green">₹</div><h4>Today’s Revenue</h4><strong>₹ 18,450</strong><span class="trend">↑ 8.2%</span><svg class="mini-line" viewBox="0 0 80 30"><polyline points="0,25 12,22 20,25 30,17 38,21 49,10 58,16 67,9 79,2" fill="none" stroke="#25d49b" stroke-width="2"/></svg></div>`:''}
   <div class="card kpi"><div class="round blue">▰</div><h4>Occupied Tables</h4><strong>12 / 20</strong><span class="muted">60%</span><div class="progress"><span style="width:60%"></span></div></div>
   <div class="card kpi"><div class="round purple">♟</div><h4>Active Staff</h4><strong>08</strong><div class="active-dot">● Active</div></div>
   <div class="card kpi"><div class="round pink">▣</div><h4>Today’s Reservations</h4><strong>5</strong><span class="trend">↑ 25%</span></div>
 </div>

 <div class="columns">
   <div class="stack">
     <section class="card panel">
       <div class="panel-head"><h3>${financial?'Revenue Overview':'Orders Overview'}</h3><button>Last 7 Days⌄</button></div>
       ${financial?revenueChart():`<div class="private-note"><b>Staff view</b><br><br>Financial analytics are private to the restaurant owner. Operational order activity is shown in the Live Orders panel.</div>`}
     </section>
     <section class="card panel table-panel">
       <div class="panel-head"><h3>Table Map</h3><div class="table-legend"><span><i style="background:#19bb82"></i>Available</span><span><i style="background:#ff5a61"></i>Occupied</span><span><i style="background:#ffb91f"></i>Reserved</span><span><i style="background:#3b96e8"></i>Cleaning</span></div></div>
       <div class="table-map">${['T01','T02','T03','T04','T05','T06','T07','T08','T09','T10'].map((x,i)=>`<div class="table-item ${['available','occupied','available','reserved','available','available','available','occupied','reserved','available'][i]}">${x}</div>`).join('')}</div>
       <div class="floor"><div class="zone">♨<br>Kitchen</div><div class="zone">♜<br>Bar</div></div>
     </section>
   </div>

   <div class="stack">
     <section class="card panel">
       <div class="panel-head"><h3>Order Type</h3></div>
       <div class="donut-wrap"><div class="donut"><div class="donut-label">48<small>Total Orders</small></div></div><div class="legend"><div><span><i class="l1"></i>Dine In</span><b>56%</b></div><div><span><i class="l2"></i>Take Away</span><b>27%</b></div><div><span><i class="l3"></i>Delivery</span><b>17%</b></div></div></div>
     </section>
     <section class="card panel">
       <div class="panel-head"><h3>Recent Activity</h3><button>View All →</button></div>
       <div class="activity">
         <div class="activity-row"><div class="activity-icon">♨</div><div><b>New order received</b><small>#1042 · Table T04 · ₹1,250</small></div><span>07:31 PM</span></div>
         <div class="activity-row"><div class="activity-icon">▰</div><div><b>Table T07 is now occupied</b><small>Customer: Ramesh</small></div><span>07:28 PM</span></div>
         <div class="activity-row"><div class="activity-icon">▤</div><div><b>Menu item updated</b><small>Paneer Butter Masala · ₹220</small></div><span>07:15 PM</span></div>
         <div class="activity-row"><div class="activity-icon">♟</div><div><b>Staff added</b><small>Rahul Kumar · Waiter</small></div><span>06:52 PM</span></div>
       </div>
     </section>
   </div>

   <div class="stack">
     <section class="card panel"><div class="panel-head"><h3>Live Orders</h3><button>View All →</button></div><div class="live-list">
       ${liveOrder('#1042','Preparing','Table T04 · 3 items · 07:31 PM','https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=120&q=70','p-prep')}
       ${liveOrder('#1041','Ready','Table T07 · 2 items · 07:28 PM','https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=120&q=70','p-ready')}
       ${liveOrder('#1040','New','Table T02 · 4 items · 07:25 PM','https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=120&q=70','p-new')}
       ${liveOrder('#1039','Served','Table T10 · 2 items · 07:18 PM','https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=120&q=70','p-served')}
       ${liveOrder('#1038','Canceled','Table T05 · 1 item · 07:12 PM','https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=120&q=70','p-cancel')}
     </div></section>
     <section class="card panel"><div class="panel-head"><h3>Quick Actions</h3></div><div class="quick">
       <button onclick="window.go('orders')"><span>♨</span>New Order</button>
       <button onclick="window.go('reservations')"><span>▣</span>New Reservation</button>
       <button onclick="window.go('customers')"><span>♟</span>Add Customer</button>
       <button onclick="window.go('menu')"><span>✂</span>Add Menu Item</button>
       <button onclick="window.go('staff')"><span>♟</span>Add Staff</button>
       ${financial?'<button onclick="window.go(\\'expenses\\')"><span>▣</span>Add Expense</button>':''}
     </div></section>
   </div>
 </div>

 <div class="bottom-strip"><div class="bottom-copy">Delicious Food<br><span>Happy Customers ♥</span></div><div class="benefits"><span>♙ &nbsp; Fresh Ingredients</span><span>♧ &nbsp; Hygienic Kitchen</span><span>★ &nbsp; Best Quality</span></div><button class="view-menu" onclick="window.go('menu')">View Menu →</button></div>
 `;
}

function liveOrder(id,status,meta,img,cls){return `<div class="live"><div><b>${id}<span class="pill ${cls}">${status}</span></b><small>${meta}</small></div><img src="${img}" alt=""></div>`}
function revenueChart(){return `<div class="chart-wrap"><svg class="chart-svg" viewBox="0 0 700 180" preserveAspectRatio="none"><g stroke="#1f2b36" stroke-width="1">${[25,65,105,145].map(y=>`<line x1="45" y1="${y}" x2="690" y2="${y}"/>`).join('')}</g><g fill="#8e9aa6" font-size="9"><text x="5" y="29">₹30K</text><text x="5" y="69">₹20K</text><text x="5" y="109">₹10K</text><text x="12" y="149">₹0</text></g><path d="M45 130 L145 120 L245 95 L345 110 L445 70 L545 95 L645 62 L690 52" fill="none" stroke="#f7bc26" stroke-width="2.5"/><path d="M45 130 L145 120 L245 95 L345 110 L445 70 L545 95 L645 62 L690 52 L690 160 L45 160 Z" fill="#f0af1d" opacity=".08"/><g fill="#f7bc26">${[[45,130],[145,120],[245,95],[345,110],[445,70],[545,95],[645,62],[690,52]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="3.5"/>`).join('')}</g><g fill="#8e9aa6" font-size="9"><text x="38" y="176">20 Sep</text><text x="138" y="176">21 Sep</text><text x="238" y="176">22 Sep</text><text x="338" y="176">23 Sep</text><text x="438" y="176">24 Sep</text><text x="538" y="176">25 Sep</text><text x="638" y="176">26 Sep</text></g></svg></div>`}
function generic(title){content.innerHTML=`<div class="title"><div><h2>${title}</h2><span class="muted">Firebase-backed ${title.toLowerCase()} management</span></div></div><div class="card panel"><div class="private-note">This module is ready for the next Firebase CRUD implementation.</div></div>`}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
