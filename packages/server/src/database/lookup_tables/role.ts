export const USER_ROLE_ARRAY = ["Admin", "Moderator", "User"] as const

export const USER_ROLE = {
  Admin: { id: 1, name: "Admin" },
  Moderator: { id: 2, name: "Moderator" },
  User: { id: 3, name: "User" },
} as const
