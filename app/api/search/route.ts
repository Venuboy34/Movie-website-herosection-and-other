// app/api/search/route.ts
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.NEON_DATABASE_URL!);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ status: "error", message: "Missing query parameter" }, { status: 400 });
    }
    
    const result = await sql`
      SELECT * 
      FROM media 
      WHERE title ILIKE ${'%' + query + '%'} 
         OR description ILIKE ${'%' + query + '%'}
    `;
    
    return NextResponse.json({ status: "success", results: result });
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json({ status: "error", message: "Failed to search" }, { status: 500 });
  }
}
