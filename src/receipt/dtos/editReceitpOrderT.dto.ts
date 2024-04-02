export class ReceiptOrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export class EditReceiptOrderTransferDto {
  constructor(
    id: number,
    supplierId: number,
    receiptOrderItems: ReceiptOrderItem[],
  ) {
    this.id = id;
    this.supplierId = supplierId;
    this.receiptOrderItems = receiptOrderItems;
  }

  id: number;
  supplierId: number;
  receiptOrderItems: ReceiptOrderItem[];
}
