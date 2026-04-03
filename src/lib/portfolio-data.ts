export interface PortfolioCategoryData {
  slug: string;
  name: string;
  description: string;
  carouselImages: string[];
  galleryImages: string[];
}

function toUnsplashUrl(photoId: string, width: number, height: number, seed: number) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=80&v=${seed}`;
}

const landscapes = [
  "photo-1469474968028-56623f02e42e",
  "photo-1501785888041-af3ef285b470",
  "photo-1472214103451-9374bd1c798e",
  "photo-1441974231531-c6227db76b6e",
  "photo-1506744038136-46273834b3fb",
  "photo-1439853949127-fa647821eba0",
  "photo-1472396961693-142e6e269027",
  "photo-1500534314209-a25ddb2bd429",
  "photo-1493244040629-496f6d136cc3",
  "photo-1511497584788-876760111969",
  "photo-1493246507139-91e8fad9978e",
  "photo-1507525428034-b723cf961d3e",
];

const portraits = [
  "photo-1494790108377-be9c29b29330",
  "photo-1521572267360-ee0c2909d518",
  "photo-1520813792240-56fc4a3765a7",
  "photo-1521119989659-a83eee488004",
  "photo-1544005313-94ddf0286df2",
  "photo-1542204625-de293a06df54",
  "photo-1463453091185-61582044d556",
  "photo-1519085360753-af0119f7cbe7",
  "photo-1488426862026-3ee34a7d66df",
  "photo-1500648767791-00dcc994a43e",
  "photo-1524504388940-b1c1722653e1",
  "photo-1535713875002-d1d0cf377fde",
];

const weddings = [
  "photo-1511285560929-80b456fea0bc",
  "photo-1520854221256-17451cc331bf",
  "photo-1522673607200-164d1b6ce486",
  "photo-1519741497674-611481863552",
  "photo-1515934751635-c81c6bc9a2d8",
  "photo-1460364157752-926555421a7e",
  "photo-1519225421980-715cb0215aed",
  "photo-1513279922550-250c2129b13a",
  "photo-1519225421980-715cb0215aed",
  "photo-1472653431158-6364773b2a56",
  "photo-1522673607200-164d1b6ce486",
  "photo-1511285560929-80b456fea0bc",
];

const categoryBase: Array<Omit<PortfolioCategoryData, "carouselImages" | "galleryImages"> & {
  photoIds: string[];
}> = [
  {
    slug: "paisajes",
    name: "Paisajes",
    description: "Luz natural, contraste y escala para contar lugares.",
    photoIds: landscapes,
  },
  {
    slug: "retratos",
    name: "Retratos",
    description: "Retratos editoriales con foco en expresion y detalle.",
    photoIds: portraits,
  },
  {
    slug: "bodas",
    name: "Bodas",
    description: "Cobertura elegante para capturar momentos irrepetibles.",
    photoIds: weddings,
  },
];

export const HOME_CAROUSEL_CATEGORIES: PortfolioCategoryData[] = categoryBase.map(
  (category, index) => ({
    slug: category.slug,
    name: category.name,
    description: category.description,
    carouselImages: category.photoIds
      .slice(0, 5)
      .map((id, photoIndex) => toUnsplashUrl(id, 2000, 1300, index * 10 + photoIndex)),
    galleryImages: [...category.photoIds, ...category.photoIds].map((id, photoIndex) =>
      toUnsplashUrl(id, 1400, 1400, index * 100 + photoIndex)
    ),
  })
);

export function getCategoryData(slug: string) {
  return HOME_CAROUSEL_CATEGORIES.find((category) => category.slug === slug.toLowerCase());
}
