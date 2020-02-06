import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest } from '@angular/common/http';
import { TokenService } from './token.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  
  routes = ['api/photos', 'api/media_objects']

  constructor(
    private tokenService: TokenService,
    private userService: UserService
    ) { }

  intercept(req: HttpRequest<any>, next){
    if (this.userService.isAuthenticated$){
      if (this.routes.indexOf(req.url) !== -1 && req.method.toLowerCase() === 'post'){
        const client = this.userService.getClient()
        this.tokenService.updateToken(client);
        const tokenizedReq = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + this.tokenService.getToken().access_token
        }
      })
      return next.handle(tokenizedReq)
      }
      
    }
    return next.handle(req);

  }

}
