'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdsTextPage() {
  const [mode, setMode] = useState<'generate' | 'rephrase'>('generate');
  const [form, setForm] = useState({
    productName: '',
    description: '',
    targetAudience: '',
    campaignObjective: '',
    tone: '',
    platform: '',
    adFormat: '',
    callToAction: '',
    budget: '',
    additionalContext: '',
    text: '',
  });
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const endpoint = mode === 'generate' ? '/api/gemini/generate-ad-text' : '/api/gemini/rephrase-text';
      const body = mode === 'generate'
        ? {
            productName: form.productName,
            description: form.description,
            targetAudience: form.targetAudience,
            campaignObjective: form.campaignObjective,
            tone: form.tone,
            platform: form.platform,
            adFormat: form.adFormat,
            callToAction: form.callToAction,
            budget: form.budget ? Number(form.budget) : undefined,
            additionalContext: form.additionalContext,
          }
        : {
            text: form.text,
            targetAudience: form.targetAudience,
            tone: form.tone,
            platform: form.platform,
          };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setResult(data.error || 'Error occurred');
      }
    } catch (err) {
      setResult('Error occurred');
    }
    setLoading(false);
  };
  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">{mode === 'generate' ? 'Generate Ad Text' : 'Rephrase Ad Text'}</h1>
      <div className="mb-4 flex gap-2">
        <Button variant={mode === 'generate' ? 'default' : 'outline'} onClick={() => setMode('generate')}>Generate</Button>
        <Button variant={mode === 'rephrase' ? 'default' : 'outline'} onClick={() => setMode('rephrase')}>Rephrase</Button>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {mode === 'generate' ? (
          <>
            <Input name="productName" value={form.productName} onChange={handleChange} placeholder="Product Name" required maxLength={100} />
            <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" maxLength={500} />
            <Input name="targetAudience" value={form.targetAudience} onChange={handleChange} placeholder="Target Audience" />
            <Input name="campaignObjective" value={form.campaignObjective} onChange={handleChange} placeholder="Campaign Objective" />
            <Input name="tone" value={form.tone} onChange={handleChange} placeholder="Tone (e.g. professional, casual)" />
            <Input name="platform" value={form.platform} onChange={handleChange} placeholder="Platform (facebook, instagram, general)" />
            <Input name="adFormat" value={form.adFormat} onChange={handleChange} placeholder="Ad Format (single_image, video, carousel, collection)" />
            <Input name="callToAction" value={form.callToAction} onChange={handleChange} placeholder="Call to Action" />
            <Input name="budget" value={form.budget} onChange={handleChange} placeholder="Budget" type="number" min="1" />
            <Textarea name="additionalContext" value={form.additionalContext} onChange={handleChange} placeholder="Additional Context" maxLength={300} />
          </>
        ) : (
          <>
            <Textarea name="text" value={form.text} onChange={handleChange} placeholder="Text to rephrase" required maxLength={1000} />
            <Input name="targetAudience" value={form.targetAudience} onChange={handleChange} placeholder="Target Audience" />
            <Input name="tone" value={form.tone} onChange={handleChange} placeholder="Tone (e.g. professional, casual)" />
            <Input name="platform" value={form.platform} onChange={handleChange} placeholder="Platform (facebook, instagram, general)" />
          </>
        )}
        <Button type="submit" disabled={loading}>{loading ? 'Processing...' : 'Submit'}</Button>
      </form>
      {result && (
        <div className="mt-6 p-4 bg-gray-50 border rounded">
          <h2 className="font-semibold mb-2">Result</h2>
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}
    </div>
  );
}
