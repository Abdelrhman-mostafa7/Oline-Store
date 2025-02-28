import { Component, inject, OnInit } from '@angular/core';
import { BrandService } from '../../core/services/brand/brand.service';
import { IBrand } from '../../shared/interfaces/brand';
import { Modal } from 'flowbite';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {
  private readonly brandService = inject(BrandService);
  branddata: IBrand[] = [];
  selectedBrand: any = null;
  modal: any;
  lastFocusedElement: HTMLElement | null = null;

  ngOnInit(): void {
    this.getbrand();
    this.initModal();
  }

  getbrand(): void {
    this.brandService.getAllbrands().subscribe({
      next: (res) => {
        this.branddata = res.data;
      },
      error: (err) => {
      }
    });
  }

  openModal(brandId: string): void {
    this.lastFocusedElement = document.activeElement as HTMLElement;
    this.brandService.getspecificbrands(brandId).subscribe({
      next: (res) => {
        this.selectedBrand = res.data;
        this.modal.show();
        const modalElement = document.getElementById('brand-modal');
        if (modalElement) {
          modalElement.removeAttribute('inert');
        }
      },
      error: (err) => {
      }
    });
  }

  closeModal(): void {
    this.modal.hide();
    this.selectedBrand = null;
    const modalElement = document.getElementById('brand-modal');
    if (modalElement) {
      modalElement.setAttribute('inert', '');
    }
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
    }
  }

  initModal(): void {
    const $modalElement = document.getElementById('brand-modal');
    if ($modalElement) {
      this.modal = new Modal($modalElement);
    }
  }
}