export interface Article {
  slug: string;
  route: string;
  tag: string;
  title: string;
  displayDate: string;
  publishedAt: string;
  description: string;
  image: string;
  imageAlt: string;
  tags: string[];
}

export const articles: Article[] = [
  {
    slug: 'the-broken-middle',
    route: '/insights/the-broken-middle',
    tag: 'Clinical Trials',
    title: 'The Broken Middle: Three Structural Failures in Clinical Trial Eligibility',
    displayDate: 'April 2026',
    publishedAt: '2026-04-01',
    description:
      "For decades, the industry has told itself the same story: the bottleneck isn't at the front of the funnel. It's in the middle — at the moment when a coordinator sits down with a list of potential patients and tries to figure out who is actually eligible. That step is broken, and it's been broken for structural reasons that no amount of additional outreach will fix.",
    image: 'clinical-trial-data',
    imageAlt: 'Healthcare professional reviewing patient data on a laptop',
    tags: ['Clinical Trials', 'Patient Recruitment'],
  },
];

export function articlesByRecency(): Article[] {
  return [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
