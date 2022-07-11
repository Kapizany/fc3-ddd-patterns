import Address from "../../entity/address";
import { EventInterface } from "../@shared/event.interface";

export class CustomerChangeAddressEvent implements EventInterface{
    dataTimeOccured: Date;
    eventData: {
        id:string,
        nome: string,
        endereco: Address,
    };

    constructor(eventData: any) {
        this.dataTimeOccured = new Date();
        this.eventData = eventData;
    }
}