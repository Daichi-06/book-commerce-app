export interface BookType {
  id: number;
  title: string;
  content: string;
  thumbnail: {
    url: string;
  };
  price: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  image?: string;
}

export interface Purchase {
  id: number;
  userId: string;
  bookId: string;
  created_at: string;
}
