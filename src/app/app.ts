import {Component} from '@angular/core';
import {Home} from './home/home';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [Home, RouterOutlet, RouterLink],
  template: ` 
  <!-- <main>
      <header class="brand-name">
        <img class="brand-logo" src="/public/logo.svg" alt="logo" aria-hidden="true" />
      </header>
      <section class="content">
        <app-home />
      </section>
    </main> -->
     <main>
      <a [routerLink]="['/']">
        <header class="brand-name">
          <img class="brand-logo" src="/public/home.jpg" alt="logo" aria-hidden="true" width="450" height="250" />
        </header>
      </a>
      <section class="content">
        <router-outlet />
      </section>
    </main>
  `,
  styleUrls: ['./app.css'],
})
export class App {
  //title = 'default';
}
