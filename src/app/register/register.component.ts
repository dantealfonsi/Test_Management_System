import {Component, inject} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatIcon } from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatIcon,
    MatTooltipModule,
    MatDatepickerModule
  ],
  animations: [
    trigger('horizontalStepTransition', [
      state('start', style({ transform: 'translateX(0)' })),
      state('end', style({ transform: 'translateX(100%)' })),
      transition('start => end', animate('500ms ease-in')),
      transition('end => start', animate('500ms ease-out'))
    ])
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {


  ngOnInit(): void {
    this.initializeFormGroups();
  }

  private _formBuilder = inject(FormBuilder);
  secondFormGroup: any;
  firstFormGroup: any;
  thirdFormGroup: any;
  private readonly _currentYear = new Date().getFullYear();
  readonly minDate = new Date(this._currentYear - 100, 0, 1);
  readonly maxDateParent = new Date(this._currentYear - 18, 0, 1);
  readonly maxDateStudent = new Date(2017, 0, 1); // Por ejemplo, 01/01/1900


  initializeFormGroups() {
    this.firstFormGroup = this._formBuilder.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      birthday: ['', Validators.required],

    });

    this.secondFormGroup = this._formBuilder.group({
        password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[A-Za-z])[0-9A-Za-z!@#$%]{8,20}$/)]],
        email: ['', [Validators.required, Validators.email]],
    });
    
    this.thirdFormGroup = this._formBuilder.group({
      code: ['', Validators.required]
    });
  }
  isLinear = false;




  ////////////Validaciones//////////////////
  getPasswordError(): string {
    const passwordControl = this.secondFormGroup.get('password');
    if (passwordControl.hasError('required')) {
      return 'La contraseña es obligatoria.';
    }
  
    if (passwordControl.hasError('pattern')) {
      return 'La contraseña no cumple con los requisitos.';
    }
    return '';
  }


  ////////////BUTTON TIMER///////////


    timeLeft: number = 60;
    interval: any;
    isButtonDisabled: boolean = false;
    buttonText: string = "Obtener Código";  

  startTimer() {
    this.isButtonDisabled = true;
    this.timeLeft = 60;  // Reinicia el temporizador a 60 segundos
    this.updateButtonText();  // Actualiza el texto del botón
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateButtonText();  // Actualiza el texto del botón
      } else {
        this.isButtonDisabled = false;  // Habilita el botón
        this.buttonText = "Obtener Código";  // Cambia el texto del botón
        clearInterval(this.interval);
      }
    }, 1000);
  }

  updateButtonText() {
    this.buttonText = `${this.timeLeft}`;  // Actualiza el texto del botón con el tiempo restante
  }


  /////////END BUTTON TIMER ///////////////
}