const data = [
  {
    place: "Ақтөбе қаласы",
    title: "АҚТӨБЕ",
    title2: "ҚАЛАСЫ",
    description:
      "Ақтөбе — Батыс Қазақстандағы ең ірі әрі қарқынды дамып келе жатқан қалалардың бірі. Кешкі уақытта қала шамдары жанып, даңғылдар мен алаңдар ерекше әсем көрінеді.",
    image: "./assets/aktobe-city.png",
  },
  {
    place: "Мұғалжар таулары (Мугоджары)",
    title: "МҰҒАЛЖАР",
    title2: "ТАУЛАРЫ",
    description:
      "Мұғалжар таулары Ақтөбе өңірінің ерекше табиғи бедерімен танымал. Қоңыр жоталар, ашық дала және тыныш табиғат бұл аймаққа өзгеше әсер береді.",
    image: "./assets/mugalzhar-hills.jpg",
  },
  {
    place: "Ақтолағай шатқалы",
    title: "АҚТОЛАҒАЙ",
    title2: "АҚ ТАУЛАР",
    description:
      "Ақтолағай шатқалы ақ борлы жартастарымен және ерекше пішінді тау бедерімен әйгілі. Күн батқанда ақ таулар алтын түске боялып, кең аңғар өте әсерлі көрінеді.",
    image: "./assets/aktolagai.png",
  },
  {
    place: "Ақтөбе өңірінің",
    title: "ТАБИҒИ",
    title2: "СҰЛУЛЫҒЫ",
    description:
      "Кең даласы, жасыл төбелері мен тыныш табиғаты ерекше әсер береді.",
    image: "./assets/aktobe-steppe.jpg",
  },
  {
    place: "Табиғи шатқал",
    title: "ВОЛЧИЙ",
    title2: "САРҚЫРАМА",
    description:
      "Волчий сарқырамасы жартасты шатқалдың ішінде көгілдір суымен ерекше көрінеді. Судың қуатты ағысы мен тас қабырғалар бұл жерге әсерлі табиғи атмосфера береді.",
    image: "./assets/ebita-reserve.png",
  },
  {
    place: "Дала табиғаты",
    title: "ЭБИТА",
    title2: "ҚОРЫҒЫ",
    description:
      "Эбита қорығы кең дала, жұмсақ қыраттар және табиғи тыныштықпен ерекшеленеді. Көктемде гүлдер жайқалып, бұл аймақ жабайы табиғаттың нәзік сұлулығын көрсетеді.",
    image: "./assets/wolf-waterfall.png",
  },
  {
    place: "Шалқар және маңы",
    title: "ТҰЗДЫ",
    title2: "КӨЛДЕР",
    description:
      "Шалқар және өңірдегі тұзды көлдер кең даладағы ерекше табиғи айна сияқты көрінеді. Күн батқан кезде су беті аспанның қызғылт, көк және күлгін түстерін шағылыстырып, өте әдемі көрініс жасайды.",
    image: "./assets/salt-lakes.png",
  },
];

const $ = (id) => document.getElementById(id);
const ease = "sine.inOut";
const numberSize = 58;

let order = data.map((_, index) => index);
let detailsEven = true;
let isStepping = false;
let autoTimer;

let offsetTop = 200;
let offsetLeft = 700;
let cardWidth = 200;
let cardHeight = 300;
let gap = 34;

function getCard(index) {
  return `#card${index}`;
}

function getCardContent(index) {
  return `#card-content-${index}`;
}

function formatNumber(index) {
  return String(index + 1).padStart(2, "0");
}

function fillDetails(target, slide) {
  document.querySelector(`${target} .place-box .text`).textContent = slide.place;
  document.querySelector(`${target} .title-1`).textContent = slide.title;
  document.querySelector(`${target} .title-2`).textContent = slide.title2;
  document.querySelector(`${target} .desc`).textContent = slide.description;
}

function calculateLayout() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const narrow = width < 860;

  cardWidth = narrow ? Math.min(160, Math.max(118, width * 0.32)) : Math.min(220, Math.max(180, width * 0.14));
  cardHeight = cardWidth * 1.45;
  gap = narrow ? 14 : 34;
  offsetTop = narrow ? height - cardHeight - 92 : height - cardHeight - 112;
  offsetLeft = narrow ? 24 : Math.max(width - cardWidth * 3 - gap * 2 - 70, width * 0.46);
}

function thumbnailX(index) {
  return offsetLeft + index * (cardWidth + gap);
}

function thumbnailContentY() {
  return offsetTop + cardHeight - 78;
}

function renderCards() {
  const cards = data
    .map((item, index) => `<div class="card" id="card${index}" style="background-image:url('${item.image}')"></div>`)
    .join("");

  const cardContents = data
    .map(
      (item, index) => `<div class="card-content" id="card-content-${index}">
        <div class="content-start"></div>
        <div class="content-place">${item.place}</div>
        <div class="content-title-1">${item.title}</div>
        <div class="content-title-2">${item.title2}</div>
      </div>`
    )
    .join("");

  $("demo").innerHTML = cards + cardContents;
}

function resetInactiveDetails(target) {
  gsap.set(target, { opacity: 0, zIndex: 12, x: -80 });
  gsap.set(`${target} .text`, { y: 100 });
  gsap.set(`${target} .title-1`, { y: 110 });
  gsap.set(`${target} .title-2`, { y: 110 });
  gsap.set(`${target} .desc`, { y: 55, opacity: 0 });
  gsap.set(`${target} .cta`, { y: 60, opacity: 0 });
}

function setPaginationPosition() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  gsap.set("#pagination", {
    top: width < 860 ? height - 66 : offsetTop + cardHeight + 30,
    left: width < 860 ? 24 : offsetLeft,
  });
}

function init() {
  calculateLayout();
  renderCards();

  const [active, ...rest] = order;
  const detailsActive = detailsEven ? "#details-even" : "#details-odd";
  const detailsInactive = detailsEven ? "#details-odd" : "#details-even";

  fillDetails(detailsActive, data[active]);
  fillDetails(detailsInactive, data[active]);

  gsap.set(getCard(active), {
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    borderRadius: 0,
    zIndex: 20,
    scale: 1,
    filter: "brightness(1)",
  });
  gsap.set(getCardContent(active), { x: 0, y: 0, opacity: 0 });
  gsap.set(detailsActive, { opacity: 0, zIndex: 55, x: -130 });
  gsap.set(`${detailsActive} .text`, { y: 0 });
  gsap.set(`${detailsActive} .title-1`, { y: 0 });
  gsap.set(`${detailsActive} .title-2`, { y: 0 });
  gsap.set(`${detailsActive} .desc`, { y: 0, opacity: 1 });
  gsap.set(`${detailsActive} .cta`, { y: 0, opacity: 1 });
  resetInactiveDetails(detailsInactive);

  rest.forEach((cardIndex, index) => {
    gsap.set(getCard(cardIndex), {
      x: thumbnailX(index),
      y: offsetTop,
      width: cardWidth,
      height: cardHeight,
      zIndex: 30,
      borderRadius: 12,
      scale: 1,
      filter: "brightness(1)",
    });
    gsap.set(getCardContent(cardIndex), {
      x: thumbnailX(index),
      y: thumbnailContentY(),
      opacity: index < 4 ? 1 : 0,
      zIndex: 40,
    });
  });

  setPaginationPosition();
  gsap.set(".progress-sub-foreground", {
    width: `${((active + 1) / order.length) * 100}%`,
  });
  $("slide-current").textContent = formatNumber(active);
  gsap.set("#slide-current", { x: 0, opacity: 1 });
  gsap.set("#slide-next", { x: numberSize, opacity: 0 });
  gsap.set(".indicator", { x: -window.innerWidth });

  const startDelay = 0.45;
  gsap.to(".cover", {
    x: window.innerWidth + 400,
    delay: 0.25,
    duration: 0.7,
    ease,
  });
  gsap.to("#pagination", { y: 0, opacity: 1, ease, delay: startDelay });
  gsap.to(".brand", { y: 0, opacity: 1, ease, delay: startDelay });
  gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: startDelay, duration: 0.8 });

  document.querySelector(".arrow-left").addEventListener("click", () => queueStep("prev"));
  document.querySelector(".arrow-right").addEventListener("click", () => queueStep("next"));
  scheduleAuto();
}

function animateNumber(newActive, direction) {
  const current = $("slide-current");
  const next = $("slide-next");
  const fromX = direction === "next" ? numberSize : -numberSize;
  const toX = direction === "next" ? -numberSize : numberSize;

  next.textContent = formatNumber(newActive);
  gsap.set(next, { x: fromX, opacity: 1 });
  gsap.to(current, { x: toX, opacity: 0, duration: 0.45, ease });
  gsap.to(next, {
    x: 0,
    opacity: 1,
    duration: 0.45,
    ease,
    onComplete: () => {
      current.textContent = next.textContent;
      gsap.set(current, { x: 0, opacity: 1 });
      gsap.set(next, { x: fromX, opacity: 0 });
    },
  });
}

function queueStep(direction = "next") {
  if (isStepping) return Promise.resolve();
  clearTimeout(autoTimer);
  isStepping = true;

  return step(direction).finally(() => {
    isStepping = false;
    scheduleAuto();
  });
}

function step(direction = "next") {
  return new Promise((resolve) => {
    const outgoing = order[0];

    if (direction === "next") {
      order.push(order.shift());
    } else {
      order.unshift(order.pop());
    }

    const [active, ...rest] = order;
    const detailsActive = detailsEven ? "#details-odd" : "#details-even";
    const detailsInactive = detailsEven ? "#details-even" : "#details-odd";
    detailsEven = !detailsEven;

    fillDetails(detailsActive, data[active]);
    animateNumber(active, direction);

    const tl = gsap.timeline({
      defaults: { ease },
      onComplete: () => {
        resetInactiveDetails(detailsInactive);
        resolve();
      },
    });

    tl.set(detailsActive, { zIndex: 55, opacity: 1, x: 0 }, 0);
    tl.set(`${detailsActive} .text`, { y: 100 }, 0);
    tl.set(`${detailsActive} .title-1`, { y: 110 }, 0);
    tl.set(`${detailsActive} .title-2`, { y: 110 }, 0);
    tl.set(`${detailsActive} .desc`, { y: 55, opacity: 0 }, 0);
    tl.set(`${detailsActive} .cta`, { y: 60, opacity: 0 }, 0);
    tl.to(detailsInactive, { opacity: 0, x: -70, duration: 0.35 }, 0);
    tl.to(`${detailsActive} .text`, { y: 0, duration: 0.7 }, 0.16);
    tl.to(`${detailsActive} .title-1`, { y: 0, duration: 0.7 }, 0.22);
    tl.to(`${detailsActive} .title-2`, { y: 0, duration: 0.7 }, 0.27);
    tl.to(`${detailsActive} .desc`, { y: 0, opacity: 1, duration: 0.45 }, 0.42);
    tl.to(`${detailsActive} .cta`, { y: 0, opacity: 1, duration: 0.45 }, 0.48);

    tl.set(getCard(outgoing), { zIndex: 10 }, 0);
    tl.set(getCard(active), { zIndex: 20 }, 0);
    tl.to(getCard(active), {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      borderRadius: 0,
      scale: 1,
      filter: "brightness(1)",
      duration: 1.08,
    }, 0);
    tl.to(getCardContent(active), {
      y: offsetTop + cardHeight - 25,
      opacity: 0,
      duration: 0.32,
    }, 0);
    tl.to(".progress-sub-foreground", {
      width: `${((active + 1) / order.length) * 100}%`,
      duration: 0.75,
    }, 0.18);

    rest.forEach((cardIndex, index) => {
      const xNew = thumbnailX(index);
      const isOutgoing = cardIndex === outgoing;

      tl.to(getCard(cardIndex), {
        x: xNew,
        y: offsetTop,
        width: cardWidth,
        height: cardHeight,
        borderRadius: 12,
        scale: 1,
        filter: "brightness(1)",
        duration: isOutgoing ? 0.82 : 0.8,
        delay: isOutgoing ? 0 : 0.05 * index,
      }, isOutgoing ? 0.22 : 0.1);
      tl.to(getCardContent(cardIndex), {
        x: xNew,
        y: thumbnailContentY(),
        opacity: index < 4 ? 1 : 0,
        zIndex: 40,
        duration: 0.55,
        delay: 0.04 * index,
      }, 0.22);
      tl.set(getCard(cardIndex), { zIndex: 30 }, 1.02);
    });
  });
}

function playIndicator() {
  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve });
    tl.set(".indicator", { x: -window.innerWidth });
    tl.to(".indicator", { x: 0, duration: 0.45, ease });
    tl.to(".indicator", { x: window.innerWidth, duration: 0.4, delay: 0.18, ease });
  });
}

function scheduleAuto() {
  clearTimeout(autoTimer);
  autoTimer = setTimeout(async () => {
    if (isStepping) {
      scheduleAuto();
      return;
    }

    isStepping = true;
    await playIndicator();
    await step("next");
    isStepping = false;
    scheduleAuto();
  }, 4200);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function start() {
  try {
    await Promise.all(data.map(({ image }) => loadImage(image)));
    init();
  } catch (error) {
    console.error("One or more images failed to load", error);
  }
}

window.addEventListener("resize", () => {
  calculateLayout();
  setPaginationPosition();
});

start();
