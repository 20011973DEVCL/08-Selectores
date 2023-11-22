import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, switchMap, tap } from 'rxjs';

import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { CountriesService } from '../../services/countries.service';


@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit  {

  public countriesByRegion: SmallCountry[]=[];
  public borders: SmallCountry[]=[];

  public myForm: FormGroup = this.fb.group({
    region : ['', Validators.required ],
    country: ['', Validators.required ],
    border : ['', Validators.required ],
  });


  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) {}

  ngOnInit(): void {
   this.onRegionChanged();
   this.onCountryChanged();
  }

  get regions():Region[]
  {
    return this.countriesService.regions;
  }

  onRegionChanged()
  {
    this.myForm.get('region')?.valueChanges
      .pipe(
        tap( ()=> this.myForm.get('country')?.setValue('')),
        tap( ()=> this.borders = []),
        switchMap(region => this.countriesService.getCountriesByRegion(region)),
      )
      .subscribe(countries => {
        this.countriesByRegion = countries.sort((a, b) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
      });
  }

  onCountryChanged()
  {
    this.myForm.get('country')?.valueChanges
    .pipe(
      tap( ()=> this.myForm.get('border')?.setValue('')),
      filter( (value: string) => value.length > 0),
      switchMap(alphacode => this.countriesService.getCountryByAlphaCode(alphacode)),
      switchMap((country) => this.countriesService.getCountryBordersByCodes(country.borders))
    )
    .subscribe(country => {
      // this.countriesByRegion = borders.sort((a, b) => {
      //   const nameA = a.name.toUpperCase();
      //   const nameB = b.name.toUpperCase();
      //   if (nameA < nameB) {
      //     return -1;
      //   }
      //   if (nameA > nameB) {
      //     return 1;
      //   }
      //   return 0;
      // });
      this.borders = country;
      console.log({borders: country});
    });
  }







}
