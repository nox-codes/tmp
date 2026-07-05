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
]

export function getUnreadCount(list: Notification[] = notifications): number {
  return list.filter((n) => !n.read).length
}

export const starredMessages: StarredMessage[] = [
]
