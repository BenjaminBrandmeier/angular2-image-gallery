import { GalleryPage } from './app.po';

describe('gallery App', function() {
  let page: GalleryPage;

  beforeEach(() => {
    page = new GalleryPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
