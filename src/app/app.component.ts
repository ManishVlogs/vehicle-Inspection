import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable, startWith, map } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PartProductsService } from '../Services/part-products-service.service';


// import { PartProductsService } from '../Services/part-products-service.service';
@Component({
  selector: 'app-root',
  // standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    FormsModule,
    AutoCompleteModule,
    DropdownModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'vehicle_inspection';


  serviceForm!: FormGroup;
  parts!: FormArray;
  searchTextPartsDescription: string = '';
  partOptions: PartOption[] = [];
  PartsfilteredOptions: PartOption[] = [];

  labours!: FormArray;
  searchTextLaboursDescription: string = '';
  LabourOptions: LabourOption[] = [];
  LabourfilteredOptions: LabourOption[] = [];

  value: any; // This will store the selected object




  constructor(private fb: FormBuilder, private http: HttpClient
    , private partProductsService: PartProductsService
  ) { }


  ngOnInit() {
    this.serviceForm = this.fb.group({
      customerName: ['', Validators.required],
      serviceConsultant: ['', Validators.required],
      address: ['', Validators.required],
      modelCode: ['', Validators.required],
      registrationNumber: ['', Validators.required],
      jobCardNumber: [{ value: '', disabled: true }, Validators.required], // Set the field as disabled
      modelName: ['', Validators.required],
      jobCardDate: ['', Validators.required],
      odometerReading: ['', Validators.required],
      recipientGSTIN: ['', Validators.required],
      customerVoice: [''],
      parts: this.fb.array([]),
      labours: this.fb.array([]),
    });
    // debugger
    this.parts = this.serviceForm.get('parts') as FormArray;
    this.labours = this.serviceForm.get('labours') as FormArray;

    this.addPartRow();
    this.fetchPartsData();



    this.addLabourRow();


    this.fetchLaboursData();
    this.subscribeToRowValueChanges(this.parts.controls[0]);
    this.setJobCardNumber();
  }

  fetchPartsData(): void {
    this.http.get<any[]>('assets/parts.json').subscribe({
      next: (data) => {
        this.partOptions = data.map((item, index) => ({
          id: index + 1,
          name: item.description,
          productID: item.productID
        }));
      },
      error: (error) => console.error('Error fetching parts:', error)
    });
  }
  fetchLaboursData(): void {
    this.http.get<any[]>('assets/labour.json').subscribe({
      next: (data) => {
        this.LabourOptions = data.map((item, index) => ({
          id: index + 1,
          name: item.description,
          productID: item.productID
        }));
      },
      error: (error) => console.error('Error fetching Labour:', error)
    });
  }

  searchTimeoutPart: any; // Declare a variable to store timeout
  onSearchInput(part: any, i: number): void {

    clearTimeout(this.searchTimeoutPart); // Clear the previous timeout if user types again
    this.searchTimeoutPart = setTimeout(() => {
      this.filterOptions(part, i);
    }, 2000); // Delay of 2 seconds
  }

  PartRowIndexNumber: number = 0;
  filterOptions(part: any, i: number): void {
    debugger
    const v = part.get('SeachablePart')?.value;
    this.PartRowIndexNumber = i;
    this.PartsfilteredOptions = v
      ? this.partOptions.filter(part => part.name.toLowerCase().includes(v.toLowerCase()))
      : [];
  }

  // selectPart(part: PartOption): void {
  selectPart(part: any, i: number): void {
    debugger
    const partFormGroup = this.parts.at(this.PartRowIndexNumber) as FormGroup;

    // Set value in the FormControl
    partFormGroup.get('code')?.setValue(part.productID); // Assuming productID exists in the object
    partFormGroup.get('SeachablePart')?.setValue(part.name);
    // this.searchTextPartsDescription = part.name;

    this.PartsfilteredOptions = [];
  }


  addPartRow() {
    const newPart = this.createPart();
    this.parts.push(newPart);
    this.subscribeToRowValueChanges(newPart);
  }
  // Create a new part form group
  createPart(): FormGroup {
    return this.fb.group({
      code: ['', Validators.required],
      SeachablePart: [null, Validators.required],
      description: [null, Validators.required],
      qty: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(1)]],
      finalAmount: [{ value: 0, disabled: true }]
    });
  }


  removePartRow(index: number) {
    this.parts.removeAt(index);
  }


  searchTimeoutLabour: any; // Declare a variable to store timeout
  onSearchInputLabour(part: any, i: number): void {
    clearTimeout(this.searchTimeoutLabour); // Clear the previous timeout if user types again
    this.searchTimeoutLabour = setTimeout(() => {
      this.filterOptionsLabour(part, i);
    }, 2000); // Delay of 2 seconds
  }



  LabourRowIndexNumber: number = 0;
  filterOptionsLabour(Labour: any, i: number): void {
    debugger
    const v = Labour.get('SeachableLabour')?.value;
    this.LabourRowIndexNumber = i;
    this.LabourfilteredOptions = v
      ? this.LabourOptions.filter(Labour => Labour.name.toLowerCase().includes(v.toLowerCase()))
      : [];
  }


  selectLabour(labour: any): void {
    // this.searchTextLaboursDescription = labour.name;
    debugger
    const LabourFormGroup = this.labours.at(this.LabourRowIndexNumber) as FormGroup;

    // Set value in the FormControl
    LabourFormGroup.get('SeachableLabour')?.setValue(labour.name);
    LabourFormGroup.get('code')?.setValue(labour.productID); // Assuming productID exists in the object

    this.LabourfilteredOptions = [];

  }



  addLabourRow() {
    const newPart = this.createLabour();
    this.labours.push(newPart);

  }
  // Create a new Labour form group
  createLabour(): FormGroup {
    return this.fb.group({
      code: ['', Validators.required],
      SeachableLabour: ['', Validators.required],
      description: [null, Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      finalAmount: [0, [Validators.required, Validators.min(1)]]
    });
  }

  removeLabourRow(index: number) {
    this.labours.removeAt(index);
  }





  printPage(): void {
    const originalTitle = document.title;  // Store original title
    document.title = this.jobCardNumber || 'document';  // Set filename as title
  
    window.print();
  
    setTimeout(() => {
      document.title = originalTitle;  // Restore original title after print
    }, 1000);
  }
  
  jobCardNumber!: string;
  setJobCardNumber(): void {
    const today = new Date();
    const day = this.padNumber(today.getDate());
    const month = this.padNumber(today.getMonth() + 1); // Months are zero-indexed
    const year = today.getFullYear();
    const seconds = String(today.getSeconds()).padStart(2, '0');
    const milliseconds = String(today.getMilliseconds()).padStart(3, '0'); // Ensures 3-digit format



    const jobCardNumber = `RMVI${day}${month}${year}${seconds}${milliseconds}`;
    this.jobCardNumber = jobCardNumber;
    this.serviceForm.get('jobCardNumber')?.setValue(jobCardNumber);
  }


  // Helper function to pad single-digit numbers
  padNumber(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
  subscribeToRowValueChanges(part: any) {
    part.get('qty')?.valueChanges.subscribe(() => this.updateFinalAmount(part));
    part.get('price')?.valueChanges.subscribe(() => this.updateFinalAmount(part));
  }



  // Update finalAmount based on qty and price
  updateFinalAmount(part: any): void {
    const qty = part.get('qty')?.value || 0;
    const price = part.get('price')?.value || 0;
    const finalAmount = qty * price;
    part.get('finalAmount')?.setValue(finalAmount, { emitEvent: false }); // Prevent emitting valueChanges again
  }
  // Calculate the total amount for all parts
  calculateTotalParts(): number {
    let total = 0;
    this.parts.controls.forEach(part => {
      const finalAmount = part.get('finalAmount')?.value || 0;
      total += finalAmount;
    });
    return total;
  }


  // Method to calculate the total of all labour
  calculateTotalLabour(): number {
    let total = 0;
    this.labours.controls.forEach(labour => {
      const finalAmount = labour.get('finalAmount')?.value || 0;
      total += finalAmount;
    });
    return total;
  }

  // Method to calculate the grand total of both parts and labour
  calculateGrandTotal(): number {
    return this.calculateTotalParts() + this.calculateTotalLabour();
  }



  onSubmit() {
    if (this.serviceForm.valid) {
      const formData = this.serviceForm.value;

      // Send the data to the API
      this.http.post('https://your-api-endpoint.com/save', formData)
        .subscribe(
          response => {
            console.log('Data saved successfully', response);
          },
          error => {
            console.error('Error saving data', error);
          }
        );
    } else {
      console.log('Form is invalid');
    }
  }
}

interface PartOption {
  id: number;
  name: string;
  productID: string;
}
interface LabourOption {
  id: number;
  name: string;
  productID: string;
}
