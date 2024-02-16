ALTER TABLE "chats" RENAME COLUMN "user_id" TO "workspace_id";--> statement-breakpoint
ALTER TABLE "chats" DROP CONSTRAINT "chats_user_id_workspace_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "chats_auth_user_id_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chats_auth_user_id_idx" ON "chats" ("workspace_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chats" ADD CONSTRAINT "chats_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
