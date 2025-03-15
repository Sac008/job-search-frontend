import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private baseUrl = 'http://localhost:8082/api/jobs/scrape';
  constructor(private http: HttpClient) { }

  getSearchResults(queryString: string): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}?jobTitle=${queryString}`);
  }
}
