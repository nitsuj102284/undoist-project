import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxViewComponent } from './inbox-view.component';

describe('InboxViewComponent', () => {
  let component: InboxViewComponent;
  let fixture: ComponentFixture<InboxViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InboxViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InboxViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
