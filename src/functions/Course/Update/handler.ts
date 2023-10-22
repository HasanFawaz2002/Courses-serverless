import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {schema} from '../Schema';

const dynamoDB = new DynamoDBClient({ region: 'us-east-1' });
const tableName = 'CourseTable';

export const updateCourseById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const CourseID = event.pathParameters.CourseID;

        const reqBody = JSON.parse(event.body);

        try {
            await schema.validate(reqBody, { abortEarly: false });
        } catch (validationError) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: validationError.errors }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Credentials': true
                },
            };
        }

        
        const item: { [key: string]: any } = {
            CourseID: { S: CourseID }, 
        };

        
        if (reqBody.name) {
            item.name = { S: reqBody.name };
        }
        if (reqBody.description) {
            item.description = { S: reqBody.description };
        }
        if (reqBody.credit) {
            item.credit = { N: reqBody.credit.toString() };
        }

        const putItemParams: PutItemCommandInput = {
            TableName: tableName,
            Item: item,
        };

        try {
            const putResult = await dynamoDB.send(new PutItemCommand(putItemParams));

            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Item updated successfully", response: putResult }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Credentials': true
                },
            };
        } catch (error) {
            console.error("Error updating course by ID:", error);

            if (error.code === 'UnauthorizedException' || error.code === 'AccessDeniedException') {
                
                return {
                    statusCode: 401,
                    body: JSON.stringify({ error: "Unauthorized" }),
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                        'Access-Control-Allow-Credentials': true
                    },
                };
            } else {
                
                return {
                    statusCode: 500,
                    body: JSON.stringify({ error: "Internal Server Error" }),
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                        'Access-Control-Allow-Credentials': true
                    },
                };
            }
        }
    } catch (error) {
        console.error("Error updating course by ID:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Credentials': true
            },
        };
    }
};
