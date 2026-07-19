import { ChangeDetectorRef,Component,inject,computed, signal } from '@angular/core';
import {HousingLocation} from '../housing-location/housing-location';
import {HousingLocationInfo} from '../housinglocationinfo';
import {HousingService} from '../housing';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSliderModule} from '@angular/material/slider';

@Component({
  selector: 'app-home',
  imports: [HousingLocation,MatSlideToggle,FormsModule,MatSliderModule],
  template: `
     <section>
      <form>
        <div class="filterBar">
          <input type="text" placeholder="Filter by city" #filter/>
        </div>
        <div class="checkboxGroup">
          <label>
            <input type="checkbox" #filter1 />
            gym
          </label> 
          <label>
            <input type="checkbox" #filter2 />
            pool
          </label> 
      </div>
         <div class="range-container">

         <p>Select Price Range:</p>
  <!-- <mat-slider min="700000" max="200000000" step="1000" showTickMarks discrete [displayWith]="formatLabel">
  <input matSliderThumb>
</mat-slider> -->
<mat-slider
  min="30000"
  max="2000000"
  step="100"
  showTickMarks
  discrete
  [displayWith]="formatLabel">
  <input matSliderThumb #filterPrice="matSliderThumb">
</mat-slider>
</div>
        <div class="filterBar">

          <button class="primary" type="button" (click)="filterResults(filter.value, filter1.checked, filter2.checked, filterPrice.value)">Search</button>
</div>
      </form>
    </section>
    <section class="results">
      @for (housingLocation of filteredLocationList; track $index) {
        <app-housing-location [housingLocation]="housingLocation" />
      }
    </section>
  `,
  styles: `
      .results {
      display: grid;
      column-gap: 14px;
      row-gap: 14px;
      grid-template-columns: repeat(auto-fill, minmax(400px, 400px));
      margin-top: 50px;
      justify-content: space-around;
    }
    input[type="text"] {
      border: solid 1px var(--primary-color);
      padding: 10px;
      border-radius: 8px;
      margin-right: 4px;
      display: inline-block;
      width: 30%;
    }
    button {
      padding: 10px;
      border: solid 1px var(--primary-color);
      background: var(--primary-color);
      color: white;
      border-radius: 8px;
    }
    @media (min-width: 500px) and (max-width: 768px) {
      .results {
          grid-template-columns: repeat(2, 1fr);
      }
      input[type="text"] {
          width: 70%;
      }   
    }
    .checkboxGroup{
      display: flex;
      gap: 10px;
      margin-top:20px;
      margin-bottom:20px;
      justify-content: center;
      align-items: center;
    }
    .filterBar{
      display: flex;
      gap: 10px;
      justify-content: center;
      align-items: center;
    }
    mat-slider {
      width: 800px;
    }
    .range-container{
      display: flex;
      gap: 10px;
      justify-content: center;
      align-items: center;
    }
    .mat-mdc-slider .mdc-slider__value-indicator {
  transform: scale(20.5);
}

.mat-mdc-slider .mdc-slider__value-indicator-text {
  font-size: 300px;
  font-weight: 600;
}
    @media (max-width: 499px) {
      .results {
          grid-template-columns: 1fr;
      }    
    }
   
  `,
})
export class Home {
  housingLocationList: HousingLocationInfo[] = [];
  housingService: HousingService = inject(HousingService);
  filteredLocationList: HousingLocationInfo[] = [];
  changeDetectorRef = inject(ChangeDetectorRef);  

  constructor() {
this.housingService
      .getAllHousingLocations()
      .then((housingLocationList: HousingLocationInfo[]) => {
        this.housingLocationList = housingLocationList;
        this.filteredLocationList = housingLocationList;
        this.changeDetectorRef.markForCheck();
      });
      
          this.filteredLocationList = this.housingLocationList;
  }
  formatLabel(value: number): string {

  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  }

  if (value >= 1_000) {
    return (value / 1_000).toFixed(0) + 'K';
  }

  return `${value}`;
}
  filterResults(text: string,gymFilter:boolean,pool:boolean,price:number) {
    
    if (!text){
       if(pool && gymFilter){
          this.filteredLocationList = this.housingLocationList.filter((housingLocation) =>
     housingLocation?.pool==pool && housingLocation?.gym==gymFilter,
    );
  }else if(pool){
        this.filteredLocationList = this.housingLocationList.filter((housingLocation) =>
       housingLocation?.pool==pool,
    );
  }else if(gymFilter){
        this.filteredLocationList = this.housingLocationList.filter((housingLocation) =>
     housingLocation?.gym==gymFilter,
    );
  }else{
          this.filteredLocationList = this.housingLocationList;
          
  }
           this.filteredLocationList = this.filteredLocationList.filter(
  housingLocation => housingLocation.price <= price,
);
          return;
    }
    if(pool && gymFilter){
          this.filteredLocationList = this.housingLocationList.filter((housingLocation) =>
      housingLocation?.city.toLowerCase().includes(text.toLowerCase())&& housingLocation?.pool==pool && housingLocation?.gym==gymFilter,
    );
  }else if(pool){
        this.filteredLocationList = this.housingLocationList.filter((housingLocation) =>
      housingLocation?.city.toLowerCase().includes(text.toLowerCase())&& housingLocation?.pool==pool,
    );
  }else if(gymFilter){
        this.filteredLocationList = this.housingLocationList.filter((housingLocation) =>
      housingLocation?.city.toLowerCase().includes(text.toLowerCase()) && housingLocation?.gym==gymFilter,
    );
  }else{
    this.filteredLocationList = this.housingLocationList.filter((housingLocation) =>
      housingLocation?.city.toLowerCase().includes(text.toLowerCase()),
    );
  }
  this.filteredLocationList = this.filteredLocationList.filter(
  housingLocation => housingLocation.price <= price,
  );
}
}
