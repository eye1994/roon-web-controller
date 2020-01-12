import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { find } from 'lodash';
import { environment } from 'src/environments/environment';
import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay';
import { faPauseCircle } from '@fortawesome/free-solid-svg-icons/faPauseCircle';
import { faStepForward } from '@fortawesome/free-solid-svg-icons/faStepForward';
import { faStepBackward } from '@fortawesome/free-solid-svg-icons/faStepBackward';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons/faVolumeUp';
import { faVolumeDown } from '@fortawesome/free-solid-svg-icons/faVolumeDown';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
let AppComponent = class AppComponent {
    constructor(socket, httpClient, cookieService) {
        this.socket = socket;
        this.httpClient = httpClient;
        this.cookieService = cookieService;
        this.title = 'roon-web-controller-ui';
        this.faPlay = faPlay;
        this.faPause = faPauseCircle;
        this.faStepForward = faStepForward;
        this.faStepBackward = faStepBackward;
        this.faVolumeUp = faVolumeUp;
        this.faVolumeDown = faVolumeDown;
        this.faArrowLeft = faArrowLeft;
    }
    get currentZone() {
        if (!this.selectedZone) {
            return;
        }
        return find(this.zones, { zone_id: this.selectedZone });
    }
    getCoverUrl(imageId, small = false) {
        return `${environment.API_URL}/roonapi/${small ? 'getImageSmall' : 'getImage'}?image_key=${imageId}`;
    }
    getMinute(seconds) {
        return Math.floor(seconds / 60);
    }
    getSeconds(seconds) {
        const result = seconds % 60;
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
        this.chnageVolume(this.currentZone.outputs[0].volume.value + this.currentZone.outputs[0].volume.step);
    }
    volumeDown() {
        if (this.currentZone.outputs[0].volume.value - this.currentZone.outputs[0].volume.step < 0) {
            return;
        }
        this.chnageVolume(this.currentZone.outputs[0].volume.value - this.currentZone.outputs[0].volume.step);
    }
    chnageVolume(volume) {
        this.socket.emit('changeVolume', { output_id: this.currentZone.outputs[0].output_id, volume });
    }
    ngOnInit() {
        this.socket.on('zoneList', (payload) => {
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
    selectZone(zoneId) {
        this.socket.emit('getZone', zoneId);
        this.loadLibrary();
        this.cookieService.set('current-zone', zoneId);
        this.selectedZone = zoneId;
    }
    nextPage() {
        const listoffset = this.browseResponse.list.display_offset + 100;
        this.httpClient.post(`${environment.API_URL}/roonapi/goLoadBrowse`, { listoffset })
            .subscribe((response) => {
            this.browseResponse = response.data;
        });
    }
    prevPage() {
        const listoffset = this.browseResponse.list.display_offset - 100;
        this.httpClient.post(`${environment.API_URL}/roonapi/goLoadBrowse`, { listoffset })
            .subscribe((response) => {
            this.browseResponse = response.data;
        });
    }
    search(itemKey, value) {
        console.log(value);
        this.loadLibrary({ item_key: itemKey, input: value });
    }
    loadLibrary(options, listoffset = 0) {
        this.lastItemKey = options && options.item_key;
        this.httpClient.post(`${environment.API_URL}/roonapi/goRefreshBrowse`, { zone_id: this.selectedZone, options, listoffset })
            .subscribe((response) => {
            this.browseResponse = response.data;
        });
    }
};
AppComponent = tslib_1.__decorate([
    Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.sass']
    })
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map