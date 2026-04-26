import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cta-section.component.html',
  styleUrl: './cta-section.component.scss'
})
export class CtaSectionComponent {
  @Input() headline = 'Advance the Pulse of Innovation.';
  @Input() body = 'Available for strategic consultations, speaking engagements, and collaborative research initiatives at the intersection of medicine and technology.';
  @Input() buttonText = 'Inquire about Collaboration';
}
