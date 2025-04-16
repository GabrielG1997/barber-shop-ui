import { Injectable } from "@angular/core";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";

@Injectable({
    providedIn:'root'
})
export class CustomPaginator extends MatPaginatorIntl{
    override itemsPerPageLabel = 'Items per Page';
    override nextPageLabel = 'Next Page';
    override previousPageLabel = 'Previous Page';
    override firstPageLabel = 'First Page';
    override lastPageLabel = 'Last Page';
}