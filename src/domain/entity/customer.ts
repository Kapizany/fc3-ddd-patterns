import { EventDispatcherInterface } from "../event/@shared/event-dispatcher.interface";
import { CustomerChangeAddressEvent } from "../event/customer/customer-change-address.event";
import { CustomerCreatedEvent } from "../event/customer/customer-created.event";
import Address from "./address";

export default class Customer {
    private _id: string;
    private _name: string;
    private _address!: Address;
    private _active: boolean = false;
    private _rewardPoints: number = 0


    constructor(id: string, name: string, eventDispatcher:(EventDispatcherInterface | undefined) = undefined) {
        this._id = id;
        this._name = name;
        this.validate();
        if (eventDispatcher){
          eventDispatcher.notify(new CustomerCreatedEvent({
            id,
            name,
          }));
        }
      }
    
      get id(): string {
        return this._id;
      }
    
      get name(): string {
        return this._name;
      }
    
    
      validate() {
        if (this._id.length === 0) {
          throw new Error("Id is required");
        }
        if (this._name.length === 0) {
          throw new Error("Name is required");
        }
      }
    
      changeName(name: string) {
        this._name = name;
        this.validate();
      }
    
      get Address(): Address {
        return this._address;
      }

      get rewardPoints(): number{
        return this._rewardPoints;
      }

      
      changeAddress(address: Address, eventDispatcher:EventDispatcherInterface | undefined = undefined) {
        this._address = address;
        if (eventDispatcher){
          eventDispatcher.notify(new CustomerChangeAddressEvent({
            id: this._id,
            nome: this._name,
            endereco: address,
          }));
        }
      }
    
      isActive(): boolean {
        return this._active;
      }
    
      activate() {
        if (this._address === undefined) {
          throw new Error("Address is mandatory to activate a customer");
        }
        this._active = true;
      }
    
      deactivate() {
        this._active = false;
      }

      addRewardPoints(points: number):void{
        this._rewardPoints += points;
      }

      set Address(address: Address) {
        this._address = address;
      }
}