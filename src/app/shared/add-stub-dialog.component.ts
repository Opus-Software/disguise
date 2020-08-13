import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ImposterService } from '../imposters/imposter.service';
import { faPlusSquare, faTrash, faCaretUp, faCaretDown, faPen, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Response, Predicate } from './interfaces';

@Component({
    selector: 'app-add-stub-dialog',
    templateUrl: './add-stub-dialog.component.html',
    styleUrls: ['./add-stub-dialog.component.sass']
})
export class AddStubDialogComponent implements OnInit {

    @Input() btnOkText: string;
    @Input() btnCancelText: string;
    @Input() imposterPort: number;
    showObject = true;
    showField = false;
    description = '';
    faPlusSquare = faPlusSquare;
    faTrash = faTrash;
    faCaretUp = faCaretUp;
    faCaretDown = faCaretDown;
    faPen = faPen;
    faTimes = faTimes;
    stubIndex = '';
    stubObject = '';
    responses: Response[] = [{statusCode: '', body: '', wait: '', decorate: '', repeat: '', headers: [],
                              shellTransform: '', copy: '', lookup: '', bodyType: 'object'}];
    predicates: Predicate[] = [];
    predicateOptions: object[] = [];
    validationFields: object = {};
    doneResponses: object[] = [{}];
    donePredicates: object[] = [];
    responseViewMode: boolean[] = [false];
    predicateViewMode: boolean[] = [];
    validResponse: boolean[] = [false];
    validPredicate: boolean[] = [];
    hasSomeError = false;
    stubObjectLines = '';
    predicateOptionsLines: object[] = [];
    responseBodyLines: string[] = ['1.'];
    donePredicateLines: string[] = [];
    doneResponseLines: string[] = ['1.'];

    @ViewChild('stubObjLines') stubObjLines: ElementRef;
    @ViewChild('stubObjArea') stubObjArea: ElementRef;

    constructor(private activeModal: NgbActiveModal,
                private imposterService: ImposterService) { }

    ngOnInit(): void {
        this.resetValidation();
        this.stubObjectLines = '1.';
    }

    resetValidation(): void {
        this.validationFields['stubObjSynt'] = true;
        this.validationFields['index'] = true;
        this.validationFields['status'] = [true];
        this.validationFields['bodyObj'] = [true];
        this.validationFields['repeat'] = [true];
        this.validationFields['lookup'] = [true];
        this.validationFields['copy'] = [true];
        this.validationFields['equals'] = [];
        this.validationFields['deepEquals'] = [];
        this.validationFields['contains'] = [];
        this.validationFields['startsWith'] = [];
        this.validationFields['endsWith'] = [];
        this.validationFields['matches'] = [];
        this.validationFields['exists'] = [];
        this.validationFields['not'] = [];
        this.validationFields['or'] = [];
        this.validationFields['and'] = [];
        this.validationFields['xpath'] = [];
        this.validationFields['jsonpath'] = [];
    }

    initPredicateValField(): void {
        this.validationFields['equals'].push(true);
        this.validationFields['deepEquals'].push(true);
        this.validationFields['contains'].push(true);
        this.validationFields['startsWith'].push(true);
        this.validationFields['endsWith'].push(true);
        this.validationFields['matches'].push(true);
        this.validationFields['exists'].push(true);
        this.validationFields['not'].push(true);
        this.validationFields['or'].push(true);
        this.validationFields['and'].push(true);
        this.validationFields['xpath'].push(true);
        this.validationFields['jsonpath'].push(true);
    }

    initResponseValField(): void {
        this.validationFields['status'].push(true);
        this.validationFields['bodyObj'].push(true);
        this.validationFields['repeat'].push(true);
        this.validationFields['lookup'].push(true);
        this.validationFields['copy'].push(true);
    }

    removePredicateValField(index: number): void {
        this.validationFields['equals'].splice(index, 1);
        this.validationFields['deepEquals'].splice(index, 1);
        this.validationFields['contains'].splice(index, 1);
        this.validationFields['startsWith'].splice(index, 1);
        this.validationFields['endsWith'].splice(index, 1);
        this.validationFields['matches'].splice(index, 1);
        this.validationFields['exists'].splice(index, 1);
        this.validationFields['not'].splice(index, 1);
        this.validationFields['or'].splice(index, 1);
        this.validationFields['and'].splice(index, 1);
        this.validationFields['xpath'].splice(index, 1);
        this.validationFields['jsonpath'].splice(index, 1);
    }

    removeResponseValField(index: number): void {
        this.validationFields['status'].splice(index, 1);
        this.validationFields['bodyObj'].splice(index, 1);
        this.validationFields['repeat'].splice(index, 1);
        this.validationFields['lookup'].splice(index, 1);
        this.validationFields['copy'].splice(index, 1);
    }

    checkPredicateValidation(index: number): boolean {
        const keys = ['equals', 'deepEquals', 'contains', 'startsWith', 'endsWith', 'matches',
                      'exists', 'not', 'or', 'and', 'xpath', 'jsonpath'];
        let valid = true;
        keys.forEach(k => {
            if (!this.validationFields[k][index]) {
                valid = false;
            }
        });
        return valid;
    }

    checkResponseValidation(index: number): boolean {
        const keys = ['status', 'bodyObj', 'repeat', 'lookup', 'copy'];
        let valid = true;
        keys.forEach(k => {
            if (!this.validationFields[k][index]) {
                valid = false;
            }
        });
        return valid;
    }

    public decline() {
        const discard = confirm('Do you really want to discard your changes and return to the imposter details page?');
        if (discard) {
            this.activeModal.dismiss();
        }
    }

    public accept() {
        if (this.showObject) {
            if (this.validateObject()) {
                let body = JSON.parse(this.stubObject);
                if (!body['stub']) {
                    body = {stub: body};
                }
                if (this.stubIndex) {
                    body['index'] = +this.stubIndex;
                }
                this.imposterService.addStub(this.imposterPort, body).subscribe({
                    next: () => this.activeModal.close(true)
                });
            }
        } else {
            const body = this.mergeFields();
            if (!body) {
                alert('Add at least one response object in the stub.');
            } else {
                let conf = true;
                if (this.hasSomeError) {
                    conf = confirm('Responses and predicates with unsolved errors or unsaved ' +
                    'changes will not be added. Do you want to continue?');
                }
                if (conf) {
                    const stubBody = body['predicates'].length > 0 ? body : { responses: body['responses'] };
                    if (this.description) {
                        stubBody['description'] = this.description;
                    }
                    const stub = { stub: stubBody };
                    if (this.stubIndex) {
                        stub['index'] = +this.stubIndex;
                    }
                    this.imposterService.addStub(this.imposterPort, stub).subscribe({
                        next: () => this.activeModal.close(true)
                    });
                }
            }
        }
    }

    validateObject(): boolean {
        this.validationFields['stubObjSynt'] = true;
        try {
            JSON.parse(this.stubObject);
        } catch {
            this.validationFields['stubObjSynt'] = false;
        }
        if (this.stubIndex) {
            this.validationFields['index'] = isNaN(+this.stubIndex) ? false : true;
        }
        if (this.validationFields['index'] && this.validationFields['stubObjSynt']) {
            return true;
        } else {
            return false;
        }
    }

    mergeFields(): object {
        this.hasSomeError = false;
        const resp = [];
        const pred = [];
        this.validResponse.forEach((r, i) => {
            if (r) {
                resp.push(this.doneResponses[i]);
            } else {
                this.hasSomeError = true;
            }
        });
        this.validPredicate.forEach((p, i) => {
            if (p) {
                pred.push(this.donePredicates[i]);
            } else {
                this.hasSomeError = true;
            }
        });
        if (resp.length === 0) {
            return undefined;
        }
        return { responses: resp, predicates: pred };
    }

    showObjects(): void {
        this.showObject = true;
        this.showField = false;
    }

    showFields(): void {
        this.showField = true;
        this.showObject = false;
    }

    newResponse(): void {
        this.responses.push({statusCode: '', headers: [], body: '', wait: '',
            decorate: '', repeat: '', shellTransform: '', copy: '', lookup: '', bodyType: 'object'});
        this.doneResponses.push({});
        this.responseViewMode.push(false);
        this.initResponseValField();
        this.validResponse.push(false);
        this.responseBodyLines.push('1.');
        this.doneResponseLines.push('1.');
    }

    removeResponse(index: number): void {
        this.responses.splice(index, 1);
        this.doneResponses.splice(index, 1);
        this.responseViewMode.splice(index, 1);
        this.removeResponseValField(index);
        this.validResponse.splice(index, 1);
        this.responseBodyLines.splice(index, 1);
        this.doneResponseLines.splice(index, 1);
    }

    newPredicate(): void {
        this.predicates.push({equals: '', deepEquals: '', contains: '', startsWith: '', endsWith: '',
            matches: '', exists: '', not: '', or: '', and: '', xpath: '', jsonpath: '', inject: '', caseSensitive: false});
        this.donePredicates.push({});
        this.predicateViewMode.push(false);
        this.predicateOptions.push({});
        this.initPredicateValField();
        this.validPredicate.push(false);
        this.predicateOptionsLines.push({equals: '1.', deepEquals: '1.', contains: '1.', startsWith: '1.', endsWith: '1.',
            matches: '1.', exists: '1.', not: '1.', or: '1.', and: '1.', xpath: '1.', jsonpath: '1.', inject: '1.'});
        this.donePredicateLines.push('1.');
    }

    removePredicate(index: number): void {
        this.predicates.splice(index, 1);
        this.donePredicates.splice(index, 1);
        this.predicateViewMode.splice(index, 1);
        this.predicateOptions.splice(index, 1);
        this.removePredicateValField(index);
        this.validPredicate.splice(index, 1);
        this.predicateOptionsLines.splice(index, 1);
        this.donePredicateLines.splice(index, 1);
    }

    addHeader(index: number): void {
        this.responses[index].headers.push([]);
    }

    removeHeader(indexR: number, indexH: number): void {
        this.responses[indexR].headers.splice(indexH, 1);
    }

    onEditDonePredicate(index: number): void {
        this.predicateViewMode[index] = false;
    }

    onEditDoneResponse(index: number): void {
        this.responseViewMode[index] = false;
    }

    onAcceptPredicate(index: number): void {
        this.donePredicates[index] = this.buildPredicate(this.predicates[index], index);
        if (this.checkPredicateValidation(index)) {
            this.onKey('donePred', index);
            this.validPredicate[index] = true;
            this.predicateViewMode[index] = true;
        }
    }

    onAcceptResponse(index: number): void {
        this.doneResponses[index] = this.buildResponse(this.responses[index], index);
        if (this.checkResponseValidation(index)) {
            this.onKey('doneResp', index);
            this.validResponse[index] = true;
            this.responseViewMode[index] = true;
        }
    }

    checkEmpty(object: string, target: string, index: number): void {
        if (object === '') {
            this.validationFields[target][index] = true;
        }
    }

    buildPredicate(pred: Predicate, index: number): object {
        const returnObj = {};
        const keys = Object.keys(pred);
        keys.pop();
        keys.pop();
        returnObj['caseSensitive'] = pred.caseSensitive;
        keys.forEach(atr => {
            if (pred[atr]) {
                this.validationFields[atr][index] = true;
                try {
                    returnObj[atr] = JSON.parse(pred[atr]);
                } catch {
                    this.validationFields[atr][index] = false;
                }
            }
            this.checkEmpty(pred[atr], atr, index);
        });
        if (pred.inject) {
            returnObj['inject'] = pred.inject;
        }
        return returnObj;
    }

    buildResponse(res: Response, index: number): object {
        const returnObj = { };
        if (res.statusCode) {
            this.validationFields['status'][index] = true;
            returnObj['is'] = returnObj['is'] ? returnObj['is'] : {};
            this.validationFields['status'][index] = isNaN(+res.statusCode) ? false : true;
            returnObj['is']['statusCode'] = +res.statusCode;
        }
        this.checkEmpty(res.statusCode, 'status', index);
        if (res.headers) {
            res.headers.forEach(header => {
                if (header[0] && header[1]) {
                    returnObj['is'] = returnObj['is'] ? returnObj['is'] : {};
                    returnObj['is']['headers'] = returnObj['is']['headers'] ? returnObj['is']['headers'] : {};
                    returnObj['is']['headers'][header[0]] = header[1];
                }
            });
        }
        if (res.body) {
            this.validationFields['bodyObj'][index] = true;
            returnObj['is'] = returnObj['is'] ? returnObj['is'] : {};
            try {
                returnObj['is']['body'] = res.bodyType === 'string' ? res.body : JSON.parse(res.body);
            } catch {
                this.validationFields['bodyObj'][index] = false;
            }
        }
        this.checkEmpty(res.body, 'bodyObj', index);
        if (res.wait) {
            returnObj['_behaviors'] = returnObj['_behaviors'] ? returnObj['_behaviors'] : {};
            returnObj['_behaviors']['wait'] = isNaN(+res.wait) ? res.wait : +res.wait;
        }
        if (res.repeat) {
            this.validationFields['repeat'][index] = true;
            returnObj['_behaviors'] = returnObj['_behaviors'] ? returnObj['_behaviors'] : {};
            this.validationFields['repeat'][index] = (isNaN(+res.repeat) || +res.repeat <= 0) ? false : true;
            returnObj['_behaviors']['repeat'] = +res.repeat;
        }
        this.checkEmpty(res.repeat, 'repeat', index);
        if (res.copy) {
            this.validationFields['copy'][index] = true;
            returnObj['_behaviors'] = returnObj['_behaviors'] ? returnObj['_behaviors'] : {};
            try {
                returnObj['_behaviors']['copy'] = JSON.parse(res.copy);
            } catch {
                this.validationFields['copy'][index] = false;
            }
        }
        this.checkEmpty(res.copy, 'copy', index);
        if (res.lookup) {
            this.validationFields['lookup'][index] = true;
            returnObj['_behaviors'] = returnObj['_behaviors'] ? returnObj['_behaviors'] : {};
            try {
                returnObj['_behaviors']['lookup'] = JSON.parse(res.lookup);
            } catch {
                this.validationFields['lookup'][index] = false;
            }
        }
        this.checkEmpty(res.lookup, 'lookup', index);
        if (res.decorate) {
            returnObj['_behaviors'] = returnObj['_behaviors'] ? returnObj['_behaviors'] : {};
            returnObj['_behaviors']['decorate'] = res.decorate;
        }
        if (res.shellTransform) {
            returnObj['_behaviors'] = returnObj['_behaviors'] ? returnObj['_behaviors'] : {};
            const tmp = res.shellTransform.replace(/[\[\]]+/g, '');
            returnObj['_behaviors']['shellTransform'] = tmp.split(',');
        }
        return returnObj;
    }

    togglePredicateOption(index: number, target: string): void {
        if (this.predicateOptions[index][target] === undefined) {
            this.predicateOptions[index][target] = true;
        } else {
            this.predicateOptions[index][target] = !this.predicateOptions[index][target];
        }
    }

    deletePredicateOption(index: number, target: string): void {
        this.togglePredicateOption(index, target);
        this.predicates[index][target] = '';
    }

    onKey(target: string, index?: number, predOpt?: string): void {
        let lines = 0;
        switch (target) {
            case 'stubObj':
                this.stubObjectLines = '';
                lines = this.stubObject.split(/\r\n|\r|\n/).length;
                for (let i = 1; i <= lines; i++) {
                    this.stubObjectLines = this.stubObjectLines + `${i}.\n`;
                }
                break;
            case 'respBody':
                this.responseBodyLines[index] = '';
                lines = this.responses[index]['body'].split(/\r\n|\r|\n/).length;
                for (let i = 1; i <= lines; i++) {
                    this.responseBodyLines[index] = this.responseBodyLines[index] + `${i}.\n`;
                }
                break;
            case 'doneResp':
                this.doneResponseLines[index] = '';
                lines = JSON.stringify(this.doneResponses[index], null, 2).split(/\r\n|\r|\n/).length;
                for (let i = 1; i <= lines; i++) {
                    this.doneResponseLines[index] = this.doneResponseLines[index] + `${i}.\n`;
                }
                break;
            case 'donePred':
                this.donePredicateLines[index] = '';
                lines = JSON.stringify(this.donePredicates[index], null, 2).split(/\r\n|\r|\n/).length;
                for (let i = 1; i <= lines; i++) {
                    this.donePredicateLines[index] = this.donePredicateLines[index] + `${i}.\n`;
                }
                break;
            case 'predBody':
                this.predicateOptionsLines[index][predOpt] = '';
                lines = this.predicates[index][predOpt].split(/\r\n|\r|\n/).length;
                for (let i = 1; i <= lines; i++) {
                    this.predicateOptionsLines[index][predOpt] = this.predicateOptionsLines[index][predOpt] + `${i}.\n`;
                }
                break;
        }
    }
}
