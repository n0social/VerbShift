import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import stripe from '@/lib/stripe';

// Stripe requires the raw body to validate the signature

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const rawBody = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed.' }, { status: 400 });
  }

  // Handle subscription created/updated events
  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated'
  ) {
    const session = event.data.object as any;
    const customerEmail = session.customer_email || session.customer?.email;
    let tier = 'BASIC';
    if (session.display_items || session.line_items) {
      const name = session.display_items?.[0]?.custom?.name || session.line_items?.[0]?.description || '';
      if (name.toLowerCase().includes('premium')) tier = 'PREMIUM';
    }
    // Find user by email and update subscription
    if (customerEmail) {
      await prisma.user.update({
        where: { email: customerEmail },
        data: {
          // Subscription logic removed; no longer updating subscription on user
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
