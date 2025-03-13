import { Injectable } from '@angular/core';
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

  getById<T>(storeName: string, id: string): Observable<T> {
    const observable: Observable<T> = new Observable(observer => {
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

  getAll<T>(storeName: string): Observable<T[]> {
    const observable: Observable<T[]> = new Observable(observer => {
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

  getByIndexValues<T>(storeName: string, indexName: string, values: (string | number | boolean)[]): Observable<T[]> {
    const observable: Observable<T[]> = new Observable(observer => {
      const transaction: IDBTransaction = this._db.transaction([storeName], 'readonly');
      const store: IDBObjectStore = transaction.objectStore(storeName);
      const index: IDBIndex = store.index(indexName);
      
      values = this.helperService.mapBooleansToBit(values);
      const rangeValue: any = values.length === 1
        ? values[0] : values;
      const range: IDBKeyRange = IDBKeyRange.only(rangeValue);

      const request: IDBRequest = index.openCursor(range);
      const results: T[] = [];

      request.onsuccess = (e: any) => {
        const cursor: IDBCursorWithValue = e.target.result;
        if (!cursor) {
          observer.next(results);
          observer.complete();
          return;
        }

        results.push(cursor.value);
        cursor.continue();
      }

      request.onerror = (e: any) => {
        observer.error(e);
      }
    });

    return observable;
  }

  addRecords<T>(entityRecords: EntityRecords[]): Observable<T[]> {
    const observable: Observable<T[]> = new Observable(observer => {
      const storeNames: string[] = entityRecords.map(entity => entity.entityName);
      const transaction: IDBTransaction = this._db.transaction(storeNames, 'readwrite');
      
      const insertedRecords: T[] = [];
      entityRecords.forEach(entity => {
        const { entityName, records } = entity;
        const store: IDBObjectStore = transaction.objectStore(entityName);

        records.forEach(record => {
          let mappedRecord: any = { ...record };
          
          //id
          if (!record.id) mappedRecord.id = this.helperService.generateUuid();

          //timestamps
          const date = new Date().toISOString();
          mappedRecord.createdAt = date;
          mappedRecord.modifiedAt = date;
          mappedRecord = this.helperService.mapObjectBooleansToBit(mappedRecord);

          insertedRecords.push(mappedRecord);

          const request: IDBRequest = store.add(mappedRecord);
          request.onerror = (e: any) => observer.error(`Error adding ${entityName}: ${e.target.error}`);
        })
      });

      transaction.oncomplete = () => {
        observer.next(insertedRecords);
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
      {
        entityName: 'project',
        indexes: [
          { name: 'id', columns: ['id'], isUnique: true },
          { name: 'userId', columns: ['userId'] },
          { name: 'default', columns: ['userId', 'isDefault'], isUnique: true }
        ]
      },
      {
        entityName: 'task',
        indexes: [
          { name: 'id', columns: ['id'], isUnique: true },
          { name: 'projectId', columns: ['projectId']},
          { name: 'parentTaskId', columns: ['parentTaskId']}
        ]
      },
      {
        entityName: 'taskGroup',
        indexes: [
          { name: 'id', columns: ['id'], isUnique: true },
          { name: 'projectId', columns: ['projectId']}
        ]
      },
      {
        entityName: 'user',
        indexes: [
          { name: 'id', columns: ['id'], isUnique: true }
        ]
      }
    ];

    entities.forEach(entityIndex => this.createDbSchema(entityIndex));
  }

  private createDbSchema(entityIndex: EntityIndex): void {
    const { entityName, indexes } = entityIndex;
    const storeName: string = this.helperService.stringToCamelCase(entityName);
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
    indexes.forEach(index => {
      const columns = index.columns.length === 1 ? index.columns[0] : index.columns;
      store.createIndex(index.name, columns, { unique: index.isUnique || false });
    });

  }

}
