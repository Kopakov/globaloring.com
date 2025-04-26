import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Create order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            profile_id: session.metadata.profile_id,
            order_number: `ORD-${Date.now()}`,
            status: 'processing',
            payment_status: 'paid',
            subtotal: session.amount_subtotal / 100,
            tax: (session.amount_total - session.amount_subtotal) / 100,
            shipping: 0, // Adjust based on your shipping logic
            total: session.amount_total / 100,
            billing_address: session.customer_details?.address,
            shipping_address: session.shipping?.address,
            stripe_payment_intent_id: session.payment_intent,
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // Get cart items
        const { data: cartItems, error: cartItemsError } = await supabase
          .from('cart_items')
          .select('product_id, quantity, product:products(price)')
          .eq('cart_id', session.metadata.cart_id);

        if (cartItemsError) throw cartItemsError;

        // Create order items
        const { error: orderItemsError } = await supabase
          .from('order_items')
          .insert(
            cartItems.map((item) => ({
              order_id: order.id,
              product_id: item.product_id,
              quantity: item.quantity,
              price: item.product.price,
            }))
          );

        if (orderItemsError) throw orderItemsError;

        // Clear cart
        const { error: clearCartError } = await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', session.metadata.cart_id);

        if (clearCartError) throw clearCartError;

        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        
        // Update order payment status
        const { error: updateError } = await supabase
          .from('orders')
          .update({ payment_status: 'paid' })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (updateError) throw updateError;
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        
        // Update order payment status
        const { error: updateError } = await supabase
          .from('orders')
          .update({ payment_status: 'failed' })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (updateError) throw updateError;
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
} 