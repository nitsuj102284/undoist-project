import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { User } from '../../classes/generated/User';
import { DatabaseService } from '../database/database.service';
import { EntityRecords } from '../../interfaces/entity-records.interface';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _currentUserSubject$: BehaviorSubject<User> = new BehaviorSubject(null);
  private _entityName: string = 'user';
  private _storageKey: string = 'u';
  private _usersSubject$: BehaviorSubject<User[]> = new BehaviorSubject([]);
  
  currentUser$: Observable<User> = this._currentUserSubject$.asObservable();
  users$: Observable<User[]> = this._usersSubject$.asObservable();

  constructor(
    private databaseService: DatabaseService
  ) {
    this.dbReady()
      .subscribe(() => {
        this.fetchUsers();
      });
  }

  dbReady(): Observable<boolean> {
    return this.databaseService.dbReady$
      .pipe(
        filter(ready => ready),
        take(1),
        tap(() => {
          this.fetchUsers()
        })
      )
  }

  userIsLoggedIn(): Observable<boolean> {
    const loggedInUser: User = this._currentUserSubject$.value;
    const savedUserId: string = this.getUserIdFromSession();
    if (loggedInUser) return of(true);
    if (!loggedInUser && !savedUserId) return of(false);

    return this.dbReady()
      .pipe(
        switchMap(() => this.logIn(savedUserId)),
        map(user => user ? true : false)
      );
  }

  fetchUsers(): void {
    this.databaseService.getAll<User>(this._entityName)
      .pipe(
        switchMap(users => {
          if (users.length) return of(users);
          return this.addTestUsers()
            .pipe(
              switchMap(() => this.databaseService.getAll<User>(this._entityName))
            )
        })
      )
      .subscribe(users => this._usersSubject$.next(users));
  }

  getUserById(userId: string): Observable<User> {
    return this.databaseService.getById<User>(this._entityName, userId);
  }

  addTestUsers(): Observable<User[]> {
    const users: User[] = [];

    const user1: User = new User();
    user1.id = 'c1eadad7-affb-484c-a09f-307806c6f7ba',
    user1.email = 'bob@bob.com';
    user1.firstName = 'Bob';
    user1.lastName = 'Thompson';
    user1.profileImage = 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300';
    users.push(user1);

    const user2: User = new User();
    user2.id = '1a0a7336-14ac-4e70-9e31-83625d83646b',
    user2.email = 'cindy@cindy.com';
    user2.firstName = 'Cindy';
    user2.lastName = 'Smith';
    user2.profileImage = 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300';
    users.push(user2);

    const entityRecords: EntityRecords = {
      entityName: this._entityName,
      records: users
    }
    return this.databaseService.addRecords<User>([entityRecords]);
  }

  logIn(userId: string): Observable<User> {
    return this.getUserById(userId)
      .pipe(
        filter(user => !!user),
        tap(user => {
          this._currentUserSubject$.next(user);
          this.storeUserInSession(user);
        })
      );
  }

  storeUserInSession(user: User): void {
    sessionStorage.setItem(this._storageKey, user.id);
  }

  getUserIdFromSession(): string {
    return sessionStorage.getItem(this._storageKey);
  }

}
