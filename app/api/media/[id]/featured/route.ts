// app/api/media/[id]/featured/route.ts
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.NEON_DATABASE_URL!);

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    
    // Get current featured status
    const current = await sql`SELECT featured FROM media WHERE id = ${id}`;
    const newFeatured = !current[0].featured;
    
    // Update featured status
    const result = await sql`
      UPDATE media 
      SET featured = ${newFeatured}
      WHERE id = ${id}
      RETURNING *
    `;
    
    return NextResponse.json({ status: "success", data: result[0] });
  } catch (error) {
    console.error("Error updating featured status:", error);
    return NextResponse.json({ status: "error", message: "Failed to update featured status" }, { status: 500 });
  }
}
