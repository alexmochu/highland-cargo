const { createClient } = require('@supabase/supabase-js');
const { OpenAI } = require('openai');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateProductEmbeddings() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, description');

  if (error) throw error;

  for (const product of products) {
    const text = `${product.name} ${product.description || ''}`.trim();
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text
    });
    const embedding = response.data[0].embedding;

    await supabase
      .from('products')
      .update({ embedding })
      .eq('id', product.id);
  }
}

async function generateCategoryEmbeddings() {
  const { data: categories, error } = await supabase
    .from('product_categories')
    .select('id, name, description');

  if (error) throw error;

  for (const category of categories) {
    const text = `${category.name} ${category.description || ''}`.trim();
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text
    });
    const embedding = response.data[0].embedding;

    await supabase
      .from('product_categories')
      .update({ embedding })
      .eq('id', category.id);
  }
}

async function main() {
  await generateProductEmbeddings();
  await generateCategoryEmbeddings();
  console.log('Embeddings generated successfully');
}

main().catch(console.error);