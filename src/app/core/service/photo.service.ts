import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(private apiService: ApiService) { }

  getPhotos(page: string) {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', '10');
    return this.apiService.get('api/photos', params);
  }

  postPhoto(data, file: File) {
    let formData = new FormData();
    formData.append('file', file);
    console.log(formData);
    return this.apiService.post('api/media_objects', formData);
  }

  createPost(data, media) {
    console.log(data);
    const body = {
      name: data.name,
      description: data.description,
      new: data.new,
      popular: data.popular,
      image: 'api/media_objects/' + `${media.id}`
    }
    return this.apiService.post('api/photos', body);
  }
}
