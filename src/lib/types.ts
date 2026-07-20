export interface Delivery {
  id: string;
  customerName: string;
  projectType: string;
  products: string[];
  quantity: number;
  deliveryDate: string;
  purpose: string;
  isGovernment: boolean;
  lat: number;
  lng: number;
  city: string;
}

export interface Product {
  slug: string;
  titleKey: string;
  textKey: string;
  specs: string[];
  accent: "solid" | "hollow" | "paving" | "interlock";
}

export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  cover: string;
  draft?: boolean;
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
  readingTimeMin: number;
}
