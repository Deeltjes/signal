import { FC } from "react"
import {
  useCopyTempoSelection,
  useDeleteTempoSelection,
  useDuplicateTempoSelection,
  usePasteTempoSelection,
  useResetTempoSelection,
} from "../../actions/tempo"
import { TempoEventsClipboardDataSchema } from "../../clipboard/clipboardTypes"
import { useTempoEditor } from "../../hooks/useTempoEditor"
import { readClipboardData } from "../../services/Clipboard"
import { KeyboardShortcut } from "./KeyboardShortcut"
import { isFocusable } from "./isFocusable"

export const TempoEditorKeyboardShortcut: FC = () => {
  const { setMouseMode } = useTempoEditor()
  const resetTempoSelection = useResetTempoSelection()
  const deleteTempoSelection = useDeleteTempoSelection()
  const copyTempoSelection = useCopyTempoSelection()
  const duplicateTempoSelection = useDuplicateTempoSelection()
  const pasteTempoSelection = usePasteTempoSelection()

  return (
    <KeyboardShortcut
      actions={[
        {
          code: "Digit1",
          run: () => setMouseMode("pencil"),
        },
        {
          code: "Digit2",
          run: () => setMouseMode("selection"),
        },
        { code: "Escape", run: resetTempoSelection },
        { code: "Backspace", run: deleteTempoSelection },
        { code: "Delete", run: deleteTempoSelection },
        {
          code: "KeyC",
          metaKey: true,
          run: () => copyTempoSelection(),
        },
        {
          code: "KeyX",
          metaKey: true,
          run: () => {
            {
              copyTempoSelection()
              deleteTempoSelection()
            }
          },
        },
        {
          code: "KeyD",
          metaKey: true,
          run: duplicateTempoSelection,
        },
      ]}
      onPaste={async (e) => {
        if (e.target !== null && isFocusable(e.target)) {
          return
        }

        const obj = await readClipboardData()
        const { data } = TempoEventsClipboardDataSchema.safeParse(obj)

        if (!data) {
          return
        }

        pasteTempoSelection()
      }}
    />
  )
}
