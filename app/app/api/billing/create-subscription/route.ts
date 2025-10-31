import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Initialize Razorpay (USER NEEDS TO SET THIS UP)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectCount, licenseCount } = await request.json();

    // Calculate subscription amount
    const baseAmount = 100000 * projectCount; // ₹1L per project
    const includedLicenses = 10 * projectCount;
    const extraLicenses = Math.max(0, licenseCount - includedLicenses);
    const extraLicenseCost = extraLicenses * 15000;
    const totalAmount = baseAmount + extraLicenseCost; // Amount in rupees

    // Create Razorpay subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID!, // Create this in Razorpay Dashboard
      customer_notify: 1,
      total_count: 12, // 12 months
      quantity: projectCount,
      notes: {
        project_count: projectCount,
        license_count: licenseCount,
        user_id: user.id
      }
    });

    // Save subscription to database
    const { data: savedSubscription, error: saveError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        razorpay_subscription_id: subscription.id,
        status: subscription.status,
        project_count: projectCount,
        license_count: licenseCount,
        amount: totalAmount,
        current_period_start: new Date(subscription.start_at * 1000),
        current_period_end: new Date(subscription.end_at * 1000)
      })
      .select()
      .single();

    if (saveError) throw saveError;

    return NextResponse.json({
      success: true,
      subscription: savedSubscription,
      razorpay_subscription_id: subscription.id
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

