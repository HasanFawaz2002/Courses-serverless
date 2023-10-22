import { DynamoDBClient, GetItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const dynamoDB = new DynamoDBClient({ region: 'us-east-1' });
const tableName = 'UsersCourseTable'; 

export const getUserById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const UserId = event.pathParameters.UserId; 

        const getItemParams: GetItemCommandInput = {
            TableName: tableName,
            Key: {
                UserId: { S: UserId }, 
            },
        };

        const getItemResult = await dynamoDB.send(new GetItemCommand(getItemParams));

        if (getItemResult.Item) {
            return {
                statusCode: 200,
                body: JSON.stringify(getItemResult.Item),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Credentials': true,
                },
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "User not found" }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Credentials': true,
                },
            };
        }
    } catch (error) {
        console.error("Error getting user by ID:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Credentials': true,
            },
        };
    }
};
