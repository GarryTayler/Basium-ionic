import { Injectable } from '@angular/core';
import { Common } from '../common';
import { Storage } from '@ionic/storage';

@Injectable()
export class Preferences {

  tag: string = Common.PREFERENCES_TAG;
  data = {};

  constructor(
    public storage: Storage
  ) {
  }

  save() {
    this.storage.set(this.tag, this.data);
  }

  load() {
    return this.storage.get(this.tag);
  }

  set(key, value) {
    this.data[key] = value;
    this.save();
  }

  get(key) {
    if( this.data == null ) {
      this.data = [];
      return false;
    }

    if (this.data.hasOwnProperty(key)) {
      return this.data[key];
    }
    else {
      return false;
    }
  }

  setEmpty() {
    this.data = [];
    this.save();
  }
}
