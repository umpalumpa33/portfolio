import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    const body = document.body;
    const main = document.querySelector('main');

    if (body.classList.contains('dark-mode') && main) {
      main.classList.add('dark-mode');
    } else if (!body.classList.contains('dark-mode') && main) {
      main.classList.remove('dark-mode');
    }
  }
}
