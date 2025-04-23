import { useCallback } from "react"
import { ControlSelection } from "../entities/selection/ControlSelection"
import { ControlMode } from "../stores/ControlStore"
import { useMobxSelector, useMobxStore } from "./useMobxSelector"
import { useStores } from "./useStores"

export function useControlPane() {
  const { controlStore, pianoRollStore } = useStores()
  const { rulerStore } = pianoRollStore

  const cursor = useMobxStore(
    ({ pianoRollStore }) => pianoRollStore.controlCursor,
  )
  const mouseMode = useMobxStore(
    ({ pianoRollStore }) => pianoRollStore.mouseMode,
  )
  const controlMode = useMobxStore(
    ({ controlStore }) => controlStore.controlMode,
  )
  const controlModes = useMobxStore(
    ({ controlStore }) => controlStore.controlModes,
  )
  const selection = useMobxStore(({ controlStore }) => controlStore.selection)
  const selectedEventIds = useMobxStore(
    ({ controlStore }) => controlStore.selectedEventIds,
  )
  const scrollLeft = useMobxStore(
    ({ pianoRollStore }) => pianoRollStore.scrollLeft,
  )
  const cursorX = useMobxStore(({ pianoRollStore }) => pianoRollStore.cursorX)
  const transform = useMobxStore(
    ({ pianoRollStore }) => pianoRollStore.transform,
  )
  const quantizer = useMobxStore(
    ({ pianoRollStore }) => pianoRollStore.quantizer,
  )
  const beats = useMobxSelector(() => rulerStore.beats, [rulerStore])

  return {
    cursor,
    mouseMode,
    controlMode,
    controlModes,
    selection,
    selectedEventIds,
    scrollLeft,
    cursorX,
    transform,
    beats,
    quantizer,
    resetSelection: useCallback(() => {
      controlStore.selection = null
      controlStore.selectedEventIds = []
    }, []),
    setControlMode: useCallback((controlMode: ControlMode) => {
      controlStore.controlMode = controlMode
    }, []),
    setControlModes: useCallback((controlModes: ControlMode[]) => {
      controlStore.controlModes = controlModes
    }, []),
    setSelection: useCallback((selection: ControlSelection | null) => {
      controlStore.selection = selection
    }, []),
    setSelectedEventIds: useCallback((selectedEventIds: number[]) => {
      controlStore.selectedEventIds = selectedEventIds
    }, []),
  }
}
