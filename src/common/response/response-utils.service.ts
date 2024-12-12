import { ZodError } from 'zod';
import Response from "./response.dto";



async function genericZodErrorHandler(error: any): Promise<Response> {
    if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
            message: `${issue.path.join('.')} is ${issue.message}`,
        }));
        return new Response(400, JSON.stringify({ error: 'Invalid data', details: errorMessages }), { 'Content-Type': 'application/json' });
    }
    console.error(error);
    return new Response(500, JSON.stringify({ error: 'Internal Server Error', details: error.message }), { 'Content-Type': 'application/json' });
}

async function genericObjectRemoveDBFields(response: Response): Promise<Response> {
    const body = JSON.parse(response.getBody());
    if (body.payload && Array.isArray(body.payload) && body.payload.length > 0) {
        body.payload = body.payload.filter((x: any) => x != null).map((item: any) => {
            removeFields(item);
            return item;
        });
    } else {
        removeFields(body.payload);
    }
    return new Response(response.getStatus(), JSON.stringify(body), response.getHeaders());
}

function removeFields(item: any) {
    delete item["_rid"];
    delete item["_self"];
    delete item["_etag"];
    delete item["_attachments"];
    delete item["_ts"];
    //item["relatedParty"].forEach((relatedParty: any) => {
    //    delete relatedParty["id"];
    //});
}

export { genericZodErrorHandler, genericObjectRemoveDBFields };