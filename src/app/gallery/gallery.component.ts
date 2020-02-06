import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../core/service/photo.service';
import { Photos, Datum, Media } from '../core/interface/Photo';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../core/service/user.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.sass']
})
export class GalleryComponent implements OnInit {

  isShowing = new BehaviorSubject<boolean>(false);
  isAdding = new BehaviorSubject<boolean>(false);
  isAuth: boolean = false;
  pictures: Datum[] = [];
  picToShow: Datum;
  currentPage = 0;
  maxPage = 1;
  selectedPhoto: File;
  uploadForm;
  isLoading = new BehaviorSubject<boolean>(false);

  constructor(
    private photoService: PhotoService,
    private userService: UserService,
    private formBuilder: FormBuilder
    ) {
      this.uploadForm = formBuilder.group({
        name: ['',[
          Validators.required
        ]],
        description: ['',[
          Validators.required
        ]],
        popular: false,
        new: false,
        file: [, [
          Validators.required
        ]]
      })
    }

  sendPicture(form: FormGroup){
    const body = form.getRawValue();
    console.log(body);
    this.photoService.postPhoto(body, this.selectedPhoto)
      .subscribe(
        (media: Media) => this.photoService.createPost(body, media)
          .subscribe(
            () =>
            console.log('Photo was added successfully')
          ),
        err => console.log(err)
      );
  }

  selectFile(event){
    this.selectedPhoto = event.target.files[0];
    console.log(event.target.files);
  }

  getPhotos(page: number) {
    if (page <= this.maxPage && page >= 1 && page !== this.currentPage){
      this.currentPage = page;
      this.pictures = [];
      this.isLoading.next(true);
      return this.photoService.getPhotos(String(page))
        .subscribe((data: Photos) => {
          this.isLoading.next(false);
          this.pictures = [];
          this.maxPage = data.countOfPages;
          data.data.forEach(picture =>
            this.pictures.push(picture));
          this.pictures.forEach(pic =>
            pic.image.contentUrl = `${environment.pic_url}${pic.image.contentUrl}`);
          }),
          () => this.isLoading.next(false);
    }
    }
    

  showPic(picture){
    this.isShowing.next(true);
    this.picToShow = picture;
  }

  ngOnInit() {
    this.getPhotos(1);
    this.userService.isAuthenticated$.subscribe(isAuth => this.isAuth = isAuth);
  }

}
