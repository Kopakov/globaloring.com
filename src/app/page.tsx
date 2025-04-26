import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Global O-Ring</h1>
        <p className="text-xl text-muted-foreground">
          Your trusted source for high-quality o-rings and sealing solutions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quality Products</CardTitle>
            <CardDescription>
              Premium o-rings and sealing solutions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              We offer a wide range of high-quality o-rings and sealing solutions
              for various industries and applications.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expert Support</CardTitle>
            <CardDescription>
              Technical assistance and guidance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Our team of experts is ready to help you find the perfect sealing
              solution for your specific needs.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fast Shipping</CardTitle>
            <CardDescription>
              Quick delivery worldwide
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              We ensure fast and reliable shipping to get your products to you as
              quickly as possible.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <Button asChild size="lg">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    </div>
  );
}
