import {Component, OnInit} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {find} from 'lodash';
import { environment } from 'src/environments/environment';
import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay';
import { faPauseCircle } from '@fortawesome/free-solid-svg-icons/faPauseCircle';
import { faStepForward } from '@fortawesome/free-solid-svg-icons/faStepForward';
import { faStepBackward } from '@fortawesome/free-solid-svg-icons/faStepBackward';

import { faVolumeUp } from '@fortawesome/free-solid-svg-icons/faVolumeUp';
import { faVolumeDown } from '@fortawesome/free-solid-svg-icons/faVolumeDown';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

interface IZone {
  zone_id: string;
  display_name: string;
  outputs: {
    output_id: string;
    zone_id: string;
    can_group_with_output_ids: string[];
    display_name: string;
    volume: { type: string, min: number, max: number, value: number, step: number };
    source_controls: { control_key: string, display_name: string, supports_standby: string, status: string }[]
  }[];
  state: 'paused';
  is_next_allowed: boolean;
  is_previous_allowed: boolean;
  is_pause_allowed: boolean;
  is_play_allowed: boolean;
  is_seek_allowed: boolean;
  queue_items_remaining: number;
  queue_time_remaining: number;
  settings: {loop: string, shuffle: boolean, auto_radio: boolean};
  now_playing: {
    seek_position: number;
    length: number;
    one_line: { line1: string; };
    two_line: { line1: string; line2: string; };
    three_line: {line1: string; line2: string; line3: string;}
    image_key: string;
    artist_image_keys: string[];
  };
}

interface IBrowseResponse {
  items: {title: string, subtitle: string, image_key: string, item_key: string; hint: string; 
    input_prompt?: {prompt: string; action: string;}}[];
  offset: number;
  list: {
    level: number;
    title: string;
    subtitle: string;
    image_key: string;
    count: number;
    display_offset: number;
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'roon-web-controller-ui';
  zones: IZone[];
  selectedZone: string;


  faPlay = faPlay;
  faPause = faPauseCircle;
  faStepForward = faStepForward;
  faStepBackward = faStepBackward;

  faVolumeUp = faVolumeUp;
  faVolumeDown = faVolumeDown;
  faArrowLeft = faArrowLeft;

  lastItemKey: string;


  browseResponse: IBrowseResponse;

  constructor(
    private socket: Socket,
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {

  }

  get currentZone(): IZone {
    if (!this.selectedZone) {
      return;
    }

    return find(this.zones, { zone_id: this.selectedZone });
  }

  getCoverUrl(imageId: string, small = false) {
    return `${environment.API_URL}/roonapi/${small ? 'getImageSmall' : 'getImage'}?image_key=${imageId}`;
  }

  getMinute(seconds: number) {
    return Math.floor(seconds / 60);
  }

  getSeconds(seconds: number) {
    const result: number = seconds % 60;
    return result < 10 ? `0${result}` : result;
  }

  play() {
    this.socket.emit('goPlay', this.selectedZone);
  }

  pause() {
    this.socket.emit('goPause', this.selectedZone);
  }

  prev() {
    this.socket.emit('goPrev', this.selectedZone);
  }

  next() {
    this.socket.emit('goNext', this.selectedZone);
  }

  volumeUp() {
    if (this.currentZone.outputs[0].volume.value + this.currentZone.outputs[0].volume.step > this.currentZone.outputs[0].volume.max) {
      return;
    }

    this.chnageVolume(
      this.currentZone.outputs[0].volume.value + this.currentZone.outputs[0].volume.step
    );
  }

  volumeDown() {
    if (this.currentZone.outputs[0].volume.value - this.currentZone.outputs[0].volume.step < 0) {
      return;
    }

    this.chnageVolume(
      this.currentZone.outputs[0].volume.value - this.currentZone.outputs[0].volume.step
    );
  }

  chnageVolume(volume: number) {
    this.socket.emit('changeVolume', { output_id: this.currentZone.outputs[0].output_id, volume });
  }

  ngOnInit(): void {
    this.socket.on('zoneList', (payload: IZone[]) => {
      this.zones = payload;
    });

    this.socket.on('zoneStatus', (payload) => {
      this.zones = payload;
    });

    this.socket.emit('getZone', true);

    if (this.cookieService.get('current-zone')) {
      this.selectZone(this.cookieService.get('current-zone'));
    }
  }

  selectZone(zoneId: string) {
    this.socket.emit('getZone', zoneId);
    this.loadLibrary();
    this.cookieService.set('current-zone', zoneId);
    this.selectedZone = zoneId;
  }

  nextPage() {
    const listoffset = this.browseResponse.list.display_offset + 100;
    this.httpClient.post(`${environment.API_URL}/roonapi/goLoadBrowse`, { listoffset })
      .subscribe((response: { data: IBrowseResponse }) => {
        this.browseResponse = response.data;
      });
  }

  prevPage() {
    const listoffset = this.browseResponse.list.display_offset - 100;
    this.httpClient.post(`${environment.API_URL}/roonapi/goLoadBrowse`, { listoffset })
      .subscribe((response: { data: IBrowseResponse }) => {
        this.browseResponse = response.data;
      });
  }

  search(itemKey: string, value: string) {
    console.log(value);
    this.loadLibrary({ item_key: itemKey, input: value });
  }

  loadLibrary(options?: { item_key?: string; pop_levels?: number; input?: string }, listoffset = 0) {
    this.lastItemKey = options && options.item_key;

    this.httpClient.post(`${environment.API_URL}/roonapi/goRefreshBrowse`, { zone_id: this.selectedZone, options,  listoffset})
      .subscribe((response: { data: IBrowseResponse }) => {
        this.browseResponse = response.data;
      });
  }
}
