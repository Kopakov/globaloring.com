import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { stripe } from '@/lib/stripe';
import Image from 'next/image';
import Link from 'next/link';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  name: string;
  image_url: string;
}

interface Order {
  id: string;
  created_at: string;
  total: number;
  status: string;
  items: OrderItem[];
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getOrder(sessionId: string): Promise<Order | null> {
  try {
    await stripe.checkout.sessions.retrieve(sessionId);
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .single();

    if (!order) return null;

    return {
      id: order.id,
      created_at: order.created_at,
      total: order.total,
      status: order.status,
      items: order.items,
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

const ConfirmationPage = async ({ searchParams }: {
  searchParams: Promise<{ session_id?: string | string[] }>,
}) => {
  // @ts-expect-error: comment
  const sessionId = Array.isArray(searchParams.session_id)
  // @ts-expect-error: comment
    ? searchParams.session_id[0]
  // @ts-expect-error: comment
    : searchParams.session_id;

  if (!sessionId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Invalid Session</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Invalid checkout session. Please try again.</p>
            <Button asChild className="mt-4">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Await the promise and handle the result properly
  const order = await getOrder(sessionId);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Order Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>We couldn&apos;t find your order. Please contact support.</p>
            <Button asChild className="mt-4">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <CardTitle>Order Confirmed</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold">Order Details</h3>
              <p>Order ID: {order.id}</p>
              <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
              <p>Status: {order.status}</p>
              <p>Total: ${order.total.toFixed(2)}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Items</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmationPage;
