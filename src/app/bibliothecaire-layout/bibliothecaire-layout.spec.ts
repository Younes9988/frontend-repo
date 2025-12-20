import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliothecaireLayout } from './bibliothecaire-layout';

describe('BibliothecaireLayout', () => {
  let component: BibliothecaireLayout;
  let fixture: ComponentFixture<BibliothecaireLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BibliothecaireLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BibliothecaireLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
