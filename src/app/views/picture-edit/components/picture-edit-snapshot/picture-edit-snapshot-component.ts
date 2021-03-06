import { Component, Input, Output, EventEmitter } from '@angular/core';

import { environment as env } from '../../../../../environments/environment';
import { Url } from '../../../../core/url/url';

@Component({
  selector: 'app-picture-edit-snapshot',
  templateUrl: './picture-edit-snapshot-component.html',
  styleUrls: ['./picture-edit-snapshot-component.scss']
})
export class PictureEditSnapshotComponent {
  @Input()
  path: string;

  @Output()
  change = new EventEmitter();

  @Output()
  deletePicture = new EventEmitter<string>();

  @Output()
  upPicture = new EventEmitter<string>();

  @Output()
  downPicture = new EventEmitter<string>();

  get imagePath(): string {
    const url = Url.parse(env.imagesDir + this.path, env.apiUrl);

    return url.toString();
  }

  get thumbImagePath(): string {
    const url = Url.parse(env.thumbsDir + this.path, env.apiUrl);

    return url.toString();
  }
}
