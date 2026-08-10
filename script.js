const projects=[
["Azuma Sushi","ecommerce","Restaurant","Japanese dining / UK","https://azumasushi.co.uk/","A hospitality-focused web experience for a Japanese restaurant brand.","#5b2815"],
["Umar & Amayrah","ecommerce","E-commerce","Modest fashion & fragrance / UK","https://umarandamayrah.co.uk/","An online store for abayas, thobes and perfumes with product-led browsing.","#4b3020"],
["Boyshero","agency","Technology","Digital transformation / Bangladesh","https://boyshero.com/","A technology and business transformation site spanning software, AI, marketing and managed services.","#30231c"],
["Spark IT","business","Internet Service Provider","Broadband / Bangladesh","https://sparkit.net.bd/","A broadband ISP website built around plans, coverage, support and connectivity use cases.","#1c3141"],
["DigiWebNex","agency","Digital Marketing","SEO & web / Bangladesh","https://digiwebnex.com/","A digital growth agency site focused on SEO, AEO, GEO, website design and content.","#3a2015"],
["Aestora Living","ecommerce","E-commerce","Lifestyle / US","https://aestoraliving.com/","A lifestyle commerce project presented as an e-commerce brand experience.","#3b2d20"],
["Kelma","saas","Hosting / Technology","WordPress hosting","https://kelma.io/","A WordPress hosting brand with a technology-first positioning and product-focused experience.","#18303b"],
["Get Levrg","business","Offshoring / Operations","Business services / Canada","https://getlevrg.com/","A professional services website for an offshore talent and operational efficiency company.","#3b2419"],
["Pipeline Signals","saas","SaaS / B2B","Sales & marketing technology","https://pipelinesignals.com/","A B2B technology website focused on pipeline and growth-oriented messaging.","#24304a"],
["Empellor CRM","saas","CRM Consulting","CRM / USA","https://empellorcrm.com/","A strategic CRM consultancy website covering Microsoft Dynamics 365, Salesforce and CRM transformation.","#182a3c"],
["The Sales Factory","agency","B2B Sales","Lead generation / Canada & USA","https://www.thesalesfactory.com/","A B2B sales and lead-generation experience built around growth, services and buyer journeys.","#302117"],
["NAZMC","agency","Education / Digital","AI & digital marketing","https://nazmc.com/","A digital education and services website combining AI, marketing learning and professional offerings.","#3b241a"],
["FameDevBD","business","Technology","Web / IT services","https://famedevbd.com/","A technology-focused business web presence.","#30251f"],
["FameTerra","business","Business","Professional services","https://fameterra.com/","A professional business website presented as part of the portfolio system.","#30231c"],
["TRP Medicare Pharma","health","Healthcare","Pharmaceutical / Bangladesh","https://trpmedicarepharma.com/","A healthcare and pharmaceutical business web presence.","#18362e"],
["Nuqta BD","business","Business","Bangladesh","https://nuqtabd.com/","A Bangladesh-focused business website included in the portfolio.","#33251d"],
["LPSS USA","business","Professional Services","USA","https://lpssusa.com/","A US-focused professional services website.","#29252a"],
["Eurobath BD","ecommerce","Home & Bath","Bathroom products / Bangladesh","https://eurobathbd.com/","A product-led bathroom and sanitaryware website with catalog-style browsing.","#34302b"]
];

const grid=document.querySelector("#project-grid");
function render(filter="all"){
 grid.innerHTML=projects.map((p,i)=>{
   const [title,cat,industry,market,url,desc,tone]=p;
   const hidden=filter!=="all"&&cat!==filter?"hidden":"";
   return `<a class="project ${hidden} reveal" href="${url}" target="_blank" rel="noopener" data-category="${cat}">
     <div class="project-visual" style="--tone:${tone}">
       <div class="browser"><div class="browser-top"><i></i><i></i><i></i></div><div class="browser-body"><small>${industry} · ${market}</small><strong>${title}</strong><small>${url.replace(/^https?:\/\//,"").replace(/\/$/,"")}</small></div></div>
       <span class="project-badge">${String(i+1).padStart(2,"0")} / ${cat.toUpperCase()}</span>
     </div>
     <div class="project-meta"><div><h3>${title}</h3><p>${industry} · ${market}</p><span class="project-link">View project ↗</span></div></div>
   </a>`
 }).join("");
 observeReveals();
}
render();

document.querySelectorAll(".filters button").forEach(btn=>btn.addEventListener("click",()=>{
 document.querySelectorAll(".filters button").forEach(b=>b.classList.remove("active"));
 btn.classList.add("active"); render(btn.dataset.filter);
}));

const nav=document.querySelector("#nav");
window.addEventListener("scroll",()=>nav.classList.toggle("scrolled",scrollY>30),{passive:true});

const menu=document.querySelector(".menu-btn");
menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",open)});
document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menu.setAttribute("aria-expanded","false")}));

function observeReveals(){
 const items=document.querySelectorAll(".reveal");
 if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){items.forEach(x=>{x.style.opacity=1;x.style.transform="none"});return}
 if(window.gsap&&window.ScrollTrigger){
   gsap.registerPlugin(ScrollTrigger);
   items.forEach(el=>{
     if(el.dataset.animated)return;
     el.dataset.animated="1";
     gsap.fromTo(el,{y:28,opacity:0},{y:0,opacity:1,duration:.8,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 88%",once:true}});
   });
 }
}
observeReveals();

if(window.gsap&&window.ScrollTrigger&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
 gsap.to(".portrait-orbit",{rotation:25,duration:18,repeat:-1,ease:"none"});
 gsap.to(".portrait-stage",{y:-22,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:1}});
}

const dot=document.querySelector(".cursor-dot"),ring=document.querySelector(".cursor-ring");
if(dot&&ring&&matchMedia("(pointer:fine)").matches){
 addEventListener("pointermove",e=>{dot.style.left=e.clientX+"px";dot.style.top=e.clientY+"px";ring.animate({left:e.clientX+"px",top:e.clientY+"px"},{duration:280,fill:"forwards"});});
 document.querySelectorAll("a,button,summary").forEach(el=>el.addEventListener("mouseenter",()=>ring.style.transform="translate(-50%,-50%) scale(1.5)"));
 document.querySelectorAll("a,button,summary").forEach(el=>el.addEventListener("mouseleave",()=>ring.style.transform="translate(-50%,-50%) scale(1)"));
}
document.querySelector("#year").textContent=new Date().getFullYear();
