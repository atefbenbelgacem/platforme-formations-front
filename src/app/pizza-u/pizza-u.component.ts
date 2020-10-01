import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PizzaEvent } from '../interfaces/pizza-event';
import { User } from '../interfaces/user';
import { PizzaEventService } from '../services/pizza-event.service';
import { SnackBarService } from '../shared/snack-bar.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-pizza-u',
  templateUrl: './pizza-u.component.html',
  styleUrls: ['./pizza-u.component.css']
})
export class PizzaUComponent implements OnInit {

  pizzasLoading: boolean = false
  //actionLoading: boolean = false
  pizzas: PizzaEvent[] = []
  currentUser: User;
  subscribersList: string[] = []
  waitingList: string[] = []
  filteredPizzas: PizzaEvent[];

  constructor(
    private readonly pizzaService: PizzaEventService,
    public readonly dialog: MatDialog,
    private readonly snackService: SnackBarService
  ) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser')).user
  }

  ngOnInit(): void {
    this.getAllPizzas()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredPizzas = this.pizzas.filter(pizza=>{
      return pizza.title.trim().toLowerCase().includes(filterValue.trim().toLowerCase())
    })
  }

  subscribe(pizza: PizzaEvent) {
    this.pizzasLoading = true
    this.pizzaService.subscribe(pizza._id).subscribe(res => {
      this.getAllPizzas()
      this.snackService.openSnackBar('Subscribed Successfully')
    })
  }

  unSubscribe(pizza: PizzaEvent){
    this.pizzasLoading = true
    this.pizzaService.unSubscribe(pizza._id).subscribe(res => {
      this.getAllPizzas()
      this.snackService.openSnackBar('UnSubscribed Successfully')
    })
  }

  openPersonDialog(person: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: "350px",
      data: person
    });
  }

  private getAllPizzas() {
    this.pizzasLoading = true
    this.pizzaService.getAllPizzas().subscribe(data => {
      this.pizzasLoading = false
      console.log(data)
      data.map(pizzaEv => {
        const indexS = pizzaEv.subscribers.findIndex(pers => {
          return pers._id === this.currentUser._id
        })
        const indexW = pizzaEv.waitingList.findIndex(pers => {
          return pers._id === this.currentUser._id
        })

        if (indexS > -1 || indexW > -1) {
          pizzaEv.isSubscribed = true
        }
      })
      this.pizzas = data
      this.filteredPizzas = this.pizzas
    }, error => {
      this.pizzasLoading = false
      console.log(error)
    })
  }

}
