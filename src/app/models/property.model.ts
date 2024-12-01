export interface PropertyListing {
    id?: string;
    address: string;
    type: string;
    price: number;
    squareFootage: number;
    numberOfBedrooms: number;
    numberOfBathrooms: number;
    description: string;
    status: string;
    listingDate: string;
    imageUrls: string;
    userId?: string;
}