import {GalleryPage} from './app.po'
import {browser, protractor} from "protractor"

describe('Gallery', function () {
  let page: GalleryPage

  beforeEach(() => {
    page = new GalleryPage()
  })

  it('should display the first gallery row', () => {
    page.navigateTo()
    expect(page.getFirstGalleryRow().isPresent()).toBeTruthy()
  })

  it('should open the image viewer on click of the first image', () => {
    page.getFirstImageFromFirstRow().click()
    expect(page.getImageInsideViewerIfActive(1).isPresent()).toBeTruthy()
  })

  it('should navigate through the images when using keystrokes', () => {
    browser.actions().sendKeys(protractor.Key.RIGHT).perform()
    expect(page.getImageInsideViewerIfActive(2).isPresent()).toBeTruthy()
  })

  it('should display the interaction elements inside the viewer correctly', () => {
    expect(page.getExitButton().isPresent()).toBeTruthy()

    // buttons only show on hover
    browser.actions().mouseMove(page.getImageInsideViewerIfActive(2)).perform()
    expect(page.getLeftArrowButton().isPresent()).toBeTruthy()
    expect(page.getRightArrowButton().isPresent()).toBeTruthy()
  })

  it('should support swiping images', () => {
    browser.actions()
      .mouseDown(page.getImageInsideViewerIfActive(2))
      .mouseMove({x: -150, y: 0})
      .mouseUp()
      .perform()

    expect(page.getImageInsideViewerIfActive(3).isPresent()).toBeTruthy()
  })

  it('should close the viewer on exit', () => {
    page.getExitButton().click()

    browser.wait(protractor.ExpectedConditions.stalenessOf(page.getImageInsideViewerIfActive(3)), 1000)
    browser.wait(protractor.ExpectedConditions.stalenessOf(page.getExitButton()), 1000)
  })
})
