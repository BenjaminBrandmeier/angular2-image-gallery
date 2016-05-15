import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { GalleryAppComponent } from '../app/gallery.component';

beforeEachProviders(() => [GalleryAppComponent]);

describe('App: Gallery', () => {
  it('should create the app',
      inject([GalleryAppComponent], (app: GalleryAppComponent) => {
    expect(app).toBeTruthy();
  }));

  // it('should have as title \'gallery works!\'',
  //     inject([GalleryAppComponent], (app: GalleryAppComponent) => {
  //   expect(app.title).toEqual('gallery works!');
  // }));
});
