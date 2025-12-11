/* =========================================================
   ELEMENTS
========================================================= */
const mProducts = document.getElementById("m-products");
const wProducts = document.getElementById("w-products");
const wCanvas = document.getElementById("w-canvas");
const navItems = document.querySelectorAll(".shop-nav-item");


/* =========================================================
   RENDER FUNCTIONS
========================================================= */
function renderMobile(filtered) {
  mProducts.innerHTML = "";

  let loaded = 0;

  filtered.forEach(prod => {
    const card = document.createElement("div");
    card.className = "product-card m-product-card";

    const img = document.createElement("img");
    img.className = "product-img";
    img.src = prod.img;

    const info = document.createElement("div");
    info.className = "product-info";
    info.innerHTML = `${prod.name}<br>${prod.price}`;

    card.appendChild(img);
    card.appendChild(info);
    mProducts.appendChild(card);

    // 이미지 로드 완료 체크
    img.onload = () => {
      loaded++;
      if (loaded === filtered.length) {
        layoutMobileCards();   // 🔥 간격 정확하게 계산됨
        enableMobileDrag();    // 드래그 기능도 동일하게 적용
      }
    };
  });
}



function renderWeb(filtered) {
  wCanvas.innerHTML = "";

  filtered.forEach(prod => {
    const card = document.createElement("div");
    card.className = "product-card w-product-card";
    card.style.setProperty("--tilt", `${randomTilt()}deg`);

    card.innerHTML = `
      <img class="product-img" src="${prod.img}" />
      <div class="product-info">
        ${prod.name}<br>${prod.price}
      </div>
    `;

    // ★ 캔버스 안에 배치
    wCanvas.appendChild(card);

    // ★ 랜덤 초기 위치 (캔버스 내)
    positionCardRandom(card);

    // ★ 드래그 기능 부여
    makeDraggable(card);
  });
}


/* =========================================================
   CATEGORY FILTER
========================================================= */
function setActive(category) {
  navItems.forEach(i => i.classList.remove("active"));
  document.querySelectorAll(`[data-cat="${category}"]`).forEach(i => {
    i.classList.add("active");
  });
}

function filterCategory(cat) {
  if (cat === "all") return products;
  return products.filter(p => p.category.includes(cat));
}


/* =========================================================
   RANDOM FUNCTIONS
========================================================= */
function randomTilt() {
  return (Math.random() * 4 - 2).toFixed(2); // -2deg ~ 2deg
}

function positionCardRandom(card) {
  const canvasRect = wCanvas.getBoundingClientRect();
  const maxX = canvasRect.width - 260;
  const maxY = canvasRect.height - 300;

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  card.style.left = x + "px";
  card.style.top = y + "px";
}


/* =========================================================
   DRAG LOGIC
========================================================= */
function makeDraggable(card) {
  let isDown = false;
  let offsetX = 0;
  let offsetY = 0;

  card.addEventListener("mousedown", (e) => {
    isDown = true;
    card.style.cursor = "grabbing";

    const rect = card.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDown) return;

    const canvasRect = wCanvas.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    let newX = e.clientX - canvasRect.left - offsetX;
    let newY = e.clientY - canvasRect.top - offsetY;

    // X 축 제한 (영역 넓힌 버전!)
    const extraLeft = 60;   
    const extraRight = 60;   

    const minX = -extraLeft;
    const maxX = canvasRect.width - cardRect.width + extraRight;

    newX = Math.max(minX, Math.min(newX, maxX));


    // Y 축 제한 (영역 넓힌 버전!)
    const extraTop = 5;      
    const extraBottom = 60;  

    const minY = -extraTop;
    const maxY = canvasRect.height - cardRect.height + extraBottom;

    newY = Math.max(minY, Math.min(newY, maxY));

    card.style.left = newX + "px";
    card.style.top = newY + "px";
  });

  window.addEventListener("mouseup", () => {
    isDown = false;
    card.style.cursor = "grab";
  });
}


/* =========================================================
   INIT
========================================================= */
function init() {
  const initial = filterCategory("all");
  renderMobile(initial);
  renderWeb(initial);
  setActive("all");

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const cat = item.dataset.cat;
      const filtered = filterCategory(cat);

      setActive(cat);
      renderMobile(filtered);
      renderWeb(filtered);

    });
  });
}

init();

window.addEventListener("load", () => {
  layoutMobileCards();   // 이미지가 100% 로드된 뒤 정렬
  enableMobileDrag();    // 안정적으로 다시 드래그 활성화
});




/* =========================================================
   MOBILE LAYOUT
========================================================= */


function layoutMobileCards() {
  const isMobile = window.matchMedia("(max-width: 900px)").matches;
  if (!isMobile) return;

  const container = document.querySelector(".m-products");
  const cards = document.querySelectorAll(".m-product-card");

  let currentY = 100;

  cards.forEach((card, index) => {

    const cardWidth = card.offsetWidth;
    const containerWidth = container.offsetWidth;
    const spacing = cardWidth * 0.09;
    const isLast = index === cards.length - 1;

    // ⭐ px 기반 중앙정렬
    const centerX = (containerWidth - cardWidth) / 2;

    card.style.position = "absolute";
    card.style.left = centerX + "px";
    card.style.top = currentY + "px";

    // ⭐ 기울기 (번갈아 적용)
    // index 0 → -, index 1 → +, index 2 → -, ...
    const tiltDegree = (index % 2 === 0)
      ? -(Math.random() * 0.8 + 0.4)  // -1.5 ~ -3 deg
      : (Math.random() * 0.8 + 0.4);  // +1.5 ~ +3 deg

    card.style.transform = `rotate(${tiltDegree}deg)`;
    // translateX(-50%) 안 쓰기 때문에 rotate만 적용하면 OK

    if (isLast) {
      currentY += card.offsetHeight + 55;
    } else {
      currentY += card.offsetHeight + spacing;
    }
  });

  container.style.height = currentY + "px";
}


/* =========================================================
   RESIZE — 너무 많이 실행되지 않게 debounce 적용
========================================================= */

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    layoutMobileCards();
  }, 20);
});

/* =========================================================
   MOBILE DRAG
========================================================= */

function enableMobileDrag() {
  const container = document.querySelector(".m-products");
  const cards = document.querySelectorAll(".m-product-card");

  cards.forEach(card => {
    let dragging = false;
    let startX = 0, startY = 0;
    let cardX = 0, cardY = 0;
    let scrollStartY = 0;

    function startDrag(x, y) {
      dragging = true;

      // ⭐ transform 기반이 아니므로 style에서 정확한 px을 읽을 수 있음
      cardX = parseFloat(card.style.left);
      cardY = parseFloat(card.style.top);

      startX = x;
      startY = y;

      scrollStartY = window.scrollY;   // ⭐ 스크롤 시작 위치 저장

      card.style.transition = "none";
      card.style.zIndex = 999; // 드래그 중 맨 앞으로
    }

    function moveDrag(x, y) {
      if (!dragging) return;

      const deltaX = x - startX;
      const deltaY = y - startY;

      // ⭐ 스크롤 변화량 보정
      const scrollDiffY = window.scrollY - scrollStartY;

      let newX = cardX + deltaX;
      let newY = cardY + deltaY + scrollDiffY;   // ← 이 한 줄이 오차 100% 해결함

      // ⭐ container의 절대 px 기반 제한
      const containerHeight = document.documentElement.scrollHeight; // 페이지 전체 높이
      const containerWidth = window.innerWidth; // 화면 너비
      const cardWidth = card.offsetWidth;
      const cardHeight = card.offsetHeight;

      // 좌우 제한
      if (newX < -30) newX = -30;
      if (newX > containerWidth - cardWidth + 30)
        newX = containerWidth - cardWidth + 30;

      // 상하 제한
      if (newY < -30) newY = -30;
      if (newY > containerHeight - cardHeight + 30)
        newY = containerHeight - cardHeight + 30;

      card.style.left = newX + "px";
      card.style.top = newY + "px";
    }

    function endDrag() {
      dragging = false;
      card.style.zIndex = 1;
    }

    // ⭐ 터치
    card.addEventListener("touchstart", e => {
      const t = e.touches[0];
      startDrag(t.clientX, t.clientY);
    });
    card.addEventListener("touchmove", e => {
      const t = e.touches[0];
      moveDrag(t.clientX, t.clientY);
    });
    card.addEventListener("touchend", endDrag);

    // ⭐ 마우스
    card.addEventListener("mousedown", e => {
      startDrag(e.clientX, e.clientY);
    });
    window.addEventListener("mousemove", e => {
      moveDrag(e.clientX, e.clientY);
    });
    window.addEventListener("mouseup", endDrag);
  });
}


/* =========================================================
SPARKLE CURSOR
========================================================= */

if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener('mousemove', (e) => {

    // 파티클 갯수 (3~4개 랜덤)
    const count = Math.floor(Math.random() * 2) + 3;

    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'cross-sparkle';
      document.body.appendChild(sparkle);

      // 위치
      sparkle.style.left = e.clientX + 'px';
      sparkle.style.top = e.clientY + 'px';

      // 퍼지는 정도(좀 더 다양하게)
      const xMove = (Math.random() - 0.5) * 60;
      const yMove = (Math.random() - 0.5) * 60;
      sparkle.style.transform = `translate(${xMove}px, ${yMove}px)`;

      // 제거
      setTimeout(() => sparkle.remove(), 800);
    }
  });
}

// ---- ✨ Mobile Touch Falling Cross Sparkle ----
if (window.matchMedia("(pointer: coarse)").matches) {

  window.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];

    const sparkle = document.createElement('div');
    sparkle.className = 'cross-sparkle';
    document.body.appendChild(sparkle);

    // 터치 위치에 생성
    sparkle.style.left = touch.clientX + 'px';
    sparkle.style.top = touch.clientY + 'px';

    // ---- 별똥별처럼 떨어지는 랜덤 각도와 거리 ----
    const fallX = (Math.random() - 0.5) * 80;   // 좌우로 약간 흔들리게
    const fallY = 120 + Math.random() * 80;     // 아래로 길게 떨어짐

    sparkle.style.setProperty("--fall-x", `${fallX}px`);
    sparkle.style.setProperty("--fall-y", `${fallY}px`);

    // 애니메이션 적용
    sparkle.style.animation = "crossFall 5.1s ease-out forwards";

    // 제거
    setTimeout(() => sparkle.remove(), 5200);
  });
}

let lastTouchEnd = 0;

document.addEventListener('touchend', function (e) {
  const now = Date.now();

  // 300ms 안에 두 번 터치 = 더블탭 → 확대 차단
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }

  lastTouchEnd = now;
}, false);