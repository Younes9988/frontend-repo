import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliothecaireBookList } from './bibliothecaire-book-list';

describe('BibliothecaireBookList', () => {
  let component: BibliothecaireBookList;
  let fixture: ComponentFixture<BibliothecaireBookList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BibliothecaireBookList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BibliothecaireBookList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
