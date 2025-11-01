import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

/**
 * POST /api/team/invite
 * Invite a new team member to the organization
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user's organization
    const { data: userProfile } = await supabase
      .from('users')
      .select('organization_id, organizations(name)')
      .eq('id', user.id)
      .single()
    
    if (!userProfile?.organization_id) {
      return NextResponse.json(
        { error: 'No organization found' },
        { status: 400 }
      )
    }
    
    const body = await request.json()
    const { email, fullName, role = 'lawyer' } = body
    
    if (!email || !fullName) {
      return NextResponse.json(
        { error: 'Email and full name required' },
        { status: 400 }
      )
    }
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single()
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }
    
    // Create invite record
    const { data: invite, error: inviteError } = await supabase
      .from('team_invites')
      .insert({
        organization_id: userProfile.organization_id,
        email,
        full_name: fullName,
        role,
        invited_by: user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      })
      .select()
      .single()
    
    if (inviteError) {
      console.error('Invite creation error:', inviteError)
      return NextResponse.json(
        { error: 'Failed to create invite' },
        { status: 500 }
      )
    }
    
    // Send invitation email
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/accept-invite?token=${invite.id}`
    
    try {
      await sendEmail({
        to: email,
        subject: `You've been invited to join ${userProfile.organizations?.name} on LegalOS`,
        html: `
          <h2>You've been invited!</h2>
          <p>Hi ${fullName},</p>
          <p>You've been invited to join <strong>${userProfile.organizations?.name}</strong> on LegalOS.</p>
          <p>Click the link below to accept the invitation:</p>
          <p><a href="${inviteLink}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Accept Invitation</a></p>
          <p>This invitation will expire in 7 days.</p>
          <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          <hr />
          <p style="font-size: 12px; color: #666;">LegalOS - AI-Powered Legal Assistant</p>
        `,
      })
    } catch (emailError) {
      console.error('Email send error:', emailError)
      // Don't fail the request if email fails
    }
    
    return NextResponse.json({
      success: true,
      invite: {
        id: invite.id,
        email: invite.email,
        fullName: invite.full_name,
        role: invite.role,
      },
    })
  } catch (error: any) {
    console.error('Team invite error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/team/invite
 * List pending invites for the organization
 */
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user's organization
    const { data: userProfile } = await supabase
      .from('users')
      .select('organization_id')
      .eq('id', user.id)
      .single()
    
    if (!userProfile?.organization_id) {
      return NextResponse.json(
        { error: 'No organization found' },
        { status: 400 }
      )
    }
    
    // Get pending invites
    const { data: invites, error } = await supabase
      .from('team_invites')
      .select('*, invited_by_user:users!invited_by(full_name, email)')
      .eq('organization_id', userProfile.organization_id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Get invites error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch invites' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ invites })
  } catch (error: any) {
    console.error('Get invites error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

