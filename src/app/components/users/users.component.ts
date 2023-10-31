import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})


export class UsersComponent implements OnInit{
  public users : any= [];
  constructor(private usersService: UsersService){
    this.usersService.getUsers().subscribe(data => {
         
      this.users = data;
       console.log("usuarios", this.users)
    });

  }
  ngOnInit(): void {
    /*this.users = [
      {
        name: 'Ivan Larios',
        age: 27,
        description: 'Desarrollador fullstack',
        avatar: 'https://ideapod.com/wp-content/uploads/2017/08/person-1.jpg',
        work: 'Project manager',
      },
      {
        name: 'Martin Larios',
        age: 19,
        description: 'Diseñador',
        avatar: 'https://ideapod.com/wp-content/uploads/2017/08/person-1.jpg'
      },
      {
        name: 'Luis Larios',
        age: 27,
        description: 'Desarrollador back',
        avatar: 'https://ideapod.com/wp-content/uploads/2017/08/person-1.jpg'
      },
      {
        name: 'Hector Larios',
        age: 20,
        description: 'Desarrollador front',
        avatar: 'https://ideapod.com/wp-content/uploads/2017/08/person-1.jpg'
      },
      {
        name: 'Martin Larios',
        age: 19,
        description: 'Diseñador',
        avatar: 'https://ideapod.com/wp-content/uploads/2017/08/person-1.jpg'
      },
      {
        name: 'Luis Larios',
        age: 27,
        description: 'Desarrollador back',
        avatar: 'https://ideapod.com/wp-content/uploads/2017/08/person-1.jpg'
      },
      {
        name: 'Hector Larios',
        age: 20,
        description: 'Desarrollador front',
        avatar: 'https://ideapod.com/wp-content/uploads/2017/08/person-1.jpg'
      },
    ];*/

    //this.users = this.usersService.getUsers();
    console.log("usuarios", this.users)
  }
  


}
