'use strict';

(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.main-nav');
  const mobileQuery = window.matchMedia('(max-width: 900px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const setMenu = (open, returnFocus = false) => {
    if (!toggle || !navigation) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    navigation.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (returnFocus) toggle.focus();
  };

  if (toggle && navigation) {
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', event => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      if (event.key === 'Escape' && open) setMenu(false, true);
      if (event.key !== 'Tab' || !open) return;
      const focusable = [toggle, ...navigation.querySelectorAll('a')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    });
    document.addEventListener('click', event => {
      if (toggle.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) setMenu(false);
    });
    mobileQuery.addEventListener('change', event => { if (!event.matches) setMenu(false); });
  }

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
  document.querySelectorAll('[data-year]').forEach(element => { element.textContent = String(new Date().getFullYear()); });

  if ('IntersectionObserver' in window) {
    if (!reducedMotion.matches) {
      const targets = [...document.querySelectorAll('[data-reveal]')];
      const reveal = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('revealed');
          reveal.unobserve(entry.target);
        });
      }, { threshold: 0.06, rootMargin: '0px 0px 24px 0px' });
      targets.forEach(element => reveal.observe(element));
      document.documentElement.classList.add('reveal-ready');
      reducedMotion.addEventListener('change', event => {
        if (event.matches) {
          document.documentElement.classList.remove('reveal-ready');
          reveal.disconnect();
        }
      });
    }

    const hero = document.querySelector('.hero');
    const contact = document.querySelector('#contato');
    const mobileContact = document.querySelector('.mobile-contact');
    if (hero && contact && mobileContact) {
      let heroVisible = true;
      let contactVisible = false;
      const updateContact = () => {
        const hidden = heroVisible || contactVisible;
        mobileContact.classList.toggle('is-hidden', hidden);
        mobileContact.inert = hidden;
        mobileContact.setAttribute('aria-hidden', String(hidden));
      };
      updateContact();
      const contactObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.target === hero) heroVisible = entry.isIntersecting;
          if (entry.target === contact) contactVisible = entry.isIntersecting;
        });
        updateContact();
      }, { threshold: 0 });
      contactObserver.observe(hero); contactObserver.observe(contact);
    }

    const navigationLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navigationLinks.forEach(link => {
          if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    navigationLinks.forEach(link => {
      const section = document.querySelector(link.getAttribute('href'));
      if (section) sectionObserver.observe(section);
    });
  }

  const gallery = document.querySelector('#galeria-relatos');
  const previous = document.querySelector('#relato-anterior');
  const next = document.querySelector('#relato-proximo');
  const counter = document.querySelector('#relato-contador');
  if (gallery && previous && next && counter) {
    const cards = [...gallery.querySelectorAll('.testimonial')];
    let current = 0;
    let frame = 0;
    const updateGallery = () => {
      frame = 0;
      const left = gallery.getBoundingClientRect().left + parseFloat(getComputedStyle(gallery).paddingLeft || 0);
      let distance = Infinity;
      cards.forEach((card, index) => {
        const candidate = Math.abs(card.getBoundingClientRect().left - left);
        if (candidate < distance) { distance = candidate; current = index; }
      });
      previous.disabled = current === 0;
      next.disabled = current === cards.length - 1;
      counter.textContent = `${current + 1} de ${cards.length}`;
    };
    const moveGallery = direction => {
      const desired = Math.max(0, Math.min(cards.length - 1, current + direction));
      const padding = parseFloat(getComputedStyle(gallery).paddingLeft || 0);
      const target = gallery.scrollLeft + cards[desired].getBoundingClientRect().left - gallery.getBoundingClientRect().left - padding;
      gallery.scrollTo({ left: target, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    };
    previous.addEventListener('click', () => moveGallery(-1));
    next.addEventListener('click', () => moveGallery(1));
    gallery.addEventListener('keydown', event => {
      if (!window.matchMedia('(max-width: 680px)').matches) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault(); moveGallery(event.key === 'ArrowRight' ? 1 : -1);
      }
    });
    gallery.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(updateGallery); }, { passive: true });
    window.addEventListener('resize', updateGallery, { passive: true });
    updateGallery();
  }

  // Native details remain usable when JavaScript is unavailable.
  document.querySelectorAll('.faq-list details').forEach(details => {
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      document.querySelectorAll('.faq-list details').forEach(other => {
        if (other !== details) other.open = false;
      });
    });
  });
})();
