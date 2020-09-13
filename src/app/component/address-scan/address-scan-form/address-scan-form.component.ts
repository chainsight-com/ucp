import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {
  AccountApiService,
  AddressScanApiService,
  AddressScanCreation,
  AddressScanDto,
  CurrencyDto, ProjectApiService
} from "@profyu/unblock-ng-sdk";
import {ActivatedRoute, Router} from "@angular/router";
import {QrScannerService} from "../../../services/qr-scanner.service";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../../services/user.service";
import {filter, finalize, take, takeUntil} from "rxjs/operators";

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

  @Output()
  public onSubmitted: EventEmitter<AddressScanDto> = new EventEmitter<AddressScanDto>();

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
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      projectId: [this.projectId, [Validators.required]],
      currencyId: [this.currencyId, [Validators.required]],
      address: [this.address, [Validators.required]],
      forwardEnabled: [true],
      forwardMaxLevel: [3, [Validators.required]],
      backwardEnabled: [true],
      backwardMaxLevel: [3, [Validators.required]],
      dateRange: [[]],
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

    const body: AddressScanCreation = {
      projectId: formValue.projectId,
      currencyId: formValue.currencyId,
      address: formValue.address,
      forwardMaxLevel: formValue.forwardMaxLevel,
      backwardMaxLevel: formValue.backwardMaxLevel,
      startingTime: formValue.dateRange[0],
      endingTime: formValue.dateRange[1],
      timeoutSecs: 3600,
      batchMode: false,
    };


    this.isSubmitting = true;
    this.addressScanApi.createAddressScanUsingPOST(body)
      .pipe(
        take(1),
        finalize(() => {
          this.isSubmitting = false;
        })
      ).subscribe(created => {
      this.onSubmitted.emit(created);
    }, console.error);

  }

  qrScan() {
    this.router.navigate(['qr-scan']);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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