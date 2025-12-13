import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarLecteur } from './sidebar-lecteur';

describe('SidebarLecteur', () => {
  let component: SidebarLecteur;
  let fixture: ComponentFixture<SidebarLecteur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarLecteur]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarLecteur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
