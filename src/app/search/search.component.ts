import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../service/search.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, CommonModule, LoaderComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  queryParam: string = '';
  filterQuery: string = ''; // For filtering across fields

  result: any[] = []; // Full dataset
  filteredResults: any[] = []; // Stores filtered dataset
  paginatedResults: any[] = []; // Stores paginated subset

  itemsPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number = 1;
  searchClicked: boolean = false;
  noDataFound: boolean = false;
  error: any = {};

  constructor(private searchService: SearchService) {}

  ngOnInit(){
    this.error['status'] = 200;
  }

  onSearch(): void {
    if (!this.queryParam.trim()) {
      alert('Please enter a job profile before searching.');
      return;
    }
    this.noDataFound = false;
    if(this.error.status !== 200) {
      this.error['status'] = 200;
    }
    this.searchClicked = true;
    this.result = [];
    this.paginatedResults = [];
    if (this.queryParam.trim()) {
      this.searchService.getSearchResults(this.queryParam).subscribe({
        next: (data: any) => {  
          this.result = data;
          this.filterQuery = ''; // Reset filter on new search
          this.applyFilter(); // Apply filter on new results
          this.searchClicked = false;
        },
        error: (error: any) => {
          // console.error("Error came:", error.status);
          this.searchClicked = false;
          this.error.status = error.status
        }
      });
    }
  }

  applyFilter(): void {
    if (this.filterQuery.trim()) {
      const filter = this.filterQuery.toLowerCase();
      this.filteredResults = this.result.filter(job => 
        Object.keys(job).some(key => 
          key !== 'title' && job[key] && job[key].toString().toLowerCase().includes(filter)
        )
      );
    } else {
      this.filteredResults = [...this.result]; // Reset to full list if no filter is applied
    }
    
    this.currentPage = 1; // Reset pagination
    this.totalPages = Math.ceil(this.filteredResults.length / this.itemsPerPage);
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedResults = this.filteredResults.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
}