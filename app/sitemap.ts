import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://nasr-sanitary.vercel.app",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://nasr-sanitary.vercel.app/products",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://nasr-sanitary.vercel.app/cart",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://nasr-sanitary.vercel.app/checkout",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://nasr-sanitary.vercel.app/login",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://nasr-sanitary.vercel.app/register",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}