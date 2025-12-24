import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliothecaireHome } from './bibliothecaire-home';

describe('BibliothecaireHome', () => {
  let component: BibliothecaireHome;
  let fixture: ComponentFixture<BibliothecaireHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BibliothecaireHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BibliothecaireHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
