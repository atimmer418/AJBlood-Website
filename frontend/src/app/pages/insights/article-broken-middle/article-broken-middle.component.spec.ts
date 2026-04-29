import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ArticleBrokenMiddleComponent } from './article-broken-middle.component';

describe('ArticleBrokenMiddleComponent', () => {
  let component: ArticleBrokenMiddleComponent;
  let fixture: ComponentFixture<ArticleBrokenMiddleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleBrokenMiddleComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleBrokenMiddleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should render a breadcrumb link back to insights', () => {
    const el: HTMLElement = fixture.nativeElement;
    const link = el.querySelector('a.breadcrumb-link');
    expect(link?.textContent?.trim()).toBe('Insights');
  });
});
