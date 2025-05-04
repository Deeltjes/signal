import { useUpdateEventsInRange } from "../../../actions"
import { Point } from "../../../entities/geometry/Point"
import { TempoCoordTransform } from "../../../entities/transform/TempoCoordTransform"
import { MouseGesture } from "../../../gesture/MouseGesture"
import { bpmToUSecPerBeat } from "../../../helpers/bpm"
import { getClientPos } from "../../../helpers/mouseEvent"
import { observeDrag } from "../../../helpers/observeDrag"
import { useHistory } from "../../../hooks/useHistory"
import { useSong } from "../../../hooks/useSong"
import { useTempoEditor } from "../../../hooks/useTempoEditor"
import { setTempoMidiEvent } from "../../../midi/MidiEvent"
import { isSetTempoEvent, UNASSIGNED_TRACK_ID } from "../../../track"

export const usePencilGesture = (): MouseGesture<
  [Point, TempoCoordTransform]
> => {
  const song = useSong()
  const { pushHistory } = useHistory()
  const { quantizer } = useTempoEditor()
  const updateEventsInRange = useUpdateEventsInRange(
    song.conductorTrack?.id ?? UNASSIGNED_TRACK_ID,
    quantizer,
    isSetTempoEvent,
    (v) => setTempoMidiEvent(0, bpmToUSecPerBeat(v)),
  )

  return {
    onMouseDown(e, startPoint, transform) {
      const { conductorTrack: track } = song

      if (track === undefined) {
        return
      }

      pushHistory()

      const startClientPos = getClientPos(e)
      const pos = transform.fromPosition(startPoint)
      const bpm = bpmToUSecPerBeat(pos.bpm)

      const event = {
        ...setTempoMidiEvent(0, Math.round(bpm)),
        tick: quantizer.round(pos.tick),
      }
      track.createOrUpdate(event)

      let lastTick = pos.tick
      let lastValue = pos.bpm

      observeDrag({
        onMouseMove: (e) => {
          const posPx = getClientPos(e)
          const deltaPx = Point.sub(posPx, startClientPos)
          const local = Point.add(startPoint, deltaPx)
          const value = Math.max(
            0,
            Math.min(transform.maxBPM, transform.fromPosition(local).bpm),
          )
          const tick = transform.getTick(local.x)

          updateEventsInRange(lastValue, value, lastTick, tick)

          lastTick = tick
          lastValue = value
        },
      })
    },
  }
}
