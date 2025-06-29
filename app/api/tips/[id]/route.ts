import { NextRequest, NextResponse } from 'next/server';
import { TipsService } from '@/lib/services/tips';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || undefined;

    const tip = await TipsService.getTipById(params.id, userId);

    if (!tip) {
      return NextResponse.json(
        { error: 'Tip not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(tip);
  } catch (error) {
    console.error('Error fetching tip:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tip' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const success = await TipsService.deleteTip(params.id, userId);

    if (!success) {
      return NextResponse.json(
        { error: 'Tip not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tip:', error);
    return NextResponse.json(
      { error: 'Failed to delete tip' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { userId, ...updates } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const updatedTip = await TipsService.updateTip(params.id, userId, updates);

    if (!updatedTip) {
      return NextResponse.json(
        { error: 'Tip not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTip);
  } catch (error) {
    console.error('Error updating tip:', error);
    return NextResponse.json(
      { error: 'Failed to update tip' },
      { status: 500 }
    );
  }
}
