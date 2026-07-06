'use client'

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { GoBellFill } from "react-icons/go";
import { IoCogSharp } from "react-icons/io5";
import { HiLightningBolt, HiOutlineViewList, HiOutlineX } from "react-icons/hi";
import NotificationPopup from "./NotificationPopup";
import { notifications, getUnreadCount } from "../data/notifications";
import { useAuth } from "../lib/auth-context";
import { useSidebar } from "../lib/sidebar-context";

export default function UserNav() {
  const [showNotifs, setShowNotifs] = useState(false)
  const bellRef = useRef<HTMLAnchorElement>(null)
  const unread = getUnreadCount(notifications)
  const { user, gender } = useAuth()
  const { isOpen, toggle } = useSidebar()
  const avatarSrc = gender === 'female' ? '/female-avatar.svg' : '/male-avatar.svg'

  return (
    <nav className="nav-bar">
      <div className="nav-container">
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="user-nav-icon-btn md:hidden"
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isOpen ? <HiOutlineX className="h-5 w-5" /> : <HiOutlineViewList className="h-5 w-5" />}
          </button>
        </div>

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
            <Image width={36} height={36} src={avatarSrc} alt="Profile" />
          </Link>
          {user && (
            <span className="hidden md:inline text-sm text-[var(--text-mute)] ml-1">
              {user.username}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
