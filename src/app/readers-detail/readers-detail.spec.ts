import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadersDetail } from './readers-detail';

describe('ReadersDetail', () => {
  let component: ReadersDetail;
  let fixture: ComponentFixture<ReadersDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadersDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadersDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
