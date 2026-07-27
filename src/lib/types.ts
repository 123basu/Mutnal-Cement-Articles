export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  specs: string[];
  image: string;
}

export interface AdminBlog {
  id: string;
  slug: string;
  category: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readingTime: number;
  content: string;
}

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
