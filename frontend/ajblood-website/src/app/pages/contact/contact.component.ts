import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  sent = signal(false);

  submit(e: Event) {
    e.preventDefault();
    this.sent.set(true);
  }
}
