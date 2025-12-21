import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmprunt } from './add-emprunt';

describe('AddEmprunt', () => {
  let component: AddEmprunt;
  let fixture: ComponentFixture<AddEmprunt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEmprunt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEmprunt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
