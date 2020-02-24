import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-namespace-add',
  templateUrl: './namespace-add.component.html',
  styleUrls: ['./namespace-add.component.scss']
})
export class NamespaceAddComponent implements OnInit {

  validateForm: FormGroup;


  constructor(private fb: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      namespace: [null, [Validators.required]]
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
    this.router.navigate(['/namespace']);
  }
}
