import { useState } from 'react'
import PhoneIcon from '../components/PhoneIcon'
import Dots from '../components/Dots'
import { mapsUrlFor, telHref } from '../data'
import { fmtDateTime, initialsOf } from '../api'
import type { RideScheduleResponse } from '../api'

/* P3 · Booking — seats are not assigned; you book a number of places
   in the car and sit where is free (per user decision). */
export default function BookingScreen({
  schedule,
  maxPassengers,
  requesting,
  error,
  onBack,
  onRequest,
}: {
  schedule: RideScheduleResponse
  maxPassengers: number
  requesting: boolean
  error: string | null
  onBack: () => void
  onRequest: (passengerCount: number, luggageCount: number) => void
}) {
  const [count, setCount] = useState(1)
  const [bags, setBags] = useState(1)

  const driver = schedule.driver
  const vehicle = driver.vehicle
  const total = schedule.fareAmount * count
  const filled = Number(schedule.approvedPassengerCount)
  const capacity = Number(schedule.maxPassengerCount)

  return (
    <div className="screen has-bottom-bar">
      <div className="top-bar">
        <button className="back-btn" onClick={onBack} aria-label="Back">
          ‹
        </button>
        <div className="top-bar-title">
          <strong>Book your places</strong>
        </div>
      </div>

      <div className="driver-row">
        <span className="avatar lg">{initialsOf(driver.name)}</span>
        <div>
          <strong>{driver.name}</strong>
          <span>
            {vehicle
              ? `${vehicle.manufacturer ?? ''} ${vehicle.modelName} · ${vehicle.licensePlate}`.trim()
              : 'Car'}
          </span>
          <span className="phone-line">{driver.driverPhone}</span>
        </div>
        <a
          className="call-btn"
          href={telHref(driver.driverPhone)}
          aria-label="Call driver"
        >
          <PhoneIcon />
        </a>
      </div>

      <div className="card seat-card">
        <div className="seat-status-head">
          <strong>{fmtDateTime(schedule.meetingAt)}</strong>
          <span className="pill-teal">
            {filled}/{capacity} filled
          </span>
        </div>
        <div className="ride-fill">
          <Dots filled={filled} total={capacity} />
          <span>
            {schedule.remainingPassengerCount} place
            {schedule.remainingPassengerCount === 1 ? '' : 's'} left
          </span>
        </div>
        <div className="legend">
          <span>Seats are not assigned — sit where is free.</span>
        </div>
      </div>

      <div className="card stepper-card">
        <div className="stepper-labels">
          <strong>Passengers</strong>
          <span>{schedule.fareAmount} TJS each</span>
        </div>
        <div className="stepper">
          <button
            className="step-btn"
            onClick={() => setCount((c) => Math.max(1, c - 1))}
            aria-label="Fewer passengers"
          >
            −
          </button>
          <strong className="step-value">{count}</strong>
          <button
            className="step-btn primary"
            onClick={() => setCount((c) => Math.min(maxPassengers, c + 1))}
            aria-label="More passengers"
          >
            +
          </button>
        </div>
      </div>

      <div className="card stepper-card">
        <div className="stepper-labels">
          <strong>Bags</strong>
          <span>Luggage</span>
        </div>
        <div className="stepper">
          <button
            className="step-btn"
            onClick={() => setBags((b) => Math.max(0, b - 1))}
            aria-label="Fewer bags"
          >
            −
          </button>
          <strong className="step-value">{bags}</strong>
          <button
            className="step-btn primary"
            onClick={() => setBags((b) => Math.min(8, b + 1))}
            aria-label="More bags"
          >
            +
          </button>
        </div>
      </div>

      <div className="card meet-card">
        <div className="map-thumb" aria-hidden="true">
          <span className="map-pin" />
        </div>
        <div className="meet-info">
          <span className="field-label">Meeting point</span>
          <strong>{schedule.meetingPlaceName ?? schedule.meetingAddress}</strong>
          <a
            href={mapsUrlFor(schedule.meetingAddress)}
            target="_blank"
            rel="noreferrer"
          >
            Open in Google Maps ↗
          </a>
        </div>
      </div>

      {error && (
        <p className="footer-note strong">
          Request failed: <span className="muted">{error}</span>
        </p>
      )}

      <div className="bottom-bar">
        <div className="bottom-price">
          <span>
            {count} place{count > 1 ? 's' : ''}
          </span>
          <strong>{total} TJS · cash</strong>
        </div>
        <button
          className="cta compact"
          disabled={requesting}
          onClick={() => onRequest(count, bags)}
        >
          {requesting ? 'Sending…' : 'Request places'}
        </button>
      </div>
    </div>
  )
}
