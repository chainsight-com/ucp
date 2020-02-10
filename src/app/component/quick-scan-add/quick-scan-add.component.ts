import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-quick-scan-add',
  templateUrl: './quick-scan-add.component.html',
  styleUrls: ['./quick-scan-add.component.scss']
})
export class QuickScanAddComponent implements OnInit {
  validateForm: FormGroup;
  maxLevel: number;
  private _selectedTab;

  constructor(private fb: FormBuilder) {
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
      // console.log('selected tab:', this.selectedIndex);
      console.log(this.validateForm.value);
      console.log(this._selectedTab);
    } else {
      // validate all form fields
    }
  }
}
