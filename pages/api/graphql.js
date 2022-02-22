import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-micro';

require('dotenv').config();
const postgres = require('postgres');
const sql = postgres();

const typeDefs = gql`
  type Query {
    todos(filterChecked: Boolean): [Todo]
    todo(id: ID!): Todo
  }
  type Mutation {
    createTodo(title: String!): Todo
  }
  type Todo {
    id: ID
    title: String
  }
`;

async function getTodos() {
  return await sql`select * from todos`;
}

async function getFilteredTodos(checked) {
  return await sql`select * from todos WHERE checked = ${checked}`;
}

async function getTodo(id) {
  const result = await sql`select * from todos WHERE id = ${id}`;
  return result[0];
}

async function createTodo(title) {
  const result = await sql`INSERT INTO todos (title, checked)
  VALUES (${title}, ${false}) RETURNING id, title, checked;`;
  return result[0];
}

const resolvers = {
  Query: {
    todo: (parent, args) => {
      return getTodo(args.id);
    },
    todos: (parent, args) => {
      if (args.filterChecked === true) {
        return getFilteredTodos(true);
      } else if (args.filterChecked === false) {
        return getFilteredTodos(false);
      }

      return getTodos();
    },
  },
  Mutation: {
    createTodo: (parent, args) => {
      return createTodo(args.title);
    },
  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default new ApolloServer({ schema }).createHandler({
  path: '/api/graphql',
});
