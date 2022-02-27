# Axie GraphQL Endpoint

## GraphQL Query & Mutation Schema

```graphql
query Axie($limit: Int = 50, $offset: Int = 0, $sort: SortValue = NAME) {
  classes {
    name
    total_pet_count
  }
  pets(input: { limit: $limit, offset: $offset, sort: $sort }) {
    total_count
    result_count
    pet {
      id
      name
      class
      stage
      priceUSD
    }
  }
  getPet(id: Int!){
    id
    name
    class
    stage
    priceUSD
  }
}

mutation AxieMutation {
    createPet(input: { name: String!, class: PetAllowedClass!, stage: Int!, priceUSD: Float! }): Pet
    updatePet(input: { name: String!, class: PetAllowedClass!, stage: Int!, priceUSD: Float! }): Pet
    deletePet(id: String!): Pet
}
```

## Variables

### Query

| Name   | Description                  | Required | Default Value | Data Type |
| ------ | ---------------------------- | -------- | ------------- | --------- |
| id     | Pet ID field                 | No       | None          | String    |
| limit  | Allowed returned limit       | No       | 50            | Int       |
| offset | Offset index of the result   | No       | 0             | Int       |
| sort   | Sorting option of the result | No       | NAME          | SortValue |

```graphql
enum SortValues {
  CLASS
  PRICE_ASC
  PRICE_DESC
  NAME
}
```

### Mutation

| Name     | Required | Default Value | Data Type       |
| -------- | -------- | ------------- | --------------- |
| id       | Yes      | None          | String          |
| name     | Yes      | None          | String          |
| class    | Yes      | None          | PetAllowedClass |
| stage    | Yes      | None          | Int             |
| priceUSD | Yes      | None          | Float           |

```graphql
enum PetAllowedClass {
  Aquatic
  Bird
  Dawn
  Dusk
  Plant
  Reptile
  Beast
  Bug
  Mech
}
```

## Installation

- Create a `.env` file by populating `.env.example`.
- Import the `axie` database using the dump file located in [mongodb directory](/mongodb/).

  - Import the dump file using the following commands:
    ```bash
    $ mongorestore --gzip --drop --archive=axie_db_copy.gz
    ```
    **NOTE**: this script will be dropping the `axie` database before restoring the dump.

- Execute the following commands to run the GraphQL Server:
  ```bash
  $ npm i
  $ npm run build
  $ npm start
  ```
