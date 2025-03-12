import { Injectable } from '@angular/core';
import { User } from '../../classes/generated/User';
import { Project } from '../../classes/generated/Project';
import { HelperService } from '../helper/helper.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { EntityIndex, EntityRecords } from '../../interfaces/entity-records.interface';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private _db: IDBDatabase;
  private readonly _dbName: string = 'undoist_db';
  private _dbReadySubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private readonly _dbVersion: number = 1;

  dbReady$: Observable<boolean> = this._dbReadySubject$.asObservable();

  constructor(
    private helperService: HelperService
  ) {
    this.init();
  }

  init(): void {
    if (!this._db) this.openDatabase();
  }

  getById(storeName: string, id: string): Observable<any> {
    const observable: Observable<any[]> = new Observable(observer => {
      const transaction: IDBTransaction = this._db.transaction([storeName], 'readonly');
      const store: IDBObjectStore = transaction.objectStore(storeName);
      const index: IDBIndex = store.index('id');
      const request: IDBRequest = index.openCursor(IDBKeyRange.only(id));

      request.onsuccess = (e: any) => {
        const cursor: IDBCursorWithValue = e.target.result;
        if (cursor) {
          observer.next(cursor.value);
        }
      }

      request.onerror = (e: any) => {
        observer.error(e);
      }
    });

    return observable;
  }

  getAll(storeName: string): Observable<any[]> {
    const observable: Observable<any[]> = new Observable(observer => {
      const transaction: IDBTransaction = this._db.transaction([storeName], 'readonly');
      const store: IDBObjectStore = transaction.objectStore(storeName);
      const request: IDBRequest = store.getAll();

      request.onsuccess = (e: any) => {
        observer.next(e.target.result);
        observer.complete();
      }

      request.onerror = (e: any) => {
        observer.error(e);
      }
    });

    return observable;
  }

  addRecords(entityRecords: EntityRecords[]): Observable<void> {
    const observable: Observable<any> = new Observable(observer => {
      const storeNames: string[] = entityRecords.map(entity => entity.entityName);
      const transaction: IDBTransaction = this._db.transaction(storeNames, 'readwrite');
      
      entityRecords.forEach(entity => {
        const { entityName, records } = entity;
        const store: IDBObjectStore = transaction.objectStore(entityName);

        records.forEach(record => {
          const request: IDBRequest = store.add(record);

          request.onerror = (e: any) => observer.error(`Error adding ${entityName}: ${e.target.error}`);
        })
      });

      transaction.oncomplete = () => {
        observer.next(true);
        observer.complete();
      }

      transaction.onerror = (e: any) => observer.error(`Failed to save to database: ${e.target.error}`);
    });

    return observable;
  }

  private openDatabase(): void {
    const request = indexedDB.open(this._dbName, this._dbVersion);

    request.onupgradeneeded = (e: IDBVersionChangeEvent) => this.upgradeDbSchema(e);
    request.onsuccess = (e: any) => {
      this._db = e.target.result
      this._dbReadySubject$.next(true);
    };
  }

  private upgradeDbSchema(e: IDBVersionChangeEvent): void {
    this._db = (e.target as any).result;

    //add entities
    const entities: EntityIndex[] = [
      { entity: Project, columns: ['id', 'userId']},
      { entity: User, columns: ['id', 'email', 'firstName', 'lastName']}
    ];

    entities.forEach(entityIndex => this.createDbSchema(entityIndex));
  }

  private createDbSchema<T>(entityIndex: EntityIndex): void {
    const { entity, columns } = entityIndex;
    const storeName: string = this.helperService.stringToCamelCase(entity.name);
    const storeExists: boolean = this._db.objectStoreNames.contains(storeName);
    let store: IDBObjectStore;

    //get store
    if(storeExists) {
      const transaction: IDBTransaction = this._db.transaction([storeName]);
      store = transaction.objectStore(storeName);
    }

    //no store, create it
    if (!store) store = this._db.createObjectStore(storeName, { keyPath: 'id' });

    //add each index
    columns.forEach(col => {
      store.createIndex(col, col);
    });

  }

}
