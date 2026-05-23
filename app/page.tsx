// app/page.tsx
'use client'; // Tells Next.js this is a client-side component

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [inventory, setInventory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // 1. Fetch the data when the page loads
  const fetchInventory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('inventory')
      .select('*, products(name, price)')
      .eq('product_id', '11111111-1111-1111-1111-111111111111') // Our dummy product ID
      .single();

    if (!error && data) {
      setInventory(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // 2. Handle the checkout button click
  const handleCheckout = async () => {
    setMessage('Processing reservation...');
    
    // We generate a fake User ID for this demo
    const demoUserId = 'user_' + Math.floor(Math.random() * 1000);

    const res = await fetch('/api/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inventoryId: inventory.id,
        userId: demoUserId,
        quantity: 1
      })
    });

    const data = await res.json();

    if (res.ok) {
      setMessage(`✅ Success: ${data.message}`);
      fetchInventory(); // Refresh the stock number on screen
    } else {
      setMessage(`❌ Failed: ${data.error}`);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Store...</div>;

  return (
    <main className="max-w-md mx-auto mt-20 p-6 bg-white border rounded-lg shadow-sm font-sans">
      <h1 className="text-2xl font-bold mb-2">{inventory?.products?.name}</h1>
      <p className="text-gray-600 mb-4">Location: {inventory?.warehouse_location}</p>
      
      <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded">
        <span className="text-xl font-semibold">${inventory?.products?.price}</span>
        <span className={`px-3 py-1 rounded text-sm font-bold ${inventory.available_stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {inventory.available_stock > 0 ? `${inventory.available_stock} Left in Stock` : 'Sold Out'}
        </span>
      </div>

      <button 
        onClick={handleCheckout}
        disabled={inventory.available_stock === 0}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        {inventory.available_stock === 0 ? 'Out of Stock' : 'Checkout & Reserve'}
      </button>

      {message && (
        <div className="mt-4 p-3 bg-gray-100 text-center rounded text-sm font-medium">
          {message}
        </div>
      )}
    </main>
  );
}