import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsTypeManagementPageComponent } from './items-type-management-page.component';

describe('ItemsTypeManagementPageComponent', () => {
  let component: ItemsTypeManagementPageComponent;
  let fixture: ComponentFixture<ItemsTypeManagementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsTypeManagementPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsTypeManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
