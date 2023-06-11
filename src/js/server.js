import http from 'http';
import Koa from 'koa';
import { koaBody } from 'koa-body';
import cors from '@koa/cors';
import Ticket, { TicketFull } from './tickets.js';

const app = new Koa();

var tickets = [];

app.use(koaBody({
    urlencoded: true,
    multipart: true,
    json: true,
}));

app.use(cors());

app.use(async (ctx, next) => {
    const { method } = ctx.request.query;
    console.log(ctx.request.body);
    console.log(method);

    switch (method) {
        case 'allTickets':
            if (ctx.request.method !== 'GET') {
                await next();
                return;
            }
            ctx.response.type = 'application/json';
            ctx.response.body = JSON.stringify(tickets);
            ctx.response.status = 200;
            return;

        case 'ticketById':
            const { id } = ctx.request.query;
            if (ctx.request.method === 'GET') {
                ctx.response.type = 'application/json';
                ctx.response.body = JSON.stringify(tickets.find(ticket => ticket.id == id));
                ctx.response.status = 200;
                return;
            }
            else if (ctx.request.method === 'DELETE') {
                tickets = tickets.filter(ticket => ticket.id != id);
                ctx.response.type = 'application/json';
                ctx.response.body = JSON.stringify(tickets);
                ctx.response.status = 200;
                return
            }
            else if (ctx.request.method === 'PATCH') {
                
                const { name, status, description } = ctx.request.body;
                let ticket = tickets.find(ticket => ticket.id == id)
                let index = tickets.indexOf(ticket);
                console.log(tickets[index]);
                tickets[index].name = name;
                tickets[index].status = status;
                console.log(tickets[index].status)
                if (description) {
                    tickets[index].description = description;
                }

                ctx.response.type = 'application/json';
                ctx.response.body = JSON.stringify(tickets);
                ctx.response.status = 200;
                return
            } else {
                await next();
                return;
            }

        case 'createTicket':
            if (ctx.request.method !== 'POST') {
                await next();
                return;
            }

            const { name, status, description } = ctx.request.body;
            if (!description) {
                tickets.push(new Ticket(name, status));
            } else {
                tickets.push(new TicketFull(name, status, description));
            }
            ctx.response.status = 201;
            ctx.response.type = 'application/json';
            ctx.response.body = JSON.stringify(tickets);
            return;

        default:
            ctx.response.status = 404;
            return;
    }
});

const port = 7070;
const server = http.createServer(app.callback());

server.listen(port, (err) => {
    if (err) {
        console.log(err);
        return
    }
    console.log(`Server is listeting to the port ${port}`)
})
