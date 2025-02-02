import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../ApiEndPoints/EndPoints';

@Injectable({
  providedIn: 'root' // ✅ Ensure service is provided globally
})
export class PartProductsService {
  constructor(private http: HttpClient) { }

  getParts(): Observable<any> {
    debugger
    return this.http.get<any>(API_ENDPOINTS.GET_PARTS);
  }

  getLabourProducts():  Observable<any> {
    return this.http.get<any>(API_ENDPOINTS.GET_LABOURPARTS);
  }
}

interface PartProduct {
  description: string;
  productID: string;
}
