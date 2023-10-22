import {
    DynamoDBClient,
    ScanCommand,
    ScanCommandInput,
} from "@aws-sdk/client-dynamodb";

const dynamoDB = new DynamoDBClient({ region: 'us-east-1' });
const tableName = 'UsersCourseTable';

export const getAllUsers = async () => {
    try {
        const scanParams: ScanCommandInput = {
            TableName: tableName,
        };

        const scanResults = await dynamoDB.send(new ScanCommand(scanParams));

        if (scanResults.Items && scanResults.Items.length > 0) {
            return {
                statusCode: 200,
                body: JSON.stringify(scanResults.Items),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                },
            };
        } else {
            return {
                statusCode: 204,
                body: JSON.stringify({ message: "No users found" }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                },
            };
        }
    } catch (error) {
        console.error("Error getting all users:", error);

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
