
document.addEventListener('DOMContentLoaded',()=>{
 const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.navlinks');
 if(toggle&&nav){toggle.addEventListener('click',()=>{nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(nav.classList.contains('open')))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')))}

 // Pulido de interfaz: barra de progreso, cabecera y aparicion progresiva
 const progress=document.createElement('div');progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');document.body.appendChild(progress);
 const header=document.querySelector('.header');
 const updateScroll=()=>{
  const max=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.width=(max>0?(window.scrollY/max)*100:0)+'%';
  if(header)header.classList.toggle('is-scrolled',window.scrollY>12);
 };
 window.addEventListener('scroll',updateScroll,{passive:true});updateScroll();
 const allowMotion=!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const revealTargets=document.querySelectorAll('.hero-content,.page-hero .container,.section-head,.split > div,.image-card,.menu-section,.gallery a,.contact-card,.reservation-grid > div,.quote');
 revealTargets.forEach((el,i)=>{el.classList.add('js-reveal');el.dataset.delay=String(i%4)});
 if(allowMotion&&'IntersectionObserver' in window){
  document.documentElement.classList.add('motion-ready');
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}});
  },{threshold:.08,rootMargin:'0px 0px 35px 0px'});
  revealTargets.forEach(el=>observer.observe(el));
  // Failsafe: never leave offscreen content invisible indefinitely.
  window.addEventListener('pageshow',e=>{if(e.persisted)revealTargets.forEach(el=>el.classList.add('is-visible'))});
 }else{revealTargets.forEach(el=>el.classList.add('is-visible'))}

 const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
 const form=document.getElementById('booking-form');
 if(form){form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;
  const data=Object.fromEntries(new FormData(form).entries());data.id=String(Date.now());data.status='Pendiente';data.createdAt=new Date().toISOString();
  try{const list=JSON.parse(localStorage.getItem('elpi_reservations')||'[]');list.push(data);localStorage.setItem('elpi_reservations',JSON.stringify(list));const msg=document.getElementById('form-message');msg.textContent='Solicitud guardada en este navegador. Esta demostración no la ha enviado al restaurante. Para confirmar, llama al +34 961 68 01 70.';msg.hidden=false;form.reset()}catch(err){alert('No se ha podido guardar la solicitud en este navegador.') }
 })}
 // Filtro de carta
 document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b===btn));const f=btn.dataset.filter;document.querySelectorAll('[data-menu-category]').forEach(el=>el.hidden=f!=='all'&&el.dataset.menuCategory!==f)}));
 // Acceso rápido oculto: cinco clics sobre el logotipo (sin recargar la página)
 let logoClicks=0,logoTimer;
 document.querySelectorAll('.brand').forEach(logo=>{
  logo.addEventListener('click',e=>{
   if(!e.altKey)return;
   e.preventDefault();
   logoClicks++;
   clearTimeout(logoTimer);
   if(logoClicks>=5){window.location.href=new URL('admin.html',window.location.href).href;return;}
   logoTimer=setTimeout(()=>{logoClicks=0},2200);
  });
 });
});
