export type Product = {
  name: string;
  reviews: any[];
  price: number;
  discount: number;
  discriptio
  id: string;
  slug  :      String  
  description: String   
  isNew     :  Boolean
  isPublished    :  Boolean
  image    :   String
  stock    :   number

  quantity : number
  category :{
    name: string;
    id:  string;
    image: string;
  }
  brand  :{
    name: string;
    id:  string;
    image: string;
  }
  rating  :   number
  properties :any
  hashtags :any[]
  images: {
    url: string[];
  };
};
