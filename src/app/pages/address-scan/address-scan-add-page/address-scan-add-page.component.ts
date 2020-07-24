import {Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import {HttpClient} from '@angular/common/http';
import {filter, finalize, take, takeUntil} from 'rxjs/operators';
import {
  AccountApiService, AccountDto, AddressScanApiService, AddressScanCreation, CurrencyDto, ProjectDto,
} from '@profyu/unblock-ng-sdk';
import {ActivatedRoute, Router} from '@angular/router';
import {QrScannerService} from 'src/app/services/qr-scanner.service';
import {Subject} from 'rxjs';
import {UserService} from "../../../services/user.service";


@Component({
  selector: 'app-new-scan-page',
  templateUrl: './address-scan-add-page.component.html',
  styleUrls: ['./address-scan-add-page.component.scss']
})
export class AddressScanAddPageComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  public currencyId: string;
  @Input()
  public address: string;

  public form: FormGroup;
  public isSubmitting = false;
  private unsubscribe$ = new Subject<void>();
  currencies: CurrencyDto[];

  constructor(private router: Router,
              private qrScannerService: QrScannerService,
              private fb: FormBuilder,
              private httpClient: HttpClient,
              private addressScanApi: AddressScanApiService,
              private accountApiService: AccountApiService,
              private userService: UserService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {

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
      currencyId: [null, [Validators.required]],
      address: ['', [Validators.required]],
      forwardEnabled: [true],
      forwardMaxLevel: [3, [Validators.required]],
      backwardEnabled: [true],
      backwardMaxLevel: [3, [Validators.required]],
      dateRange: [[]],
    });

    this.qrScannerService.code$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(code => {
        this.form.controls.address.setValue(code);
      });

    this.activatedRoute.queryParams
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(params => params.currencyId)
      )
      .subscribe(params => {
        this.currencyId = params.currencyId;
        this.form.get('currencyId').setValue(this.currencyId);
      });
    this.activatedRoute.queryParams
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(params => params.address)
      )
      .subscribe(params => {
        this.address = params.address;
        this.form.get('address').setValue(this.address);
      });
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
      projectId: this.userService.project.id,
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
      ).subscribe(pipeline => {
      this.router.navigate(['address-scan']);
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
    if (changes.currencyId) {
      this.form.get('currencyId').setValue(this.currencyId);
    }
    if (changes.address) {
      this.form.get('address').setValue(this.address);
    }
  }


}
