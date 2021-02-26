import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('f') searchForm: NgForm;


  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(){
    console.log(this.searchForm.value.search);
    this.router.navigate(['/profiles/search', this.searchForm.value.search]);
    this.searchForm.reset();
  }

}