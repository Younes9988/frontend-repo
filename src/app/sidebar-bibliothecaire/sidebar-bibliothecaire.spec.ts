import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarBibliothecaire } from './sidebar-bibliothecaire';

describe('SidebarBibliothecaire', () => {
  let component: SidebarBibliothecaire;
  let fixture: ComponentFixture<SidebarBibliothecaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarBibliothecaire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarBibliothecaire);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
