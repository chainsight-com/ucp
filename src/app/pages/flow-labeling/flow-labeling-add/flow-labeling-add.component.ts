import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../../services/user.service';
import {
  FlowLabelingApiService,
  BlobDto,
  BlobApiService,
  CurrencyDto,
  LabelDto,
  LabelApiService, LabelCategoryDto, LabelCategoryApiService
} from '@profyu/unblock-ng-sdk';
import {NzMessageService, UploadFile, UploadXHRArgs} from 'ng-zorro-antd';
import {HttpClient, HttpEventType, HttpResponse} from '@angular/common/http';
import {takeUntil, take} from 'rxjs/operators';
import {Subject} from 'rxjs';


@Component({
  selector: 'app-flow-labeling-add',
  templateUrl: './flow-labeling-add.component.html',
  styleUrls: ['./flow-labeling-add.component.scss']
})
export class FlowLabelingAddComponent implements OnInit, OnDestroy {
  public categories: LabelCategoryDto[];
  public labels: LabelDto[]
  public isSubmitting = false;
  public projectId: string;
  public unsubscribe$ = new Subject<void>();
  public uploadedCsvBlob: BlobDto;
  public id: number;
  public isEditing = false;
  fileList: UploadFile[] = [];
  currencies: CurrencyDto[];
  form: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router,
              private userService: UserService,
              private message: NzMessageService,
              private flowLabelingApiService: FlowLabelingApiService,
              private labelCategoryApiService: LabelCategoryApiService,
              private labelApiService: LabelApiService,
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
          this.projectId = project.id;
          this.reloadLabelCategories(project.id);
        }

      });

    this.form = this.fb.group({
      currencyId: [null, [Validators.required]],
      forwardEnabled: [true],
      forwardMaxLevel: [3, [Validators.required]],
      backwardEnabled: [true],
      backwardMaxLevel: [3, [Validators.required]],
      dateRange: [null, Validators.required],
      categoryId: [null],
      labelId: [null, Validators.required]
    });

    this.form.controls.categoryId.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(categoryId => {
        if (categoryId) {
          this.reloadLabels(categoryId);
        }
      });


  }

  submitForm(): void {
    console.log(this.form.value);
    if (this.fileList.length === 0) {
      alert('Please upload root address CSV!');
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
    this.flowLabelingApiService.createFlowLabelingUsingPOST({
      currencyId: formValue.currencyId,
      forwardMaxLevel: formValue.forwardMaxLevel,
      backwardMaxLevel: formValue.backwardMaxLevel,
      startingTime: formValue.dateRange[0],
      endingTime: formValue.dateRange[1],
      timeoutSecs: '3600',
      labelId: formValue.labelId,
      projectId: this.projectId,
      addressListBlobId: (this.fileList[0].response as BlobDto).id
    }).pipe(
      take(1)
    ).subscribe(resBody => {
      this.router.navigate(['/flow-labeling-page']);
    }, (err) => console.error(err), () => {
      this.isSubmitting = false;
    });


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


  handleCancel() {
    this.router.navigate(['/flow-labeling-page']);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private reloadLabelCategories(projectId: string) {
    this.labelCategoryApiService.listLabelCategoriesUsingGET(projectId)
      .pipe(
        take(1)
      ).subscribe(resp => {
      this.categories = resp;
    });
  }

  private reloadLabels(categoryId: string) {
    this.form.controls.categoryId.setValue(null);
    this.labelApiService.listLabelsUsingGET(categoryId)
      .pipe(
        take(1)
      ).subscribe(resp => {
      this.labels = resp;
    });
  }

}
