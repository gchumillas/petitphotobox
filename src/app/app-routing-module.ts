import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeView } from './views/home/home-view';
import { UserLoginView } from './views/user-login/user-login-view';
import { UserRegisterView } from './views/user-register/user-register-view';
import { UserRedirectView } from './views/user-redirect/user-redirect-view';
import { CategoryNewView } from './views/category-new/category-new-view';
import { CategoryEditView } from './views/category-edit/category-edit-view';
import { PictureNewView } from './views/picture-new/picture-new-view';
import { PictureEditView } from './views/picture-edit/picture-edit-view';
import { SearchView } from './views/search/search-view';
import { PageNotFoundView } from './views/page-not-found/page-not-found-view';

const routes: Routes = [
  { path: 'home', component: HomeView },
  { path: 'home/:categoryId', component: HomeView },
  { path: 'home/:categoryId/:page', component: HomeView },
  // TODO: rename login by access
  { path: 'login', component: UserLoginView },
  // TODO: rename redirect by verify
  { path: 'redirect', component: UserRedirectView },
  { path: 'login/:back', component: UserLoginView },
  { path: 'user-register', component: UserRegisterView },
  { path: 'category/new', component: CategoryNewView },
  { path: 'category/new/:parentCategoryId', component: CategoryNewView },
  { path: 'category/edit/:categoryId', component: CategoryEditView },
  { path: 'picture/new', component: PictureNewView },
  { path: 'picture/new/:categoryId', component: PictureNewView },
  { path: 'picture/edit/:pictureId', component: PictureEditView },
  { path: 'search', component: SearchView },
  { path: 'search/:categoryIds', component: SearchView },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundView }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
