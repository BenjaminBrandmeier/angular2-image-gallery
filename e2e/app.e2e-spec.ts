import { AwesomePage } from './app.po';

describe('awesome App', function() {
  let page: AwesomePage;

  beforeEach(() => {
    page = new AwesomePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
