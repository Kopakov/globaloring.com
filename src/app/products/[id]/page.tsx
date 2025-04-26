import { Suspense } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { client } from '@/lib/sanity';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sku: string;
  categories: string[];
  specifications: Record<string, string>;
}

async function getProduct(id: string): Promise<Product | null> {
  const query = `*[_type == "product" && _id == $id][0]`;
  const product = await client.fetch(query, { id });
  return product;
}

function ProductGallery({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="relative aspect-square">
        <Image
          src={images[0]}
          alt="Main product image"
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {images.slice(1).map((image, index) => (
          <div key={index} className="relative aspect-square">
            <Image
              src={image}
              alt={`Product image ${index + 2}`}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductInfo({ product }: { product: Product }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">{product.name}</h1>
        <p className="text-2xl font-semibold mt-2">${product.price.toFixed(2)}</p>
        <p className="text-sm text-muted-foreground mt-1">SKU: {product.sku}</p>
      </div>
      
      <div className="prose">
        <p>{product.description}</p>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Specifications</h2>
        <dl className="grid grid-cols-2 gap-4">
          {Object.entries(product.specifications).map(([key, value]) => (
            <div key={key} className="border-b pb-2">
              <dt className="font-medium">{key}</dt>
              <dd className="text-muted-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      
      <Button className="w-full">Add to Cart</Button>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Skeleton className="h-[600px] w-full" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  
  if (!product) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoadingState />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductGallery images={product.images} />
          <ProductInfo product={product} />
        </div>
      </Suspense>
    </div>
  );
} 