document.addEventListener("DOMContentLoaded", () => {

    let currentTotal = 0;


    const address = document.getElementById("address");
    const detail_address = document.getElementById("detail_address");
    const orderForm = document.getElementById("orderForm");

    const same = document.getElementById("same");
    const orderer = document.getElementById("orderer");
    const phone = document.getElementById("phone");
    const email = document.getElementById("email");
    const receiver = document.getElementById("receiver");
    const receiver_phone = document.getElementById("receiver_phone");
    const request = document.getElementById("request");
    const cash_receipt = document.getElementById("cash_receipt");

    address.addEventListener("click", () => {
        execDaumPostcode();
    });

    const SHIPPING_FEE = 3500;

    function parsePrice(priceStr) {
        return Number(priceStr.replace(/[^\d]/g, ""));
    }


    // 총 금액 // 

    function updatePriceSummary() {
        const priceSummary = document.getElementById("priceSummary");

        // ✅ 상품 선택 안 됐으면 숨김
        if (orderItems.length === 0) {
            priceSummary.style.display = "none";
            return;
        }

        // ✅ 상품 1개 이상이면 보이게
        priceSummary.style.display = "block";

        let subtotal = 0;

        orderItems.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (!product) return;

            const price = parsePrice(product.price);
            subtotal += price * item.qty;
        });

        const total = subtotal + SHIPPING_FEE;
        currentTotal = total;

        document.getElementById("subtotal").textContent =
            subtotal.toLocaleString() + "원";

        document.getElementById("total").textContent =
            total.toLocaleString() + "원";
    }



    window.execDaumPostcode = function () {
        new daum.Postcode({
            oncomplete: function (data) {
                let addr = data.userSelectedType === "R"
                    ? data.roadAddress
                    : data.jibunAddress;

                // ✅ 주소 + 우편번호 함께
                address.value = `${addr} (${data.zonecode})`;

                detail_address.focus();
            }
        }).open();
    };

    // products.js에서 불러온 상품 데이터
    if (typeof products === "undefined") {
        console.error("products 데이터가 로드되지 않았습니다");
        return;
    }


    const toggleBtn = document.getElementById("toggleProducts");
    const productList = document.getElementById("productList");
    const selectedProducts = document.getElementById("selectedProducts");

    const orderItems = [];

    // 토글 버튼

    toggleBtn.addEventListener("click", () => {
        const isOpen = productList.style.display === "block";

        productList.style.display = isOpen ? "none" : "block";
        toggleBtn.classList.toggle("open", !isOpen);
    });



    products.forEach(product => {
        if (product.outOfStock) return;
        const div = document.createElement("div");
        div.className = "product-row";

        div.innerHTML = `
        <span class="product-name">${product.name}</span>

    <div class="product-controls">
      <button type="button" class="minus"><span class="minus-char">−</span></button>
      <span class="qty">1</span>
      <button type="button" class="plus">+</button>
      <button type="button" class="add">추가</button>
    </div>
  `;

        const qtySpan = div.querySelector(".qty");

        div.querySelector(".minus").onclick = () => {
            let q = Number(qtySpan.textContent);
            if (q > 1) qtySpan.textContent = q - 1;
        };

        div.querySelector(".plus").onclick = () => {
            qtySpan.textContent = Number(qtySpan.textContent) + 1;
        };

        div.querySelector(".add").onclick = () => {
            const existing = orderItems.find(i => i.id === product.id);

            if (existing) {
                existing.qty += Number(qtySpan.textContent);
            } else {
                orderItems.push({
                    id: product.id,
                    name: product.name,
                    qty: Number(qtySpan.textContent)
                });
            }

            renderSelectedProducts();
        };

        productList.appendChild(div);
    });

    function renderSelectedProducts() {
        // ❌ 상품 없으면
        if (orderItems.length === 0) {
            selectedProducts.innerHTML = "";
            updatePriceSummary(); // 🔥 이 줄 추가
            return;
        }

        // ⭕ 상품 있을 때만 제목 표시
        selectedProducts.innerHTML =
            "<div class='section-title'>주문 상품</div>";

        orderItems.forEach((item, index) => {
            const div = document.createElement("div");
            div.style.display = "flex";
            div.style.justifyContent = "space-between";
            div.style.alignItems = "center";
            div.style.marginBottom = "6px";

            const text = document.createElement("span");
            text.className = "selected-product-text";
            text.innerHTML = `${item.name} <span class="mid-star">*</span> ${item.qty}`;

            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.textContent = "✕";
            removeBtn.style.marginLeft = "10px";

            removeBtn.onclick = () => {
                orderItems.splice(index, 1);
                renderSelectedProducts();
            };

            div.appendChild(text);
            div.appendChild(removeBtn);
            selectedProducts.appendChild(div);
        });

        updatePriceSummary(); // ⭕ 상품 있을 때도 호출
    }




    same.addEventListener("change", () => {
        if (same.checked) {
            receiver.value = orderer.value;
            receiver_phone.value = phone.value;
        }
    });

    const ENDPOINT = "https://script.google.com/macros/s/AKfycbwa_Afiu-3zZMGW9Bo51XqUhYOdoWX5n-iksRZYIQJmkZWBoG9xdstqG0G4iam15hHs/exec";

    orderForm.addEventListener("submit", e => {
        e.preventDefault();

        // 🔴 주소 미선택 시 막기
        if (!address.value.trim()) {
            alert("주소를 선택해주세요.");
            address.focus();
            return;
        }

        // 🔴 상품 미선택 시 제출 막기
        if (orderItems.length === 0) {
            alert("상품을 최소 1개 이상 추가해주세요.");
            return;
        }


        fetch(ENDPOINT, {
            method: "POST",
            body: JSON.stringify({
                products: orderItems,
                total: currentTotal,
                orderer: orderer.value,
                phone: phone.value,
                email: email.value,
                receiver: receiver.value,
                receiver_phone: receiver_phone.value,
                address: address.value,
                detail_address: detail_address.value,
                request: request.value,
                payment: "계좌이체",
                cash_receipt: cash_receipt.value
            })
        }).then(() => {
            alert("주문이 접수되었습니다.");

            // 1️⃣ form 입력값 리셋
            orderForm.reset();

            // 2️⃣ 선택 상품 배열 비우기
            orderItems.length = 0;

            // 3️⃣ 선택 상품 UI 제거
            selectedProducts.innerHTML = "";

            // 4️⃣ 가격 요약 숨기기
            document.getElementById("priceSummary").style.display = "none";

            // 5️⃣ 총액 초기화 (안전)
            currentTotal = 0;

            // 6️⃣ 상품 선택 리스트 닫기 (선택)
            productList.style.display = "none";
        });
    });

    // ✅ 뒤로 가기 (여기로 이동)
    const backBtn = document.getElementById("back-btn");
    if (backBtn) {
        backBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.history.back();
        });
    }


});

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

