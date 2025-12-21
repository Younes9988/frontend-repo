import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpruntUserList } from './emprunt-user-list';

describe('EmpruntUserList', () => {
  let component: EmpruntUserList;
  let fixture: ComponentFixture<EmpruntUserList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpruntUserList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpruntUserList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
