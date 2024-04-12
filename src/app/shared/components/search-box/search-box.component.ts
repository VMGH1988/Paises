import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: ``
})
//onINit es el ciclo de vida de inicio y ondestroy cuando muere
export class SearchBoxComponent implements OnInit, OnDestroy{



  private debouncer: Subject<string>=  new Subject<string>();
  private debouncerSuscription?: Subscription;


  @Input()
  public placeholder: string='';

  @Input()
  public initialValue: string ='';

  @Output() // para poder hacer emited
  public onValue = new EventEmitter<string>();

  @Output()// este se usa en el ngoinit siguiente
  public onDebounce = new EventEmitter<string>();

//siempre que tengamos subscripciones hay que hacer una limpieza, sino siempre va a estar escuchando aunque no se necesite

  ngOnInit(): void {
    this.debouncerSuscription = this.debouncer
    .pipe(
      debounceTime(300),
    )
    .subscribe(value => this.onDebounce.emit(value));
  }

  ngOnDestroy(): void {
  this.debouncerSuscription?.unsubscribe();
  }



  emitValue(value: string):void{
    this.onValue.emit(value);
  }

  onKeyPress(searchTerm: string){

    this.debouncer.next(searchTerm);

  }

}

