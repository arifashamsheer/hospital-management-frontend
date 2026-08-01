import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentStr } from './payment-str';

describe('PaymentStr', () => {
  let component: PaymentStr;
  let fixture: ComponentFixture<PaymentStr>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentStr]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentStr);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
