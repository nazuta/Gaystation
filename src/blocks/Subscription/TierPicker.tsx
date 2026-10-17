'use client'

import React, { useState } from 'react'

type Plan = {
  has: number
  m: number
  name: string
  pop?: boolean
  y: number
}

const PERKS = [
  'Online multiplayer',
  'Monthly games',
  'Cloud saves',
  'Game catalog',
  'Day-one releases',
  'Classics',
  'Game trials',
  'Cloud streaming',
]

const PLANS: Plan[] = [
  { has: 3, m: 9.99, name: 'Essential', y: 89.99 },
  { has: 5, m: 14.99, name: 'Extra', pop: true, y: 134.99 },
  { has: 8, m: 17.99, name: 'Premium', y: 159.99 },
]

// Ports the pricing-tier picker from concept-static/index.html: three tabs sharing
// one tier panel, plus a monthly/yearly billing switch. Prices are placeholders.
export const TierPicker: React.FC = () => {
  const [current, setCurrent] = useState(1)
  const [yearly, setYearly] = useState(false)
  const plan = PLANS[current]

  return (
    <>
      <div className="billing rv" style={{ '--i': 2 } as React.CSSProperties}>
        <span>Monthly</span>
        <button
          aria-checked={yearly}
          aria-label="Bill yearly"
          className="switch"
          onClick={() => setYearly((y) => !y)}
          role="switch"
          type="button"
        />
        <span>Yearly</span>
        <span className="save">Save 25%</span>
      </div>

      <div
        aria-label="Subscription tiers"
        className="seg rv"
        role="tablist"
        style={{ '--i': 2 } as React.CSSProperties}
      >
        <span
          aria-hidden="true"
          className="pill"
          style={{ transform: `translateX(${current * 100}%)` }}
        />
        {PLANS.map((p, i) => (
          <button
            aria-selected={i === current}
            className="tab"
            key={p.name}
            onClick={() => setCurrent(i)}
            role="tab"
            type="button"
          >
            {p.name}
          </button>
        ))}
      </div>

      <div aria-live="polite" className="tier rv" role="tabpanel" style={{ '--i': 3 } as React.CSSProperties}>
        <div className="tier-top">
          <h3>
            <span>{plan.name}</span>
            {plan.pop && <span className="popular">Most popular</span>}
          </h3>
          <p className="price">
            <b>${(yearly ? plan.y : plan.m).toFixed(2)}</b>
            <span>{yearly ? 'per year' : 'per month'}</span>
          </p>
        </div>
        <ul className="perks">
          {PERKS.map((perk, i) => (
            <li className={i < plan.has ? '' : 'off'} key={perk}>
              <svg className="i" viewBox="0 0 24 24">
                {i < plan.has ? <path d="M20 6L9 17l-5-5" /> : <path d="M5 12h14" />}
              </svg>
              {perk}
            </li>
          ))}
        </ul>
        <div className="tier-foot">
          <a className="btn btn-primary" href="#">
            Get {plan.name}
          </a>
          <small>
            {yearly ? `About $${(plan.y / 12).toFixed(2)} a month` : 'Cancel any time'}
          </small>
        </div>
      </div>
    </>
  )
}
