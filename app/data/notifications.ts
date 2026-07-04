export type NotificationKind = "cbt" | "reminder" | "group" | "streak" | "material" | "achievement"

export interface Notification {
  id: number
  text: string
  time: string
  kind: NotificationKind
  read: boolean
}

export interface StarredMessage {
  id: number
  sender: string
  course: string
  text: string
  time: string
}

export const notifications: Notification[] = [
  { id: 1, text: "CSC 312 CBT result ready — 88%", time: "2 min ago", kind: "cbt", read: false },
  { id: 2, text: "MTH 201 tutorial starts in 30 min", time: "18 min ago", kind: "reminder", read: false },
  { id: 3, text: "Fatimah B. invited you to STA 211 Sprint", time: "1 hr ago", kind: "group", read: false },
  { id: 4, text: "Your 12-day streak is at risk!", time: "3 hr ago", kind: "streak", read: false },
  { id: 5, text: "New past questions added for CSC 314", time: "5 hr ago", kind: "material", read: false },
  { id: 6, text: "You moved up to #3 on the leaderboard", time: "1 day ago", kind: "achievement", read: false },
  { id: 7, text: "CSC 312 group chat: 24 new messages", time: "2 days ago", kind: "group", read: true },
  { id: 8, text: "Your weekly report is ready", time: "3 days ago", kind: "cbt", read: true },
  { id: 9, text: "PHY 102 practice exam available", time: "4 days ago", kind: "material", read: true },
]

export function getUnreadCount(list: Notification[] = notifications): number {
  return list.filter((n) => !n.read).length
}

export const starredMessages: StarredMessage[] = [
  { id: 1, sender: "Fatimah B.", course: "STA 211 Sprint", text: "Use the z-table row first, then match the second decimal across the columns.", time: "12 min ago" },
  { id: 2, sender: "Tomi A.", course: "CSC 312", text: "Kahn's algorithm questions usually hide the indegree clue in the graph diagram.", time: "38 min ago" },
  { id: 3, sender: "Dr. Salako", course: "MTH 201", text: "Tutorial sheet 4 is the best revision path before Friday's quiz.", time: "1 hr ago" },
  { id: 4, sender: "CSC 300L Squad", course: "CSC 314", text: "Round robin examples: always track the queue after every time quantum.", time: "2 hr ago" },
  { id: 5, sender: "Adewale O.", course: "PHY 102", text: "The optics past question repeats the same sign convention from 2021.", time: "Yesterday" },
  { id: 6, sender: "Mariam K.", course: "ENG 201", text: "For summary writing, keep the original order but remove examples.", time: "2 days ago" },
  { id: 7, sender: "Library Bot", course: "CSC 318", text: "New software engineering notes mention cohesion vs coupling with examples.", time: "3 days ago" },
  { id: 8, sender: "Study Coach", course: "MTH 202", text: "Eigenvalue questions get easier when you test the answer against Av = lambda v.", time: "4 days ago" },
  { id: 9, sender: "Habeeb L.", course: "ACC 201", text: "Don't forget: depreciation method must match the wording in the scenario.", time: "5 days ago" },
]
