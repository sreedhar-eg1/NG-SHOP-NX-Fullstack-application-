import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';

import { AuthAction } from '@frontend/users';

import { NxWelcome } from './nx-welcome';

@Component({
  imports: [NxWelcome, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private store = inject(Store)

  ngOnInit(): void {
      this.store.dispatch(AuthAction.buildUserSession())
  }
}
