/* Mahi Uddin Ahmed — site behaviour.
   Everything here is progressive: with JS off the page is fully readable. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- year ---------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- signature interaction: cursor spotlight ----------
     One rAF loop, two CSS custom properties. The spotlight tints the page
     and is also the mask that reveals the hero grid, so it reads as a single
     light source rather than two separate effects. */
  var fine = window.matchMedia('(pointer: fine)').matches;

  if (fine && !reduced) {
    document.body.classList.add('is-pointer');

    var tx = window.innerWidth / 2;
    var ty = window.innerHeight * 0.4;
    var cx = tx, cy = ty;
    var queued = false;

    window.addEventListener('pointermove', function (e) {
      tx = e.clientX;
      ty = e.clientY;
      if (!queued) { queued = true; requestAnimationFrame(tick); }
    }, { passive: true });

    function tick() {
      queued = false;
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      root.style.setProperty('--mx', cx.toFixed(1) + 'px');
      root.style.setProperty('--my', cy.toFixed(1) + 'px');
      if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) {
        queued = true;
        requestAnimationFrame(tick);
      }
    }
  } else {
    document.body.classList.add('no-pointer');
  }

  /* ---------- nav state on scroll ---------- */
  var nav = document.getElementById('nav');
  if (nav) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        nav.classList.toggle('is-stuck', window.scrollY > 40);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- scroll reveals ---------- */
  var items = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    for (var i = 0; i < items.length; i++) items[i].classList.add('in');
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    for (var j = 0; j < items.length; j++) io.observe(items[j]);
  }

  /* ---------- light section: the spotlight steps aside ----------
     The about panel inverts to ivory; an additive light over it washes
     the type out, so the effect fades for as long as that panel is on screen. */
  var light = document.getElementById('about');
  if (light && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      document.body.classList.toggle('is-light', entries[0].isIntersecting);
    }, { threshold: 0 }).observe(light);
  }

  /* ---------- magnetic CTA ---------- */
  if (fine && !reduced) {
    var magnets = document.querySelectorAll('[data-magnetic]');
    Array.prototype.forEach.call(magnets, function (el) {
      var raf = null;

      function move(e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          var r = el.getBoundingClientRect();
          var dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
          var dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
          el.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)';
        });
      }

      function reset() {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        el.style.transform = '';
      }

      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', reset);
      el.addEventListener('blur', reset);
    });
  }
})();
