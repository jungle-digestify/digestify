"use client"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Heading from "@tiptap/extension-heading"
import { Toolbar } from "@/components/ToolBar"

export default function Tiptap({
    description,
    onChange,
    id,
}: {
    description:string
    onChange: (richText:string) => void
    id: string
}) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({}),
            Heading.configure({
                HTMLAttributes: {
                    class: "text-xl font-bold",
                    levels: [2]
                }
            })
        ],
        content: description,
        editorProps: {
            attributes: {
                class:
                "rounded-md border min-h-[150px] border-input bg-back "
            },
        },
        onUpdate({editor}) {
            onChange(editor.getHTML())
            console.log(editor.getHTML())
        },
    })

    return (
        <div className="flex flex-col justify-stretch ">
            <Toolbar editor={editor} />
            <EditorContent id={"markdownHolder "+id} editor={editor}/>
        </div>
    )
}