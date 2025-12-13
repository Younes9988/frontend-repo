import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReaders } from './add-readers';

describe('AddReaders', () => {
  let component: AddReaders;
  let fixture: ComponentFixture<AddReaders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReaders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReaders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
