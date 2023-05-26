import { Component, OnInit } from '@angular/core';
import { faSchool,faHouse, faPersonChalkboard, faGraduationCap, faNoteSticky, faBook, faUserCheck, faPersonWalkingArrowRight} from '@fortawesome/free-solid-svg-icons';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  faSchool = faSchool;
  faHouse = faHouse;
  faPersonChalkboard = faPersonChalkboard;
  faGraduationCap = faGraduationCap;
  faNoteSticky = faNoteSticky;
  faBook = faBook;
  faUserCheck = faUserCheck;
  faPerson = faPersonWalkingArrowRight;

  authority: string = '';

  constructor(
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.authority = this.tokenService.getRoles();
  }

}
