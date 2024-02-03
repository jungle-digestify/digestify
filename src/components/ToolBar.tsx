"use client";

import { type Editor } from "@tiptap/react";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
} from "lucide-react";
import { Toggle } from "./ui/toggle";
import BulletList from "@tiptap/extension-bullet-list";
type Props = {
  editor: Editor | null;
};

export function Toolbar({ editor }: Props) {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-input bg-transparent my-1">
      <Toggle
        size="sm"
        className="data-[state=on]:bg-transparent data-[state=on]:text-slate-50 hover:bg-transparent data-[state=on]:outline outline-white mr-1"
        pressed={editor.isActive("heading")}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 className="h-4 w-4 data-[state=on]:bg-transparent" />
      </Toggle>
      <Toggle
        size="sm"
        className="data-[state=on]:bg-transparent data-[state=on]:text-slate-50 hover:bg-transparent data-[state=on]:outline outline-white mr-1"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4 data-[state=on]:bg-transparent" />
      </Toggle>
      <Toggle
        size="sm"
        className="data-[state=on]:bg-transparent data-[state=on]:text-slate-50 hover:bg-transparent data-[state=on]:outline outline-white mr-1"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        className="data-[state=on]:bg-transparent data-[state=on]:text-slate-50 hover:bg-transparent data-[state=on]:outline outline-white mr-1"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        className="data-[state=on]:bg-transparent data-[state=on]:text-slate-50 hover:bg-transparent data-[state=on]:outline outline-white mr-1"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => {
          editor.chain().focus().toggleBulletList().run();
          BulletList.configure({
            keepMarks: true,
          });
        }}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        className="data-[state=on]:bg-transparent data-[state=on]:text-slate-50 hover:bg-transparent data-[state=on]:outline outline-white mr-1"
        pressed={editor.isActive("orderlist")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
    </div>
  );
}
