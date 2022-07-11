import Address from "../../entity/address";
import Customer from "../../entity/customer";
import { EventDispatcher } from "../@shared/event-dispatcher";
import { EnviaConsoleLog1Handler } from "./handler/envia-console-log-1.handler";
import { EnviaConsoleLog2Handler } from "./handler/envia-console-log-2.handler";
import { EnviaConsoleLogHandler } from "./handler/envia-console-log.handler";

describe("Customer events tests", () => {

    it("should tigger two event handlers when a client was created", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new EnviaConsoleLog1Handler();
        const eventHandler2 = new EnviaConsoleLog2Handler();
        const spyEvent1Handler = jest.spyOn(eventHandler1, "handle");
        const spyEvent2Handler = jest.spyOn(eventHandler2, "handle");
        
        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toContainEqual(eventHandler1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toContainEqual(eventHandler2);

        let customer = new Customer("01", "Customer 1", eventDispatcher)
        expect(spyEvent1Handler).toHaveBeenCalled()
        expect(spyEvent2Handler).toHaveBeenCalled()

    });

    it("should tigger an event handler when a client change his/her address", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLogHandler();
        const spyEvent1Handler = jest.spyOn(eventHandler, "handle");
        
        eventDispatcher.register("CustomerChangeAddressEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]).toMatchObject(eventHandler);

        let customer = new Customer("01", "Customer 1")
        const address = new Address('Stret One', 123, "12123123", "São Paulo")
        customer.changeAddress(address, eventDispatcher)
        expect(spyEvent1Handler).toHaveBeenCalled()

    });
})