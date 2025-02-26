import Layout from '../../components/Layout';
import EntryDetail from '../../components/EntryDetail';
import { getContentPaths, getContentBySlugWithHTML } from '../../lib/api';

export default function ItemEntry({ itemData }) {
  if (!itemData) {
    return (
      <Layout title="Item Not Found | The Pub">
        <h1>Item Not Found</h1>
        <p>The requested item could not be found.</p>
      </Layout>
    );
  }
  
  const { entry, content, rawMarkdown } = itemData;
  
  return (
    <Layout title={`${entry.name} | Items | The Pub`}>
      <EntryDetail 
        entry={entry} 
        content={content} 
        type="items" 
        rawMarkdown={rawMarkdown}
      />
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getContentPaths('items').map(path => ({
    params: { slug: path.replace(/\.md$/, '') },
  }));
  
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const itemData = await getContentBySlugWithHTML('items', params.slug);
  
  if (!itemData) {
    return {
      notFound: true,
    };
  }
  
  return {
    props: {
      itemData,
    },
  };
}