import styled from "@emotion/styled"
import { observer } from "mobx-react-lite"
import { FC } from "react"
import { useSong } from "../../hooks/useSong"
import { DraggableList } from "../ControlSettingDialog/DraggableList"
import { AddTrackButton } from "./AddTrackButton"
import { TrackListItem } from "./TrackListItem"

const List = styled.div`
  overflow-y: auto;
  background: var(--color-background);
  min-width: 14rem;
  flex-grow: 1;
`

// we still need to use observer to track song.tracks changes
export const TrackList: FC = observer(() => {
  const song = useSong()

  return (
    <List>
      <DraggableList
        items={song.tracks.filter((t) => !t.isConductorTrack)}
        getItemId={(track) => track.id}
        onItemMoved={(id, overId) => {
          const track = song.getTrack(id)
          const overTrack = song.getTrack(overId)
          if (track === undefined || overTrack === undefined) {
            return
          }
          const fromIndex = song.tracks.indexOf(track)
          const toIndex = song.tracks.indexOf(overTrack)
          song.moveTrack(fromIndex, toIndex)
        }}
        render={(track) => <TrackListItem key={track.id} trackId={track.id} />}
      ></DraggableList>
      <AddTrackButton />
    </List>
  )
})
