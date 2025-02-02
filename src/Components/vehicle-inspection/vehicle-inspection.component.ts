import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-vehicle-inspection',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],  
  templateUrl: './vehicle-inspection.component.html',
  styleUrl: './vehicle-inspection.component.scss'
})
export class VehicleInspectionComponent {

  parts: Part[] = [];

  addRow() {
    this.parts.push({
      code: '',
      description: '',
      qty: 0,
      price: 0,
      amount: 0
    });
  }

  removeRow(index: number) {
    this.parts.splice(index, 1);
  }
}


interface Part {
  code: string;
  description: string;
  price: number;
  qty: number;
  amount: number;
}
