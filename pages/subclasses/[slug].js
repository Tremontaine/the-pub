import Layout from '../../components/Layout';
import EntryDetail from '../../components/EntryDetail';
import { getContentPaths, getContentBySlugWithHTML } from '../../lib/api';

export default function SubclassEntry({ subclassData }) {
  if (!subclassData) {
    return (
      <Layout title="Subclass Not Found | The Pub">
        <h1>Subclass Not Found</h1>
        <p>The requested subclass could not be found.</p>
      </Layout>
    );
  }
  
  const { entry, content, rawMarkdown } = subclassData;
  
  return (
    <Layout title={`${entry.name} | Subclasses | The Pub`}>
      <EntryDetail 
        entry={entry} 
        content={content} 
        type="subclasses" 
        rawMarkdown={rawMarkdown}
      />
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getContentPaths('subclasses').map(path => ({
    params: { slug: path.replace(/\.md$/, '') },
  }));
  
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const subclassData = await getContentBySlugWithHTML('subclasses', params.slug);
  
  if (!subclassData) {
    return {
      notFound: true,
    };
  }
  
  return {
    props: {
      subclassData,
    },
  };
}