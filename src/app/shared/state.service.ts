import { Injectable } from '@angular/core';
import { StateServiceData } from '../interfaces/state-data';

@Injectable({
  providedIn: 'root'
})
export class StateService {

public data: StateServiceData

  constructor() { }
}
