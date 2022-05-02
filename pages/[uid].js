import Head from 'next/head';
import { GET_DETAILS, GET_UIDS } from '../GraphQL/Queries';
import { client } from './_app';
import { RichText } from 'prismic-reactjs';
import { htmlSerializer } from '../prismic-config';
import Image from 'next/image';
import Router from 'next/router';
import styles from '../styles/Grid.module.css';

export async function getStaticProps({ params }) {
  const { data } = await client.query({ query: GET_DETAILS(params.uid) });

  return {
    props: {
      article: data.article ?? null,
    },
  };
}

export async function getStaticPaths() {
  const { data } = await client.query({ query: GET_UIDS });

  return {
    paths: data.allArticles.edges.map(({ node }) => ({
      params: { uid: node._meta.uid },
    })),
    fallback: true,
  };
}

export default function ArticleDetail({ article }) {
  return (
    <div>
      <Head>
        <title>Leisure Time Inc. | Post</title>
        <meta
          name='description'
          content='This is a post from the Leisure Time Inc. blog. '
        />
        <link rel='icon' href='/favicon.png' />
      </Head>

      <main className={styles.container}>
        <Image
          src={article.feature_image.url}
          alt={article.feature_image.alt}
          width='1000px'
          height='500px'
        />
        <h1>{article?.title?.[0]?.text}</h1>
        {article.body
          .filter((index) => index.type === 'inline_text')
          .map((content, index) => {
            return (
              <RichText
                key={index}
                render={content.primary.description}
                htmlSerializer={htmlSerializer}
              />
            );
          })}
        <button onClick={() => Router.back()} className={styles.button}>
          Back
        </button>
      </main>
    </div>
  );
}
