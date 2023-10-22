import { DynamoDBClient, DeleteItemCommand, DeleteItemCommandInput } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const dynamoDB = new DynamoDBClient({ region: 'us-east-1' });
const tableName = 'CourseTable';

export const deleteCourseById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const CourseID = event.pathParameters.CourseID;

        const deleteItemParams: DeleteItemCommandInput = {
            TableName: tableName,
            Key: {
                CourseID: { S: CourseID },
            },
        };

        await dynamoDB.send(new DeleteItemCommand(deleteItemParams));

        return {
            statusCode: 204, 
            body: JSON.stringify({ message: "Course Deleted Successfully" }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Credentials': true
            },
        };
    } catch (error) {
        console.error("Error deleting course by ID:", error);

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
};
