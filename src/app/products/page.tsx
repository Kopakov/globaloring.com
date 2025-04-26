import { Suspense } from 'react';
import { InstantSearch, SearchBox, Hits, RefinementList, Pagination } from 'react-instantsearch';
import { searchClient, ALGOLIA_INDEX_NAME } from '@/lib/algolia';
import { ProductCard } from '@/components/products/product-card';
import { Skeleton } from '@/components/ui/skeleton';

function SearchResults() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Hits
        hitComponent={({ hit }) => <ProductCard product={hit} />}
        classNames={{
          list: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
          item: 'w-full',
        }}
      />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Products</h1>
      
      <InstantSearch
        searchClient={searchClient}
        indexName={ALGOLIA_INDEX_NAME}
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <SearchBox
                placeholder="Search products..."
                classNames={{
                  root: 'w-full',
                  input: 'w-full px-4 py-2 border rounded-lg',
                  submit: 'hidden',
                  reset: 'hidden',
                }}
              />
              
              <div className="space-y-4">
                <h2 className="font-semibold">Categories</h2>
                <RefinementList
                  attribute="categories"
                  classNames={{
                    list: 'space-y-2',
                    item: 'flex items-center space-x-2',
                    checkbox: 'rounded border-gray-300',
                    label: 'text-sm',
                    count: 'text-xs text-gray-500',
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <Suspense fallback={<LoadingState />}>
              <SearchResults />
            </Suspense>
            
            <div className="mt-8">
              <Pagination
                classNames={{
                  root: 'flex justify-center space-x-2',
                  item: 'px-3 py-1 rounded border',
                  selectedItem: 'bg-primary text-primary-foreground',
                  disabledItem: 'opacity-50 cursor-not-allowed',
                }}
              />
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
} 