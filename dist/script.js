'use strict';

(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
  const menuQuery = window.matchMedia('(max-width: 950px)');
  const mobileQuery = window.matchMedia('(max-width: 680px)');
  const motionButton = document.querySelector('.motion-toggle');
  const revealTargets = [...document.querySelectorAll('[data-reveal]')];
  let paused = false;
  let motionEnabled = true;
  let scrollFrame = 0;
  let zones = [];
  let parallax = [];
  let journey = null;
  let viewportHeight = window.innerHeight;
  let scrollRange = 1;

  try { paused = localStorage.getItem('cristina-motion') === 'paused'; } catch { /* File previews can restrict local storage. */ }
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

  function setMotion() {
    motionEnabled = !paused && !reduced.matches;
    root.dataset.motion = motionEnabled ? 'on' : 'off';
    root.classList.toggle('motion-ready', motionEnabled && 'IntersectionObserver' in window);
    if (!motionEnabled) {
      revealTargets.forEach(element => element.classList.add('revealed'));
      document.querySelectorAll('[data-parallax]').forEach(element => element.style.setProperty('--parallax-y', '0px'));
      document.querySelectorAll('[data-tilt]').forEach(element => {
        element.style.setProperty('--tilt-x', '0deg');
        element.style.setProperty('--tilt-y', '0deg');
      });
    }
    if (motionButton) {
      motionButton.setAttribute('aria-pressed', String(!motionEnabled));
      motionButton.disabled = reduced.matches;
      motionButton.querySelector('span').textContent = reduced.matches ? 'Movimento reduzido' : paused ? 'Ativar animações' : 'Pausar animações';
      motionButton.title = reduced.matches ? 'Seu dispositivo está configurado para movimento reduzido.' : '';
    }
    scheduleScroll();
  }

  motionButton?.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('cristina-motion', paused ? 'paused' : 'active'); } catch { /* The preference still applies to this visit. */ }
    setMotion();
  });
  reduced.addEventListener('change', setMotion);

  function measure() {
    viewportHeight = window.innerHeight;
    scrollRange = Math.max(1, document.documentElement.scrollHeight - viewportHeight);
    const scrollTop = window.scrollY;
    zones = [...document.querySelectorAll('[data-scroll-zone]')].map(element => {
      const box = element.getBoundingClientRect();
      return { element, top: box.top + scrollTop, height: box.height };
    });
    const enableParallax = window.innerWidth > 680;
    parallax = [...document.querySelectorAll('[data-parallax]')].map(element => {
      const offset = parseFloat(element.style.getPropertyValue('--parallax-y')) || 0;
      const box = element.getBoundingClientRect();
      return { element, top: box.top + scrollTop - offset, height: box.height, speed: enableParallax ? Number(element.dataset.parallax) : 0 };
    });
    const journeyElement = document.querySelector('.journey');
    if (journeyElement) {
      const box = journeyElement.getBoundingClientRect();
      journey = { element: journeyElement, top: box.top + scrollTop, height: box.height };
    }
    scheduleScroll();
  }

  function updateScroll() {
    scrollFrame = 0;
    if (document.hidden) return;
    const y = window.scrollY;
    root.style.setProperty('--page-progress', clamp(y / scrollRange).toFixed(4));
    zones.forEach(zone => {
      const progress = motionEnabled ? clamp((y + viewportHeight * 0.63 - zone.top) / Math.max(1, zone.height - viewportHeight * 0.12)) : 1;
      zone.element.style.setProperty('--zone-progress', progress.toFixed(4));
    });
    parallax.forEach(item => {
      const distance = y + viewportHeight * 0.5 - item.top - item.height * 0.5;
      const visible = item.top < y + viewportHeight + 100 && item.top + item.height > y - 100;
      if (!visible && motionEnabled) return;
      const offset = motionEnabled ? clamp(distance * item.speed, -24, 24) : 0;
      item.element.style.setProperty('--parallax-y', offset.toFixed(2) + 'px');
    });
    if (journey) {
      const progress = motionEnabled ? clamp((y + viewportHeight * 0.65 - journey.top) / Math.max(1, journey.height - viewportHeight * 0.25)) : 1;
      journey.element.style.setProperty('--journey-progress', progress.toFixed(4));
    }
  }

  function scheduleScroll() {
    if (!scrollFrame && !document.hidden) scrollFrame = requestAnimationFrame(updateScroll);
  }

  window.addEventListener('scroll', scheduleScroll, { passive: true });
  let resizeFrame = 0;
  window.addEventListener('resize', () => {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => { resizeFrame = 0; measure(); updateTabOrientation(); });
  }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    root.classList.toggle('tab-away', document.hidden);
    if (!document.hidden) scheduleScroll();
  });

  // Navigation stays native; only the compact menu needs a state.
  const toggle = document.querySelector('.nav-toggle');
  const navigation = document.querySelector('.site-nav');
  const header = document.querySelector('.site-header');
  const closeMenu = (returnFocus = false) => {
    if (!toggle || !navigation) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    navigation.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    if (returnFocus) toggle.focus();
  };

  if (toggle && navigation) {
    toggle.addEventListener('click', () => {
      if (toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); return; }
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Fechar menu');
      navigation.classList.add('is-open');
      document.body.classList.add('menu-open');
    });
    navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
    menuQuery.addEventListener('change', event => { if (!event.matches) closeMenu(); });
    document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
    document.addEventListener('keydown', event => {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (event.key === 'Escape') { closeMenu(true); return; }
      if (event.key !== 'Tab') return;
      const elements = [toggle, ...navigation.querySelectorAll('a')];
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  }

  // The same topic can be selected from a scenario or with the keyboard.
  const tablist = document.querySelector('.topic-tabs');
  const tabs = [...document.querySelectorAll('[data-topic]')];
  function updateTabOrientation() {
    tablist?.setAttribute('aria-orientation', menuQuery.matches ? 'horizontal' : 'vertical');
  }
  function selectTopic(topic, focus = false) {
    const active = tabs.find(tab => tab.dataset.topic === topic);
    if (!active) return;
    tabs.forEach(tab => {
      const selected = tab === active;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      if (panel) panel.hidden = !selected;
    });
    if (focus) active.focus();
    if (menuQuery.matches && tablist) {
      const parentBox = tablist.getBoundingClientRect();
      const tabBox = active.getBoundingClientRect();
      if (tabBox.left < parentBox.left || tabBox.right > parentBox.right) {
        tablist.scrollTo({ left: tablist.scrollLeft + tabBox.left - parentBox.left - 12, behavior: motionEnabled ? 'smooth' : 'instant' });
      }
    }
    measure();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTopic(tab.dataset.topic));
    tab.addEventListener('keydown', event => {
      const keys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else next = (index + (event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1) + tabs.length) % tabs.length;
      selectTopic(tabs[next].dataset.topic, true);
    });
  });
  document.querySelectorAll('[data-select-topic]').forEach(link => link.addEventListener('click', () => selectTopic(link.dataset.selectTopic)));

  const contactMessages = {
    informacoes: 'Olá, Cristina! Conheci seu site e gostaria de informações sobre o atendimento em psicopedagogia.',
    aprendizagem: 'Olá, Cristina! Conheci seu site e gostaria de conversar sobre uma dificuldade de aprendizagem e saber como funciona seu atendimento.',
    responsavel: 'Olá, Cristina! Sou responsável e gostaria de conversar sobre uma dificuldade de aprendizagem e conhecer seu atendimento em psicopedagogia.'
  };
  const contactLink = document.querySelector('#contato-principal');
  const reasonButtons = [...document.querySelectorAll('[data-contact-reason]')];
  reasonButtons.forEach(button => button.addEventListener('click', () => {
    if (!contactLink || !contactMessages[button.dataset.contactReason]) return;
    reasonButtons.forEach(other => {
      other.classList.toggle('is-selected', other === button);
      other.setAttribute('aria-pressed', String(other === button));
    });
    contactLink.href = 'https://wa.me/5511963106711?text=' + encodeURIComponent(contactMessages[button.dataset.contactReason]);
  }));

  document.querySelectorAll('.faq-list details').forEach(details => {
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      document.querySelectorAll('.faq-list details').forEach(other => { if (other !== details) other.open = false; });
    });
  });
  document.querySelectorAll('[data-year]').forEach(element => { element.textContent = String(new Date().getFullYear()); });

  // A small tilt is limited to precise pointers; no animation loop runs at rest.
  document.querySelectorAll('[data-tilt]').forEach(element => {
    let frame = 0;
    let tiltX = 0;
    let tiltY = 0;
    element.addEventListener('pointermove', event => {
      if (!motionEnabled || !hover.matches || menuQuery.matches) return;
      const box = element.getBoundingClientRect();
      const range = Math.min(Number(element.dataset.tilt) || 3, 4);
      tiltX = ((event.clientY - box.top) / box.height - 0.5) * -range * 2;
      tiltY = ((event.clientX - box.left) / box.width - 0.5) * range * 2;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!motionEnabled) return;
        element.style.setProperty('--tilt-x', tiltX.toFixed(2) + 'deg');
        element.style.setProperty('--tilt-y', tiltY.toFixed(2) + 'deg');
      });
    });
    element.addEventListener('pointerleave', () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      element.style.setProperty('--tilt-x', '0deg');
      element.style.setProperty('--tilt-y', '0deg');
    });
  });

  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        reveal.unobserve(entry.target);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 45px 0px' });
    revealTargets.forEach(element => reveal.observe(element));

    const activeAnimations = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('in-view', entry.isIntersecting));
    }, { rootMargin: '140px 0px', threshold: 0 });
    document.querySelectorAll('.hero, .learning, .contact, .word-ribbon').forEach(element => activeAnimations.observe(element));

    const hero = document.querySelector('.hero');
    const contact = document.querySelector('#contato');
    const mobileContact = document.querySelector('.mobile-contact');
    if (hero && contact && mobileContact) {
      let heroVisible = true;
      let contactVisible = false;
      const setMobileContact = () => {
        const hidden = heroVisible || contactVisible;
        mobileContact.classList.toggle('is-hidden', hidden);
        mobileContact.inert = hidden;
        mobileContact.setAttribute('aria-hidden', String(hidden));
      };
      setMobileContact();
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.target === hero) heroVisible = entry.isIntersecting;
          if (entry.target === contact) contactVisible = entry.isIntersecting;
        });
        setMobileContact();
      }, { threshold: 0 });
      observer.observe(hero); observer.observe(contact);
    }

    const links = [...document.querySelectorAll('.site-nav a[href^="#"]')];
    const sections = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-16% 0px -63% 0px', threshold: 0 });
    links.forEach(link => {
      const section = document.querySelector(link.getAttribute('href'));
      if (section) sections.observe(section);
    });
  }

  updateTabOrientation();
  setMotion();
  measure();
  if (document.fonts?.ready) document.fonts.ready.then(measure).catch(() => {});
})();
