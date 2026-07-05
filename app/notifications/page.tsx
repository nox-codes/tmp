'use client'

import { useState } from "react"
import { HiOutlineDocumentText, HiOutlineClock, HiOutlineUserGroup, HiOutlineFire, HiOutlineBookOpen, HiOutlineStar } from "react-icons/hi"
import { notifications, getUnreadCount, starredMessages } from "../data/notifications"

const kindConfig: Record<string, { Icon: React.ComponentType<{ className?: string }>, tone: string }> = {
  cbt:         { Icon: HiOutlineDocumentText, tone: "teal" },
  reminder:    { Icon: HiOutlineClock,        tone: "amber" },
  group:       { Icon: HiOutlineUserGroup,    tone: "violet" },
  streak:      { Icon: HiOutlineFire,         tone: "rose" },
  material:    { Icon: HiOutlineBookOpen,     tone: "blue" },
  achievement: { Icon: HiOutlineStar,         tone: "amber" },
}

export default function NotificationsPage() {
  const unread = getUnreadCount(notifications)
  const [visibleStarred, setVisibleStarred] = useState(5)
  const visibleMessages = starredMessages.slice(0, visibleStarred)
  const hasMoreStarred = visibleStarred < starredMessages.length

  return (
    <div className="dash">
      <div className="dash-welcome">
        <div>
          <h1 className="dash-welcome-title display">Notifications</h1>
          <p className="dash-welcome-sub">{notifications.length === 0 ? "You're all caught up" : `${unread} unread · ${notifications.length} total`}</p>
        </div>
      </div>

      <div className="notifications-layout">
        <section className="notifications-panel" aria-label="Notifications inbox">
          <div className="notifications-panel-head">
            <div>
              <h2 className="notifications-panel-title">Inbox</h2>
              <p className="notifications-panel-sub">Latest academic alerts and study updates</p>
            </div>
            <span className="notifications-count">{unread} unread</span>
          </div>

          {notifications.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-[var(--text-mute)] text-base">No notifications yet.</p>
              <p className="text-[var(--text-faint)] text-sm mt-2">You&apos;ll see updates here when there&apos;s activity.</p>
            </div>
          ) : (
            <ul className="notifications-list">
              {notifications.map((n) => {
                const { Icon, tone } = kindConfig[n.kind]
                return (
                  <li
                    key={n.id}
                    className={`notification-row ${!n.read ? "notification-row-unread" : ""}`}
                  >
                    <span className={`notification-icon notification-icon-${tone}`}>
                      <Icon className="notification-icon-svg" />
                    </span>

                    <div className="notification-copy">
                      <p className="notification-title">{n.text}</p>
                      <p className="notification-time">{n.time}</p>
                    </div>

                    {!n.read && <span className="notification-dot" aria-label="Unread" />}
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <aside className="starred-messages-panel" aria-label="Starred messages">
          <div className="starred-messages-head">
            <span className="starred-messages-icon">
              <HiOutlineStar />
            </span>
            <div>
              <h2 className="starred-messages-title">Starred messages</h2>
              <p className="starred-messages-sub">Pinned notes from chats and study groups</p>
            </div>
          </div>

          {starredMessages.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-[var(--text-mute)] text-sm">No starred messages yet.</p>
            </div>
          ) : (
            <ul className="starred-messages-list">
              {visibleMessages.map((message) => (
                <li key={message.id} className="starred-message-card">
                  <div className="starred-message-meta">
                    <span>{message.sender}</span>
                    <span>{message.time}</span>
                  </div>
                  <p className="starred-message-text">{message.text}</p>
                  <p className="starred-message-course">{message.course}</p>
                </li>
              ))}
            </ul>
          )}

          {starredMessages.length > 0 && hasMoreStarred && (
            <button
              type="button"
              className="starred-see-more"
              onClick={() => setVisibleStarred((count) => Math.min(count + 4, starredMessages.length))}
            >
              See more
            </button>
          )}
        </aside>
      </div>
    </div>
  )
}
