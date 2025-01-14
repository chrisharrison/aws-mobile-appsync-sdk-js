import { authLink, AUTH_TYPE } from "../../src/auth-link";
import { execute, ApolloLink, Observable } from "@apollo/client/core";
import gql from 'graphql-tag';

describe("Auth link", () => { 
    test('Test AWS_LAMBDA authorizer for queries', (done) => {
        const query = gql`query { someQuery { aField } }`

        const link = authLink({
            auth: {
                type: AUTH_TYPE.AWS_LAMBDA,
                token: 'token'
            }, 
            region: 'us-east-1',
            url: 'https://xxxxx.appsync-api.amazonaws.com/graphql'
        })

        
        const spyLink = new ApolloLink((operation, forward) => {
            const { headers: { Authorization} } = operation.getContext();
            expect(Authorization).toBe('token');
            done();

            return new Observable(() => {});
        })
        
        const testLink = ApolloLink.from([link, spyLink]);

        execute(testLink, { query }).subscribe({ })
    });

    test('Test AMAZON_COGNITO_USER_POOLS authorizer for queries', (done) => {
        const query = gql`query { someQuery { aField } }`

        const link = authLink({
            auth: {
                type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
                jwtToken: 'token'
            }, 
            region: 'us-east-1',
            url: 'https://xxxxx.appsync-api.amazonaws.com/graphql'
        })

        
        const spyLink = new ApolloLink((operation, forward) => {
            const { headers: { Authorization} } = operation.getContext();
            expect(Authorization).toBe('token');
            done();

            return new Observable(() => {});
        })
        
        const testLink = ApolloLink.from([link, spyLink]);

        execute(testLink, { query }).subscribe({ })
    });

    test('Test AMAZON_COGNITO_USER_POOLS authorizer uses result of async jwtToken method', (done) => {
        const query = gql`query { someQuery { aField } }`

        const initialiLink = authLink({
            auth: {
                type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
                jwtToken: 'token'
            }, 
            region: 'us-east-1',
            url: 'https://xxxxx.appsync-api.amazonaws.com/graphql'
        })

        const link = authLink({
            auth: {
                type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
                jwtToken: 'updated-token'
            }, 
            region: 'us-east-1',
            url: 'https://xxxxx.appsync-api.amazonaws.com/graphql'
        })

        
        const spyLink = new ApolloLink((operation, forward) => {
            const { headers: { Authorization} } = operation.getContext();
            expect(Authorization).toBe('updated-token');
            done();

            return new Observable(() => {});
        })
        
        const testLink = ApolloLink.from([initialiLink, link, spyLink]);

        execute(testLink, { query }).subscribe({ })
    });

    test('Test OPENID_CONNECT authorizer for queries', (done) => {
        const query = gql`query { someQuery { aField } }`

        const link = authLink({
            auth: {
                type: AUTH_TYPE.OPENID_CONNECT,
                jwtToken: 'token'
            }, 
            region: 'us-east-1',
            url: 'https://xxxxx.appsync-api.amazonaws.com/graphql'
        })

        
        const spyLink = new ApolloLink((operation, forward) => {
            const { headers: { Authorization} } = operation.getContext();
            expect(Authorization).toBe('token');
            done();

            return new Observable(() => {});
        })
        
        const testLink = ApolloLink.from([link, spyLink]);

        execute(testLink, { query }).subscribe({ })
    });

    test('Test API_KEY authorizer for queries', (done) => {
        const query = gql`query { someQuery { aField } }`

        const link = authLink({
            auth: {
                type: AUTH_TYPE.API_KEY,
                apiKey: 'token'
            }, 
            region: 'us-east-1',
            url: 'https://xxxxx.appsync-api.amazonaws.com/graphql'
        })

        
        const spyLink = new ApolloLink((operation, forward) => {
            const { headers } = operation.getContext();

            expect(headers["X-Api-Key"]).toBe('token');
            done();

            return new Observable(() => {});
        })
        
        const testLink = ApolloLink.from([link, spyLink]);

        execute(testLink, { query }).subscribe({ })
    });
});