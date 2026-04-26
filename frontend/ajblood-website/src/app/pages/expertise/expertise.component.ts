import { Component } from '@angular/core';
import { ExpertiseCardComponent } from '../../components/expertise-card/expertise-card.component';
import { CtaSectionComponent } from '../../components/cta-section/cta-section.component';

@Component({
  selector: 'app-expertise',
  standalone: true,
  imports: [ExpertiseCardComponent, CtaSectionComponent],
  templateUrl: './expertise.component.html',
  styleUrl: './expertise.component.scss'
})
export class ExpertiseComponent {
  readonly cards = [
    {
      icon: 'cardiology',
      title: 'Cardiology & Critical Care',
      desc: "Practicing at the forefront of Brigham and Women's Hospital, focusing on the acute stabilization of complex cardiovascular disease.",
      tags: ['Cath Lab', 'Hemodynamics'],
      dark: false,
    },
    {
      icon: 'psychology',
      title: 'AI in Healthcare',
      desc: 'Pioneering generative AI frameworks to streamline clinical workflows and enhance diagnostic precision without losing the human touch.',
      tags: ['Generative LLMs', 'Predictive Diagnostics'],
      dark: false,
    },
    {
      icon: 'science',
      title: 'Research & Transformation',
      desc: 'Leading the DRIVE study and massive-scale clinical trials aimed at decentralizing care and validating digital interventions.',
      tags: ['Clinical Trials', 'DRIVE Study'],
      dark: false,
    },
    {
      icon: 'monitor_weight',
      title: 'Obesity Medicine',
      desc: 'Integrated metabolic management strategies that treat obesity as a foundational driver of cardiovascular risk.',
      tags: ['Pharmacological', 'Digital Tools'],
      dark: false,
    },
  ];
}
