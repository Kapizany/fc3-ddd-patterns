import { EventHandlerInterface } from "../../@shared/event-handler.interface";
import { CustomerChangeAddressEvent } from "../customer-change-address.event";

export class EnviaConsoleLogHandler 
implements EventHandlerInterface<CustomerChangeAddressEvent> {
    handle(event: CustomerChangeAddressEvent): void {
        console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.nome} alterado para: ${event.eventData.endereco}`);
    }    
}