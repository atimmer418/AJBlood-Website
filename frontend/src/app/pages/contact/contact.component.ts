import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  sent = signal(false);
  submitting = signal(false);
  error = signal<string | null>(null);

  async submit(e: SubmitEvent) {
    e.preventDefault();
    if (this.submitting()) return;

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const payload = {
      fullName: String(data.get('fullName') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      org: String(data.get('org') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
    };

    if (!payload.fullName || !payload.email || !payload.message) {
      this.error.set('Please fill in your name, email, and message.');
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      this.sent.set(true);
    } catch {
      this.error.set('Something went wrong sending your message. Please try again.');
    } finally {
      this.submitting.set(false);
    }
  }
}
