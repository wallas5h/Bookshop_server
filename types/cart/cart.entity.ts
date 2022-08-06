export interface CartModelType {
  user: string,
  books: string[],
  active: boolean,
}

export interface GetBooksFromCartResponse {
  id: string,
  _id: string,
  count: number,
}