import { maxBy } from "lodash"
import { ControllerEvent, PitchBendEvent } from "midifile-ts"
import { useMemo } from "react"
import { isNotUndefined } from "../helpers/array"
import {
  TrackEventOf,
  isControllerEventWithType,
  isPitchBendEvent,
} from "../track"
import { useControlPane } from "./useControlPane"
import { usePianoRoll } from "./usePianoRoll"
import { useTickScroll } from "./useTickScroll"
import { useTrack } from "./useTrack"

export function useControlValueEvents() {
  const { controlMode, transform } = useControlPane()
  const { scrollLeft } = useTickScroll()
  const { windowedEvents, selectedTrackId } = usePianoRoll()
  const { events: selectedTrackEvents } = useTrack(selectedTrackId)

  const filter = useMemo(() => {
    switch (controlMode.type) {
      case "velocity":
        throw new Error("don't use this method for velocity")
      case "pitchBend":
        return isPitchBendEvent
      case "controller":
        return isControllerEventWithType(controlMode.controllerType)
    }
  }, [controlMode])

  const events = useMemo(
    () => windowedEvents.filter(filter),
    [windowedEvents, filter],
  )

  // controller events in the outside of the visible area
  const prevEvent = useMemo(() => {
    const controllerEvents = selectedTrackEvents.filter(filter)
    const tickStart = transform.getTick(scrollLeft)

    return maxBy(
      controllerEvents.filter((e) => e.tick < tickStart),
      (e) => e.tick,
    )
  }, [filter, scrollLeft, transform, selectedTrackEvents])

  const controlValueEvents = useMemo(() => {
    return [prevEvent, ...events].filter(isNotUndefined)
  }, [events, prevEvent])

  return controlValueEvents as (
    | TrackEventOf<ControllerEvent>
    | TrackEventOf<PitchBendEvent>
  )[]
}
