import styled from "@emotion/styled"
import VolumeUp from "mdi-react/VolumeHighIcon"
import { FC, useCallback } from "react"
import { useSetTrackVolume } from "../../actions"
import { usePianoRoll } from "../../hooks/usePianoRoll"
import { Slider } from "../ui/Slider"

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  max-width: 8rem;
  min-width: 5rem;
  margin-left: 1rem;
  margin-right: 1rem;
  align-items: center;
`

const VolumeIcon = styled(VolumeUp)`
  width: 1.3rem;
  height: 2rem;
  color: var(--color-text-secondary);
  margin-right: 0.5rem;
`

export const VolumeSlider: FC = () => {
  const { currentVolume, selectedTrackId: trackId } = usePianoRoll()
  const setTrackVolume = useSetTrackVolume()
  const volume = currentVolume ?? 100
  const onChange = useCallback(
    (value: number) => setTrackVolume(trackId, value),
    [setTrackVolume, trackId],
  )
  return (
    <Container>
      <VolumeIcon />
      <Slider
        value={volume}
        onChange={(value) => onChange(value)}
        max={127}
        minStepsBetweenThumbs={1}
      />
    </Container>
  )
}
