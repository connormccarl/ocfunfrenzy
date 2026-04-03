import { db } from "@/lib/utils";

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
