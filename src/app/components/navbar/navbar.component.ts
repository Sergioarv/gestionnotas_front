import { Component, OnInit } from '@angular/core';
import { faSchool, faHouse, faPersonChalkboard, faGraduationCap, faNoteSticky, faBook, faUserCheck, faPersonWalkingArrowRight } from '@fortawesome/free-solid-svg-icons';
import { TokenService } from 'src/app/services/token.service';

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

  isLogged = false;
  roles: string[] = [];
  authority: string = '';

  constructor(
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.authority = this.tokenService.getRoles();
    this.isLogged = this.tokenService.isLogged(); 
  }

  onLogOut(): void {
    this.tokenService.logOut();
  }

}
