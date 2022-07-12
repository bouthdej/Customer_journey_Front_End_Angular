import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private messageSource = new BehaviorSubject<any>(null);
  currentResult = this.messageSource.asObservable();

  constructor() { }

  update(message:any) {
    console.log(message)
    this.messageSource.next(message)
  }
}
