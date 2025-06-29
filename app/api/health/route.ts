import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/db/connection';

export async function GET() {
  try {
    // Check database connection
    const isDbConnected = await testConnection();
    
    if (!isDbConnected) {
      return NextResponse.json(
        { 
          status: 'error',
          message: 'Database connection failed'
        },
        { status: 500 }
      );
    }

    // Check environment variables
    const requiredEnvVars = [
      'DATABASE_URL',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];

    const missingEnvVars = requiredEnvVars.filter(
      envVar => !process.env[envVar]
    );

    if (missingEnvVars.length > 0) {
      return NextResponse.json(
        { 
          status: 'error',
          message: 'Missing environment variables',
          missing: missingEnvVars
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'ok',
      message: 'All systems operational',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });

  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
