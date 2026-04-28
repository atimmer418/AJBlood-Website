import { Component, computed, signal } from '@angular/core';
import { PublicationCardComponent } from '../../components/publication-card/publication-card.component';

interface Publication {
  tag: string;
  year: number;
  title: string;
  authors: string;
  journal: string;
  doi: string;
  url?: string;
}

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [PublicationCardComponent],
  templateUrl: './publications.component.html',
  styleUrl: './publications.component.scss'
})
export class PublicationsComponent {
  readonly filters = ['All Publications', 'AI & LLMs', 'Cardiometabolic', 'Heart Failure', 'Remote Care'];
  readonly activeFilter = signal('All Publications');

  readonly publications: Publication[] = [
    {
      tag: 'AI & LLMs',
      year: 2025,
      title: 'Manual vs AI-Assisted Prescreening for Trial Eligibility Using Large Language Models — A Randomized Clinical Trial',
      authors: 'Unlu O, Varugheese M, Shin J, et al.',
      journal: 'JAMA, Vol 333, Issue 12',
      doi: 'DOI: 10.1001/jama.2024.28047',
    },
    {
      tag: 'AI & LLMs',
      year: 2024,
      title: 'Retrieval-Augmented Generation–Enabled GPT-4 for Clinical Trial Screening',
      authors: 'Unlu O, Shin J, Mailly C, et al.',
      journal: 'NEJM AI, 2024',
      doi: 'DOI: 10.1056/AIoa2400181',
    },
    {
      tag: 'Cardiometabolic',
      year: 2024,
      title: 'Randomized Evaluation of a Remote Management Program to Improve Guideline-Directed Medical Therapy: The DRIVE Trial',
      authors: 'Blood AJ, Chang LS, Hassan S, et al.',
      journal: 'Circulation, Vol 149, Issue 23',
      doi: 'DOI: 10.1161/CIRCULATIONAHA.124.069494',
    },
    {
      tag: 'Cardiometabolic',
      year: 2023,
      title: 'Results of a Remotely Delivered Hypertension and Lipid Program in More Than 10,000 Patients Across a Diverse Health Care Network',
      authors: 'Blood AJ, Cannon CP, Gordon WJ, et al.',
      journal: 'JAMA Cardiology, Vol 8, Issue 1',
      doi: 'DOI: 10.1001/jamacardio.2022.4018',
    },
    {
      tag: 'Heart Failure',
      year: 2024,
      title: 'Use of Sodium–Glucose Cotransporter 2 Inhibitors in Hospitalized Patients',
      authors: 'Unlu O, Bhatt AS, Blood AJ',
      journal: 'JACC: Advances, Vol 3, Issue 7',
      doi: 'DOI: 10.1016/j.jacadv.2024.101024',
    },
    {
      tag: 'Heart Failure',
      year: 2020,
      title: 'Remote Optimization of Guideline-Directed Medical Therapy in Patients with Heart Failure with Reduced Ejection Fraction',
      authors: 'Desai AS, Maclean TE, Blood AJ, et al.',
      journal: 'JAMA Cardiology, Vol 5, Issue 12',
      doi: 'DOI: 10.1001/jamacardio.2020.3757',
    },
    {
      tag: 'Remote Care',
      year: 2021,
      title: 'Workflow Automation for a Virtual Hypertension Management Program',
      authors: 'Gordon WJ, Blood AJ, Chaney K, et al.',
      journal: 'Applied Clinical Informatics, Vol 12, Issue 5',
      doi: 'DOI: 10.1055/s-0041-1739195',
    },
    {
      tag: 'Cardiometabolic',
      year: 2023,
      title: 'Implementation of a Scalable Online Weight Management Programme in Clinical Settings: Protocol for the PROPS 2.0 Programme',
      authors: 'Cho J, Noonan SH, Fay R, et al.',
      journal: 'BMJ Open, Vol 13, Issue 12',
      doi: 'DOI: 10.1136/bmjopen-2023-077520',
    },
    {
      tag: 'Remote Care',
      year: 2021,
      title: 'Disruptive and Sustaining Innovation in Telemedicine: A Strategic Roadmap',
      authors: 'Lee SG, Blood AJ, Gordon WJ, Scirica BM',
      journal: 'NEJM Catalyst Innovations in Care Delivery, Vol 2, Issue 6',
      doi: 'DOI: 10.1056/CAT.21.0311',
      url: 'https://catalyst.nejm.org/doi/full/10.1056/CAT.21.0311',
    },
    {
      tag: 'Cardiometabolic',
      year: 2025,
      title: 'Long-Term Blood Pressure Trends Following a Remote Hypertension Intervention',
      authors: 'Hassan S, Blood AJ, Zelle D, et al.',
      journal: 'Hypertension, Vol 82, Issue 4',
      doi: 'DOI: 10.1161/HYPERTENSIONAHA.124.24475',
    },
    {
      tag: 'Cardiometabolic',
      year: 2025,
      title: 'Digital Approaches to Obesity: Future Directions',
      authors: 'Falahee B, Ostrominski J, Blood A',
      journal: 'Canadian Journal of Cardiology, Vol 41, 1832–1835',
      doi: 'DOI: 10.1016/j.cjca.2025.03.011',
    },
  ];

  readonly filtered = computed(() => {
    const f = this.activeFilter();
    return f === 'All Publications' ? this.publications : this.publications.filter(p => p.tag === f);
  });

  setFilter(f: string) {
    this.activeFilter.set(f);
  }
}
