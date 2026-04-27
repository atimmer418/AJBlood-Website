import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-podcast',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './podcast.component.html',
  styleUrl: './podcast.component.scss'
})
export class PodcastComponent {
  readonly episodes = [
    { title: 'Episode title placeholder one',   desc: 'Short description Dr. Blood will provide.',                    guest: 'Guest TBD', duration: '—', icon: 'podcasts' },
    { title: 'Episode title placeholder two',   desc: 'Conversation summary placeholder, two to three lines.',        guest: 'Guest TBD', duration: '—', icon: 'mic' },
    { title: 'Episode title placeholder three', desc: 'Conversation summary placeholder, two to three lines.',        guest: 'Guest TBD', duration: '—', icon: 'graphic_eq' },
    { title: 'Episode title placeholder four',  desc: 'Conversation summary placeholder, two to three lines.',        guest: 'Guest TBD', duration: '—', icon: 'headphones' },
    { title: 'Episode title placeholder five',  desc: 'Conversation summary placeholder, two to three lines.',        guest: 'Guest TBD', duration: '—', icon: 'campaign' },
    { title: 'Episode title placeholder six',   desc: 'Conversation summary placeholder, two to three lines.',        guest: 'Guest TBD', duration: '—', icon: 'record_voice_over' },
  ];
}
