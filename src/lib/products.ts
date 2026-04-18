export interface ProductImage {
  src: string;
  width: number;
  height: number;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  productCode: string;
  images: ProductImage[];
  status: "sold-out" | "available";
  price: number;
  currency: string;
  description: string;
  longDescription: string;
  specifications: string[];
  features: string[];
  tags: string[];
  weight: string;
  dimensions: string;
  materials: string[];
  careInstructions: string;
}

export const products: Product[] = [
  {
    id: "ryoko_bag",
    title: "Ryokō Bag",
    category: "Accessories",
    productCode: "RB-002",
    images: [
      { src: "bag1.jpg", width: 3435, height: 5152 },
      { src: "bag2.jpg", width: 3186, height: 4779 },
      { src: "bag3.jpg", width: 3648, height: 2432 },
      { src: "bag4.jpg", width: 4728, height: 3152 },
      { src: "bag5.jpg", width: 4927, height: 3285 },
    ],
    status: "sold-out",
    price: 125,
    currency: "EUR",
    description:
      "The Ryokō bag blends minimalist form with everyday utility. Featuring dual compartments and discreet pockets, each piece is crafted from water-resistant, long-lasting materials. Its clean, structured silhouette is ideal for those who seek effortless organization with a refined edge.",
    longDescription:
      "Meticulously handcrafted in Montréal, the Ryokō bag represents the perfect fusion of Japanese minimalism and Canadian craftsmanship. Every detail has been considered to create a bag that grows more beautiful with use.",
    specifications: [
      "Handmade in Montréal",
      "",
      "External: Made of Dead stock Canada Goose nylon",
      "• 2 zipper pockets",
      "• 2 quick access pockets",
      "• 1 Camera/Film holder (3) pocket",
      "",
      "Interior: Made of Brador COMMANDER Nylon",
      "• Laptop sleeve",
      "• 4 catch all pockets",
      "",
      "Bag size:",
      "W: 18in  H: 18in  D: 6in",
    ],
    features: [
      "Handmade in Montréal",
      "Water-resistant deadstock materials",
      'Laptop compartment fits up to 13"',
      "Multiple organizational pockets",
      "Durable construction for daily use",
    ],
    tags: ["Bag", "Accessories", "Handmade", "Water-resistant", "Laptop"],
    weight: "1.2 kg",
    dimensions: "457 × 457 × 152 mm",
    materials: ["Canada Goose Nylon", "Brador COMMANDER Nylon"],
    careInstructions: "Spot clean with damp cloth. Air dry completely before storage.",
  },
  {
    id: "book",
    title: "Brushing Shoulders",
    category: "Photography",
    productCode: "PB-001",
    images: [
      { src: "book1.jpg", width: 3365, height: 5048 },
      { src: "book2.jpg", width: 3435, height: 5153 },
      { src: "book3.jpg", width: 3527, height: 5290 },
      { src: "book4.jpg", width: 3261, height: 4892 },
    ],
    status: "sold-out",
    price: 45,
    currency: "EUR",
    description:
      "Brushing Shoulders is a photographic journey spanning five years of Boris Halas' work. This first edition captures intimate moments and urban landscapes, showcasing the artist's unique perspective on contemporary life.",
    longDescription:
      "This carefully curated collection represents five years of photographic exploration, capturing the essence of urban life and human connection. Each image tells a story of fleeting moments and lasting impressions, showcasing Boris Halas' distinctive eye for detail and composition.",
    specifications: [
      "Brushing Shoulders",
      "©Boris Halas 2019-2024",
      "Book Made in Montréal",
      "Design by Tatsuki Nikolas Shintani",
      "Cover Design by André Brown Lab",
      "First edition of 200",
      "Dimensions: 210 MM (W) × 297 MM (H)",
      "159 Pages, Soft Cover",
      "Release date: June 13th 2024",
    ],
    features: [
      "Limited first edition of 200 copies",
      "Premium soft cover binding",
      "High-quality archival paper",
      "Curated collection spanning 5 years",
      "Designed in collaboration with renowned artists",
    ],
    tags: ["Photography", "Art Book", "Limited Edition", "Urban", "Portrait"],
    weight: "0.8 kg",
    dimensions: "210 × 297 × 15 mm",
    materials: ["Archival Paper", "Soft Cover Binding"],
    careInstructions: "Keep away from direct sunlight and moisture. Handle with clean hands.",
  },
  {
    id: "cap_v2",
    title: "NPTY! CAP PINK",
    category: "Accessories",
    productCode: "CV2-004",
    images: [
      { src: "cap_v2_1.jpg", width: 3179, height: 4769 },
      { src: "cap_v2_2.jpg", width: 3529, height: 5294 },
      { src: "cap_v2_3.jpg", width: 3426, height: 5139 },
      { src: "cap_v2_4.jpg", width: 3409, height: 5114 },
    ],
    status: "sold-out",
    price: 50,
    currency: "EUR",
    description:
      "NPTY! CAP PINK featuring premium construction and distinctive details. The pink edition combines outdoor functionality with streetwear aesthetics.",
    longDescription:
      "Building on the success of our NPTY! CAP GREEN, the PINK edition refines the formula with updated details and improved construction. This iteration maintains the rugged aesthetic while enhancing comfort and durability.",
    specifications: [
      "NPTY! CAP PINK",
      "Material: 100% Cotton",
      "Size: OS (One Size)",
      "Woven Tag: Brushing Shoulders",
      "Closure: Snap Closure",
      "White: 3M Reflective thread",
      "Red: Puff Embroidery",
    ],
    features: [
      "Updated Real-Tree camouflage pattern",
      "Enhanced 3M reflective detailing",
      "Improved puff embroidery",
      "Comfortable snap closure",
      "Refined cotton blend construction",
    ],
    tags: ["Cap", "Accessories", "Camo", "Streetwear", "Updated"],
    weight: "0.15 kg",
    dimensions: "One Size Fits Most",
    materials: ["100% Cotton", "3M Reflective Thread"],
    careInstructions: "Hand wash cold. Air dry. Do not bleach.",
  },
  {
    id: "cap_v1",
    title: "NPTY! CAP GREEN",
    category: "Accessories",
    productCode: "CV1-003",
    images: [
      { src: "cap_v1_1.jpg", width: 3437, height: 5155 },
      { src: "cap_v1_2.jpg", width: 3402, height: 5103 },
      { src: "cap_v1_3.jpg", width: 3503, height: 5254 },
      { src: "cap_v1_4.jpg", width: 3499, height: 5248 },
    ],
    status: "sold-out",
    price: 50,
    currency: "EUR",
    description:
      "NPTY! CAP GREEN featuring premium construction and distinctive details. A limited edition piece combining outdoor functionality with streetwear aesthetics.",
    longDescription:
      "The NPTY! CAP GREEN represents our first foray into headwear, combining classic Real-Tree camouflage with modern streetwear sensibilities. Each cap features thoughtful details that set it apart from ordinary headwear.",
    specifications: [
      "NPTY! CAP GREEN",
      "Material: 100% Cotton",
      "Size: OS (One Size)",
      "Woven Tag: Brushing Shoulders",
      "Closure: Snap Closure",
      "White: 3M Reflective thread",
      "Red: Puff Embroidery",
    ],
    features: [
      "Real-Tree camouflage pattern",
      "3M reflective detailing",
      "Puff embroidery accents",
      "Adjustable snap closure",
      "Premium cotton construction",
    ],
    tags: ["Cap", "Accessories", "Camo", "Limited Edition", "Streetwear"],
    weight: "0.15 kg",
    dimensions: "One Size Fits Most",
    materials: ["100% Cotton", "3M Reflective Thread"],
    careInstructions: "Hand wash cold. Air dry. Do not bleach.",
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
