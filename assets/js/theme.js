(function(){
  var root=document.documentElement;
  var toggle=document.getElementById('theme-toggle');
  if(toggle){toggle.addEventListener('click',function(){
    var next=root.getAttribute('data-theme')==='dark'?'light':'dark';
    root.setAttribute('data-theme',next);localStorage.setItem('theme',next);
  });}
  var navToggle=document.getElementById('nav-toggle');
  var navLinks=document.getElementById('nav-links');
  if(navToggle&&navLinks){navToggle.addEventListener('click',function(){
    var open=navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded',open?'true':'false');
  });}

  /* Subtle scroll-reveal for sections (reduced-motion safe) */
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduce&&'IntersectionObserver'in window){
    root.classList.add('reveal');
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
      });
    },{rootMargin:'0px 0px -8% 0px',threshold:.08});
    document.querySelectorAll('.section').forEach(function(el){io.observe(el);});
  }
})();
