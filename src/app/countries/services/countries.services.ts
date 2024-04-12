import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, map, of, tap } from 'rxjs';
import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';


@Injectable({providedIn: 'root'})
export class CountriesService {

  private apiURL: string = 'https://restcountries.com/v3.1';
  //Para coger los datos de las paginas en el servicio y que sean persistentes por ejemplo de byCapital: {term:'', countries:[]}
  public cacheStore: CacheStore ={
    byCapital: {term:'', countries:[]},
    byCountries: {term:'', countries:[]},
    byRegion: {region:'', countries:[]},
  }


  constructor(private http: HttpClient) {
    // esto hace que  al recargar la pagina (hacer otra peticion http) mire lo que hay en el local
    this.loadFromLocalStorage();
  }


  private saveToLocalStorage(){
    localStorage.setItem('casheStore', JSON.stringify(this.cacheStore));
  }



  private loadFromLocalStorage(){
    if(!localStorage.getItem('casheStore')) return;
    this.cacheStore = JSON.parse(localStorage.getItem('casheStore')!);
  }

  private getCountriesRequest(url: string):Observable<Country[]>{

    return this.http.get<Country[]>(url)
    .pipe(
      catchError(() => of([])),
     // delay(2000),
      );
  }


  searchCountryByAlphaCode(code: string): Observable<Country | null>{
    const url = `${this.apiURL}/alpha/${code}`;

   return this.http.get<Country[]>(url)
    //hago un map para que me devuelva el primer objeto del array ya que la api nos lo da en un array aunque sea un objeto, y si no hay nos deuelve null
   .pipe(
      map(countries => countries.length > 0 ? countries[0]: null),
      catchError(() => of(null)),

   );
  }



  searchCapital(term: string): Observable<Country[]>{

    const url = `${this.apiURL}/capital/${term}`;
    return this.getCountriesRequest(url)
    .pipe(
      tap( countries => this.cacheStore.byCapital = {term, countries}),
      tap(()=> this.saveToLocalStorage()),
    );
  }



  searchCountry(term: string): Observable<Country[]>{

    const url = `${this.apiURL}/name/${term}`;
    return this.getCountriesRequest(url)
    .pipe(
      tap( countries => this.cacheStore.byCountries = {term, countries}),
      tap(()=> this.saveToLocalStorage()),
    );
  }


  searchRegion(region: Region): Observable<Country[]>{

    const url = `${this.apiURL}/region/${region}`;
    return this.getCountriesRequest(url)
    .pipe(
      tap( countries => this.cacheStore.byRegion = {region, countries}),
      tap(()=> this.saveToLocalStorage()),
    );
  }


}

/*    Codigo sin refactorizar


@Injectable({providedIn: 'root'})
export class CountriesService {

  private apiURL: string = 'https://restcountries.com/v3.1'

  constructor(private http: HttpClient) { }

  searchCountryByAlphaCode(code: string): Observable<Country | null>{
    const url = `${this.apiURL}/alpha/${code}`;

   return this.http.get<Country[]>(url)
    //hago un map para que me devuelva el primer objeto del array ya que la api nos lo da en un array aunque sea un objeto, y si no hay nos deuelve null
   .pipe(

    map(countries => countries.length > 0 ? countries[0]: null),
   catchError(() => of(null))
   );
  }



  searchCapital(term: string): Observable<Country[]>{
    const url = `${this.apiURL}/capital/${term}`;

   return this.http.get<Country[]>(url)
   .pipe(
   catchError(() => of([]))
   );
   // con el catchError(error => of([])) captura el error y regresa un array vacio
  }




searchCountry(term: string): Observable<Country[]>{

  const url = `${this.apiURL}/name/${term}`;
  return this.http.get<Country[]>(url)
}




searchRegion(region: string): Observable<Country[]>{

  const url = `${this.apiURL}/region/${region}`;
  return this.http.get<Country[]>(url)
}


}






/*
searchCapital(term: string): Observable<Country[]>{
    const url = `${this.apiURL}/capital/${term}`;

   return this.http.get<Country[]>(url)
   .pipe(
    tap(countries => console.log('Paso por el tap1', countries)),
    map( countries =>[]),
    tap(countries => console.log('Paso por el tap2', countries)),
   );
   // pipe es un metodo para identificar diferentes operadores de rxjs
   // tap Intercepta cada emisión de la fuente y ejecuta una función. Retorna un Observable idéntico a la fuente siempre y cuando no ocurra ningún error.
   // con el map tratamos que devolvemos, si se pone map( countries =>[]) nos devuelve siempre un array vacio
  }

*/

