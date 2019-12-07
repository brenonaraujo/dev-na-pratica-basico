import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldClienteFormComponent } from './field-cliente-form.component';

describe('FieldClienteFormComponent', () => {
  let component: FieldClienteFormComponent;
  let fixture: ComponentFixture<FieldClienteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldClienteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldClienteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
