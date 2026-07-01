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
})();
