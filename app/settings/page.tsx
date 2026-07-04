'use client'

import { useState } from "react"
import { useTheme } from "next-themes"
import {
  HiOutlineUser,
  HiOutlineBell,
  HiOutlineCreditCard,
  HiOutlineShieldCheck,
  HiOutlineGlobe,
  HiOutlineLogout,
} from "react-icons/hi"
import ComingSoonAction from "../componenets/ComingSoonAction"

const sections = [
  { id: "account",  label: "Account",        Icon: HiOutlineUser },
  { id: "notifs",   label: "Notifications",  Icon: HiOutlineBell },
  { id: "billing",  label: "Billing",        Icon: HiOutlineCreditCard },
  { id: "security", label: "Security",       Icon: HiOutlineShieldCheck },
  { id: "prefs",    label: "Preferences",    Icon: HiOutlineGlobe },
]

export default function Settings() {
  const [active, setActive] = useState("account")
  const { theme, setTheme } = useTheme()

  return (
    <div className="dash">
      <div className="dash-welcome">
        <div>
          <h1 className="dash-welcome-title display">Settings</h1>
          <p className="dash-welcome-sub">Manage your account, billing and preferences.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="w-full lg:w-64 shrink-0">
          <nav className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elev-1)] p-3">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`w-full flex items-center gap-4 rounded-xl px-5 py-4 text-sm font-medium transition-all duration-200 cursor-pointer ${
                  active === s.id 
                    ? "bg-[var(--accent-soft)] text-[var(--accent)] shadow-sm" 
                    : "text-[var(--text-mute)] hover:text-[var(--text)] hover:bg-white/[0.04]"
                }`}
              >
                <s.Icon className="h-5 w-5 shrink-0" /> {s.label}
              </button>
            ))}
            <div className="my-4 h-px bg-[var(--line)] mx-2" />
            <ComingSoonAction className="w-full flex items-center gap-4 rounded-xl px-5 py-4 text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer" title="Log out">
              <HiOutlineLogout className="h-5 w-5 shrink-0" /> Log out
            </ComingSoonAction>
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elev-1)] p-8 md:p-12 lg:p-16">
            {active === "account" && (
              <div className="space-y-16">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-[var(--text)]">Account</h2>
                  <p className="text-base text-[var(--text-mute)]">Public info and basics</p>
                </div>
                <div className="grid gap-10 sm:grid-cols-2">
                  <div className="auth-field">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] mb-2 block">First name</label>
                    <input type="text" defaultValue="Nox" className="h-12" />
                  </div>
                  <div className="auth-field">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] mb-2 block">Last name</label>
                    <input type="text" defaultValue="Adekunle" className="h-12" />
                  </div>
                  <div className="auth-field">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] mb-2 block">Email</label>
                    <input type="email" defaultValue="nox@unilag.edu.ng" className="h-12" />
                  </div>
                  <div className="auth-field">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] mb-2 block">Matric number</label>
                    <input type="text" defaultValue="219024050" className="h-12" />
                  </div>
                </div>
                <div className="flex gap-4 pt-6">
                  <ComingSoonAction className="btn btn-primary px-10 py-4 text-base" title="Account settings">Save changes</ComingSoonAction>
                  <ComingSoonAction className="btn btn-secondary px-10 py-4 text-base" title="Account settings">Cancel</ComingSoonAction>
                </div>
              </div>
            )}

            {active === "notifs" && (
              <div className="space-y-16">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-[var(--text)]">Notifications</h2>
                  <p className="text-base text-[var(--text-mute)]">Choose what we email you about</p>
                </div>
                <div className="space-y-8">
                  {[
                    ["Daily study reminders", true],
                    ["Streak in danger alerts", true],
                    ["New course materials", false],
                    ["Group activity", true],
                    ["Weekly performance report", true],
                    ["Product updates", false],
                  ].map(([label, on]) => (
                    <label key={label as string} className="flex items-center justify-between gap-8 cursor-pointer group py-2">
                      <span className="text-lg text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">{label}</span>
                      <input
                        type="checkbox"
                        defaultChecked={on as boolean}
                        className="h-6 w-6 rounded-lg border-[var(--line-strong)] bg-[var(--bg-elev-2)] text-[var(--accent)] focus:ring-[var(--accent)]/30 cursor-pointer transition-all"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {active === "billing" && (
              <div className="space-y-16">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-[var(--text)]">Billing</h2>
                  <p className="text-base text-[var(--text-mute)]">Plan and payment</p>
                </div>
                <div className="rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] p-10 space-y-8">
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">Current plan</p>
                    <p className="text-3xl font-bold text-[var(--text)]">Essentials · ₦2,500/mo</p>
                    <p className="text-base text-[var(--text-mute)]">Renews on March 14</p>
                  </div>
                  <div className="flex gap-4">
                    <ComingSoonAction className="btn btn-primary px-10 py-4 text-base" title="Billing settings">Upgrade to Pro</ComingSoonAction>
                    <ComingSoonAction className="btn btn-secondary px-10 py-4 text-base" title="Billing settings">Cancel</ComingSoonAction>
                  </div>
                </div>
                <div className="space-y-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-faint)]">Payment method</p>
                  <div className="flex items-center justify-between py-8 border-b border-[var(--line)]">
                    <span className="text-lg text-[var(--text)]">Visa ending in •••• 4242</span>
                    <ComingSoonAction className="text-sm font-semibold text-[var(--accent)] hover:brightness-110 transition-colors cursor-pointer" title="Payment method">
                      Update
                    </ComingSoonAction>
                  </div>
                </div>
              </div>
            )}

            {active === "security" && (
              <div className="space-y-16">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-[var(--text)]">Security</h2>
                  <p className="text-base text-[var(--text-mute)]">Password and devices</p>
                </div>
                <div className="space-y-10">
                  <div className="auth-field">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] mb-2 block">Current password</label>
                    <input type="password" placeholder="Enter current password" className="h-12" />
                  </div>
                  <div className="auth-field">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] mb-2 block">New password</label>
                    <input type="password" placeholder="Enter new password" className="h-12" />
                  </div>
                  <ComingSoonAction className="btn btn-primary px-10 py-4 text-base" title="Password update">
                    Update password
                  </ComingSoonAction>
                </div>
                <div className="pt-12 border-t border-[var(--line)] space-y-10">
                  <div className="space-y-3">
                    <p className="text-lg font-medium text-[var(--text)]">Two-factor authentication</p>
                    <p className="text-base text-[var(--text-mute)]">Recommended for keeping your account secure.</p>
                  </div>
                  <ComingSoonAction className="btn btn-secondary px-10 py-4 text-base" title="Two-factor authentication">
                    Enable 2FA
                  </ComingSoonAction>
                </div>
              </div>
            )}

            {active === "prefs" && (
              <div className="space-y-16">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-[var(--text)]">Preferences</h2>
                  <p className="text-base text-[var(--text-mute)]">Make UniLock yours</p>
                </div>
                <div className="space-y-10 max-w-md">
                  <div className="auth-field">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] mb-2 block">Theme</label>
                    <select value={theme} onChange={(e) => setTheme(e.target.value)} className="h-12">
                      <option value="system">System</option>
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                    </select>
                    <p className="text-sm text-[var(--text-faint)] mt-3">Default: matches your system settings</p>
                  </div>
                  <div className="auth-field">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] mb-2 block">Timezone</label>
                    <select defaultValue="wat" className="h-12">
                      <option value="wat">West Africa Time (WAT)</option>
                      <option value="utc">UTC</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
