import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPropertyComponent } from './post-property.component';

describe('PostPropertyComponent', () => {
  let component: PostPropertyComponent;
  let fixture: ComponentFixture<PostPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostPropertyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
