import { computed, makeObservable, observable } from "mobx"
import { Layout } from "../Constants"
import { KeyTransform } from "../entities/transform/KeyTransform"

export class KeyScrollStore {
  scrollTopKeys = 70 // 中央くらいの音程にスクロールしておく
  scaleY = 1
  canvasHeight: number = 0

  constructor() {
    makeObservable(this, {
      scrollTopKeys: observable,
      scaleY: observable,
      canvasHeight: observable,
      scrollTop: computed,
      transform: computed,
    })
  }

  get scrollTop(): number {
    return Math.round(this.transform.getY(this.scrollTopKeys))
  }

  get transform(): KeyTransform {
    return new KeyTransform(Layout.keyHeight * this.scaleY, 127)
  }
}
