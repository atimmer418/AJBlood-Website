import { Component } from '@angular/core';
import { QuoteSectionComponent } from '../../components/quote-section/quote-section.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [QuoteSectionComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  readonly roles = ['Harvard Medical School', "Brigham & Women's Hospital", 'AIwithCare CEO'];

  readonly affiliations = [
    { mark: 'aff-hms',  label: 'Harvard Medical School',                                              short: 'HMS' },
    { mark: 'aff-bwh',  label: "Brigham and Women's Hospital",                                        short: 'BWH' },
    { mark: 'aff-aiwc', label: 'AIwithCare',                                                          short: 'AIwithCare' },
    { mark: 'aff-aha',  label: 'American Heart Association — Health Technology Advisory Group',        short: 'AHA' },
  ];

  readonly timeline = [
    {
      date: 'High School',
      title: 'Sidwell Friends School',
      desc: 'Early interest in health policy and technology took root during secondary education in Washington, D.C.',
      active: false,
    },
    {
      date: '2010',
      title: 'Johns Hopkins University, B.A.',
      desc: 'Neuroscience, entrepreneurship, and management. Basic science research alongside pre-medical training.',
      active: false,
    },
    {
      date: '2010 — 2011',
      title: 'National Institutes of Health',
      desc: 'Post-baccalaureate research fellowship at NICHD. Awarded Best Research Poster for work in neurodevelopmental biology.',
      active: false,
    },
    {
      date: '2015',
      title: 'Zucker School of Medicine at Hofstra/Northwell',
      desc: 'Member of the inaugural class. Student body president and Faculty Council Leadership awardee. Interned with Northwell CEO Michael Dowling.',
      active: false,
    },
    {
      date: '2015 — 2018',
      title: 'Duke University Health System',
      desc: 'Internal Medicine Residency. Developed a research interest in remote healthcare delivery and integrating technology to make care easier to both provide and consume.',
      active: false,
    },
    {
      date: '2018 — Present',
      title: 'Harvard Medical School & Harvard T.H. Chan School of Public Health',
      desc: "Cardiology and Critical Care fellowships at Brigham and Women's. Worked with the One Brave Idea research group and the Digital Care Transformation team building AI models and care algorithms to equitably initiate, titrate, and monitor therapy for chronic disease. M.Sc. in Epidemiology focused on informatics and machine learning. Now an HMS instructor and Director of the Cardiac Intensive Care Unit at Newton Wellesley Hospital.",
      active: true,
    },
  ];
}
