import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DemoComponent} from './demo.component';
import {MaterialModule} from '@angular/material';
import {ViewerComponent} from '../viewer/viewer.component';
import {GalleryComponent} from '../gallery/gallery.component';
import {FormsModule} from '@angular/forms';
import {ImageService} from '../services/image.service';

describe('DemoComponent', () => {
    let component: DemoComponent;
    let fixture: ComponentFixture<DemoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DemoComponent,
                GalleryComponent,
                ViewerComponent
            ],
            imports: [
                MaterialModule,
                FormsModule
            ],
            providers: [ImageService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DemoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
