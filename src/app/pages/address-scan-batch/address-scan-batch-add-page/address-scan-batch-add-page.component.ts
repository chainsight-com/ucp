import { Component, OnInit } from '@angular/core';
import { from, Subject } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService, UploadFile, UploadXHRArgs } from "ng-zorro-antd";
import { Router } from "@angular/router";
import { UserService } from "../../../services/user.service";
import { HttpClient } from "@angular/common/http";
import { finalize, map, take, takeUntil } from "rxjs/operators";
import { BlobDto, CurrencyDto } from '@chainsight/unblock-api-axios-sdk';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-address-scan-batch-add-page',
  templateUrl: './address-scan-batch-add-page.component.html',
  styleUrls: ['./address-scan-batch-add-page.component.scss']
})
export class AddressScanBatchAddPageComponent implements OnInit {

  public isSubmitting = false;
  public projectId: string;
  currencies: CurrencyDto[];
  public unsubscribe$ = new Subject<void>();
  form: FormGroup;
  public uploadedCsvBlob: BlobDto;
  public id: number;
  fileList: UploadFile[] = [];

  constructor(private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private message: NzMessageService,
    private api: ApiService,
    private http: HttpClient) {
  }

  ngOnInit(): void {

    this.userService.project$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((project) => {
        if (project) {
          this.currencies = project.currencies;
        }

      });

    this.form = this.fb.group({
      name: ['', [Validators.required]],
      currencyId: [null, [Validators.required]],
      method: ['TAINT', [Validators.required]],
      methodOptMaxN: [3, [Validators.required]],
      forwardEnabled: [true],
      forwardMaxLevel: [3, [Validators.required]],
      backwardEnabled: [true],
      backwardMaxLevel: [3, [Validators.required]],
      dateRange: [[]],
      label: [null],
      enableAddressCluster: [false, [Validators.required]],
      enablePrediction: [true, [Validators.required]],
      enableExcessiveMiddleAddressDetection: [true, [Validators.required]],
      enableCycleBackDetection: [true, [Validators.required]],
      enableNatureAmountDetection: [true, [Validators.required]],
      enableFusiformDetection: [true, [Validators.required]],
      enableLabelRiskDetection: [true, [Validators.required]],
    });
    this.userService.project$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(project => {
      console.log(project);
      if (!!project) {
        this.projectId = project.id;
      }
    });


  }

  submit(): void {
    console.log(this.form.value);
    if (this.fileList.length === 0) {
      alert('Please upload addresses CSV!');
    }
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }

    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;

    this.isSubmitting = true;
    from(this.api.addressScanBatchApi.createAddressScanBatchFromBlob({
      name: formValue.name,
      projectId: this.userService.project.id,
      addressListBlobId: (this.fileList[0].response as BlobDto).id,
      currencyId: formValue.currencyId,
      method: formValue.method,
      methodOptMaxN: formValue.methodOptMaxN,
      forwardMaxLevel: formValue.forwardMaxLevel,
      backwardMaxLevel: formValue.backwardMaxLevel,
      startingTime: formValue.dateRange[0],
      endingTime: formValue.dateRange[1],
      enableAddressCluster: formValue.enableAddressCluster,
      enablePrediction: formValue.enablePrediction,
      enableExcessiveMiddleAddressDetection: formValue.enableExcessiveMiddleAddressDetection,
      enableCycleBackDetection: formValue.enableCycleBackDetection,
      enableNatureAmountDetection: formValue.enableNatureAmountDetection,
      enableFusiformDetection: formValue.enableFusiformDetection,
      enableLabelRiskDetection: formValue.enableLabelRiskDetection,
      timeoutSecs: 3600,
    }))
      .pipe(
        take(1),
        map(resp => resp.data),
        finalize(() => {
          this.isSubmitting = false;
        })
      ).subscribe(resBody => {
        this.router.navigate(['/address-scan-batch']);
      }, (err) => console.error(err));


  }


  handleCancel() {
    this.router.navigate(['/address-scan-batch']);
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
  methodChanged(method: String): void {
    const ctrl = this.form.get('methodOptMaxN');
    if (method !== 'MAX') {
      ctrl.setValue(0);
    } else {
      ctrl.setValue(3);
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

  upoadReq = (item: UploadXHRArgs) => {
    // Create a FormData here to store files and other parameters.
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    formData.append('file', item.file as any);
    formData.append('id', '1000');

    return from(this.api.blobApi.createBlob(item.file as any))
      .pipe(
        take(1),
        map(resp => resp.data)
      ).subscribe(blob => {
        item.onSuccess!(blob, item.file!, null);
      }, err => {
        item.onError!(err, item.file!);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
