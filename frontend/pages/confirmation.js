import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function Confirmation() {
  const router = useRouter()
  const { bookingId } = router.query
  const [booking, setBooking] = useState(null)
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

  useEffect(() => {
    if (!bookingId) return
    axios.get(`${api}/bookings`).then(r => {
      const b = r.data.find(x => String(x.id) === String(bookingId))
      setBooking(b)
    }).catch(console.error)
  }, [bookingId])

  if (!booking) return <div style={{ padding: 20 }}>Loading confirmation...</div>
  return (
    <div style={{ padding: 20 }}>
      <h1>Booking confirmed</h1>
      <p>Booking #{booking.id} for {booking.name}</p>
      <p>Listing: {booking.listing_title}</p>
      <p>Date: {booking.date}</p>
      <p>Seats: {booking.seats}</p>
    </div>
  )
}
