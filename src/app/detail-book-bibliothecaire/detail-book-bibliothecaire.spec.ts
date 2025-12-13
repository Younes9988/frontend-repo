import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailBookBibliothecaire } from './detail-book-bibliothecaire';

describe('DetailBookBibliothecaire', () => {
  let component: DetailBookBibliothecaire;
  let fixture: ComponentFixture<DetailBookBibliothecaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailBookBibliothecaire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailBookBibliothecaire);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
