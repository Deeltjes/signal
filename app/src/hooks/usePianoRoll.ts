import { useCallback } from "react"
import { InstrumentSetting } from "../components/InstrumentBrowser/InstrumentBrowser"
import { KeySignature } from "../entities/scale/KeySignature"
import { Selection } from "../entities/selection/Selection"
import { NotePoint } from "../entities/transform/NotePoint"
import {
  PianoRollDraggable,
  PianoRollMouseMode,
} from "../stores/PianoRollStore"
import { TrackId } from "../track"
import { useMobxStore } from "./useMobxSelector"
import { useStores } from "./useStores"

export function usePianoRoll() {
  const { pianoRollStore } = useStores()

  return {
    get canvasWidth() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.canvasWidth)
    },
    get canvasHeight() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.canvasHeight)
    },
    get cursorX() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.cursorX)
    },
    get currentPan() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.currentPan)
    },
    get currentTempo() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.currentTempo)
    },
    get currentVolume() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.currentVolume)
    },
    get enabledQuantizer() {
      return useMobxStore(
        ({ pianoRollStore }) => pianoRollStore.enabledQuantizer,
      )
    },
    get notes() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.notes)
    },
    get notGhostTrackIds() {
      return useMobxStore(
        ({ pianoRollStore }) => pianoRollStore.notGhostTrackIds,
      )
    },
    get rulerStore() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.rulerStore)
    },
    get mouseMode() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.mouseMode)
    },
    get keySignature() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.keySignature)
    },
    get selection() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.selection)
    },
    get selectedTrack() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.selectedTrack)
    },
    get selectedTrackId() {
      return useMobxStore(
        ({ pianoRollStore }) => pianoRollStore.selectedTrackId,
      )
    },
    get selectedTrackIndex() {
      return useMobxStore(
        ({ pianoRollStore }) => pianoRollStore.selectedTrackIndex,
      )
    },
    get selectedNoteIds() {
      return useMobxStore(
        ({ pianoRollStore }) => pianoRollStore.selectedNoteIds,
      )
    },
    get scrollLeft() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.scrollLeft)
    },
    get scrollLeftTicks() {
      return useMobxStore(
        ({ pianoRollStore }) => pianoRollStore.scrollLeftTicks,
      )
    },
    get transform() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.transform)
    },
    get windowedEvents() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.windowedEvents)
    },
    get quantizer() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.quantizer)
    },
    get quantize() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.quantize)
    },
    get scaleX() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.scaleX)
    },
    get scaleY() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.scaleY)
    },
    get scrollTop() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.scrollTop)
    },
    get contentWidth() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.contentWidth)
    },
    get contentHeight() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.contentHeight)
    },
    get notesCursor() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.notesCursor)
    },
    get selectionBounds() {
      return useMobxStore(
        ({ pianoRollStore }) => pianoRollStore.selectionBounds,
      )
    },
    get showTrackList() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.showTrackList)
    },
    get showEventList() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.showEventList)
    },
    get ghostTrackIds() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.ghostTrackIds)
    },
    get previewingNoteNumbers() {
      return useMobxStore(
        ({ pianoRollStore }) => pianoRollStore.previewingNoteNumbers,
      )
    },
    get openTransposeDialog() {
      return useMobxStore(
        ({ pianoRollStore }) => pianoRollStore.openTransposeDialog,
      )
    },
    get openVelocityDialog() {
      return useMobxStore(
        ({ pianoRollStore }) => pianoRollStore.openVelocityDialog,
      )
    },
    get newNoteVelocity() {
      return useMobxStore(
        ({ pianoRollStore }) => pianoRollStore.newNoteVelocity,
      )
    },
    get lastNoteDuration() {
      return useMobxStore(
        ({ pianoRollStore }) => pianoRollStore.lastNoteDuration,
      )
    },
    get isQuantizeEnabled() {
      return useMobxStore(
        ({ pianoRollStore }) => pianoRollStore.isQuantizeEnabled,
      )
    },
    get autoScroll() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.autoScroll)
    },
    get currentMBTTime() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.currentMBTTime)
    },
    get controlCursor() {
      return useMobxStore(({ pianoRollStore }) => pianoRollStore.controlCursor)
    },
    get instrumentBrowserSetting() {
      return useMobxStore(
        ({ pianoRollStore }) => pianoRollStore.instrumentBrowserSetting,
      )
    },
    get openInstrumentBrowser() {
      return useMobxStore(
        ({ pianoRollStore }) => pianoRollStore.openInstrumentBrowser,
      )
    },
    resetSelection: useCallback(
      () => pianoRollStore.resetSelection(),
      [pianoRollStore],
    ),
    scrollBy: useCallback(
      (dx: number, dy: number) => pianoRollStore.scrollBy(dx, dy),
      [pianoRollStore],
    ),
    setAutoScroll: useCallback(
      (autoScroll: boolean) => (pianoRollStore.autoScroll = autoScroll),
      [pianoRollStore],
    ),
    setNotGhostTrackIds: useCallback(
      (ids: Set<TrackId>) => (pianoRollStore.notGhostTrackIds = ids),
      [pianoRollStore],
    ),
    setOpenTransposeDialog: useCallback(
      (open: boolean) => (pianoRollStore.openTransposeDialog = open),
      [pianoRollStore],
    ),
    setOpenVelocityDialog: useCallback(
      (open: boolean) => (pianoRollStore.openVelocityDialog = open),
      [pianoRollStore],
    ),
    setKeySignature: useCallback(
      (keySignature: KeySignature | null) =>
        (pianoRollStore.keySignature = keySignature),
      [pianoRollStore],
    ),
    setMouseMode: useCallback(
      (mode: PianoRollMouseMode) => {
        pianoRollStore.mouseMode = mode
        pianoRollStore.notesCursor = mode === "pencil" ? "auto" : "crosshair"
      },
      [pianoRollStore],
    ),
    setSelection: useCallback(
      (selection: Selection | null) => (pianoRollStore.selection = selection),
      [pianoRollStore],
    ),
    setShowTrackList: useCallback(
      (show: boolean) => (pianoRollStore.showTrackList = show),
      [pianoRollStore],
    ),
    setShowEventList: useCallback(
      (show: boolean) => (pianoRollStore.showEventList = show),
      [pianoRollStore],
    ),
    setScrollLeftInTicks: useCallback(
      (scrollLeft: number) => pianoRollStore.setScrollLeftInTicks(scrollLeft),
      [pianoRollStore],
    ),
    setScrollLeftInPixels: useCallback(
      (scrollLeft: number) => pianoRollStore.setScrollLeftInPixels(scrollLeft),
      [pianoRollStore],
    ),
    setSelectedTrackId: useCallback(
      (id: TrackId) => (pianoRollStore.selectedTrackId = id),
      [pianoRollStore],
    ),
    setSelectedTrackIndex: useCallback(
      (index: number) => (pianoRollStore.selectedTrackIndex = index),
      [pianoRollStore],
    ),
    setSelectedNoteIds: useCallback(
      (ids: number[]) => (pianoRollStore.selectedNoteIds = ids),
      [pianoRollStore],
    ),
    scaleAroundPointX: useCallback(
      (scaleXDelta: number, pixelX: number) =>
        pianoRollStore.scaleAroundPointX(scaleXDelta, pixelX),
      [pianoRollStore],
    ),
    scaleAroundPointY: useCallback(
      (scaleYDelta: number, pixelY: number) =>
        pianoRollStore.scaleAroundPointY(scaleYDelta, pixelY),
      [pianoRollStore],
    ),
    setScaleX: useCallback(
      (scale: number) => (pianoRollStore.scaleX = scale),
      [pianoRollStore],
    ),
    setScaleY: useCallback(
      (scale: number) => (pianoRollStore.scaleY = scale),
      [pianoRollStore],
    ),
    setScrollTopInPixels: useCallback(
      (scrollTop: number) => pianoRollStore.setScrollTopInPixels(scrollTop),
      [pianoRollStore],
    ),
    setCanvasWidth: useCallback(
      (width: number) => (pianoRollStore.canvasWidth = width),
      [pianoRollStore],
    ),
    setCanvasHeight: useCallback(
      (height: number) => (pianoRollStore.canvasHeight = height),
      [pianoRollStore],
    ),
    setNotesCursor: useCallback(
      (cursor: string) => (pianoRollStore.notesCursor = cursor),
      [pianoRollStore],
    ),
    getLocal: useCallback(
      (e: { offsetX: number; offsetY: number }) => pianoRollStore.getLocal(e),
      [pianoRollStore],
    ),
    getNotes: useCallback(
      (local: { x: number; y: number }) => pianoRollStore.getNotes(local),
      [pianoRollStore],
    ),
    setLastNoteDuration: useCallback(
      (duration: number | null) => (pianoRollStore.lastNoteDuration = duration),
      [pianoRollStore],
    ),
    toggleTool: useCallback(
      () => pianoRollStore.toggleTool(),
      [pianoRollStore],
    ),
    setNewNoteVelocity: useCallback(
      (velocity: number) => (pianoRollStore.newNoteVelocity = velocity),
      [pianoRollStore],
    ),
    setQuantize: useCallback(
      (denominator: number) => (pianoRollStore.quantize = denominator),
      [pianoRollStore],
    ),
    setIsQuantizeEnabled: useCallback(
      (enabled: boolean) => (pianoRollStore.isQuantizeEnabled = enabled),
      [pianoRollStore],
    ),
    setInstrumentBrowserSetting: useCallback(
      (setting: InstrumentSetting) =>
        (pianoRollStore.instrumentBrowserSetting = setting),
      [pianoRollStore],
    ),
    setOpenInstrumentBrowser: useCallback(
      (open: boolean) => (pianoRollStore.openInstrumentBrowser = open),
      [pianoRollStore],
    ),
    getDraggablePosition: useCallback(
      (draggable: PianoRollDraggable) =>
        pianoRollStore.getDraggablePosition(draggable),
      [pianoRollStore],
    ),
    getDraggableArea: useCallback(
      (draggable: PianoRollDraggable, minLength: number) =>
        pianoRollStore.getDraggableArea(draggable, minLength),
      [pianoRollStore],
    ),
    updateDraggable: useCallback(
      (draggable: PianoRollDraggable, position: Partial<NotePoint>) =>
        pianoRollStore.updateDraggable(draggable, position),
      [pianoRollStore],
    ),
  }
}
