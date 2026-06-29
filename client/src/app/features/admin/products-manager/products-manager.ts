import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

import { AdminService, AdminProduct } from '../../../core/services/admin';

const CATEGORIES = [
  'brazilian', 'peruvian', 'malaysian', 'indian',
  'weavon', 'closure', 'frontal', 'wig', 'accessory',
];

const TEXTURES = [
  'straight', 'body-wave', 'deep-wave', 'curly',
  'kinky-curly', 'loose-wave', 'water-wave',
];

@Component({
  selector: 'app-products-manager',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './products-manager.html',
  styleUrl: './products-manager.scss',
})
export class ProductsManager implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly fb = inject(FormBuilder);

  protected readonly categories = CATEGORIES;
  protected readonly textures = TEXTURES;

  protected readonly products = signal<AdminProduct[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly formError = signal<string | null>(null);

  // null = form hidden, undefined = adding new, string = editing by id
  protected readonly editingId = signal<string | null | undefined>(null);

  protected readonly form = this.fb.group({
    name:          ['', Validators.required],
    description:   ['', Validators.required],
    category:      ['', Validators.required],
    texture:       [''],
    lengthInches:  [null as number | null],
    priceInNaira:  [null as number | null, [Validators.required, Validators.min(1)]],
    stockQuantity: [null as number | null, [Validators.required, Validators.min(0)]],
    imageUrls:     [''],
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.adminService.getProducts().subscribe({
      next: (products) => { this.products.set(products); this.loading.set(false); },
      error: () => { this.error.set('Failed to load products.'); this.loading.set(false); },
    });
  }

  protected openAddForm(): void {
    this.form.reset();
    this.formError.set(null);
    this.editingId.set(undefined); // undefined = new product
  }

  protected openEditForm(product: AdminProduct): void {
    this.formError.set(null);
    this.editingId.set(product.id);
    this.form.setValue({
      name:          product.name,
      description:   product.description,
      category:      product.category,
      texture:       product.texture ?? '',
      lengthInches:  product.lengthInches ?? null,
      priceInNaira:  product.priceInKobo / 100,
      stockQuantity: product.stockQuantity,
      imageUrls:     product.images.join(', '),
    });
  }

  protected cancelForm(): void {
    this.editingId.set(null);
    this.form.reset();
  }

  protected saveProduct(): void {
    if (this.form.invalid || this.saving()) return;

    this.saving.set(true);
    this.formError.set(null);

    const v = this.form.value;
    const payload = {
      name:          v.name!,
      description:   v.description!,
      category:      v.category!,
      texture:       v.texture || undefined,
      lengthInches:  v.lengthInches ?? null,
      priceInKobo:   Math.round(v.priceInNaira! * 100),
      stockQuantity: v.stockQuantity!,
      images:        v.imageUrls
                       ? v.imageUrls.split(',').map((s: string) => s.trim()).filter(Boolean)
                       : [],
    };

    const id = this.editingId();
    const request = id
      ? this.adminService.updateProduct(id, payload)
      : this.adminService.createProduct(payload);

    request.subscribe({
      next: (saved) => {
        this.products.update((list) =>
          id
            ? list.map((p) => (p.id === id ? saved : p))
            : [saved, ...list]
        );
        this.cancelForm();
        this.saving.set(false);
      },
      error: (err) => {
        this.formError.set(err.error?.message ?? 'Save failed. Please try again.');
        this.saving.set(false);
      },
    });
  }

  protected deleteProduct(product: AdminProduct): void {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

    this.adminService.deleteProduct(product.id).subscribe({
      next: () => this.products.update((list) => list.filter((p) => p.id !== product.id)),
      error: () => this.error.set('Delete failed. The product may have existing orders.'),
    });
  }

  protected toNaira(kobo: number): number {
    return kobo / 100;
  }

  protected isFormOpen(): boolean {
    return this.editingId() !== null;
  }
}
