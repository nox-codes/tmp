'use client'

import Link from "next/link"
import { useEffect, useRef } from "react"
import { HiOutlineDocumentText, HiOutlineClock, HiOutlineUserGroup, HiOutlineFire, HiOutlineBookOpen, HiOutlineStar } from "react-icons/hi"
import { notifications, getUnreadCount } from "../data/notifications"

const kindConfig: Record<string, { Icon: React.ComponentType<{ className?: string }>, tone: string }> = {
  cbt:         { Icon: HiOutlineDocumentText, tone: "teal" },
  reminder:    { Icon: HiOutlineClock,        tone: "amber" },
  group:       { Icon: HiOutlineUserGroup,    tone: "violet" },
  streak:      { Icon: HiOutlineFire,         tone: "rose" },
  material:    { Icon: HiOutlineBookOpen,     tone: "blue" },
  achievement: { Icon: HiOutlineStar,         tone: "amber" },
}

export default function NotificationPopup({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const recent = notifications.slice(0, 6)
  const unread = getUnreadCount(notifications)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="notification-popup"
    >
      <div className="notification-popup-head">
        <p className="notification-popup-title">Notifications</p>
        <span className="notification-popup-count">{unread} new</span>
      </div>
      <ul className="notification-popup-list">
        {recent.map((n) => {
          const { Icon, tone } = kindConfig[n.kind]
          return (
            <li key={n.id} className={`notification-popup-row ${!n.read ? "notification-popup-row-unread" : ""}`}>
              <span className={`notification-popup-icon notification-icon-${tone}`}>
                <Icon className="notification-popup-icon-svg" />
              </span>
              <div className="notification-popup-copy">
                <p className="notification-popup-text">{n.text}</p>
                <p className="notification-popup-time">{n.time}</p>
              </div>
              {!n.read && <span className="notification-popup-dot" />}
            </li>
          )
        })}
      </ul>
      <div className="notification-popup-foot">
        <Link
          href="/notifications"
          onClick={onClose}
          className="notification-popup-link"
        >
          See all notifications
        </Link>
      </div>
    </div>
  )
}
