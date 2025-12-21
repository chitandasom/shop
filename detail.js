// 모든 상품 공통 ORDER 링크
const ORDER_LINK = "order.html";
// URL에서 product=ID 읽기
const params = new URLSearchParams(window.location.search);
const id = params.get("product");

// 상품 찾기
const product = products.find(p => p.id == id);

const orderBtn = document.getElementById("order-btn");

if (!product) {
  document.getElementById("detail-title").textContent = "상품을 찾을 수 없습니다.";
} else {
  document.getElementById("detail-title").textContent = product.name;
  const priceEl = document.getElementById("detail-price");
  priceEl.textContent = getDisplayPrice(product);
  document.getElementById("detail-desc1").innerHTML = product.description1;
  document.getElementById("detail-desc2").innerHTML = product.description2;

  const desc2 = document.getElementById("detail-desc2");

  if (product.outOfStock) {
    desc2.style.marginBottom = "30px";
  } else {
    desc2.style.marginBottom = "20px";
  }


  // ORDER 버튼 링크
  if (product.outOfStock) {
    orderBtn.style.display = "none";
  } else {
    orderBtn.href = ORDER_LINK;
  }

  const container = document.getElementById("detail-images");

  product.detailImages.forEach(src => {
    const wrap = document.createElement("div");
    wrap.className = "img-wrap";

    const img = document.createElement("img");
    img.src = src;
    img.className = "product-img";

    wrap.appendChild(img);
    container.appendChild(wrap);
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

/* =========================================================
우클릭 차단
========================================================= */

const isMobile = window.matchMedia("(pointer: coarse)").matches;

if (!isMobile) {
  document.addEventListener("contextmenu", e => {
    if (e.target.closest(".img-wrap")) {
      e.preventDefault();
    }
  });
}

// ✅ 뒤로 가기 (여기로 이동)
    const backBtn = document.getElementById("back-btn");
    if (backBtn) {
        backBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.history.back();
        });
    }



