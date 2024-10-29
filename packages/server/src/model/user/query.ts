import { eq, getTableColumns, sql } from "drizzle-orm"
import { role_table, user, user_role_table } from "~/database"
import { type Image } from "~/database/image/typebox"
import { image_table, session } from "~/database/schema"
import { db } from "~/service/database"

const select_user_role_query = db.$with("select_user_role_query").as(
  db
    .select({
      user_id: user_role_table.user_id,
      role_id: user_role_table.role_id,
      role_name: role_table.name,
    })
    .from(user_role_table)
    .leftJoin(role_table, eq(user_role_table.role_id, role_table.id)),
)

const select_user_avatar_query = db
  .$with("select_user_avatar_query")
  .as(db.select().from(image_table))

export const select_user_query = db.$with("select_user_query").as(
  db
    .with(select_user_role_query, select_user_avatar_query)
    .select({
      ...getTableColumns(user),
      role: sql<string[]>`
        array_agg(${select_user_role_query.role_name})
        filter (where ${select_user_role_query.role_name} is not null)
      `.as("role"),
      avatar: sql<Image | null>`
        json_agg(${select_user_avatar_query})
        filter (where ${select_user_avatar_query} is not null) -> 0
      `.as("avatar"),
    })
    .from(user)
    .leftJoin(
      select_user_role_query,
      eq(user.id, select_user_role_query.user_id),
    )
    .leftJoin(
      select_user_avatar_query,
      eq(user.avatar_id, select_user_avatar_query.id),
    )
    .groupBy(user.id),
)
export const select_user_with_session = db
  .with(select_user_role_query, select_user_avatar_query)
  .select({
    ...getTableColumns(user),
    role: sql<string[]>`
      array_agg(${select_user_role_query.role_name})
      filter (where ${select_user_role_query.role_name} is not null)
    `.as("role"),
    avatar: sql<Image | null>`
      json_agg(${select_user_avatar_query})
      filter (where ${select_user_avatar_query} is not null) -> 0
    `.as("avatar"),
    session: getTableColumns(session),
  })
  .from(user)
  .leftJoin(select_user_role_query, eq(user.id, select_user_role_query.user_id))
  .leftJoin(
    select_user_avatar_query,
    eq(user.avatar_id, select_user_avatar_query.id),
  )
  .leftJoin(session, eq(user.id, session.user_id))
  .groupBy(user.id, session.id)
