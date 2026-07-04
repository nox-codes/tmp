'use client'

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { GoBellFill } from "react-icons/go";
import { IoCogSharp } from "react-icons/io5";
import { HiLightningBolt } from "react-icons/hi";
import NotificationPopup from "./NotificationPopup";
import { notifications, getUnreadCount } from "../data/notifications";

export default function UserNav() {
  const [showNotifs, setShowNotifs] = useState(false)
  const bellRef = useRef<HTMLAnchorElement>(null)
  const unread = getUnreadCount(notifications)

  return (
    <nav className="nav-bar">
      <div className="nav-container">
        <Link href="/dashboard" className="nav__logo">
          <Image width={32} height={32} src="/logo-nobg.png" alt="UniLock" />
          <span className="nav__logo-text">UniLock</span>
        </Link>

        <div className="user-nav-search">
          <input placeholder="Search courses, materials, past questions..." />
        </div>

        <div className="nav__actions">
          <Link className="btn btn-primary btn-sm" href="/cbt">
            <HiLightningBolt />
            <span className="hidden sm:inline">Study Mode</span>
          </Link>
          <div className="relative">
            <Link
              ref={bellRef}
              className="user-nav-icon-btn"
              href="#"
              aria-label="Notifications"
              onClick={(e) => { e.preventDefault(); setShowNotifs(!showNotifs) }}
            >
              <GoBellFill />
              {unread > 0 && <span className="user-nav-dot" />}
            </Link>
            {showNotifs && <NotificationPopup onClose={() => setShowNotifs(false)} />}
          </div>
          <Link className="user-nav-icon-btn" href="/settings" aria-label="Settings">
            <IoCogSharp />
          </Link>
          <Link className="user-nav-avatar" href="/profile" aria-label="Profile">
            <Image width={36} height={36} src="/male-avatar.svg" alt="Profile" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
