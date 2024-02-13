"use client";

import { type Editor } from "@tiptap/react";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
  ListIcon,
  Heading2Icon,
  Heading1Icon,
  PenBoxIcon,
} from "lucide-react";
import { Toggle } from "./ui/toggle";
import BulletList from "@tiptap/extension-bullet-list";

//shadcn
import {
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Props = {
  editor: Editor | null;
};

export function Toolbar({ editor }: Props) {
  if (!editor) {
    return null;
  }

  return (
    // <div className="border-input bg-transparent my-1">
    <ToggleGroup type="multiple" variant="outline">
      <ToggleGroupItem
        value="heading"
        aria-label="Toggle heading"
        size="sm"
        // className=" hover:bg-slate-100 data-[state=on]:outline outline-black outline-1 mr-2"
        // pressed={editor.isActive("heading")}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2Icon className="h-4 w-4" />
        {/* <Heading2 className="h-4 w-4 data-[state=on]:bg-transparent" /> */}
      </ToggleGroupItem>
      <ToggleGroupItem
        value="bold"
        aria-label="Toggle bold"
        size="sm"
        // className="data-[state=on]:bg-transparent data-[state=on]:text-slate-50 hover:bg-transparent data-[state=on]:outline outline-white mr-1"
        // pressed={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <FontBoldIcon className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="italic"
        aria-label="Toggle italic"
        size="sm"
        // className="data-[state=on]:bg-transparent data-[state=on]:text-slate-50 hover:bg-transparent data-[state=on]:outline outline-white mr-1"
        // pressed={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <FontItalicIcon className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="strikethrough"
        aria-label="Toggle strikethrough"
        size="sm"
        // className="data-[state=on]:bg-transparent data-[state=on]:text-slate-50 hover:bg-transparent data-[state=on]:outline outline-white mr-1"
        // pressed={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="bulletList"
        aria-label="Toggle bulletList"
        size="sm"
        // className="data-[state=on]:bg-transparent data-[state=on]:text-slate-50 hover:bg-transparent data-[state=on]:outline outline-white mr-1"
        // pressed={editor.isActive("bulletList")}
        onClick={() => {
          editor.chain().focus().toggleBulletList().run();
          BulletList.configure({
            keepMarks: true,
          });
        }}
      >
        <ListIcon className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="listOrdered"
        size="sm"
        // className="data-[state=on]:bg-transparent data-[state=on]:text-slate-50 hover:bg-transparent data-[state=on]:outline outline-white mr-1"

        // pressed={editor.isActive("orderlist")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>

    // </div>
  );
}
