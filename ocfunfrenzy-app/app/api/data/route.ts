import { NextRequest, NextResponse } from 'next/server';

import { isDate } from '@connormccarl/nextos/lib'

import { Search_Event } from '@/prisma'
import { getDropdownOptions, getEvents } from '@/prisma';

const validateNum = (value: string | null) => {
  // null value
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  // check if it's a valid number
  const parsed = Number(value);
  return Number.isNaN(parsed) || parsed < 0 ? undefined : parsed;
}

const validateJSON = (data: Record<string, string | number>) => {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      if(isDate(value))
        return [key, new Date(value)];
      return [key, value === "" ? null : value];
    })
  );
}

export async function GET(request: NextRequest) {
  try {
    const searchOptions = await getDropdownOptions();
    return NextResponse.json(searchOptions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get search options' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // get JSON body
  const data: Search_Event = validateJSON(await request.json());

  // get search parameters
  /*const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  */
  
  // get all events and filter dropdown options
  try {
    const events = await getEvents({
        keywords: data.keywords ?? undefined,
        location: data.location ?? undefined,
        start_date: data.start_date ?? undefined,
        end_date: data.end_date ?? undefined,
        category: data.category ?? undefined,
        type: data.type ?? undefined,
        page: data.page ?? undefined,
        pageSize: data.pageSize ?? undefined,
      });
  
    return NextResponse.json({
      ...events,
      page: data.page ?? 1,
      pageSize: data.pageSize ?? 10,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get events' }, { status: 500 });
  }
}
