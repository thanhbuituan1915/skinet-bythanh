import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-text-input',
  imports: [ReactiveFormsModule, MatFormField, MatInput, MatError, MatLabel],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css',
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type = 'text';

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}

  get control() {
    return this.controlDir.control as FormControl;
  }
}

// import { Component, Input, Self } from '@angular/core';
// import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
// import { MatInputModule } from '@angular/material/input';
// import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';

// @Component({
//   selector: 'app-text-input',
//   standalone: true,
//   imports: [ReactiveFormsModule, MatFormField, MatInputModule, MatError, MatLabel],
//   templateUrl: './text-input.component.html',
//   styleUrl: './text-input.component.css',
// })
// export class TextInputComponent implements ControlValueAccessor {
//   @Input() label = '';
//   @Input() type = 'text';

//   value = '';

//   constructor(@Self() public controlDir: NgControl) {
//     this.controlDir.valueAccessor = this;
//   }

//   onChange: any = () => {};
//   onTouched: any = () => {};

//   writeValue(value: any): void {
//     this.value = value;
//   }

//   registerOnChange(fn: any): void {
//     this.onChange = fn;
//   }

//   registerOnTouched(fn: any): void {
//     this.onTouched = fn;
//   }

//   updateValue(event: Event) {
//     const input = event.target as HTMLInputElement;
//     this.value = input.value;
//     this.onChange(this.value);
//     this.onTouched();
//   }

//   get control() {
//     return this.controlDir.control as FormControl;
//   }
// }
