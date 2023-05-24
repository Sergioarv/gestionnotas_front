import { Component, OnInit } from '@angular/core';
import { faSchool,faHouse, faPersonChalkboard, faGraduationCap, faNoteSticky, faBook, faUserCheck, faPersonWalkingArrowRight} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  faSchool = faSchool;
  faHouse = faHouse;
  faPersonChalkboard = faPersonChalkboard;
  faGraduationCap = faGraduationCap;
  faNoteSticky = faNoteSticky;
  faBook = faBook;
  faUserCheck = faUserCheck;
  faPerson = faPersonWalkingArrowRight;
  
  constructor() { }

  ngOnInit(): void {
  }

  onLogOut(): void {
   
  }

}
