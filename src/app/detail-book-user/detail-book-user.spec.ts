import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailBookUser } from './detail-book-user';

describe('DetailBookUser', () => {
  let component: DetailBookUser;
  let fixture: ComponentFixture<DetailBookUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailBookUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailBookUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
