import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  template: '<app-header-component></app-header-component><router-outlet></router-outlet>'
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
