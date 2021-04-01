import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-address-scan-add-form',
  templateUrl: './quick-scan-add-form.component.html',
  styleUrls: ['./quick-scan-add-form.component.scss']
})
export class QuickScanAddFormComponent implements OnInit {

  validateForm: FormGroup;
  maxLevel: number;
  private _selectedTab;

  constructor(private fb: FormBuilder,
              private router: Router) {
  }

  get selectedTab(): any {
    return this._selectedTab;
  }

  @Input()
  set selectedTab(val: any) {
    this._selectedTab = val;
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      address: [null, [Validators.required]],
      maxLevel: [0],
      rangePicker: [[], [Validators.required]]
    });
  }

  submitForm(): void {

    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      console.log(this.validateForm.value);
      console.log(this._selectedTab);
    } else {
      // validate all form fields
    }
  }

  handleCancel() {
    this.router.navigate(['/address-scan-page']);
  }
  qrScan() {
    this.router.navigate(['qr-scan']);
  }
}
