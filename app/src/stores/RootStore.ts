import {
  createCloudMidiRepository,
  createCloudSongDataRepository,
  createCloudSongRepository,
  createUserRepository,
} from "@signal-app/api"
import { Player, SoundFontSynth } from "@signal-app/player"
import { deserialize, serialize } from "serializr"
import { auth, firestore, functions } from ".././firebase/firebase"
import { isRunningInElectron } from "../helpers/platform"
import { EventSource } from "../player/EventSource"
import { GroupOutput } from "../services/GroupOutput"
import { MIDIInput, previewMidiInput } from "../services/MIDIInput"
import { MIDIRecorder } from "../services/MIDIRecorder"
import Song from "../song"
import { UNASSIGNED_TRACK_ID } from "../track"
import ArrangeViewStore, {
  SerializedArrangeViewStore,
} from "./ArrangeViewStore"
import { AuthStore } from "./AuthStore"
import { CloudFileStore } from "./CloudFileStore"
import { ControlStore, SerializedControlStore } from "./ControlStore"
import { ExportStore } from "./ExportStore"
import HistoryStore from "./HistoryStore"
import { MIDIDeviceStore } from "./MIDIDeviceStore"
import PianoRollStore, { SerializedPianoRollStore } from "./PianoRollStore"
import { registerReactions } from "./reactions"
import RootViewStore from "./RootViewStore"
import Router from "./Router"
import SettingStore from "./SettingStore"
import { SongStore } from "./SongStore"
import { SoundFontStore } from "./SoundFontStore"
import TempoEditorStore from "./TempoEditorStore"
import { ThemeStore } from "./ThemeStore"
import { TrackMuteStore } from "./TrackMuteStore"

// we use any for now. related: https://github.com/Microsoft/TypeScript/issues/1897
type Json = any

export interface SerializedRootStore {
  song: Json
  pianoRollStore: SerializedPianoRollStore
  controlStore: SerializedControlStore
  arrangeViewStore: SerializedArrangeViewStore
}

export default class RootStore {
  readonly cloudSongRepository = createCloudSongRepository(firestore, auth)
  readonly cloudSongDataRepository = createCloudSongDataRepository(
    firestore,
    auth,
  )
  readonly cloudMidiRepository = createCloudMidiRepository(firestore, functions)
  readonly userRepository = createUserRepository(firestore, auth)

  readonly router = new Router()
  readonly songStore = new SongStore()
  readonly trackMuteStore = new TrackMuteStore()
  readonly historyStore = new HistoryStore(this)
  readonly rootViewStore = new RootViewStore()
  readonly pianoRollStore: PianoRollStore
  readonly controlStore: ControlStore
  readonly arrangeViewStore: ArrangeViewStore
  readonly tempoEditorStore: TempoEditorStore
  readonly midiDeviceStore = new MIDIDeviceStore()
  readonly exportStore = new ExportStore()
  readonly authStore = new AuthStore(this.userRepository)
  readonly cloudFileStore = new CloudFileStore(
    this.songStore,
    this.cloudSongRepository,
    this.cloudSongDataRepository,
  )
  readonly settingStore = new SettingStore()
  readonly player: Player
  readonly synth: SoundFontSynth
  readonly metronomeSynth: SoundFontSynth
  readonly synthGroup: GroupOutput
  readonly midiInput = new MIDIInput()
  readonly midiRecorder: MIDIRecorder
  readonly soundFontStore: SoundFontStore
  readonly themeStore = new ThemeStore()

  constructor() {
    const context = new (window.AudioContext || window.webkitAudioContext)()
    this.synth = new SoundFontSynth(context)
    this.metronomeSynth = new SoundFontSynth(context)
    this.synthGroup = new GroupOutput(this.trackMuteStore, this.metronomeSynth)
    this.synthGroup.outputs.push({ synth: this.synth, isEnabled: true })

    const eventSource = new EventSource(this.songStore)
    this.player = new Player(this.synthGroup, eventSource)

    this.pianoRollStore = new PianoRollStore(this.songStore, this.player)
    this.arrangeViewStore = new ArrangeViewStore(this.songStore, this.player)
    this.tempoEditorStore = new TempoEditorStore(this.songStore, this.player)
    this.controlStore = new ControlStore()
    this.soundFontStore = new SoundFontStore(this.synth)

    this.midiRecorder = new MIDIRecorder(
      this.songStore,
      this.player,
      this.pianoRollStore,
    )

    const preview = previewMidiInput(this)

    this.midiInput.onMidiMessage = (e) => {
      preview(e)
      this.midiRecorder.onMessage(e)
    }

    this.pianoRollStore.setUpAutorun()
    this.arrangeViewStore.setUpAutorun()
    this.tempoEditorStore.setUpAutorun()

    registerReactions(this)
  }

  serialize(): SerializedRootStore {
    return {
      song: serialize(this.songStore.song),
      pianoRollStore: this.pianoRollStore.serialize(),
      controlStore: this.controlStore.serialize(),
      arrangeViewStore: this.arrangeViewStore.serialize(),
    }
  }

  restore(serializedState: SerializedRootStore) {
    const song = deserialize(Song, serializedState.song)
    this.songStore.song = song
    this.pianoRollStore.restore(serializedState.pianoRollStore)
    this.controlStore.restore(serializedState.controlStore)
    this.arrangeViewStore.restore(serializedState.arrangeViewStore)
  }

  async init() {
    // Select the first track that is not a conductor track
    this.pianoRollStore.selectedTrackId =
      this.songStore.song.tracks.find((t) => !t.isConductorTrack)?.id ??
      UNASSIGNED_TRACK_ID

    await this.synth.setup()
    await this.soundFontStore.init()
    this.setupMetronomeSynth()
  }

  private async setupMetronomeSynth() {
    const data = await loadMetronomeSoundFontData()
    await this.metronomeSynth.loadSoundFont(data)
  }
}

async function loadMetronomeSoundFontData() {
  if (isRunningInElectron()) {
    return await window.electronAPI.readFile(
      "./assets/soundfonts/A320U_drums.sf2",
    )
  }
  const soundFontURL =
    "https://cdn.jsdelivr.net/gh/ryohey/signal@6959f35/public/A320U_drums.sf2"
  const response = await fetch(soundFontURL)
  const data = await response.arrayBuffer()
  return data
}
