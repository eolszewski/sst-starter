import * as iam from "aws-cdk-lib/aws-iam";
import { Auth, use } from "@serverless-stack/resources";
import { Database } from "./Database";
import { Api } from "./Api";

export function AuthStack({ stack, app }: any) {
    const { bucket } = use(Database);
    const { api } = use(Api);
    // Create a Cognito User Pool and Identity Pool
    const auth = new Auth(stack, "Auth", {
        login: ["email"],
    });
    auth.attachPermissionsForAuthUsers(stack, [
        // Allow access to the API
        api,
        // Policy granting access to a specific folder in the bucket
        new iam.PolicyStatement({
            actions: ["s3:*"],
            effect: iam.Effect.ALLOW,
            resources: [
                bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
            ],
        }),
    ]);
        
    // Show the auth resources in the output
    stack.addOutputs({
        Region: app.region,
        UserPoolId: auth.userPoolId,
        IdentityPoolId: auth.cognitoIdentityPoolId,
        UserPoolClientId: auth.userPoolClientId,
    });

    // Return the auth resource
    return {
        auth,
    };
}