import { NgTaskPage } from './app.po';

describe('ng-task App', function() {
  let page: NgTaskPage;

  beforeEach(() => {
    page = new NgTaskPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
