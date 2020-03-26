import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { HolderGroupApiService, FlowLabelingApiService, FlowLabelingCreation, UnblockBlobApiService, BlobDto } from '@profyu/unblock-ng-sdk';
import { NzMessageService, UploadFile, UploadXHRArgs } from 'ng-zorro-antd';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { takeUntil, take } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-flow-labeling-add',
  templateUrl: './flow-labeling-add.component.html',
  styleUrls: ['./flow-labeling-add.component.scss']
})
export class FlowLabelingAddComponent implements OnInit, OnDestroy {

  public isSubmitting = false;
  public projectId: number;
  public unsubscribe$ = new Subject<void>();
  validateForm: FormGroup;
  public uploadedCsvBlob: BlobDto;
  public id: number;
  public isEditing = false;
  fileList: UploadFile[] = [];
  currencyOpts = [
    { name: 'BTC', val: '1' },
    { name: 'ETH', val: '2' },
    { name: 'USDT', val: '3' },
    { name: 'ZIL', val: '4' }
  ];

  constructor(private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private message: NzMessageService,
    private flowLabelingApiService: FlowLabelingApiService,
    public blobApiService: UnblockBlobApiService,
    private http: HttpClient) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      currency: [null, [Validators.required]],
      maxLevel: [3],
      dateRange: [null],
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

  submitForm(): void {
    console.log(this.validateForm.value);
    if (this.fileList.length === 0) {
      alert('Please upload root address CSV!');
    }
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    const formValue = this.validateForm.value;
    this.isSubmitting = true;
    this.flowLabelingApiService.createProjectUsingPOST({
      currencyId: formValue.currency,
      maxLevel: formValue.maxLevel,
      startingTime: formValue.dateRange[0],
      endingTime: formValue.dateRange[1],
      timeoutSecs: 3600,
      labelName: formValue.label,
      projectId: this.projectId,
      rootCsvBlobId: (this.fileList[0].response as BlobDto).id
    }).pipe(
      take(1)
    ).subscribe(resBody => {
      this.router.navigate(['/flow-labeling']);
    }, (err) => console.error(err), () => {
        this.isSubmitting = false;
    });


  }

  customReq = (item: UploadXHRArgs) => {
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

  handleCancel() {
    this.router.navigate(['/flow-labeling']);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
