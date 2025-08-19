// app/api/media/[id]/route.ts
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.NEON_DATABASE_URL!);

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await request.json();
    
    const result = await sql`
      UPDATE media 
      SET 
        type = ${body.type},
        title = ${body.title},
        description = ${body.description},
        poster_url = ${body.poster_url},
        release_date = ${body.release_date},
        language = ${body.language},
        video_links = ${body.video_links},
        seasons = ${body.seasons}
      WHERE id = ${id}
      RETURNING *
    `;
    
    return NextResponse.json({ status: "success", data: result[0] });
  } catch (error) {
    console.error("Error updating media:", error);
    return NextResponse.json({ status: "error", message: "Failed to update media" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    
    await sql`
      DELETE FROM media 
      WHERE id = ${id}
    `;
    
    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json({ status: "error", message: "Failed to delete media" }, { status: 500 });
  }
}
