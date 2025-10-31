import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);
    const supabase = createRouteHandlerClient({ cookies });

    // Handle different Razorpay events
    switch (event.event) {
      case 'subscription.charged':
        // Payment successful
        await handleSubscriptionCharged(supabase, event.payload);
        break;

      case 'subscription.activated':
        // Subscription activated
        await handleSubscriptionActivated(supabase, event.payload);
        break;

      case 'subscription.cancelled':
        // Subscription cancelled
        await handleSubscriptionCancelled(supabase, event.payload);
        break;

      case 'payment.failed':
        // Payment failed
        await handlePaymentFailed(supabase, event.payload);
        break;

      default:
        console.log(`Unhandled event: ${event.event}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCharged(supabase: any, payload: any) {
  const subscription = payload.subscription.entity;
  const payment = payload.payment.entity;

  // Update subscription status
  await supabase
    .from('subscriptions')
    .update({
      status: 'active',
      current_period_start: new Date(subscription.current_start * 1000),
      current_period_end: new Date(subscription.current_end * 1000),
      updated_at: new Date()
    })
    .eq('razorpay_subscription_id', subscription.id);

  // Record payment
  await supabase
    .from('payments')
    .insert({
      razorpay_payment_id: payment.id,
      razorpay_subscription_id: subscription.id,
      amount: payment.amount,
      status: 'succeeded',
      description: `Monthly subscription - ${new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })}`,
      created_at: new Date(payment.created_at * 1000)
    });

  // Generate invoice
  await generateInvoice(supabase, subscription.id, payment);
}

async function handleSubscriptionActivated(supabase: any, payload: any) {
  const subscription = payload.subscription.entity;

  await supabase
    .from('subscriptions')
    .update({
      status: 'active',
      updated_at: new Date()
    })
    .eq('razorpay_subscription_id', subscription.id);
}

async function handleSubscriptionCancelled(supabase: any, payload: any) {
  const subscription = payload.subscription.entity;

  await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      cancelled_at: new Date(),
      updated_at: new Date()
    })
    .eq('razorpay_subscription_id', subscription.id);
}

async function handlePaymentFailed(supabase: any, payload: any) {
  const payment = payload.payment.entity;

  await supabase
    .from('payments')
    .insert({
      razorpay_payment_id: payment.id,
      razorpay_subscription_id: payment.subscription_id,
      amount: payment.amount,
      status: 'failed',
      description: `Failed payment attempt`,
      error_description: payment.error_description,
      created_at: new Date(payment.created_at * 1000)
    });
}

async function generateInvoice(supabase: any, subscriptionId: string, payment: any) {
  const invoiceNumber = `INV-${Date.now()}`;

  await supabase
    .from('billing_invoices')
    .insert({
      invoice_number: invoiceNumber,
      razorpay_subscription_id: subscriptionId,
      razorpay_payment_id: payment.id,
      amount: payment.amount,
      invoice_date: new Date(),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'paid'
    });
}

