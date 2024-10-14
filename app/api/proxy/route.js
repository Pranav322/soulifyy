import { NextResponse } from 'next/server';

export async function GET(request) {
  console.log('Incoming request URL:', request.url);
  console.log('Incoming request headers:', JSON.stringify(request.headers, null, 2));

  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  console.log('Requested URL:', url);

  if (!url) {
    console.log('Error: URL is required');
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    console.log('Fetching data from:', url);
    const response = await fetch(url, {
      headers: {
        Accept: "application/json, text/plain, */*",
        Cookie:
          "B=ffe5a4383fa531151b96f993e2586d32; CT=MjgzNjUxNTc3; DL=english; L=hindi; geo=152.58.76.33%2CIN%2CPunjab%2CLudhiana%2C141007; mm_latlong=31.0048%2C75.9463; CH=G03%2CA07%2CO00%2CL03",
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', JSON.stringify(Object.fromEntries(response.headers), null, 2));

    const data = await response.json();
    console.log('Response data preview:', JSON.stringify(data).substring(0, 200) + '...');

    // Log the number of results if it's a search query
    if (data.results) {
      console.log('Number of results:', data.results.length);
      console.log('First few result titles:', data.results.slice(0, 5).map(r => r.title));
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in proxy:', error);
    return NextResponse.json({ error: 'Failed to fetch data', details: error.message }, { status: 500 });
  }
}