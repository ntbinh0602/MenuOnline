/* TYPE */
export enum RoleType {
  STORE_OWNER = "STORE_OWNER",
  STAFF = "STAFF",
  MANAGER = "MANAGER",
  CHEF = "CHEF",
}
export enum RequestType {
  STAFF = 'STAFF',
  ORDER = 'ORDER',
  PAYMENT = 'PAYMENT'
}

/* STATUS */
export enum ProductStatus {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK'
}

export enum TableStatus {
  EMPTY = 'EMPTY',
  OCCUPIED = 'OCCUPIED'
}
export enum RequestStatus {
  PENDING = 'PENDING',
  INPROGRESS = 'INPROGRESS',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED',
  READY_TO_SERVE ='READY_TO_SERVE',
  SERVED = 'SERVED'
}
export enum RequestProductStatus {
  INPROGRESS = 'INPROGRESS',
  READY_TO_SERVE ='READY_TO_SERVE',
  COMPLETED = 'COMPLETED',
}

export enum OrderStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID'
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

export enum SessionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED'
}
export enum NavigationStackScreens{
  SplashScreen = "SplashScreen",
  AuthNavigation = "AuthNavigation",
  MainNavigation = "MainNavigation"
}
export enum AuthStackScreens{
  Login = "Login"
}
export enum MainStackScreens{
  RequestTransferred = "RequestTransferred"
}
