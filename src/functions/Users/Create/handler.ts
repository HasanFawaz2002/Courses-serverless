import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from 'uuid';

import { schema } from '../Schema';

import {
    DynamoDBClient,
    PutItemCommand,
    PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";

const dynamoDB = new DynamoDBClient({ region: 'us-east-1' });
const tableName = 'UsersCourseTable'; 

const validationSchema = async (reqBody) => {
    try {
        await schema.validate(reqBody, { abortEarly: false });
    } catch (validationError) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: validationError.errors }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            },
        };
    }
}

export const createUserCourse = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        console.log("Event body:", event.body);

        const reqBody = JSON.parse(event.body);

        console.log("Parsed reqBody:", reqBody);

        validationSchema(reqBody);

        

        const userCourse = {
            UserId: { S: v4() }, 
            name: { S: reqBody.name },
            email: { S: reqBody.email },
        };

        const putItemParams: PutItemCommandInput = {
            TableName: tableName,
            Item: userCourse,
        };

        await dynamoDB.send(new PutItemCommand(putItemParams));

        return {
            statusCode: 200,
            body: JSON.stringify(userCourse),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            },
        };
    } catch (error) {
        console.error("Error creating user course:", error);

        if (error.code === 'UnauthorizedException' || error.code === 'AccessDeniedException') {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: "Unauthorized" }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                },
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Internal Server Error" }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                },
            };
        }
    }
};
