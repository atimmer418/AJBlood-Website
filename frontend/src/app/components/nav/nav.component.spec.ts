import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavComponent } from './nav.component';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should start with menu closed', () => {
    expect(component.menuOpen()).toBe(false);
  });

  it('toggleMenu should open menu', () => {
    component.toggleMenu();
    expect(component.menuOpen()).toBe(true);
  });

  it('toggleMenu should close menu when already open', () => {
    component.toggleMenu();
    component.toggleMenu();
    expect(component.menuOpen()).toBe(false);
  });

  it('closeMenu should close menu', () => {
    component.toggleMenu();
    component.closeMenu();
    expect(component.menuOpen()).toBe(false);
  });

  it('onEscape should close menu', () => {
    component.toggleMenu();
    component.onEscape();
    expect(component.menuOpen()).toBe(false);
  });
});
