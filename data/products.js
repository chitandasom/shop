function getDisplayPrice(product) {
  return product.outOfStock ? "out of stock" : product.price;
}

const products = [
  {
    id: 1,
    category: ["all", "♱"],
    name: "rosa comb",
    price: "₩73,000",
    img: "img/1/1.webp",
    outOfStock: false,

    description1: "로사는 재즈를 들으며 홍차를 마실 때,<br>라푼젤처럼 긴 그녀의 머리칼을 빗곤 한다.",
    description2: "Rosa is a girl who drinks black tea while listening to jazz,<br>brushing her hair as long as rapunzel’s.<br><br>SLA-printed ABS-like resin, 54 × 149 × 10 mm",

    detailImages: Array.from({ length: 12 }, (_, i) => `img/1/1-${i + 1}.webp`)

  },

  {
    id: 2,
    category: ["all", "custom"],
    name: "custom ID portrait",
    price: "₩99,000",
    img: "img/2/2.webp",
    outOfStock: false,

    description1: "원하는 대상을 증명 그림으로 만들어 드립니다.<br>구매 후, 구매자명과 함께 증명 그림으로 제작할 사진을<br>chitandasom@gmail.com로 보내주세요.",
    description2: "Custom ID portraits of your chosen subject.<br>After purchase, please email a photo of the subject<br>for the custom ID portrait, along with the buyer’s name.",

    detailImages: Array.from({ length: 11 }, (_, i) => `img/2/2-${i + 1}.webp`)
  },

  {
    id: 3,
    category: ["all", "for-doll"],
    name: "𓆩༒︎𓆪",
    price: "₩999,999",
    img: "img/3/3.webp",
    outOfStock: true,

    description1: "",
    description2: "Coming soon…",

    detailImages: [
      "img/3/3-1.webp"
    ]
  }
];
