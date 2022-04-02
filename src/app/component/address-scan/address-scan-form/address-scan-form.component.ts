import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import {
  AccountApiService,
  AddressScanApiService,
  AddressScanCreation,
  CurrencyDto, ProjectApiService
} from "@profyu/unblock-ng-sdk";
import { ActivatedRoute, Router } from "@angular/router";
import { QrScannerService } from "../../../services/qr-scanner.service";
import { HttpClient } from "@angular/common/http";
import { UserService } from "../../../services/user.service";
import { filter, finalize, take, takeUntil } from "rxjs/operators";
import { NzMessageService } from "ng-zorro-antd";
import { ApiService } from 'src/app/services/api.service';
import { AddressScanDto } from '@chainsight/unblock-api-axios-sdk';

@Component({
  selector: 'app-address-scan-form',
  templateUrl: './address-scan-form.component.html',
  styleUrls: ['./address-scan-form.component.scss']
})
export class AddressScanFormComponent implements OnInit, OnChanges {
  @Input()
  public projectId: string;
  @Input()
  public currencyId: string;
  @Input()
  public address: string;
  @Input()
  public forceEnableAddressCluster: boolean = false;

  @Output()
  public onSubmitted: EventEmitter<AddressScanDto> = new EventEmitter<AddressScanDto | AddressScanDto>();

  private unsubscribe$ = new Subject<void>();

  public form: FormGroup;
  public isSubmitting = false;
  public currencies: CurrencyDto[] = [];

  constructor(private qrScannerService: QrScannerService,
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private addressScanApi: AddressScanApiService,
    private accountApiService: AccountApiService,
    private projectApiService: ProjectApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private message: NzMessageService,
    private api: ApiService) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      projectId: [this.projectId, [Validators.required]],
      currencyId: [this.currencyId, [Validators.required]],
      address: [this.address, [Validators.required]],
      method: ['TAINT', [Validators.required]],
      methodOptMaxN: [3, [Validators.required]],
      forwardEnabled: [true],
      forwardMaxLevel: [2, [Validators.required]],
      backwardEnabled: [true],
      backwardMaxLevel: [2, [Validators.required]],
      dateRange: [[]],
      enableAddressCluster: [this.forceEnableAddressCluster, [Validators.required]],
      enablePrediction: [true, [Validators.required]],
      enableExcessiveMiddleAddressDetection: [true, [Validators.required]],
      enableCycleBackDetection: [true, [Validators.required]],
      enableNatureAmountDetection: [true, [Validators.required]],
      enableFusiformDetection: [true, [Validators.required]],
      enableLabelRiskDetection: [true, [Validators.required]],
    });

    this.reload();

    this.qrScannerService.code$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(code => {
        this.form.controls.address.setValue(code);
      });
  }

  reload() {
    this.form.get('projectId').setValue(this.projectId);
    this.form.get('currencyId').setValue(this.currencyId);
    this.form.get('address').setValue(this.address);
    this.projectApiService.getProjectUsingGET(this.projectId)
      .pipe(
        take(1)
      ).subscribe((proj) => {
        this.currencies = proj.currencies;
      }, console.error);
  }

  clear() {
    this.form.reset();
  }

  submit() {

    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }

    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;

    if (!formValue.forwardEnabled && !formValue.backwardEnabled) {
      this.message.error(`<span class="pfy-message-error">You must enable either backward or forward scanning</span>`);
      return;
    }


    this.isSubmitting = true;

    this.api.addressScanApi.createAddressScanUsingPOST({
      projectId: formValue.projectId,
      currencyId: formValue.currencyId,
      address: formValue.address,
      method: formValue.method,
      methodOptMaxN: formValue.methodOptMaxN,
      forwardMaxLevel: formValue.forwardMaxLevel,
      backwardMaxLevel: formValue.backwardMaxLevel,
      startingTime: formValue.dateRange[0],
      endingTime: formValue.dateRange[1],
      timeoutSecs: 3600,
      batchMode: false,
      enableAddressCluster: formValue.enableAddressCluster,
      enablePrediction: formValue.enablePrediction,
      enableExcessiveMiddleAddressDetection: formValue.enableExcessiveMiddleAddressDetection,
      enableCycleBackDetection: formValue.enableCycleBackDetection,
      enableNatureAmountDetection: formValue.enableNatureAmountDetection,
      enableFusiformDetection: formValue.enableFusiformDetection,
      enableLabelRiskDetection: formValue.enableLabelRiskDetection,
    }).then((resp) => {
      this.onSubmitted.emit(resp.data);

    }, console.error)
      .finally(() => {
        this.isSubmitting = false;
      });

    // (this.addressScanApi as any).createAddressScanUsingPOST({
    //   projectId: formValue.projectId,
    //   currencyId: formValue.currencyId,
    //   address: formValue.address,
    //   method: formValue.method,
    //   methodOptMaxN: formValue.methodOptMaxN,
    //   forwardMaxLevel: formValue.forwardMaxLevel,
    //   backwardMaxLevel: formValue.backwardMaxLevel,
    //   startingTime: formValue.dateRange[0],
    //   endingTime: formValue.dateRange[1],
    //   timeoutSecs: 3600,
    //   batchMode: false,
    //   enableAddressCluster: formValue.enableAddressCluster,
    //   enablePrediction: formValue.enablePrediction,
    //   enableExcessiveMiddleAddressDetection: formValue.enableExcessiveMiddleAddressDetection,
    //   enableCycleBackDetection: formValue.enableCycleBackDetection,
    //   enableNatureAmountDetection: formValue.enableNatureAmountDetection,
    //   enableFusiformDetection: formValue.enableFusiformDetection,
    //   enableLabelRiskDetection: formValue.enableLabelRiskDetection,
    // })
    //   .pipe(
    //     take(1),
    //     finalize(() => {
    //       this.isSubmitting = false;
    //     })
    //   ).subscribe(created => {
    //     this.onSubmitted.emit(created);
    //   }, console.error);

  }

  qrScan() {
    this.router.navigate(['qr-scan']);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  methodChanged(method: String): void {
    const ctrl = this.form.get('methodOptMaxN');
    if (method !== 'MAX') {
      ctrl.setValue(0);
    } else {
      ctrl.setValue(3);
    }
    ctrl.updateValueAndValidity();
  }

  forwardEnableChanged(forwardEnabled: boolean): void {
    const ctrl = this.form.get('forwardMaxLevel');
    if (!forwardEnabled) {
      ctrl.setValue(0);
    } else {
      ctrl.reset();
    }
    ctrl.updateValueAndValidity();
  }

  backwardEnableChanged(backwardEnabled: boolean): void {
    const ctrl = this.form.get('backwardMaxLevel');
    if (!backwardEnabled) {
      ctrl.setValue(0);
    } else {
      ctrl.reset();
    }
    ctrl.updateValueAndValidity();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!this.form) {
      if (changes.projectId || changes.currencyId || changes.address) {
        this.reload();
      }

    }

  }

}
