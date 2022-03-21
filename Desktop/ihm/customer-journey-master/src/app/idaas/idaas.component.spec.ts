import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdaasComponent } from './idaas.component';

describe('IdaasComponent', () => {
  let component: IdaasComponent;
  let fixture: ComponentFixture<IdaasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdaasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdaasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
