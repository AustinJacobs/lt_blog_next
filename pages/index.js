import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { client } from './_app';
import { format } from 'date-fns';
import { GET_POSTS } from '../GraphQL/Queries';
import styles from '../styles/Grid.module.css';

export async function getStaticProps() {
  const { data } = await client.query({
    query: GET_POSTS,
  });

  return {
    props: {
      articles: data.allArticles.edges,
    },
  };
}

export default function Home({ articles }) {
  return (
    <div>
      <Head>
        <title>Leisure Time Inc. | Blog</title>
        <meta
          name='description'
          content='This is the Leisure Time Inc. blog that contains posts about hot tubs, fireplaces and other information.'
        />
        <link rel='icon' href='/favicon.png' />
      </Head>

      <main className={styles.container}>
        {articles.map((article) => (
          <Link key={article.node._meta.id} href={`/${article.node._meta.uid}`}>
            <a>
              <div className={styles.card}>
                <Image
                  src={article.node.feature_image.url}
                  alt={article.node.feature_image.alt}
                  width='1000px'
                  height='500px'
                />
                <h2>{article.node.title[0].text}</h2>
                <p>
                  Published on{' '}
                  {format(
                    new Date(article.node.published_at.substring(0, 10)),
                    'MMM dd, yyyy'
                  )}
                </p>
                <div>
                  {article.node.body
                    .find((data) => data.type === 'inline_text')
                    ?.primary?.description?.map(({ text }, index) => {
                      if (index === 0) {
                        return (
                          <p key={index}>
                            {text.substring(0, 190)}...
                            <br />
                          </p>
                        );
                      }
                      return '';
                    })}
                </div>
              </div>
            </a>
          </Link>
        ))}
      </main>
    </div>
  );
}
