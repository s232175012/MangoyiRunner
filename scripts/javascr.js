const products = [
  { name:"Cashew Milk Chocolate Coated", price:22, cat:"cashew", img:"https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&q=80" },
  { name:"Cashew Extra Hot Peri-Peri", price:18, cat:"cashew", img:"https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&q=80" },
  { name:"Macadamia Milk Chocolate", price:28, cat:"macadamia", img:"https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&q=80" },
  { name:"Macadamia Lightly Salted", price:25, cat:"macadamia", img:"https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&q=80" },
  { name:"Pecan Caramelised", price:24, cat:"pecan", img:"https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&q=80" },
  { name:"Walnut Mixed & Salted", price:20, cat:"walnut", img:"https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&q=80" },
  { name:"Hazelnut Roasted", price:22, cat:"hazelnut", img:"https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&q=80" },
  { name:"Pistachio Salted", price:26, cat:"pistachio", img:"https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&q=80" },
  { name:"Mixed Nuts Classic", price:21, cat:"mixed", img:"https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&q=80" },
  { name:"Dried Fruit Mix", price:18, cat:"fruit", img:"https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=600&q=80" },
];

// Marquee - slow & smooth
const flavours = "Lightly Salted • Mixed and Salted • Milk Chocolate Coated • Extra Hot Peri-Peri • Caramelised • Roasted • ";
document.getElementById("marqueeTrack").textContent = flavours + flavours;

// Render products + filter
const grid = document.getElementById("productGrid");
let currentFilter = "all";
function render(){
  grid.innerHTML = "";
  products.filter(p => currentFilter==="all" || p.cat===currentFilter).forEach(p=>{
    const div = document.createElement("div");
    div.className="card";
    div.innerHTML = `<img src="${p.img}"><h4>${p.name}</h4><p>R${p.price}</p><button>Add to cart</button>`;
    div.querySelector("button").onclick = ()=> addToCart(p);
    grid.appendChild(div);
  });
}
document.querySelectorAll("#filters button").forEach(btn=>{
  btn.onclick = ()=>{
    document.querySelectorAll("#filters button").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  };
});
render();

// Packaging steps
document.querySelectorAll(".pack-step").forEach(btn=>{
  btn.onclick = ()=>{
    document.querySelectorAll(".pack-step").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
  };
});

// Cart
let cart = [];
const drawer = document.getElementById("cartDrawer");
function addToCart(p){
  cart.push(p);
  updateCart();
  drawer.classList.remove("hidden");
}
function updateCart(){
  document.getElementById("cartCount").textContent = cart.length;
  const total = cart.reduce((s,p)=>s+p.price,0);
  document.getElementById("cartTotal").textContent = total;
  document.getElementById("cartItems").innerHTML = cart.map((p,i)=>`<div class="cart-row"><span>${p.name}</span><b>R${p.price}</b></div>`).join("") || "<p>Cart is empty</p>";
  document.getElementById("freeShip").textContent = total >= 350 ? "✅ Free courier unlocked!" : `Add R${350-total} more for free courier`;
}
document.getElementById("cartBtn").onclick = ()=> drawer.classList.remove("hidden");
document.getElementById("closeCart").onclick = ()=> drawer.classList.add("hidden");
document.getElementById("checkoutBtn").onclick = ()=>{
  const total = cart.reduce((s,p)=>s+p.price,0);
  const text = encodeURIComponent(`Hi NuttyNaj! I want to order:\n` + cart.map(p=>`- ${p.name} - R${p.price}`).join("\n") + `\nTotal: R${total}`);
  window.open(`https://wa.me/27630457655?text=${text}`, "_blank");
};

// WhatsApp form
document.getElementById("whatsappForm").addEventListener("submit", e=>{
  e.preventDefault();
  const name = document.getElementById("fName").value;
  const shop = document.getElementById("fShop").value;
  const type = document.getElementById("fType").value;
  const msg = document.getElementById("fMsg").value;
  const text = encodeURIComponent(`Hi NuttyNaj!\nName: ${name}\nShop: ${shop}\nEnquiry: ${type}\nMessage: ${msg}`);
  window.open(`https://wa.me/27630457655?text=${text}`, "_blank");
});

// Pause video when not on screen - saves data
const video = document.querySelector("video");
if(video){
  new IntersectionObserver(entries=>{
    entries.forEach(en=> en.isIntersecting ? video.play() : video.pause());
  }).observe(video);
}
