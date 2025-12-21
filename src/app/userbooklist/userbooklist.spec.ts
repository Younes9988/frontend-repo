import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Userbooklist } from './userbooklist';

describe('Userbooklist', () => {
  let component: Userbooklist;
  let fixture: ComponentFixture<Userbooklist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Userbooklist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Userbooklist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
