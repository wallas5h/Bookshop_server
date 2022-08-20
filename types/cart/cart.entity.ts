export interface CartModelType {
  user: string,
  books: string[],
  active: boolean,
}

export interface GetBooksFromCartResponse {
  _id: string,
  bookId: string,
  title: string,
  price: number,
  count: number,
  availability?: boolean,
}