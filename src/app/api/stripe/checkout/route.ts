import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { amount } = await req.json();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Generate Now Content Fee',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/generate-now/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/generate-now/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    // Provide a mailto link for the user to contact admin directly
    const adminEmail = 'harborworksdigital@gmail.com';
    const mailto = `mailto:verbshift@protonmail.com?subject=Stripe%20Checkout%20Error&body=I%20encountered%20an%20error%20while%20trying%20to%20checkout.%20Error%20details:%20${encodeURIComponent(error instanceof Error ? error.message : String(error))}`;
    return NextResponse.json({ 
      error: 'Failed to create checkout session',
      contact: mailto
    }, { status: 500 });
  }
}