// ==================== General Response ====================

interface IResponse<T> {
  results: number;
  metadata: IMetadata;
  data: T[];
}

interface IProductDetailResponse {
  data: IProductDetail;
}

interface IMetadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage: number;
}

// ==================== Product ====================

interface IProduct {
  sold: number;
  images: string[];
  subcategory: ISubcategory[];
  ratingsQuantity: number;
  _id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  imageCover: string;
  category: ICategory;
  brand: IBrand;
  ratingsAverage: number;
  createdAt: string;
  updatedAt: string;
  id: string;
  priceAfterDiscount?: number;
  availableColors?: any[];
}

interface IProductDetail extends IProduct {
  __v: number;
  reviews: IReview[];
}

// ==================== Subcategory ====================

interface ISubcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

// ==================== Brand ====================

interface IBrand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

// ==================== Category ====================

interface ICategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== Review ====================

interface IReview {
  _id: string;
  review: string;
  rating: number;
  product: string;
  user: IUser;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// ==================== User ====================

interface IUser {
  _id: string;
  name: string;
}

// ==================== Cart =======================
interface ICartResponse {
  status: string;
  numOfCartItems: number;
  cartId: string;
  data: ICartData;
}

interface IAddToCartResponse extends ICartResponse {
  message: string;
}

interface ICartData {
  _id: string;
  cartOwner: string;
  products: IProductCart[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalCartPrice: number;
}

interface IProductCart {
  count: number;
  _id: string;
  product: IProduct;
  price: number;
}

// ==================== Carousel ====================

interface IHeroSlide {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaLink: string;
  background: string;
}

interface IDealProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  oldPrice: number;
  discountPercent: number;
  claimedPercent: number;
}

// ==================== Auth ====================

interface IRegister {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

interface ILogin {
  email: string;
  password: string;
}

interface IShippingAddress {
  details: string;
  phone: string;
  city: string;
}
interface ICheckoutSessionResponse {
  status: string;
  session: ICheckoutSession;
}
interface ICheckoutSession {
  url: string;
  success_url: string;
  cancel_url: string;
}

interface ICheckoutSessionOptions {
  cartId: string;
  shippingAddress?: IShippingAddress;
  url?: string;
}

interface IUserSession {
  id: string;
  device: string;
  icon: 'desktop' | 'mobile';
  location: string;
  lastActive: string;
  current: boolean;
}

// ================== Orders ===============

interface IOrderResponse {
  status: string;
  data: IOrder[];
}

interface IOrder {
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  _id: string;
  user: IOrderUser;
  cartItems: IOrderCartItem[];
  shippingAddress?: IShippingAddress;
  createdAt: string;
  updatedAt: string;
  id: number;
  __v: number;
}

interface IOrderUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface IOrderCartItem {
  count: number;
  _id: string;
  product: IOrderProduct;
  price: number;
}

interface IOrderProduct {
  _id: string;
  id: string;
  title: string;
  imageCover: string;
  ratingsQuantity: number;
  ratingsAverage: number;
  category: IOrderCategory;
  brand: IOrderBrand;
  subcategory: IOrderSubcategory[];
}

interface IOrderCategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

interface IOrderBrand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

interface IOrderSubcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}
