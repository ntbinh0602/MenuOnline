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
  KitchenInProgress = "KitchenInProgress",
  History = "History"
}
export enum SocketEnum {
  TABLE_OCCUPIED = 'table.occupied',
  TABLE_EMPTY = 'table.empty',
  TABLE_CREATED = 'table.created' /* Socket thông báo bàn mới được tạo */,
  NOTIFICATION_REQUEST = 'notification.request' /* Socket thông báo của yêu cầu */,
  REQUEST_NEW = 'request.request-new' /* Socket có yêu cầu mới của khách hàng */,
  REQUEST_TYPE_NEW_PENDING = 'request.request-type-new-pending' /* Thông báo cộng yêu cầu đang được chờ */,
  REQUEST_TYPE_NEW_PENDING_UPDATED = 'request.request-type-new-pending-updated' /* Thông báo giảm yêu cầu đang được chờ */,
  REQUEST_TYPE_NEW_PENDING_RELOAD = 'request.request-type-new-pending-reload' /* Thông báo khi thanh toán */,
  REQUEST_ORDER_CONFIRMED = 'request.request-order-confirmed' /* Yêu cầu gọi món được xác nhận */,
  REQUEST_OTHER_CONFIRMED = 'request.request-other-confirmed' /* Socket yêu cầu được xác nhận hoặc hủy của thanh toán, gọi nhân viên...*/,
  REQUEST_NOTIFY_TRANSFERRED = 'request.request-notify-transferred' /*Thông báo yêu cầu cho màn hình chuyển bếp*/,
  REQUEST_NOTIFY_SERVED = 'request.request-notify-served' /* Thông báo yêu cầu được phục vụ */,
  REQUEST_NOTIFY_REJECTED = 'request.request-notify-rejected' /* Thông báo yêu cầu bị hủy */,
  MESSAGE_CONFIRMED_ORDER = 'message.request-order-confirmed' /* Thông báo tin nhắn đã được xác nhận */,
  MESSAGE_CANCELED_REQUEST_PRODUCT = 'message.request-order-canceled' /* Thông báo món đã được hủy */,
  REQUEST_PRODUCT_CHANGED = 'request-product.request-product-changed' /* Thông báo món thay đổi số lượng */,
  REQUEST_PRODUCT_COMPLETED = 'request-product.request-product-completed' /* Yêu cầu món được hoàn thành hết */,
  REQUEST_PRODUCT_CANCELED = 'request-product.request-product-canceled' /* Yêu cầu món đã hủy hết */,
  REQUEST_PRODUCT_REMADE = 'request-product.request-product-remade' /* Yêu cầu món làm lại */,
  REQUEST_PRODUCT_SERVED = 'request-product.request-product-served' /* Yêu cầu món đã phục vụ hết */,
  REQUEST_PRODUCT_INCREASED_COMPLETED_COUNT = 'request-product.request-product-increased-completed-count' /* Thông báo tăng số lượng món đã hoàn thành cho sidbar*/,
  REQUEST_PRODUCT_DECREASED_COMPLETED_COUNT = 'request-product.request-product-decreased-completed-count' /* Thông báo giảm số lượng món đã hoàn thành cho sidbar*/
}
