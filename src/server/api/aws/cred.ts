import {env} from '~/env';
import {fromCognitoIdentityPool} from '@aws-sdk/credential-providers';
import {
  InitiateAuthCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';

export const getAwsCognitoCredentials = async () => {
  try {
    const cognitoClient = new CognitoIdentityProviderClient({
      region: env.AWS_REGION,
    });
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: env.AWS_APP_CLIENT_ID,
      AuthParameters: {
        USERNAME: env.AWS_COGNITO_USERNAME,
        PASSWORD: env.AWS_COGNITO_PASSWORD,
      },
    });
    const authResponse = await cognitoClient.send(command);
    const idToken = authResponse.AuthenticationResult?.IdToken;

    if (!idToken) {
      throw new Error('No ID token received from Cognito');
    }

    const credentials = await fromCognitoIdentityPool({
      identityPoolId: env.AWS_COGNITO_IDENTITY_POOL_ID,
      clientConfig: {region: env.AWS_REGION},
      logins: {
        [`cognito-idp.${env.AWS_REGION}.amazonaws.com/${env.AWS_COGNITO_USER_POOL_ID}`]:
          idToken,
      },
    })();

    return credentials;
  } catch (error) {
    console.error('Error obtaining credentials:', error);
    throw error;
  }
};
