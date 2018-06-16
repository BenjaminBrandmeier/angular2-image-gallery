import { browser, element, by } from 'protractor';

export class GalleryPage {
  navigateTo() {
    return browser.get('');
  }

  getFirstGalleryRow() {
    return element(by.css('gallery > .galleryContainer > .innerGalleryContainer > .imagerow:nth-child(1)'));
  }

  getFirstImageFromFirstRow() {
    return element(by.css('gallery > .galleryContainer > .innerGalleryContainer > .imagerow:nth-child(1) > img:nth-child(1)'));
  }

  getImageInsideViewerIfActive(id : number) {
    return element(by.css('viewer > .outerContainer > .imageContainer > div.image.active:nth-child('+id+')'))
  }

  getExitButton() {
    return element(by.css('viewer > .outerContainer > .buttonContainer > img.action.close'))
  }

  getLeftArrowButton() {
    return element(by.css('viewer > .outerContainer > img.arrow.left'))
  }

  getRightArrowButton() {
    return element(by.css('viewer > .outerContainer > img.arrow.right'))
  }
}
