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
  lastFocusedElement: HTMLElement | null = null; // لتخزين العنصر الذي كان مركزًا قبل فتح المودال

  ngOnInit(): void {
    this.getbrand();
    this.initModal();
  }

  getbrand(): void {
    this.brandService.getAllbrands().subscribe({
      next: (res) => {
        console.log("Brands Data:", res.data);
        this.branddata = res.data;
      },
      error: (err) => {
        console.error("Error fetching brands:", err);
      }
    });
  }

  openModal(brandId: string): void {
    this.lastFocusedElement = document.activeElement as HTMLElement; // حفظ العنصر الذي كان مركزًا
    this.brandService.getspecificbrands(brandId).subscribe({
      next: (res) => {
        console.log("Brand Details:", res);
        this.selectedBrand = res.data;

        // عرض المودال
        this.modal.show();

        // إزالة inert لمنع الخطأ
        const modalElement = document.getElementById('brand-modal');
        if (modalElement) {
          modalElement.removeAttribute('inert');
        }
      },
      error: (err) => {
        console.error("Error fetching brand details:", err);
      }
    });
  }

  closeModal(): void {
    this.modal.hide();
    this.selectedBrand = null;

    // إعادة تعيين inert عند إغلاق المودال
    const modalElement = document.getElementById('brand-modal');
    if (modalElement) {
      modalElement.setAttribute('inert', '');
    }

    // إعادة التركيز إلى العنصر الذي كان مركزًا قبل فتح المودال
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