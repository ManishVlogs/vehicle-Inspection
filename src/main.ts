import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { AutoCompleteModule } from 'primeng/autocomplete';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),  // ✅ Ensure HttpClient is provided
    provideAnimationsAsync(),
    importProvidersFrom(
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatAutocompleteModule,
      MatOptionModule,
      AutoCompleteModule
    )
  ]
}).catch(err => console.error(err));
