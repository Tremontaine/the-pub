import Layout from '../../components/Layout';
import EntryDetail from '../../components/EntryDetail';
import { getContentPaths, getContentBySlugWithHTML } from '../../lib/api';

export default function BestiaryEntry({ monsterData }) {
  if (!monsterData) {
    return (
      <Layout title="Monster Not Found | The Pub">
        <h1>Monster Not Found</h1>
        <p>The requested monster could not be found.</p>
      </Layout>
    );
  }
  
  const { entry, content, rawMarkdown } = monsterData;
  
  return (
    <Layout title={`${entry.name} | Bestiary | The Pub`}>
      <EntryDetail 
        entry={entry} 
        content={content} 
        type="bestiary" 
        rawMarkdown={rawMarkdown}
      />
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getContentPaths('bestiary').map(path => ({
    params: { slug: path.replace(/\.md$/, '') },
  }));
  
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const monsterData = await getContentBySlugWithHTML('bestiary', params.slug);
  
  if (!monsterData) {
    return {
      notFound: true,
    };
  }
  
  return {
    props: {
      monsterData,
    },
  };
}