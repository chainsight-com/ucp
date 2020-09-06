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
import {Subject, pipe} from 'rxjs';
import {takeUntil, take, mergeMap, finalize} from 'rxjs/operators';
import * as dateFns from 'date-fns';
import {
  AddressCaseApiService, AddressCaseCommentApiService, AddressCaseCommentCreation,
  AddressCaseCommentDto, AddressCaseCreation,
  AddressCaseDto,
  AddressScanApiService,
  AddressScanDto, FlowGraphDto, PageOfTaintRecordDto, PageOfWitnessDto
} from '@profyu/unblock-ng-sdk';
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
  public _level: AddressCaseDto.LevelEnum;
  get level(): AddressCaseDto.LevelEnum {
    return this._level;
  }

  set level(value: AddressCaseDto.LevelEnum) {
    this._level = value;
    if (this.addressCase && value && this.addressCase.level !== value) {
      this.submitLevel(value);
    }


  }

  public addressCaseStatusList = ADDRESS_CASE_STATUS_LIST;
  public isSubmittingStatus: boolean;
  public _status: AddressCaseDto.StatusEnum;
  get status(): AddressCaseDto.StatusEnum {
    return this._status;
  }

  set status(value: AddressCaseDto.StatusEnum) {
    this._status = value;
    if (this.addressCase && value && this.addressCase.status !== value) {
      this.submitStatus(value);
    }


  }


  // comment
  public isCommentLoading = false;
  public commentPageIdx = 0;
  public commentPageSize = 30;
  public comments: AddressCaseCommentDto[] = [];

  // comment form
  public isSubmittingComment: boolean;
  public commentForm: FormGroup;

  private unsubscribe$ = new Subject<void>();



  constructor(private router: Router,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private addressCaseApiService: AddressCaseApiService,
              private addressCaseCommentApiService: AddressCaseCommentApiService) {

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
    this.addressCaseApiService.getAddressCaseUsingGET(id)
      .pipe(
        take(1)
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
    this.isCommentLoading = false;
    this.addressCaseApiService.listAddressCaseCommentUsingGET(this.addressCase.id)
      .pipe(
        take(1),
        finalize(() => {
          this.isCommentLoading = false;
        })
      ).subscribe(resBody => {
      this.comments = resBody;
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
    this.addressCaseCommentApiService.createAddressCaseCommentUsingPOST(body)
      .pipe(
        take(1),
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

  statusFormatter(status: AddressCaseDto.StatusEnum) {

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

  levelFormatter(level: AddressCaseDto.LevelEnum) {
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

  private submitLevel(value: AddressCaseDto.LevelEnum) {

    this.isSubmittingLevel = true;
    this.addressCaseApiService.patchAddressCaseLevelUsingPATCH(this.addressCase.id, value)
      .pipe(
        take(1),
        finalize(() => {
          this.isSubmittingLevel = false;
        })
      ).subscribe(resBody => {
      this.reload(this.addressCase.id)
    }, console.error);
  }

  private submitStatus(value: AddressCaseDto.StatusEnum) {
    this.isSubmittingStatus = true;
    this.addressCaseApiService.patchAddressCaseStatusUsingPATCH(this.addressCase.id, value)
      .pipe(
        take(1),
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


}
