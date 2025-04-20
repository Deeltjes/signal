import { useMemo } from "react"
import { Range } from "../entities/geometry/Range"
import { isEventOverlapRange } from "../helpers/filterEvents"
import { isNoteEvent, TrackId } from "../track"
import { useMobxSelector } from "./useMobxSelector"
import { useStores } from "./useStores"

export function useGhostNotes(trackId: TrackId) {
  const { song, pianoRollStore } = useStores()
  const transform = useMobxSelector(() => pianoRollStore.transform)
  const scrollLeft = useMobxSelector(() => pianoRollStore.scrollLeft)
  const canvasWidth = useMobxSelector(() => pianoRollStore.canvasWidth)
  const track = useMobxSelector(() => song.getTrack(trackId))
  const events = useMobxSelector(() => track?.events ?? [])

  const windowedEvents = useMemo(
    () =>
      events
        .filter(isNoteEvent)
        .filter(
          isEventOverlapRange(
            Range.fromLength(
              transform.getTick(scrollLeft),
              transform.getTick(canvasWidth),
            ),
          ),
        ),
    [scrollLeft, canvasWidth, transform.horizontalId, events],
  )

  const notes = useMemo(
    () =>
      windowedEvents.map((e) => {
        const rect = track?.isRhythmTrack
          ? transform.getDrumRect(e)
          : transform.getRect(e)
        return {
          ...rect,
          id: e.id,
          velocity: 127, // draw opaque when ghost
          isSelected: false,
        }
      }),
    [windowedEvents, transform, track?.isRhythmTrack],
  )

  return { notes, isRhythmTrack: track?.isRhythmTrack ?? false }
}
