import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'

export default function Home() {
  const [listings, setListings] = useState([])
  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
    axios.get(`${api}/listings`).then(r => setListings(r.data)).catch(console.error)
  }, [])

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>Instant Rapido — Listings</h1>
      {listings.map(l => (
        <div key={l.id} style={{ borderBottom: '1px solid #ddd', padding: 10 }}>
          <h2>{l.title} — ${(l.price_cents/100).toFixed(2)}</h2>
          <p>{l.description}</p>
          <Link href={`/listing/${l.id}`}><a>View / Book</a></Link>
        </div>
      ))}
    </div>
  )
}
