import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from "primeng/components/common/messageservice";
import { catchError } from 'rxjs/operators/';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

export class EntityService<T> {
  public headers: HttpHeaders;

  constructor(
    protected http: HttpClient,
    protected messageService: MessageService,
    protected entityUrl: string,
  ) {
    this.http = http;
    this.messageService = messageService;
    this.entityUrl = entityUrl;
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${environment.TOKEN}`);
  }

  public list() {
    return this.http.get<T[]>(this.entityUrl, { headers: this.headers }).pipe(this.defaultCatch());
  }

  public get(id: any) {
    return this.http.get<T[]>(`${this.entityUrl}/${id}`, { headers: this.headers }).pipe(this.defaultCatch());
  }

  public insert(entity: T) {
    return this.http.post<T[]>(this.entityUrl, entity, { headers: this.headers }).pipe(this.defaultCatch());
  }

  public update(id: any, entity: T) {
    return this.http.put<T[]>(`${this.entityUrl}/${id}`, entity, { headers: this.headers }).pipe(this.defaultCatch());
  }

  public delete(id: any) {
    return this.http.delete<T[]>(`${this.entityUrl}/${id}`, { headers: this.headers }).pipe(this.defaultCatch());
  }

  public defaultCatch() {
    return catchError((err: any) => {
      if (err) {
        const summary = err.status ? String(err.status) : 'Error';
        const detail = (err.error && err.error.message) || err.statusText || err.message || 'Error';
        
        this.messageService.add({
          severity: "error",
          summary,
          detail,
        });
      }
      return throwError(err);
    });
  }
}

