import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { NavItem } from '../interfaces/nav-item';
import { User } from '../interfaces/user';

import { MatDialog, DialogPosition } from "@angular/material/dialog";
import { NgDialogAnimationService } from "ng-dialog-animation";
import { LogoutDialogComponent } from '../logout-dialog/logout-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shared-nav',
  templateUrl: './shared-nav.component.html',
  styleUrls: ['./shared-nav.component.css']
})
export class SharedNavComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  menu: NavItem[]
  currentUser: User
  opened: boolean = true;
  content_margin: number = 200;
  menu_display: string = "menu_open";
  second_menu: string = "more_vert";

  adminMenu: NavItem[] = [
    {
      displayName: "All Trainings",
      iconName: "schedule",
      route: '/training'
    },
    {
      displayName: "My Trainings",
      iconName: "schedule",
      children: [
        {
          displayName: "Teacher",
          iconName: "how_to_reg",
          route: '/training/teacher'
        },
        {
          displayName: "Student",
          iconName: "school",
          route: '/training/student'
        }
      ]
    },
    {
      displayName: "All Events",
      iconName: "event",
      children: [
        {
          displayName: "Pizza-U",
          iconName: "local_pizza",
          route: "/pizza-U"
        },
        {
          displayName: "Tech-Watch",
          iconName: "search",
          route: "/Tech-Watch"
        }
      ]
    },
    {
      displayName: "My Events",
      iconName: "event",
      children: [
        {
          displayName: "Pizza-U",
          iconName: "local_pizza",
          route: "/pizza-U/student"
        },
        {
          displayName: "Tech-Watch",
          iconName: "search",
          route: "/Tech-Watch/student"
        }
      ]
    },
    {
      displayName: "Library",
      iconName: "library_books",
      route: ""
    },
    {
      displayName: "Users",
      iconName: "people",
      route: "/users"
    },
    {
      displayName: "Poles",
      iconName: "business",
      route: "/poles"
    }
  ];

  colaboratorMenu: NavItem[] = [
    {
      displayName: "Trainings",
      iconName: "schedule",
      children: [
        {
          displayName: "Teacher",
          iconName: "how_to_reg",
          route: '/training/teacher'
        },
        {
          displayName: "Student",
          iconName: "school",
          route: '/training/student'
        }
      ]
    },
    {
      displayName: "Events",
      iconName: "event",
      children: [
        {
          displayName: "Pizza-U",
          iconName: "local_pizza",
          route: "/pizza-U/student"
        },
        {
          displayName: "Tech-Watch",
          iconName: "search",
          route: "/Tech-Watch/student"
        }
      ]
    },
    {
      displayName: "Library",
      iconName: "library_books",
      route: ""
    }
  ];

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public dialog: NgDialogAnimationService,
    private readonly router: Router
  ) {
    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.currentUser = currentUser.user

    if (currentUser.user.roleName === "Admin") {
      //console.log(this.adminMenu)
      this.menu = this.adminMenu
    } else if (currentUser.user.roleName === "Colab") {
      this.menu = this.colaboratorMenu
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
  }


  toggleSideNav() {
    this.opened = !this.opened;
    if (this.opened == true) {
      this.menu_display = "menu_open";
      this.content_margin = 200;
    } else {
      this.menu_display = "menu";
      this.content_margin = 60;
    }
  }

  isSideOpened() {
    this.menu_display = "menu_open";
  }

  isSideClosed() {
    this.menu_display = "menu";
  }

  togleSecondMenu() {
    if (this.second_menu === "more_vert") {
      this.second_menu = "more_horiz";
    } else {
      this.second_menu = "more_vert";
    }
  }

  openDialog(event: any): void {
    const dialogPosition: DialogPosition = {
      top: "0",
      right: "0"
    };

    const dialogRef = this.dialog.open(LogoutDialogComponent, {
      width: "350px",
      position: dialogPosition,
      data: this.currentUser,
      animation: { to: "left" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.action === "logout") {
          this._logout()
        } else {
          this._userProfile()
        }
      }
    });

  }

  private _logout() {
    sessionStorage.removeItem('currentUser');
    this.router.navigate(['/auth']);
  }

  private _userProfile() {

  }

}
