(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Bullshit filter toggle

  const toggle = document.getElementById("filter-toggle");

  const setFilter = (on) => {
    root.dataset.filter = on ? "on" : "off";
    toggle.setAttribute("aria-pressed", String(on));
    try {
      localStorage.setItem("filter", on ? "on" : "off");
    } catch (e) {}
  };

  toggle.setAttribute("aria-pressed", String(root.dataset.filter !== "off"));
  toggle.addEventListener("click", () => {
    setFilter(root.dataset.filter === "off");
  });

  // Masthead rule once the page scrolls

  const masthead = document.querySelector(".masthead");
  const onScroll = () => {
    masthead.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Hero: type the sentence out so each buzzword collapses as it completes

  // Multi-word buzzwords sit in nowrap spans: Chrome will otherwise break a
  // line in the middle of a ligature that spans a space.

  const hero = document.getElementById("hero-sentence");

  if (!reduceMotion) {
    const walker = document.createTreeWalker(hero, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    const full = nodes.map((node) => node.data);

    const caret = document.createElement("span");
    caret.className = "caret";
    caret.setAttribute("aria-hidden", "true");
    hero.setAttribute("aria-label", hero.textContent);
    nodes.forEach((node) => (node.data = ""));
    hero.append(caret);

    let n = 0;
    let i = 0;
    const type = () => {
      while (n < nodes.length && i >= full[n].length) {
        n += 1;
        i = 0;
      }
      if (n >= nodes.length) return;
      i += 1;
      nodes[n].data = full[n].slice(0, i);
      const ch = full[n][i - 1];
      const pause = ch === "," ? 220 : ch === " " ? 70 : 38;
      setTimeout(type, pause + Math.random() * 30);
    };
    document.fonts.ready.then(() => setTimeout(type, 400));
  }

  // Try it yourself

  const editor = document.getElementById("editor");
  editor.addEventListener("input", () => {
    editor.classList.toggle("redraw");
  });

  document.getElementById("clear").addEventListener("click", () => {
    editor.value = "";
    editor.focus();
  });

  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const article = (word) => (/^[aeiou]/i.test(word) ? "an" : "a");

  const words = {
    verb: [
      "accelerate", "leverage", "monetize", "optimize", "operationalize",
      "productize", "revolutionize", "ignite", "innovate", "enable",
      "curate", "codify", "gameify", "nextify", "unpack", "crowdsource",
      "level up", "touch base on", "reach out about", "deep dive into",
      "boil the ocean on", "close the loop on", "pivot", "storify",
    ],
    noun: [
      "synergy", "paradigm shift", "bandwidth", "alignment", "mindshare",
      "low hanging fruit", "value proposition", "big data", "the cloud",
      "blueprint", "pipeline", "marketing funnel", "touchpoints",
      "eyeballs", "engagement", "scalability", "best practices",
      "action items", "game changer", "moonshot", "internet of things",
      "growth hack", "personal brand", "social currency", "exit strategy",
      "content strategy", "ideation", "collateral", "qualified leads",
      "MVP", "ROI", "gamification",
    ],
    adjective: [
      "agile", "disruptive", "holistic", "synergistic", "seamless",
      "immersive", "actionable", "bleeding edge", "best of breed",
      "next gen", "hyperlocal", "iconic", "transparent", "proactive",
      "usercentric", "real time", "web scale", "organic", "viral",
      "sticky", "lean", "emerging", "integrated", "responsive",
    ],
    person: [
      "thought leader", "rockstar", "ninja", "guru", "brogrammer",
      "change agent", "brand evangelist", "social media expert", "wizard",
      "tiger team", "stakeholder",
    ],
    closer: [
      "at scale", "at the end of the day", "moving forward",
      "below the fold", "outside the box", "as a service", "in stealth mode",
      "before it’s top of mind",
    ],
  };

  const templates = [
    () =>
      `We need to ${pick(words.verb)} our ${pick(words.adjective)} ${pick(words.noun)} ${pick(words.closer)}.`,
    () =>
      `Our ${pick(words.person)} wants to ${pick(words.verb)} the ${pick(words.noun)} and ${pick(words.verb)} the ${pick(words.noun)}.`,
    () => {
      const adj = pick(words.adjective);
      return `It’s basically uber for ${pick(words.noun)}, but ${adj} and ${pick(words.closer)}.`;
    },
    () =>
      `Quick sync: can we ${pick(words.verb)} the ${pick(words.noun)} before the ${pick(words.person)} sees it?`,
    () => {
      const adj = pick(words.adjective);
      return `Per my last email, ${article(adj)} ${adj} ${pick(words.noun)} is the only way to ${pick(words.verb)} ${pick(words.noun)} ${pick(words.closer)}.`;
    },
    () => {
      const adj = pick(words.adjective);
      return `Hiring: ${article(adj)} ${adj} ${pick(words.person)} to ${pick(words.verb)} our ${pick(words.noun)}.`;
    },
  ];

  document.getElementById("generate").addEventListener("click", () => {
    const line = pick(templates)();
    const current = editor.value.trim();
    editor.value = current ? `${current}\n\n${line}` : line;
    editor.scrollTop = editor.scrollHeight;
    editor.classList.toggle("redraw");
  });

  // The wall: tap to reveal on touch screens

  const wall = document.querySelector(".wall-words");
  wall.addEventListener("click", (event) => {
    const bar = event.target.closest(".bs");
    if (!bar) return;
    const wasOpen = bar.classList.contains("is-revealed");
    wall
      .querySelectorAll(".is-revealed")
      .forEach((el) => el.classList.remove("is-revealed"));
    if (!wasOpen) bar.classList.add("is-revealed");
  });
})();
