import { isEqual } from "lodash"
import { toJS } from "mobx"
import { useMobxSelector } from "./useMobxSelector"
import { usePianoRoll } from "./usePianoRoll"
import { useTrack } from "./useTrack"

export function useEventList() {
  const { selectedTrackId, selectedNoteIds } = usePianoRoll()
  const { events: trackEvents } = useTrack(selectedTrackId)
  const events = useMobxSelector(
    () => {
      if (selectedNoteIds.length > 0) {
        return trackEvents.filter(
          (event) => selectedNoteIds.indexOf(event.id) >= 0,
        )
      }
      return toJS(trackEvents)
    },
    [trackEvents, selectedNoteIds],
    isEqual,
  )

  return {
    events,
  }
}
