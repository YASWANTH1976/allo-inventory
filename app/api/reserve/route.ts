// app/api/reserve/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Client } from "@upstash/qstash";

// Initialize the Upstash client
const qstashClient = new Client({ token: process.env.QSTASH_TOKEN! });

export async function POST(request: Request) {
  try {
    const { inventoryId, userId, quantity } = await request.json();

    // Call our secure Postgres function. It handles the locks and math safely.
    const { data: success, error } = await supabase.rpc('reserve_stock', {
      p_inv_id: inventoryId,
      p_user_id: userId,
      p_qty: quantity
    });

    if (error) throw error;

    if (success) {
      return NextResponse.json({ message: 'Reservation successful. You have 10 minutes to pay.' });
    } else {
      // If success is false, it means the SQL function saw available_stock was 0
      return NextResponse.json({ error: 'Out of stock! Someone else grabbed it.' }, { status: 400 });
    }

  } catch (error) {
    console.error("Reservation Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}