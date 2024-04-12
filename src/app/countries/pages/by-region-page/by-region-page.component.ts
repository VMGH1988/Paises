import { Component, OnInit } from '@angular/core';
import { Country } from '../../interfaces/country';
import { CountriesService } from '../../services/countries.services';
import { Region } from '../../interfaces/region.type';

// el type es como una interfac y la usamos aqui para asegurarnos que la region solo puede ser esas 5 k no nos puedan inyectar otra
//type Region = 'Africa'| 'Americas'| 'Asia'| 'Europe'| 'Oceania';




@Component({
  selector: 'app-by-region-page',
  templateUrl: './by-region-page.component.html',
  styles: ``
})
export class ByRegionPageComponent implements OnInit{

  public countries: Country[]=[];
  public regions: Region[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  //para ver que boton esta seleccionado
  public selectedRegion?: Region;

  constructor(private countriesService:CountriesService){}


  ngOnInit(): void {
   this.countries = this.countriesService.cacheStore.byRegion.countries;
   this.selectedRegion = this.countriesService.cacheStore.byRegion.region;
  }

  searchByRegion(region: Region):void{

    this.selectedRegion = region;

    this.countriesService.searchRegion(region).subscribe(countries =>{this.countries = countries});
  }


}
