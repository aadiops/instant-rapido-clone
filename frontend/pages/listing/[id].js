import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function ListingPage() {
  const router = useRouter()
  const { id } = router.query
  const [listing, setListing] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', date: '', seats: 1 })
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

  useEffect(() => {
    if (!id) return
    axios.get(`${api}/listings/${id}`).then(r => setListing(r.data)).catch(console.error)
  }, [id])

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${api}/bookings`, { listing_id: id, ...form })
      router.push(`/confirmation?bookingId=${res.data.id}`)
    } catch (err) {
      alert('Booking failed: ' + (err.response?.data?.error || err.message))
    }
  }

  if (!listing) return <div style={{ padding: 20 }}>Loading...</div>
  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>{listing.title}</h1>
      <p>{listing.description}</p>
      <p>Price: ${(listing.price_cents/100).toFixed(2)}</p>

      <form onSubmit={submit} style={{ marginTop: 20 }}>
        <div>
          <label>Name</label><br/>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label>Email</label><br/>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <label>Date</label><br/>
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
        </div>
        <div>
          <label>Seats</label><br/>
          <input type="number" min="1" value={form.seats} onChange={e => setForm({ ...form, seats: Number(e.target.value) })} />
        </div>
        <button type="submit" style={{ marginTop: 10 }}>Book now</button>
      </form>
    </div>
  )
}
