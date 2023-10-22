import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { schema } from '../Schema';

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

export const updateUserById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const UserId = event.pathParameters.UserId;

        const reqBody = JSON.parse(event.body);

        validationSchema(reqBody);

        const item: { [key: string]: any } = {
            UserId: { S: UserId },
        };

        if (reqBody.name) {
            item.name = { S: reqBody.name };
        }
        if (reqBody.email) {
            item.email = { S: reqBody.email };
        }

        const putItemParams: PutItemCommandInput = {
            TableName: tableName,
            Item: item,
        };

        try {
            const putResult = await dynamoDB.send(new PutItemCommand(putItemParams));

            return {
                statusCode: 200,
                body: JSON.stringify({ message: "User updated successfully", response: putResult }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Credentials': true,
                },
            };
        } catch (error) {
            console.error("Error updating user by ID:", error);

            if (error.code === 'UnauthorizedException' || error.code === 'AccessDeniedException') {
                return {
                    statusCode: 401,
                    body: JSON.stringify({ error: "Unauthorized" }),
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                        'Access-Control-Allow-Credentials': true,
                    }
                };
            } else {
                return {
                    statusCode: 500,
                    body: JSON.stringify({ error: "Internal Server Error" }),
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                        'Access-Control-Allow-Credentials': true,
                    }
                };
            }
        }
    } catch (error) {
        console.error("Error updating user by ID:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Credentials': true,
            }
        };
    }
};
