import Link from 'next/link';

import queryGraphql from '../shared/query-graphql';

export default function TodoListing({ todos }) {
  return (
    <div>
      <h1>Todos Listing</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.title}>
            <Link href="/[title]" as={`/${todo.id}`}>
              <a>{todo.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getStaticProps() {
  const { todos } = await queryGraphql(`
    query {
      todos {
        id
        title
      }
    }
  `);
  return { props: { todos } };
}
