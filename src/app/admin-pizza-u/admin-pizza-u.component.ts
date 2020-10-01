import { Component, OnInit } from '@angular/core';
import { PizzaEventService } from '../services/pizza-event.service';
import { PizzaEvent } from '../interfaces/pizza-event';
import { User } from '../interfaces/user';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PizzaEventDialogComponent } from '../pizza-event-dialog/pizza-event-dialog.component';
import { UserSearchComponent } from '../user-search/user-search.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { UsersService } from '../services/users.service';
import { SnackBarService } from '../shared/snack-bar.service';


@Component({
  selector: 'app-admin-pizza-u',
  templateUrl: './admin-pizza-u.component.html',
  styleUrls: ['./admin-pizza-u.component.css']
})
export class AdminPizzaUComponent implements OnInit {

  actionLoading: boolean = false
  pizzas: PizzaEvent[]
  filteredPizzas: PizzaEvent[];

  constructor(
    private readonly pizzaService: PizzaEventService,
    public dialog: MatDialog,
    private readonly userService: UsersService,
    private readonly snackService: SnackBarService
  ) { }

  ngOnInit(): void {
    this._getAllPizzas()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredPizzas = this.pizzas.filter(pizza=>{
      return pizza.title.trim().toLowerCase().includes(filterValue.trim().toLowerCase())
    })
  }

  openActionDialog(action: string, pizza: any) {
    pizza.action = action;
    // console.log(pizza)

    const dialogRef = this.dialog.open(PizzaEventDialogComponent, {
      width: "600px",
      data: pizza
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event == "Add") {
          this.addRowData(result.data);
        } else if (result.event == "Update") {
          this.updateRowData(result.data);
        }
      }
    });
  }

  addRowData(data: any) {
    let presenter: User
    const usersEmails = [data.presenter]
    this.actionLoading = true
    this.userService.getEmailsUsers(usersEmails).subscribe(users => {
      presenter = users[0]
      const newEvent: PizzaEvent = {
        title: data.title,
        description: data.description,
        date: data.date,
        duration: data.duration,
        placesLeft: data.placesLeft,
        presenter: presenter._id
      }
      console.log(newEvent)
      this.pizzaService.addPizza(newEvent).subscribe(event => {
        this._getAllPizzas()
        this.snackService.openSnackBar('Event Added Successfully')
      })
    })
  }

  updateRowData(data: any) {
    let presenter: User
    const usersEmails = [data.presenter]
    this.actionLoading = true
    this.userService.getEmailsUsers(usersEmails).subscribe(users => {
      presenter = users[0]
      const updateEvent: PizzaEvent = {
        _id: data._id,
        title: data.title,
        description: data.description,
        date: data.date,
        duration: data.duration,
        placesLeft: data.placesLeft,
        presenter: presenter
      }
      console.log(updateEvent)
      this.pizzaService.updatePizza(updateEvent._id, updateEvent).subscribe(event => {
        this._getAllPizzas()
        this.snackService.openSnackBar('Event Updated Successfully')
      })
    })
  }

  deleteRowData(pizza: PizzaEvent) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: "350px",
      data: pizza
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.event == "Ok") {
        console.log(pizza._id)
        this.actionLoading = true
        this.pizzaService.deletePizza(pizza._id).subscribe(event => {
          this._getAllPizzas()
          this.snackService.openSnackBar('Event Deleted Successfully')
        })
      }
    })
  }

  openPersonDialog(person: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: "350px",
      data: person
    });
  }

  unSubscribe(pizzaId: string, user: User) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: "350px",
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.event == "Ok") {
        this.actionLoading = true
        this.pizzaService.adminUnSubscribe(pizzaId, user._id).subscribe(res => {
          this._getAllPizzas()
          this.snackService.openSnackBar('User Removed Successfully')
        })
      }
    })
  }
  subscribe(pizza: PizzaEvent) {
    const dialogRef = this.dialog.open(UserSearchComponent, {
      width: "350px"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.event == "Add") {
        if (pizza.subscribers.length !== 0) {
          const index = pizza.subscribers.findIndex(user => {
            return user.email === result.data
          })
          if (index > -1) {
            this.snackService.openSnackBar('User Already Existing')
          } else {
            this._add(result.data, pizza)
          }
        } else {
          this._add(result.data, pizza)
        }
      }
    });
  }

  private _add(email: string, pizza: PizzaEvent) {
    let userToAdd: User
    const usersEmails = [email]
    this.actionLoading = true
    this.userService.getEmailsUsers(usersEmails).subscribe(users => {
      userToAdd = users[0]
      this.pizzaService.adminSubscribe(pizza._id, userToAdd._id).subscribe(res => {
        this._getAllPizzas()
        this.snackService.openSnackBar('User Subscribed Successfully')
      })
    })
  }


  private _getAllPizzas() {
    this.actionLoading = true
    this.pizzaService.getAllPizzas().subscribe(data => {
      this.actionLoading = false
      console.log(data)
      this.pizzas = data
      this.filteredPizzas = this.pizzas
    }, error => {
      this.actionLoading = false
      console.log(error)
    })
  }

}
