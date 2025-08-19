// app/api/media/route.ts
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.NEON_DATABASE_URL!);

export async function GET() {
  try {
    const result = await sql`SELECT * FROM media`;
    return NextResponse.json({ status: "success", data: result });
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json({ status: "error", message: "Failed to fetch media" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, title, description, poster_url, release_date, language, video_links, seasons } = body;
    
    const result = await sql`
      INSERT INTO media (type, title, description, poster_url, release_date, language, video_links, seasons)
      VALUES (${type}, ${title}, ${description}, ${poster_url}, ${release_date}, ${language}, ${video_links}, ${seasons})
      RETURNING *
    `;
    
    return NextResponse.json({ status: "success", data: result[0] });
  } catch (error) {
    console.error("Error adding media:", error);
    return NextResponse.json({ status: "error", message: "Failed to add media" }, { status: 500 });
  }
}
