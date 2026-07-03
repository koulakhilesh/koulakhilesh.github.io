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

  /* Back-to-top */
  var toTop=document.getElementById('to-top');
  if(toTop){
    var onScroll=function(){toTop.hidden=window.scrollY<=600;};
    onScroll();
    window.addEventListener('scroll',onScroll,{passive:true});
    toTop.addEventListener('click',function(){
      window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});
    });
  }

  /* Search overlay (lightweight index + `/` shortcut) */
  var searchEl=document.getElementById('search');
  var searchToggle=document.getElementById('search-toggle');
  if(searchEl){
    var input=document.getElementById('search-input');
    var results=document.getElementById('search-results');
    var empty=document.getElementById('search-empty');
    var index=null,loading=false;
    var esc=function(s){return String(s||'').replace(/[&<>"]/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};
    var load=function(){
      if(index||loading)return;
      loading=true;
      fetch(searchEl.getAttribute('data-endpoint'))
        .then(function(r){return r.json();})
        .then(function(d){index=d;})
        .catch(function(){index=[];});
    };
    var render=function(items){
      results.innerHTML='';
      if(empty)empty.hidden=!(input.value.trim()&&items.length===0);
      items.forEach(function(it){
        var li=document.createElement('li');
        li.className='search-item';
        li.innerHTML='<a href="'+esc(it.url)+'"><span class="s-type">'+esc(it.type)+
          '</span><span class="s-title">'+esc(it.title)+
          '</span><span class="s-sum">'+esc(it.summary)+'</span></a>';
        results.appendChild(li);
      });
    };
    var run=function(){
      var q=input.value.trim().toLowerCase();
      if(!q||!index){render([]);return;}
      render(index.map(function(it){
        var t=(it.title||'').toLowerCase(),s=(it.summary||'').toLowerCase(),sc=0;
        if(t.indexOf(q)>-1)sc+=2; if(s.indexOf(q)>-1)sc+=1;
        return {it:it,sc:sc};
      }).filter(function(x){return x.sc>0;})
        .sort(function(a,b){return b.sc-a.sc;})
        .slice(0,8).map(function(x){return x.it;}));
    };
    var open=function(){
      searchEl.hidden=false;root.style.overflow='hidden';load();
      setTimeout(function(){input.focus();},20);
    };
    var close=function(){
      searchEl.hidden=true;root.style.overflow='';input.value='';render([]);
    };
    if(searchToggle)searchToggle.addEventListener('click',open);
    input.addEventListener('input',run);
    searchEl.addEventListener('click',function(e){
      if(e.target.hasAttribute('data-search-close'))close();
    });
    document.addEventListener('keydown',function(e){
      var tag=(e.target&&e.target.tagName||'').toLowerCase();
      if(e.key==='/'&&searchEl.hidden&&tag!=='input'&&tag!=='textarea'&&tag!=='select'){
        e.preventDefault();open();
      }else if(e.key==='Escape'&&!searchEl.hidden){close();}
    });
  }
})();
