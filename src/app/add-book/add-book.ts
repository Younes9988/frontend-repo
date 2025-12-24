import { Component } from '@angular/core';
import { SidebarBibliothecaire } from '../sidebar-bibliothecaire/sidebar-bibliothecaire';
import { Navbar } from '../navbar/navbar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LivreService } from '../services/livre.service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-book.html',
  styleUrl: './add-book.scss'
})
export class AddBook {

  bookForm!: FormGroup;
  selectedFile!: File;
  private toastTimeoutId: ReturnType<typeof setTimeout> | null = null;
  toast: { message: string; type: 'success' | 'error' | 'warning'; visible: boolean } = {
    message: '',
    type: 'success',
    visible: false
  };

  categories = [
    'LITTERATURE_ET_FICTION',
    'SCIENCES_ET_TECHNIQUES',
    'HISTOIRE_ET_GEOGRAPHIE',
    'ARTS_ET_CULTURE',
    'LOISIRS_ET_PRATIQUES',
    'REFERENCES_ET_DICTIONNAIRES',
    'RELIGION_ET_PHILOSOPHIE',
    'BANDE_DESSINEE_ET_MANGAS'
  ];

  constructor(
    private fb: FormBuilder,
    private livreService: LivreService,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      titre: ['', Validators.required],
      auteur: ['', Validators.required],
      isbn: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
      nombreCopies: [1, Validators.required],
      dateAcquisition: ['', Validators.required]
    });
  }

  imagePreview: string | ArrayBuffer | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    // Preview logic
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }


  onSubmit() {
    if (this.bookForm.invalid || !this.selectedFile) {
      this.showToast('Please fill all required fields and select an image.', 'warning');
      return;
    }

    const livreData = this.bookForm.value;

    const formData = new FormData();
    formData.append('livre', JSON.stringify(livreData));
    formData.append('file', this.selectedFile);

    this.livreService.addLivre(formData).subscribe({
      next: () => {
        this.showToast('Book added successfully', 'success');
        setTimeout(() => {
          this.router.navigate(['/adminbooklist']);
        }, 800);
      },
      error: (err) => {
        console.error(err);
        this.showToast(err.error?.message || 'Error while adding book', 'error');
      }
    });
  }
  cancel() {
    this.router.navigate(['/adminbooklist']);
  }

  private showToast(message: string, type: 'success' | 'error' | 'warning') {
    if (this.toastTimeoutId) {
      clearTimeout(this.toastTimeoutId);
    }

    this.toast = { message, type, visible: true };
    this.toastTimeoutId = setTimeout(() => {
      this.toast = { ...this.toast, visible: false };
      this.toastTimeoutId = null;
    }, 3000);
  }
}
