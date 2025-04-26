import Image from "next/image";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to Globaloring</h1>
      <p className="text-lg text-muted-foreground mb-4">
        Your trusted source for industrial supplies
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for featured products */}
        <div className="p-6 rounded-lg border bg-card">
          <h2 className="text-xl font-semibold mb-2">Featured Products</h2>
          <p className="text-muted-foreground">
            Coming soon...
          </p>
        </div>
        
        {/* Placeholder for categories */}
        <div className="p-6 rounded-lg border bg-card">
          <h2 className="text-xl font-semibold mb-2">Product Categories</h2>
          <p className="text-muted-foreground">
            Coming soon...
          </p>
        </div>
        
        {/* Placeholder for latest news */}
        <div className="p-6 rounded-lg border bg-card">
          <h2 className="text-xl font-semibold mb-2">Latest News</h2>
          <p className="text-muted-foreground">
            Coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
