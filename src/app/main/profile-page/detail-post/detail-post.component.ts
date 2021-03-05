import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-post',
  templateUrl: './detail-post.component.html',
  styleUrls: ['./detail-post.component.scss']
})
export class DetailPostComponent implements OnInit {
  @Input('src') srcImg: string;
  @Input('idPost') idPost: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    
  }

  onOpenPost(){
    this.router.navigate([`/profiles/posts/${this.idPost}`]);
  }
}
