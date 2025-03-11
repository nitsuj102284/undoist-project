import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../classes/generated/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _currentUserSubject$: BehaviorSubject<User> = new BehaviorSubject(null);
  currentUser$: Observable<User> = this._currentUserSubject$.asObservable();

  constructor() {
    this.setUser();
  }

  setUser(): void {
    const user: User = new User();
    user.firstName = 'Bob';
    user.profileImage = 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300';
    
    this._currentUserSubject$.next(user);
  }
}
