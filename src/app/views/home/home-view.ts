import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SessionError } from '../../core/exception/session-error';
import { HomeEntity } from './entities/home-entity';
import { MenuComponent } from '../../modules/menu/menu-component';
import { ModalWindowSystem } from '../../modules/modal-window-system/modal-window-system';

// controllers
import { LogoutController } from './../../controllers/logout-controller';
import { HomeController } from './controllers/home-controller';
import { CategoryDeleteController } from './controllers/category-delete-controller';
import { PictureDeleteController } from './controllers/picture-delete-controller';
import { PictureUpController } from './controllers/picture-up-controller';
import { PictureDownController } from './controllers/picture-down-controller';

@Component({
  selector: 'app-home',
  templateUrl: './home-view.html',
  styleUrls: ['./home-view.scss']
})
export class HomeView implements OnInit {
  entity: HomeEntity;
  modal: ModalWindowSystem;
  categoryId: string;
  page = 0;

  constructor(
    private _controller: HomeController,
    private _logoutController: LogoutController,
    private _categoryDeleteController: CategoryDeleteController,
    private _pictureDeleteController: PictureDeleteController,
    private _pictureUpController: PictureUpController,
    private _pictureDownController: PictureDownController,
    private _router: Router,
    private _route: ActivatedRoute,
    private _resolver: ComponentFactoryResolver
  ) { }

  @ViewChild('menu')
  menu: MenuComponent;

  @ViewChild('modalContainer', { read: ViewContainerRef })
  modalContainer: ViewContainerRef;

  ngOnInit() {
    this.modal = new ModalWindowSystem(
      this, this._resolver, this.modalContainer);

    this._route.params.subscribe(async (params) => {
      this.categoryId = params.categoryId ? params.categoryId : '';
      this.page = params.page ? parseInt(params.page, 10) : 0;

      this.modal.loading(() => this._refresh());
    });
  }

  async exit() {
    await this._logoutController.post();
    this._router.navigate(['/login']);
  }

  onSelectEntry(categoryId: string) {
    this.menu.visible = false;
    this._router.navigate(['/home', categoryId]);
  }

  deleteCategory() {
    this.modal.loading(async () => {
      try {
        await this._categoryDeleteController.post(
          { categoryId: this.entity.id });
      } catch (e) {
        this.modal.error(e.message);
        throw e;
      }

      this._router.navigate(['/home']);
    });
  }

  deletePicture(pictureId: string) {
    this.modal.loading(async () => {
      try {
        await this._pictureDeleteController.post({
          categoryId: this.categoryId, pictureId
        });
      } catch (e) {
        this.modal.error(e.message);
        throw e;
      }

      this._refresh();
    });
  }

  movePictureUp(pictureId: string) {
    this.modal.loading(async () => {
      try {
        await this._pictureUpController.post({
          categoryId: this.categoryId, pictureId
        });
      } catch (e) {
        this.modal.error(e.message);
        throw e;
      }

      this._refresh(pictureId);
    });
  }

  movePictureDown(pictureId: string) {
    this.modal.loading(async () => {
      try {
        await this._pictureDownController.post({
          categoryId: this.categoryId, pictureId
        });
      } catch (e) {
        this.modal.error(e.message);
        throw e;
      }

      this._refresh(pictureId);
    });
  }

  editPicture(id: string) {
    this._router.navigate([`/picture/edit/${id}`]);
  }

  goPage(page: number) {
    this._router.navigate([`/home/${this.categoryId}/${page}`]);
  }

  private async _refresh(pictureId: string = '') {
    try {
      this.entity = await this._controller.get(
        { categoryId: this.categoryId, page: this.page, pictureId });
    } catch (e) {
      if (e instanceof SessionError) {
        this._router.navigate(['/login']);
      } else {
        this.modal.error(e.message);
      }

      throw e;
    }
  }
}
