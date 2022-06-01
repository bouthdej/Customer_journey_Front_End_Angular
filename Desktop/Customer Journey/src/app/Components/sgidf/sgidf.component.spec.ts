import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SgidfComponent } from './sgidf.component';

describe('SgidfComponent', () => {
  let component: SgidfComponent;
  let fixture: ComponentFixture<SgidfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SgidfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SgidfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
