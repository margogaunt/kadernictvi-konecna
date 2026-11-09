(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Menu na mobilu */
  var toggle = document.querySelector('.bar__toggle');
  var menu = document.getElementById('menu');
  if (toggle && menu) {
    var setMenu = function (open) {
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Zavřít menu' : 'Otevřít menu');
    };
    toggle.addEventListener('click', function () {
      setMenu(!menu.classList.contains('is-open'));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
  }

  /* Jemné objevení */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* Kolo fotek */
  var wheel = document.querySelector('.wheel');
  if (!wheel) return;
  var slots = Array.prototype.slice.call(wheel.querySelectorAll('.slot'));
  var count = slots.length;
  var step = 360 / count;
  var position = 0; /* roste bez omezení, aby se kolo točilo vždy kratší cestou */
  var current = wheel.querySelector('[data-current]');
  var pauseBtn = wheel.querySelector('[data-pause]');
  var pauseIcon = wheel.querySelector('[data-icon]');
  var userPaused = reduced;
  var hovering = false;
  var focused = false;
  var visible = true;

  function activeIndex() {
    return ((position % count) + count) % count;
  }

  function render() {
    var start = parseFloat(getComputedStyle(wheel).getPropertyValue('--start')) || 0;
    var active = activeIndex();
    slots.forEach(function (slot, i) {
      var isActive = i === active;
      /* Stejný seznam funkcí se interpoluje po složkách, takže fotka jede po oblouku a zůstává rovně */
      var angle = start + (i - position) * step;
      slot.style.transform =
        'rotate(' + angle + 'deg) translateX(var(--r)) rotate(' + -angle + 'deg) scale(' + (isActive ? 1 : 0.48) + ')';
      slot.classList.toggle('is-active', isActive);
      slot.style.zIndex = isActive ? 2 : 1;
    });
    if (current) current.textContent = String(active + 1).padStart(2, '0');
  }

  function go(delta) {
    position += delta;
    render();
  }

  slots.forEach(function (slot, i) {
    slot.querySelector('button').addEventListener('click', function () {
      if (wheel.dataset.dragged === '1') return;
      var delta = i - activeIndex();
      if (delta > count / 2) delta -= count;
      if (delta < -count / 2) delta += count;
      if (delta) go(delta);
    });
  });

  wheel.querySelector('[data-prev]').addEventListener('click', function () { go(-1); });
  wheel.querySelector('[data-next]').addEventListener('click', function () { go(1); });

  function syncPause() {
    pauseBtn.setAttribute('aria-pressed', String(userPaused));
    pauseBtn.setAttribute('aria-label', userPaused ? 'Spustit otáčení' : 'Zastavit otáčení');
    pauseIcon.setAttribute('d', userPaused ? 'M8 5l11 7-11 7z' : 'M9 5v14M15 5v14');
  }
  pauseBtn.addEventListener('click', function () {
    userPaused = !userPaused;
    syncPause();
  });
  syncPause();

  wheel.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
  });

  /* Tažení a přejetí prstem */
  var dragStart = null;
  wheel.addEventListener('pointerdown', function (e) {
    dragStart = e.clientX;
    wheel.dataset.dragged = '0';
  });
  window.addEventListener('pointerup', function (e) {
    if (dragStart === null) return;
    var distance = e.clientX - dragStart;
    dragStart = null;
    if (Math.abs(distance) > 40) {
      wheel.dataset.dragged = '1';
      go(distance < 0 ? 1 : -1);
    }
  });
  window.addEventListener('pointercancel', function () { dragStart = null; });

  /* Samočinné otáčení: jeden krok po 6 s, jen když ho nic neruší */
  var panel = wheel.parentElement;
  panel.addEventListener('pointerenter', function () { hovering = true; });
  panel.addEventListener('pointerleave', function () { hovering = false; });
  wheel.addEventListener('focusin', function () { focused = true; });
  wheel.addEventListener('focusout', function () { focused = false; });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
    }).observe(panel);
  }
  if (!reduced) {
    setInterval(function () {
      if (!userPaused && !hovering && !focused && visible && !document.hidden) go(1);
    }, 6000);
  }

  window.addEventListener('resize', render);
  render();
})();
