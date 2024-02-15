ALTER TABLE "chats" DROP CONSTRAINT "chats_user_id_workspace_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "messages_chat_id_chats_id_fk";
--> statement-breakpoint
ALTER TABLE "userInWorkspace" DROP CONSTRAINT "userInWorkspace_workspaceId_workspace_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chats" ADD CONSTRAINT "chats_user_id_workspace_id_fk" FOREIGN KEY ("user_id") REFERENCES "workspace"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userInWorkspace" ADD CONSTRAINT "userInWorkspace_workspaceId_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
