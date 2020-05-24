import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
  AddressScanApiService, AddressScanBatchApiService,
  AddressScanBatchCreation, AddressScanBatchCreationFromBlob,
  AddressScanCreation,
  BlobApiService,
  BlobDto,
  CurrencyDto,
  FlowLabelingApiService
} from "@profyu/unblock-ng-sdk";
import {NzMessageService, UploadFile, UploadXHRArgs} from "ng-zorro-antd";
import {Router} from "@angular/router";
import {UserService} from "../../../services/user.service";
import {HttpClient} from "@angular/common/http";
import {take, takeUntil} from "rxjs/operators";

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
              private addressScanBatchApiService: AddressScanBatchApiService,
              public blobApiService: BlobApiService,
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
      forwardEnabled: [true],
      forwardMaxLevel: [3, [Validators.required]],
      backwardEnabled: [true],
      backwardMaxLevel: [3, [Validators.required]],
      dateRange: [[]],
      label: [null]
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

    const formValue = this.form.value;

    const body: AddressScanBatchCreationFromBlob = {
      name: formValue.name,
      projectId: this.userService.project.id,
      addressListBlobId:  (this.fileList[0].response as BlobDto).id,
      currencyId: formValue.currencyId,
      forwardMaxLevel: formValue.forwardMaxLevel,
      backwardMaxLevel: formValue.backwardMaxLevel,
      startingTime: formValue.dateRange[0],
      endingTime: formValue.dateRange[1],
      timeoutSecs: 3600,
    };

    this.isSubmitting = true;
    this.addressScanBatchApiService.createAddressScanBatchFromBlobUsingPOST(body).pipe(
      take(1)
    ).subscribe(resBody => {
      this.router.navigate(['/address-scan-batch']);
    }, (err) => console.error(err), () => {
      this.isSubmitting = false;
    });


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

    return this.blobApiService.createBlobUsingPOST(item.file as any)
      .pipe(
        take(1)
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
