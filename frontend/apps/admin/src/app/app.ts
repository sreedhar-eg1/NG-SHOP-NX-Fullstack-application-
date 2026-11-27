import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';

import { NxWelcome } from './nx-welcome';
import { AuthAction } from '@frontend/users';

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
