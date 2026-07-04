'use client'

import { ReactNode, useState } from 'react'
import { HiOutlineClock, HiOutlineX } from 'react-icons/hi'

type ComingSoonActionProps = {
  children: ReactNode
  title?: string
  message?: string
  className?: string
}

export default function ComingSoonAction({
  children,
  title = 'Coming soon',
  message = 'This feature is not connected to the backend yet. It will be available once the matching API is ready.',
  className,
}: ComingSoonActionProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children}
      </button>

      {open && (
        <div className="coming-soon-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <div
            className="coming-soon-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="coming-soon-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="coming-soon-close"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              <HiOutlineX />
            </button>
            <span className="coming-soon-icon">
              <HiOutlineClock />
            </span>
            <h2 id="coming-soon-title">{title}</h2>
            <p>{message}</p>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}
