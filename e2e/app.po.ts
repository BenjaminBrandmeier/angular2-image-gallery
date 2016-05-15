export class GalleryPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('gallery-app h1')).getText();
  }
}
