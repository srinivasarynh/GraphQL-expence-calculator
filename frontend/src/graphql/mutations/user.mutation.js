import { gql } from "@apollo/client";

export const SIGN_UP = gql`
    mutation SignUp($input: SignupInput!) {
        signUp(input: $input) {
            _id,
            name, 
            username,
            gender
        }
    }
`