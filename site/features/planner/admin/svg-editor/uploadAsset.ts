import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client for client-side uploads
// These variables must be prefixed with NEXT_PUBLIC_ to be exposed to the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a generated file (like a GLB or SVG) directly to Supabase Storage.
 * Assumes a public bucket named "catalog-assets" exists.
 */
export async function uploadAssetToSupabase(fileBlob: Blob, filename: string): Promise<string | null> {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase credentials in .env.local");
    return null;
  }

  // We are defaulting to a bucket named "catalog-assets". 
  // You may need to create this bucket in your Supabase dashboard and set it to "Public".
  const bucketName = "catalog-assets";
  const path = `generated/${Date.now()}-${filename}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(path, fileBlob, {
      cacheControl: "3600",
      upsert: false, // Don't overwrite existing files
    });

  if (error) {
    console.error("Error uploading to Supabase:", error.message);
    return null;
  }

  // Retrieve the public URL for the uploaded asset
  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}
