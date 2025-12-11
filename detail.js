// URL에서 product=ID 읽기
const params = new URLSearchParams(window.location.search);
const id = params.get("product");

// products 배열에서 상품 찾기
const product = products.find(p => p.id == id);

if (!product) {
  document.getElementById("detail-title").textContent = "상품을 찾을 수 없습니다.";
} else {
  document.getElementById("detail-title").textContent = product.name;
  document.getElementById("detail-img").src = product.img;

  document.getElementById("detail-info").innerHTML = `
    <div>Category: ${product.category.join(", ")}</div>
    <div>Price: ${product.price}</div>
  `;
}
