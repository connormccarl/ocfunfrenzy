import { NextRequest, NextResponse } from 'next/server';
import { db_getEventById } from '@/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    // get URL id
    const { id } = await params; 
    
    // query database
    const event = await db_getEventById(id);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
}
