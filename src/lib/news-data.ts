export interface NewsSection {
  title: string;
  content: string;
}

export interface NewsPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage: string;
  sections: NewsSection[];
}

export const NEWS_POSTS: NewsPost[] = [
  {
    slug: "como-preparar-una-sesion-de-retrato",
    title: "Como preparar una sesion de retrato que realmente cuente tu historia",
    date: "03 abril 2026",
    excerpt:
      "Una guia practica para llegar relajado, conectar con camara y conseguir retratos naturales.",
    coverImage:
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=1600&h=1000&q=80",
    sections: [
      {
        title: "Antes de la sesion",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eleifend erat ut augue venenatis, a tincidunt risus scelerisque. Praesent vel sem tristique, tristique massa id, imperdiet metus. Donec at purus sed lorem pellentesque vulputate.",
      },
      {
        title: "Vestuario y estilo visual",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras non mauris ac nibh feugiat dictum. Maecenas eu lectus ac purus fermentum auctor. Integer commodo est non mauris suscipit, et malesuada lacus sagittis.",
      },
      {
        title: "Direccion durante la sesion",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tempor tincidunt nibh, non mattis arcu tincidunt ut. Aenean posuere, sem a volutpat pharetra, tortor risus interdum justo, vitae posuere justo lectus vitae tortor.",
      },
    ],
  },
  {
    slug: "claves-para-fotografiar-bodas-con-luz-natural",
    title: "Claves para fotografiar bodas con luz natural y resultados de lujo",
    date: "28 marzo 2026",
    excerpt:
      "La luz cambia rapido en una boda: te contamos como anticiparte para mantener coherencia.",
    coverImage:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&h=1000&q=80",
    sections: [
      {
        title: "Planificacion de horarios",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum aliquet, ligula vitae malesuada luctus, sem augue vestibulum dolor, sit amet ullamcorper urna augue in augue. Morbi tincidunt, justo ac facilisis rhoncus, felis libero commodo sem, at malesuada metus augue vel dui.",
      },
      {
        title: "Momentos clave",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed efficitur velit. Sed eleifend efficitur lectus, in lacinia justo commodo in. Vivamus fringilla, nunc sed congue placerat, felis nibh vulputate lacus, eu feugiat tortor magna eget lectus.",
      },
      {
        title: "Edicion consistente",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, turpis non faucibus luctus, arcu massa sollicitudin turpis, eget feugiat ipsum quam vitae justo. Curabitur ac mi in augue faucibus luctus id a est.",
      },
    ],
  },
  {
    slug: "paisaje-nocturno-sin-ruido",
    title: "Paisaje nocturno sin ruido: ajustes y flujo para lograr detalle fino",
    date: "20 marzo 2026",
    excerpt:
      "ISO, exposicion y composicion: los ajustes que marcan diferencia en nocturnas.",
    coverImage:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1600&h=1000&q=80",
    sections: [
      {
        title: "Equipo minimo recomendado",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ac urna at est aliquam pretium. Nullam sollicitudin interdum velit, quis vulputate neque tincidunt vel. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
      },
      {
        title: "Tecnica de captura",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse fermentum, dolor eget tincidunt suscipit, augue turpis porta lorem, eu volutpat nulla magna sit amet odio. Curabitur dapibus aliquam arcu, non cursus lorem.",
      },
      {
        title: "Postproduccion limpia",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vel convallis tortor. Ut eleifend justo vel erat ultricies, at ultrices nibh malesuada. Donec commodo tincidunt elit vel vestibulum.",
      },
    ],
  },
  {
    slug: "viajes-fotograficos-que-si-vale-la-pena-planear",
    title: "Viajes fotograficos que si vale la pena planear con antelacion",
    date: "13 marzo 2026",
    excerpt:
      "Scouting, clima y localizaciones: como llegar con ventaja y volver con un reportaje redondo.",
    coverImage:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&h=1000&q=80",
    sections: [
      {
        title: "Investigacion previa",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin posuere quam at nunc egestas, nec volutpat lectus finibus. Morbi sollicitudin tempor lectus sed pretium. Sed et luctus mi.",
      },
      {
        title: "Adaptacion en terreno",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et augue at eros sodales consequat. Sed gravida sagittis sem, a vulputate tortor feugiat sed. Cras id consectetur lorem.",
      },
      {
        title: "Narrativa final",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet suscipit leo. Maecenas blandit posuere justo, sed consequat sem mattis sed. Curabitur at egestas turpis.",
      },
    ],
  },
];

export function getNewsPostBySlug(slug: string) {
  return NEWS_POSTS.find((post) => post.slug === slug);
}
