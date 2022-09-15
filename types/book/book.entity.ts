export interface AddBookRequest {
  title: string;
  categoty: string;
  author: string;
  description: string;
  imageURL: string;
  newPrice: number;
  oldPrice: number;
  count: number;
  active: boolean;
}

export interface BookResponseEntity {
  _id: string;
  title: string;
  categoty: string;
  author: string;
  description: string;
  imageURL: string;
  newPrice: number;
  oldPrice: number;
  count: number;
  active: boolean;
  updatedAt: string;
  __v: number;
}
