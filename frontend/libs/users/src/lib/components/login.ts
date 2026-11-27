import { Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Message } from 'primeng/message';
import { Button } from 'primeng/button';

import { Store } from '@ngrx/store';
import { authFeature } from '../state/auth.reducer';
import { AuthAction } from '../state/auth.actions';

@Component({
  selector: 'ngshop-login',
  imports: [ReactiveFormsModule, InputText, Password, Message, Button],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  // Optional route data input (e.g., '/dashboard' in admin, '/' in eshop)
  redirectUrl = input<string>('/');

  loading = this.store.selectSignal(authFeature.selectLoading);
  error = this.store.selectSignal(authFeature.selectError);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.getRawValue();

    this.store.dispatch(
      AuthAction.login({ email, password, redirectUrl: this.redirectUrl() }),
    );
  }
}
