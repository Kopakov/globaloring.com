import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2 } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getOrder(sessionId: string) {
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(
        quantity,
        price,
        product:products(
          name,
          images
        )
      )
    `)
    .eq('stripe_payment_intent_id', sessionId)
    .single();

  if (error || !order) {
    notFound();
  }

  return order;
}

function OrderDetails({ order }: { order: any }) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold">Order Confirmed!</h1>
        <p className="mt-2 text-gray-600">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold">Order Summary</h2>
        <div className="mt-4 space-y-4">
          <div className="flex justify-between">
            <span>Order Number</span>
            <span className="font-medium">{order.order_number}</span>
          </div>
          <div className="flex justify-between">
            <span>Date</span>
            <span className="font-medium">
              {new Date(order.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Status</span>
            <span className="font-medium capitalize">{order.status}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Status</span>
            <span className="font-medium capitalize">{order.payment_status}</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold">Order Items</h2>
        <div className="mt-4 space-y-4">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 overflow-hidden rounded-md">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold">Order Total</h2>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${order.shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 font-semibold">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button asChild>
          <a href="/products">Continue Shopping</a>
        </Button>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <Skeleton className="mx-auto h-16 w-16 rounded-full" />
        <Skeleton className="mx-auto mt-4 h-8 w-64" />
        <Skeleton className="mx-auto mt-2 h-4 w-96" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  if (!searchParams.session_id) {
    notFound();
  }

  const order = await getOrder(searchParams.session_id);

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <Suspense fallback={<LoadingState />}>
        <OrderDetails order={order} />
      </Suspense>
    </div>
  );
} 