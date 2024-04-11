import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, map, of } from 'rxjs';
import { Country } from '../interfaces/country';

@Injectable({providedIn: 'root'})
export class CountriesService {

  private apiURL: string = 'https://restcountries.com/v3.1'

  constructor(private http: HttpClient) { }


  private getCountriesRequest(url: string):Observable<Country[]>{

    return this.http.get<Country[]>(url)
    .pipe(
      catchError(() => of([]))
      );
  }

  searchCountryByAlphaCode(code: string): Observable<Country | null>{
    const url = `${this.apiURL}/alpha/${code}`;

   return this.http.get<Country[]>(url)
    //hago un map para que me devuelva el primer objeto del array ya que la api nos lo da en un array aunque sea un objeto, y si no hay nos deuelve null
   .pipe(
      map(countries => countries.length > 0 ? countries[0]: null),
      catchError(() => of(null)),
      delay(2000)
   );
  }



  searchCapital(term: string): Observable<Country[]>{

    const url = `${this.apiURL}/capital/${term}`;
    return this.getCountriesRequest(url);
  }



  searchCountry(term: string): Observable<Country[]>{

    const url = `${this.apiURL}/name/${term}`;
    return this.getCountriesRequest(url);
  }


  searchRegion(region: string): Observable<Country[]>{

    const url = `${this.apiURL}/region/${region}`;
    return this.getCountriesRequest(url);
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

