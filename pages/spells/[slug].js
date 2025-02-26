import Layout from '../../components/Layout';
import EntryDetail from '../../components/EntryDetail';
import { getContentPaths, getContentBySlugWithHTML } from '../../lib/api';

export default function SpellEntry({ spellData }) {
  if (!spellData) {
    return (
      <Layout title="Spell Not Found | The Pub">
        <h1>Spell Not Found</h1>
        <p>The requested spell could not be found.</p>
      </Layout>
    );
  }
  
  const { entry, content, rawMarkdown } = spellData;
  
  return (
    <Layout title={`${entry.name} | Spells | The Pub`}>
      <EntryDetail 
        entry={entry} 
        content={content} 
        type="spells" 
        rawMarkdown={rawMarkdown}
      />
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getContentPaths('spells').map(path => ({
    params: { slug: path.replace(/\.md$/, '') },
  }));
  
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const spellData = await getContentBySlugWithHTML('spells', params.slug);
  
  if (!spellData) {
    return {
      notFound: true,
    };
  }
  
  return {
    props: {
      spellData,
    },
  };
}