import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-holder-add',
  templateUrl: './holder-add.component.html',
  styleUrls: ['./holder-add.component.scss']
})
export class HolderAddComponent implements OnInit {

  public validateForm: FormGroup;


  constructor(private fb: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      namespace: [null, [Validators.required]],
      holderId: [null, [Validators.required]],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      country: [null, [Validators.required]],
      birthday: [null, [Validators.required]]
    });
  }

  submitForm(): void {
    console.log(this.validateForm.value);
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  handleCancel() {
    this.router.navigate(['/holder']);
  }

}
