import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { BtcAddressScanPipelineApiService, BtcSingleAddressRoot } from 'src/sdk';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-scan-page',
  templateUrl: './new-scan-page.component.html',
  styleUrls: ['./new-scan-page.component.scss']
})
export class NewScanPageComponent implements OnInit {

  public form: FormGroup;
  public isSubmitting = false;
  constructor(private router: Router, private fb: FormBuilder, private httpClient: HttpClient, private btcAddressScanPipelineApiService: BtcAddressScanPipelineApiService) { }

  ngOnInit() {
    this.form = this.fb.group({
      scanType: ['BTC', [Validators.required]],
      address: ['12etp4a21L5ks7KKuNtEFx2r1ZqbwEampq', [Validators.required]],
      maxLevel: [5, [Validators.required]],
      dateRange: [[new Date('2015-10-27T00:00:00.000+0000'), new Date('2015-10-30T00:00:00.000+0000')], [Validators.required]],
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

}
