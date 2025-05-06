import { useTheme } from "@emotion/react"
import Color from "color"
import { colorToVec4, enhanceContrast } from "../gl/color"
import { trackColorToCSSColor } from "../track/TrackColor"
import { usePianoRoll } from "./usePianoRoll"
import { useTrack } from "./useTrack"

export function useNoteColor() {
  const { selectedTrackId } = usePianoRoll()
  const { color: trackColor } = useTrack(selectedTrackId)
  const theme = useTheme()

  const baseColor = Color(
    trackColor !== undefined
      ? trackColorToCSSColor(trackColor)
      : theme.themeColor,
  )

  return {
    baseColor, // for LegacyNotes
    backgroundColor: Color(theme.backgroundColor), // for LegacyNotes
    selectedColor: colorToVec4(baseColor.lighten(0.7)),
    borderColor: colorToVec4(
      enhanceContrast(baseColor, theme.isLightContent, 0.3),
    ),
    inactiveColor: colorToVec4(Color(theme.backgroundColor)),
    activeColor: colorToVec4(baseColor),
  }
}
