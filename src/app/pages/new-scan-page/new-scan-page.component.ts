import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { take, takeUntil } from 'rxjs/operators';
import { BtcAddressScanPipelineApiService, BtcSingleAddressRoot } from 'src/sdk';
import { Router } from '@angular/router';
import { QrScannerService } from 'src/app/services/qr-scanner.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-new-scan-page',
  templateUrl: './new-scan-page.component.html',
  styleUrls: ['./new-scan-page.component.scss']
})
export class NewScanPageComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public isSubmitting = false;
  private unsubscribe$ = new Subject<void>();
  constructor(private router: Router, private qrScannerService: QrScannerService, private fb: FormBuilder, private httpClient: HttpClient, private btcAddressScanPipelineApiService: BtcAddressScanPipelineApiService) { }

  ngOnInit() {
    this.form = this.fb.group({
      scanType: ['BTC', [Validators.required]],
      address: ['', [Validators.required]],
      maxLevel: [5, [Validators.required]],
      dateRange: [[]],
    });

    this.qrScannerService.code$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(code => {
        this.form.controls.address.setValue(code);
      });

  }

  clearForm() {
    this.form.reset();
  }

  submitForm() {

    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }

    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;

    const body: BtcSingleAddressRoot = {
      address: formValue.address,
      maxLevel: formValue.maxLevel,
      startingTime: formValue.dateRange[0],
      endingTime: formValue.dateRange[1],
      timeoutSecs: 3600,
    };

    this.isSubmitting = true;
    this.btcAddressScanPipelineApiService.createBteAddressScanPipelineUsingPOSTDefault(body)
      .pipe(
        take(1)
      ).subscribe(pipeline => {
        this.router.navigateByUrl('/main-layout/scan-history');
      }, console.error, () => {
        this.isSubmitting = false;
      });


  }
  qrScan() {


    this.router.navigateByUrl('/main-layout/qr-scan');
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
