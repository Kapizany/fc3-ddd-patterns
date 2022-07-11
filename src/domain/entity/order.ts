import OrderItem from "./ordem_item";

export default class Order {

    private _id: string;
    private _customerId: string;
    private _items: OrderItem[] = [];
    private _total: number;

    constructor(id: string, customerId: string, items: OrderItem[]){
        this._id = id;
        this._customerId = customerId;
        this._items = items;
        this._total = this.total();
        this.validate();
    }
    set customer_id(value: string){
        this._customerId = value;
        this.validate();
    }
    set items(items: OrderItem[]){
        this._items = items;
        this._total = this.total();
        this.validate();
    }
    get id(): string{
        return this._id;
    }

    get customer_id(): string{
        return this._customerId;
    }

    get items(): Array<OrderItem> {
        return this._items;
    }

    validate(): void{
        if (this._id.length === 0) {
            throw new Error("Id is required");
        }
        if (this._customerId.length === 0) {
            throw new Error("Customer id is required");
        }
        if (this._items.length === 0) {
            throw new Error("At least one item is required");
        }
        if(this._items.some(item => item.quantity <= 0)){
            throw new Error("Item quantity must be greater than 0");
        }
    }

    total(): number {
        return this._items.reduce((total, item) => total + item.price, 0)
    }
}