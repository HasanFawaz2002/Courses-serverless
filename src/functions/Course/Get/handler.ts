import { DynamoDBClient, GetItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const dynamoDB = new DynamoDBClient({ region: 'us-east-1' });
const tableName = 'CourseTable';

export const getCourseById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const CourseID = event.pathParameters.CourseID;

        const getItemParams: GetItemCommandInput = {
            TableName: tableName,
            Key: {
                CourseID: { S: CourseID },
            },
        };

        const getItemResult = await dynamoDB.send(new GetItemCommand(getItemParams));

        if (getItemResult.Item) {
            return {
                statusCode: 200,
                body: JSON.stringify(getItemResult.Item),
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:5173',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                },
            };
        } else {
            return {
                statusCode: 404, 
                body: JSON.stringify({ message: "Course not found" }),
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:5173',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                },
            };
        }
    } catch (error) {
        console.error("Error getting course by ID:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:5173',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            },
        };
    }
};
