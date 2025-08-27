// app/api/auth/google/callback/route.js
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    if (!code) {
      return new Response(JSON.stringify({ error: 'Missing code' }), { status: 400 });
    }

    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${origin}/api/auth/google/callback`;
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenRes.ok) {
      const txt = await tokenRes.text();
      return new Response(JSON.stringify({ error: 'Token exchange failed', details: txt }), { status: 400 });
    }

    const tokenJson = await tokenRes.json();
    const { id_token, access_token } = tokenJson;
    if (!id_token) {
      return new Response(JSON.stringify({ error: 'Missing id_token' }), { status: 400 });
    }

    // Get user info
    const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token || id_token}` }
    });
    if (!userinfoRes.ok) {
      const txt = await userinfoRes.text();
      return new Response(JSON.stringify({ error: 'Failed to fetch userinfo', details: txt }), { status: 400 });
    }

    const profile = await userinfoRes.json();
    const email = (profile.email || '').toLowerCase();
    const name = profile.name || profile.given_name || 'User';
    const googleId = profile.sub;

    if (!email || !googleId) {
      return new Response(JSON.stringify({ error: 'Invalid Google profile' }), { status: 400 });
    }

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        password: crypto.randomUUID(),
        username: `${email.split('@')[0]}_${Math.random().toString(36).slice(2,6)}`,
        googleId
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    // Issue JWT
    const token = await new SignJWT({ userId: user._id.toString() })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret);

    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    // If newly created and missing usernames, onboard GitHub first
    const needsOnboarding = !user.githubUsername;
    const nextUrl = needsOnboarding ? `${origin}/onboarding/github` : `${origin}/`;
    return Response.redirect(nextUrl);
  } catch (e) {
    console.error('Google OAuth callback error:', e);
    return new Response(JSON.stringify({ error: 'OAuth error' }), { status: 500 });
  }
}


