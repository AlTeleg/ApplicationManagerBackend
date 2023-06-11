export default class Ticket {
    constructor(name, status) {
        this.id = Ticket.incrementId(); // идентификатор (уникальный в пределах системы) 1+
        this.name = name; // краткое описание
        this.status = status; // boolean - сделано или нет
        this.created = Date.now(); // дата создания (timestamp)
    }

    static incrementId() {
        if (!this.latestId) {
            this.latestId = 1;
        } else {
            this.latestId++;
        }
        return this.latestId
    }
}
export class TicketFull extends Ticket {
    constructor(name, status, description) {
        super(name, status);
        this.description = description; // полное описание
    }
}