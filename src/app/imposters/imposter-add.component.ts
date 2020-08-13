import { Component, OnInit } from '@angular/core';
import { ImposterService } from './imposter.service';
import { Router } from '@angular/router';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators, ValidationErrors, FormControl } from '@angular/forms';
import { DialogService } from '../shared/dialog.service';
@Component({
    templateUrl: './imposter-add.component.html',
    styleUrls: ['./imposter-add.component.sass']
})
​
export class ImposterAddComponent implements OnInit {
    form: FormGroup;
    submitted = false;
    faCheck = faCheck;

    constructor(private imposterService: ImposterService,
                private fb: FormBuilder,
                private router: Router,
                private dialogService: DialogService) { }

    ngOnInit() {
        this.form = this.fb.group({
            port: [null, [Validators.required, Validators.minLength(1)]],
            protocol: [null, [Validators.required, Validators.minLength(1)]],
            name: '',
            recordRequests: '',
            key: '',
            cert: '',
            mutualAuth: '',
            defaultResponse: [null, [this.validateJson]],
            stubs: [null, [this.validateJson]],
            endOfRequestResolver: [null, [this.validateJson]]
        });
    }
    addingImposter(): void {
        this.imposterService.postImposters(this.form.value, true).subscribe({
            next: () => this.return()
        });
    }

    hasError(field: string): ValidationErrors {
        return this.form.get(field).errors;
    }

    onSubmit(): void {
        this.submitted = true;
        if (this.form.valid) {
            this.addingImposter();
        }
    }

    onCancel(): void {
        this.dialogService.confirm('Discard changes', `Do you really want to discard your changes?`, 'DISCARD').then(
            ok => {
                if (ok) {
                    this.return();
                }
            }
        );
    }

    validateJson(control: FormControl) {
        try {
            JSON.parse(control.value);
        } catch (e) {
            return { invalidJson: true };
        }
        return null;
    }

    return(): void {
        this.router.navigate(['imposters']);
    }
}
