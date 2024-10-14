import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json, text/plain, */*",
        Cookie:
          "B=ffe5a4383fa531151b96f993e2586d32; CT=MjgzNjUxNTc3; DL=english; L=hindi; geo=152.58.76.33%2CIN%2CPunjab%2CLudhiana%2C141007; mm_latlong=31.0048%2C75.9463; CH=G03%2CA07%2CO00%2CL03",
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}