import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private http = inject(HttpClient);

  getAllCategories(): Observable<IResponse<ICategory>> {
    return this.http.get<IResponse<ICategory>>(`${environment.BASE_URL}/categories`);
  }
}
