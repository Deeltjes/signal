import { useCallback, useMemo } from "react"
import { Measure } from "../entities/measure/Measure"
import { isTimeSignatureEvent, UNASSIGNED_TRACK_ID } from "../track"
import { useMobxSelector } from "./useMobxSelector"
import { usePlayer } from "./usePlayer"
import { useSong } from "./useSong"
import { useTrackEvents } from "./useTrack"

export function useConductorTrack() {
  const song = useSong()
  const { timebase } = song
  const conductorTrack = useMobxSelector(
    () => song.tracks.find((t) => t.isConductorTrack),
    [song],
  )
  const events = useMobxSelector(
    () => conductorTrack?.events ?? [],
    [conductorTrack],
  )
  const timeSignatures = useMemo(
    () => events.filter(isTimeSignatureEvent),
    [events],
  )
  const measures = useMemo(
    () => Measure.fromTimeSignatures(timeSignatures, timebase),
    [timeSignatures, timebase],
  )

  return {
    get id() {
      return useMobxSelector(
        () => conductorTrack?.id ?? UNASSIGNED_TRACK_ID,
        [conductorTrack],
      )
    },
    get currentTempo() {
      const { position } = usePlayer()
      return useMobxSelector(
        () => conductorTrack?.getTempo(position) ?? 0,
        [conductorTrack, position],
      )
    },
    events,
    timeSignatures,
    measures,
    setTempo: useCallback(
      (bpm: number, tick: number) => {
        if (conductorTrack) {
          conductorTrack.setTempo(bpm, tick)
        }
      },
      [conductorTrack],
    ),
    ...useTrackEvents(conductorTrack),
  }
}
