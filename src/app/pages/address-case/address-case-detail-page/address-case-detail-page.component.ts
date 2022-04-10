import {
    Component,
    OnInit,
    OnDestroy,
    ElementRef,
    ViewChild,
    EventEmitter,
    Output,
    AfterViewInit,
    Input, OnChanges, SimpleChanges
} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Subject, pipe, from} from 'rxjs';
import {takeUntil, take, mergeMap, finalize, map} from 'rxjs/operators';
import * as dateFns from 'date-fns';
import * as go from 'gojs';

import {SankeyLayout} from '../../../shared/sankey-layout';
import {CryptoPipe} from 'src/app/pipes/crypto.pipe';

import * as moment from 'moment';
import {RuleCategory} from "../../../models/type/rule-category.enum";
import BigNumber from "bignumber.js";
import {RiskLevel} from "../../../models/type/risk-level.enum";
import {CcPipe} from "../../../pipes/cc.pipe";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RISK_LEVEL_MAP, RISK_LEVEL_LIST} from "../../../models/address-case-risk-level-option";
import {ADDRESS_CASE_STATUS_LIST, ADDRESS_CASE_STATUS_MAP} from "../../../models/address-case-status-option";
import {AddressScanTableComponent} from "../../../component/address-scan/address-scan-table/address-scan-table.component";
import { AddressCaseCommentCreation, AddressCaseCommentDto, AddressCaseDto, AddressCaseDtoLevelEnum, AddressCaseDtoStatusEnum, AddressScanDto } from '@chainsight/unblock-api-axios-sdk';
import { ApiService } from 'src/app/services/api.service';

interface CommentItem {
    data: AddressCaseCommentDto,
    isEditing: boolean,
    isSubmitting: boolean,
    currComment: string,
}

@Component({
    selector: 'app-address-case-detail-page',
    templateUrl: './address-case-detail-page.component.html',
    styleUrls: ['./address-case-detail-page.component.scss']
})
export class AddressCaseDetailPageComponent implements OnInit, OnChanges {

    @Input()
    public addressCaseId: string;
    @Input()
    public showComments: boolean = true
    @Input()
    public showScans: boolean = true

    @ViewChild("addressScanTable", {static: false})
    public addressScanTable: AddressScanTableComponent;


    // address case
    public isLoadingAddressCase = false;
    public addressCase: AddressCaseDto = {};


    public riskLevels = RISK_LEVEL_LIST;
    public isSubmittingLevel: boolean;
    public _level: AddressCaseDtoLevelEnum;
    get level(): AddressCaseDtoLevelEnum {
        return this._level;
    }

    set level(value: AddressCaseDtoLevelEnum) {
        this._level = value;
        if (this.addressCase && value && this.addressCase.level !== value) {
            this.submitLevel(value);
        }


    }

    public addressCaseStatusList = ADDRESS_CASE_STATUS_LIST;
    public isSubmittingStatus: boolean;
    public _status: AddressCaseDtoStatusEnum;
    get status(): AddressCaseDtoStatusEnum {
        return this._status;
    }

    set status(value: AddressCaseDtoStatusEnum) {
        this._status = value;
        if (this.addressCase && value && this.addressCase.status !== value) {
            this.submitStatus(value);
        }


    }


    // comment
    public isCommentLoading = false;
    public commentPageIdx = 0;
    public commentPageSize = 30;
    public comments: CommentItem[] = [];

    // comment form
    public isSubmittingComment: boolean;
    public commentForm: FormGroup;

    private unsubscribe$ = new Subject<void>();


    constructor(private router: Router,
                private fb: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private api: ApiService) {

    }


    ngOnInit() {

        this.commentForm = this.fb.group({
            comment: [null, [Validators.required]],
        });

        this.activatedRoute.params
            .pipe(
                takeUntil(this.unsubscribe$),
            )
            .subscribe(params => {
                if (params.id) {
                    this.addressCaseId = params.id;
                    this.reload(params.id);
                }
            });


    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    reload(id: string) {
        this.isLoadingAddressCase = true;
        from(this.api.addressCaseApi.getAddressCase(id))
            .pipe(
                take(1),
                map(resp => resp.data)
            ).subscribe(resBody => {
            this.addressCase = resBody;
            this.level = this.addressCase.level;
            this.status = this.addressCase.status;
            this.reloadCommentList();
        }, console.error, () => {
            this.isLoadingAddressCase = false;
        });
    }

    reloadCommentList() {
        this.isCommentLoading = true;
        from(this.api.addressCaseApi.listAddressCaseComment(this.addressCase.id))
            .pipe(
                take(1),
                map(resp => resp.data),
                finalize(() => {
                    this.isCommentLoading = false;
                })
            ).subscribe(resBody => {
            this.comments = resBody.map(c => {
                return {
                    data: c,
                    isEditing: false,
                    isSubmitting: false,
                    currComment: c.comment,
                };
            });
        }, console.error);
    }


    readableDuration(time: string | Date) {
        if (!time) {
            return '';
        }
        return dateFns.formatDistance(new Date(time), new Date());
    }

    submitComment() {
        for (const i in this.commentForm.controls) {
            this.commentForm.controls[i].markAsDirty();
            this.commentForm.controls[i].updateValueAndValidity();
        }

        if (this.commentForm.invalid) {
            return;
        }

        const formValue = this.commentForm.value;

        const body: AddressCaseCommentCreation = {
            addressCaseId: this.addressCase.id,
            comment: formValue.comment,
        };


        this.isSubmittingComment = true;
        from(this.api.addressCaseCommentApi.createAddressCaseComment(body))
            .pipe(
                take(1),
                map(resp => resp.data),
                finalize(() => {
                    this.isSubmittingComment = false;
                })
            ).subscribe(resBody => {
            this.commentForm.reset();
            this.reload(this.addressCase.id)
        }, console.error);

    }

    formatAuthor(comment: AddressCaseCommentDto) {
        let retVal = '';

        if (comment && comment.creator) {
            if (comment.creator.firstName) {
                retVal += comment.creator.firstName;
            }
            if (comment.creator.lastName) {
                retVal += ' ' + comment.creator.lastName;
            }
        }
        return retVal;

    }

    statusFormatter(status: AddressCaseDtoStatusEnum) {

        const attr = ADDRESS_CASE_STATUS_MAP[status];
        if (!attr) {
            return {
                color: '#108ee9',
                title: 'default'
            };

        }
        return {
            color: attr.color,
            title: attr.label,
        };
    }

    levelFormatter(level: AddressCaseDtoLevelEnum) {
        const attr = RISK_LEVEL_MAP[level];
        if (!attr) {
            return {
                color: '#108ee9',
                title: 'default'
            };

        }
        return {
            color: attr.color,
            title: attr.label,
        };
    }

    private submitLevel(value: AddressCaseDtoLevelEnum) {

        this.isSubmittingLevel = true;
        from(this.api.addressCaseApi.patchAddressCaseLevel(this.addressCase.id, value))
            .pipe(
                take(1),
                map(resp => resp.data),
                finalize(() => {
                    this.isSubmittingLevel = false;
                })
            ).subscribe(resBody => {
            this.reload(this.addressCase.id)
        }, console.error);
    }

    private submitStatus(value: AddressCaseDtoStatusEnum) {
        this.isSubmittingStatus = true;
        from(this.api.addressCaseApi.patchAddressCaseStatus(this.addressCase.id, value))
            .pipe(
                take(1),
                map(resp => resp.data),
                finalize(() => {
                    this.isSubmittingStatus = false;
                })
            ).subscribe(resBody => {
            this.reload(this.addressCase.id)
        }, console.error);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.addressCaseId) {
            if (this.addressCaseId) {
                this.reload(this.addressCaseId);
            }
        }
    }

    addScan() {
        this.router.navigate(['/address-scan/create'], {
            queryParams: {
                currencyId: this.addressCase.currencyId,
                address: this.addressCase.address
            }
        });
    }

    handleScanClick(row: AddressScanDto) {
        this.router.navigate(['address-scan', row.id]);
    }

    updateComment(item: CommentItem) {
        console.log(item);
        item.isEditing = true;
        item.currComment = item.data.comment;
    }

    submitCommentUpdates(item: CommentItem) {
        item.isSubmitting = true;
        from(this.api.addressCaseCommentApi.modifyAddressCase(item.data.id, {
            comment: item.currComment
        }))
            .pipe(
                take(1),
                map(resp => resp.data),
                finalize(() => {
                    item.isSubmitting = false;
                })
            ).subscribe(resBody => {
            item.isEditing = false;
            item.data = resBody;
        }, console.error);
    }

    deleteComment(item: CommentItem) {
        this.isCommentLoading = true;
        from(this.api.addressCaseCommentApi.deleteAddressCaseComment(item.data.id))
            .pipe(
                take(1),
                map(resp => resp.data),
                finalize(() => {
                    this.isCommentLoading = false;
                })
            ).subscribe(resBody => {
            this.reloadCommentList();
        }, console.error);
    }
}
