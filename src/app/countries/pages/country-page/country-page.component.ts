import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CountriesService } from '../../services/countries.services';
import { switchMap } from 'rxjs';
import { ByCapitalPageComponent } from '../by-capital-page/by-capital-page.component';
import { Country } from '../../interfaces/country';

@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
  styles: ``
})
export class CountryPageComponent implements OnInit {

  public country?: Country;

  constructor(
    private activatedRoute: ActivatedRoute,
    private countriesService: CountriesService,
    private router: Router
  ){}


  ngOnInit(): void {
   this.activatedRoute.params
   // como es un observable puedo usar pipe para poder usar los map... etc
   .pipe(
    // switchap regresa un nuevo observable, a los parametros llamamos al metodo de nuestro servicio
    switchMap( ({id}) =>this.countriesService.searchCountryByAlphaCode(id)),
   )
   .subscribe(country =>{
    if(!country){
      return this.router.navigateByUrl('');
    }

    return this.country = country;

   });
  }




}




/*
asi era antes de usar pipe
.subscribe((resp) =>{this.countriesService.searchCountryByAlphaCode(id)
    .subscribe(country => {console.log({country})})}); /*hay que subscribirse para que este atentos a los cambios de la url */

