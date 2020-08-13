import { async, TestBed } from '@angular/core/testing';
import { ImposterService } from '../imposters/imposter.service';
import { ImposterAddComponent } from './imposter-add.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { DialogService } from '../shared/dialog.service';

describe('StubDetailComponent', () => {
    let mockImposterService;

    beforeEach(async(() => {
        mockImposterService = jasmine.createSpyObj('mockImposterService', ['postImposters']);
        TestBed.configureTestingModule({
            declarations: [ImposterAddComponent],
            providers: [
                { provide: ImposterService, useValue: mockImposterService },
                FormBuilder,
                DialogService
            ],
            imports: [RouterTestingModule.withRoutes([])],
            schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();
    }));

    function setup() {
        const fixture = TestBed.createComponent(ImposterAddComponent);
        const imposterAdd = fixture.debugElement.componentInstance;
        const navSpy = spyOn(TestBed.inject(Router), 'navigate');
        return { fixture, imposterAdd, navSpy };
    }

    it('should create the add imposter component', async(() => {
        const { imposterAdd } = setup();
        expect(imposterAdd).toBeTruthy();
    }));

    it('should send the post imposter request', async(() => {
        const { fixture, imposterAdd, navSpy } = setup();
        mockImposterService.postImposters.and.returnValue(of({}));
        fixture.detectChanges();
        imposterAdd.form.controls.port.setValue('123');
        imposterAdd.form.controls.protocol.setValue('http');
        imposterAdd.onSubmit();
        expect(mockImposterService.postImposters).toHaveBeenCalledWith({ port: '123', protocol: 'http', name: '',
            recordRequests: '', key: '', cert: '', mutualAuth: '', defaultResponse: null, stubs: null,
            endOfRequestResolver: null }, true);
        expect(navSpy).toHaveBeenCalledWith(['imposters']);
    }));

    it('should set the form as invalid', async(() => {
        const { fixture, imposterAdd } = setup();
        fixture.detectChanges();
        imposterAdd.onSubmit();
        expect(imposterAdd.form.valid).toBeFalsy();
    }));
});
