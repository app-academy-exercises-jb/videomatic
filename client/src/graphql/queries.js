import gql from "graphql-tag";

export const CURRENT_USER = gql`
  query CurrentUser {
    me {
      _id
      username
    }
  }
`;

export const IS_LOGGED_IN = gql`
  query IsLoggedIn {
    isLoggedIn @client
  }
`;

export const GET_ONLINE_USERS = gql`
  query Users {
    users {
      _id
      username
    }
  }
`;

export const GET_MESSAGES = gql`
  query Messages {
    messages {
      _id
      author {
        _id
        username
      }
      body
      createdAt
    }
  }
`;
