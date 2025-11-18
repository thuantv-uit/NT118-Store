import { sql } from "../config/database.js";
import { clerkClient } from "../config/clerk.js";

function sanitizeName(user) {
  if (!user) return null;
  if (user.fullName && user.fullName.trim()) {
    return user.fullName.trim();
  }

  const composed = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  if (composed) return composed;

  if (user.username) return user.username;

  const emailAddress = user.primaryEmailAddress?.emailAddress;
  if (emailAddress) return emailAddress;

  return "User";
}

async function fetchClerkUser(userId) {
  if (!clerkClient) {
    const error = new Error("Clerk client is not configured");
    error.status = 500;
    throw error;
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    return {
      id: user.id,
      email:
        user.primaryEmailAddress?.emailAddress ||
        user.emailAddresses?.[0]?.emailAddress ||
        null,
      name: sanitizeName(user),
      avatar_url: user.imageUrl || null,
      first_name: user.firstName || null,
      last_name: user.lastName || null,
    };
  } catch (error) {
    const err = new Error("User not found in Clerk");
    err.status = 404;
    throw err;
  }
}

export async function ensureUserProfile(userId) {
  const existing = await sql`
    SELECT id, email, name, avatar_url
    FROM users
    WHERE id = ${userId}
    LIMIT 1
  `;

  if (existing.length > 0) {
    return existing[0];
  }

  const profile = await fetchClerkUser(userId);
  const [record] = await sql`
    INSERT INTO users (id, email, name, avatar_url, first_name, last_name, avatar)
    VALUES (
      ${profile.id},
      ${profile.email},
      ${profile.name},
      ${profile.avatar_url},
      ${profile.first_name},
      ${profile.last_name},
      ${profile.avatar_url}
    )
    ON CONFLICT (id)
    DO UPDATE SET email = EXCLUDED.email,
                  name = EXCLUDED.name,
                  avatar_url = EXCLUDED.avatar_url,
                  first_name = COALESCE(EXCLUDED.first_name, users.first_name),
                  last_name = COALESCE(EXCLUDED.last_name, users.last_name),
                  avatar = COALESCE(EXCLUDED.avatar, users.avatar)
    RETURNING id, email, name, avatar_url
  `;

  return record;
}

export async function findOrCreateConversation(userId, otherUserId) {
  const existing = await sql`
    SELECT *
    FROM conversations
    WHERE (user1_id = ${userId} AND user2_id = ${otherUserId})
       OR (user1_id = ${otherUserId} AND user2_id = ${userId})
    LIMIT 1
  `;

  if (existing.length > 0) {
    return existing[0];
  }

  const [conversation] = await sql`
    INSERT INTO conversations (user1_id, user2_id)
    VALUES (${userId}, ${otherUserId})
    RETURNING *
  `;
  return conversation;
}

function mapConversationRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    user1Id: row.user1_id,
    user2Id: row.user2_id,
    createdAt: row.created_at,
    otherUser: {
      id: row.other_user_id,
      email: row.other_user_email,
      name: row.other_user_name,
      avatarUrl: row.other_user_avatar_url,
    },
    lastMessage: row.last_message_id
      ? {
          id: row.last_message_id,
          senderId: row.last_message_sender_id,
          content: row.last_message_content,
          imageUrl: row.last_message_image_url,
          createdAt: row.last_message_created_at,
        }
      : null,
    unreadCount: Number(row.unread_count || 0),
  };
}

async function conversationSummaryQuery(userId, extraWhere = sql``) {
  return sql`
    WITH latest_messages AS (
      SELECT DISTINCT ON (conversation_id)
        id,
        conversation_id,
        sender_id,
        content,
        image_url,
        created_at
      FROM messages
      ORDER BY conversation_id, created_at DESC
    ),
    unread_counts AS (
      SELECT conversation_id, COUNT(*) AS unread_count
      FROM messages
      WHERE sender_id <> ${userId} AND is_read = false
      GROUP BY conversation_id
    )
    SELECT
      c.*,
      CASE
        WHEN c.user1_id = ${userId} THEN c.user2_id
        ELSE c.user1_id
      END AS other_user_id,
      u.email AS other_user_email,
      u.name AS other_user_name,
      u.avatar_url AS other_user_avatar_url,
      lm.id AS last_message_id,
      lm.sender_id AS last_message_sender_id,
      lm.content AS last_message_content,
      lm.image_url AS last_message_image_url,
      lm.created_at AS last_message_created_at,
      COALESCE(uc.unread_count, 0) AS unread_count
    FROM conversations c
    JOIN users u
      ON u.id = CASE
        WHEN c.user1_id = ${userId} THEN c.user2_id
        ELSE c.user1_id
      END
    LEFT JOIN latest_messages lm ON lm.conversation_id = c.id
    LEFT JOIN unread_counts uc ON uc.conversation_id = c.id
    WHERE (c.user1_id = ${userId} OR c.user2_id = ${userId})
      ${extraWhere}
    ORDER BY COALESCE(lm.created_at, c.created_at) DESC
  `;
}

export async function getUserConversations(userId) {
  const rows = await conversationSummaryQuery(userId);
  return rows.map(mapConversationRow);
}

export async function getConversationForUser(conversationId, userId) {
  const [row] = await conversationSummaryQuery(
    userId,
    sql`AND c.id = ${conversationId}`
  );
  return mapConversationRow(row);
}

async function ensureConversationParticipant(conversationId, userId) {
  const [conversation] = await sql`
    SELECT *
    FROM conversations
    WHERE id = ${conversationId}
      AND (user1_id = ${userId} OR user2_id = ${userId})
    LIMIT 1
  `;

  if (!conversation) {
    const error = new Error("Conversation not found");
    error.status = 404;
    throw error;
  }

  return conversation;
}

function mapMessageRow(row) {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    content: row.content,
    imageUrl: row.image_url,
    createdAt: row.created_at,
    isRead: row.is_read,
    sender: {
      id: row.sender_id,
      name: row.sender_name,
      avatarUrl: row.sender_avatar_url,
    },
  };
}

export async function getConversationMessages(
  conversationId,
  userId,
  { page = 1, limit = 50 } = {}
) {
  await ensureConversationParticipant(conversationId, userId);

  const pageNumber = Math.max(Number(page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(limit) || 50, 1), 100);
  const offset = (pageNumber - 1) * pageSize;

  const messages = await sql`
    SELECT
      m.*,
      u.name AS sender_name,
      u.avatar_url AS sender_avatar_url
    FROM messages m
    LEFT JOIN users u ON u.id = m.sender_id
    WHERE m.conversation_id = ${conversationId}
    ORDER BY m.created_at ASC
    LIMIT ${pageSize}
    OFFSET ${offset}
  `;

  await sql`
    UPDATE messages
    SET is_read = true
    WHERE conversation_id = ${conversationId}
      AND sender_id <> ${userId}
      AND is_read = false
  `;

  return messages.map(mapMessageRow);
}

export async function createMessage(
  conversationId,
  senderId,
  content,
  imageUrl
) {
  await ensureConversationParticipant(conversationId, senderId);
  await ensureUserProfile(senderId);

  const safeContent =
    typeof content === "string" && content.trim().length > 0
      ? content.trim()
      : null;
  const safeImageUrl =
    typeof imageUrl === "string" && imageUrl.trim().length > 0
      ? imageUrl.trim()
      : null;

  if (!safeContent && !safeImageUrl) {
    const error = new Error("Message content or image is required");
    error.status = 400;
    throw error;
  }

  const [message] = await sql`
    WITH inserted AS (
      INSERT INTO messages (conversation_id, sender_id, content, image_url)
      VALUES (${conversationId}, ${senderId}, ${safeContent}, ${safeImageUrl})
      RETURNING *
    )
    SELECT
      inserted.*,
      u.name AS sender_name,
      u.avatar_url AS sender_avatar_url
    FROM inserted
    LEFT JOIN users u ON u.id = inserted.sender_id
  `;

  return mapMessageRow(message);
}

export async function getSellerByProductId(productId) {
  const [product] = await sql`
    SELECT
      p.id,
      COALESCE(p.seller_id, p.customer_id) AS assigned_seller_id,
      u.first_name,
      u.last_name,
      COALESCE(u.avatar, u.avatar_url) AS avatar
    FROM product p
    LEFT JOIN users u ON u.id = COALESCE(p.seller_id, p.customer_id)
    WHERE p.id = ${productId}
    LIMIT 1
  `;

  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }

  if (!product.assigned_seller_id) {
    const error = new Error("Product does not have an assigned seller");
    error.status = 400;
    throw error;
  }

  return {
    productId: product.id,
    sellerId: product.assigned_seller_id,
    sellerProfile: {
      name: `${product.first_name || ""} ${product.last_name || ""}`.trim(),
      avatar: product.avatar || null,
    },
  };
}
