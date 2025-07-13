import Image from 'next/image';

export default function TestPage() {
  const testUrl =
    'https://cms.geroserial.com/cdn-cgi/image/width=800,format=auto/uploads/Whats_App_Image_2025_05_16_at_12_59_47_2_8ef345d18e.jpeg';

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test CDN de Cloudflare</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Imagen optimizada (800px):</h2>
        <Image
          src={testUrl}
          alt="Test imagen CDN"
          width={800}
          height={600}
          className="rounded-lg shadow-lg"
        />
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">URL generada:</h2>
        <code className="bg-gray-100 p-2 rounded text-sm break-all">
          {testUrl}
        </code>
      </div>
    </div>
  );
}
