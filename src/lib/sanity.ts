import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-05-03";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: { _type: string; asset: { _ref: string } }) {
  return builder.image(source);
}

export async function getProducts() {
  return await client.fetch(`*[_type == "product"]{
    _id,
    name,
    description,
    price,
    "slug": slug.current,
    "image": image.asset->url,
    categories[]->{
      _id,
      name,
      "slug": slug.current
    }
  }`);
}

export async function getProduct(slug: string) {
  return await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{
      _id,
      name,
      description,
      price,
      "slug": slug.current,
      "image": image.asset->url,
      categories[]->{
        _id,
        name,
        "slug": slug.current
      }
    }`,
    { slug }
  );
}

export async function getCategories() {
  return await client.fetch(`*[_type == "category"]{
    _id,
    name,
    "slug": slug.current,
    description
  }`);
}

export async function getCategory(slug: string) {
  return await client.fetch(
    `*[_type == "category" && slug.current == $slug][0]{
      _id,
      name,
      "slug": slug.current,
      description,
      "products": *[_type == "product" && references(^._id)]{
        _id,
        name,
        description,
        price,
        "slug": slug.current,
        "image": image.asset->url
      }
    }`,
    { slug }
  );
} 