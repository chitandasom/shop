function getDisplayPrice(product) {
  return product.outOfStock ? "out of stock" : product.price;
}

const products = [
  {
    id: 1,
    category: ["all", "♱"],
    name: "rosa comb",
    price: "₩73,000",
    img: "img/1/1.png",
    outOfStock: false,

    description1: "로사는 재즈를 들으며 홍차를 마실 때,<br>라푼젤처럼 긴 그녀의 머리칼을 빗곤 한다.",
    description2: "Rosa is a girl who drinks black tea while listening to jazz,<br>brushing her hair as long as rapunzel’s.<br><br>SLA-printed ABS-like resin, 54 × 149 × 10 mm",

    detailImages: [
      "img/1/1-1.png",
      "img/1/1-2.png",
      "img/1/1-3.png",
      "img/1/1-4.png",
      "img/1/1-5.png",
      "img/1/1-6.png",
      "img/1/1-7.png",
      "img/1/1-8.png",
      "img/1/1-9.png",
      "img/1/1-10.png",
      "img/1/1-11.png",
      "img/1/1-12.png"
    ]
  },

  {
    id: 2,
    category: ["all", "custom"],
    name: "custom ID portrait",
    price: "₩999,999",
    img: "img/2/2.png",
    outOfStock: true,

    description1: "",
    description2: "Coming soon…",

    detailImages: [
      "img/2/2-1.png"
    ]
  },

  {
    id: 3,
    category: ["all", "for-doll"],
    name: "𓆩༒︎𓆪",
    price: "₩999,999",
    img: "img/3/3.png",
    outOfStock: true,

    description1: "",
    description2: "Coming soon…",

    detailImages: [
      "img/3/3-1.png"
    ]
  }
];
