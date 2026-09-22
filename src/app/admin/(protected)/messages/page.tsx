import { desc } from "drizzle-orm";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { MessagesView } from "@/components/admin/MessagesView";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const rows = await db.select().from(messages).orderBy(desc(messages.createdAt)).limit(200);
  return (
    <MessagesView
      initial={rows.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        subject: m.subject,
        message: m.message,
        read: m.read,
        createdAt: m.createdAt.toISOString(),
      }))}
    />
  );
}
