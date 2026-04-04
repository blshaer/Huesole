import React, { useState, useEffect } from "react";
import axios from "@/shared/lib/axios";
import { toast } from "sonner";
import { Loader2, Save, FileText, Globe } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Textarea } from "@/shared/ui/textarea";

interface PageData {
  title: string;
  description: string;
  content: string;
}

const ManagePages: React.FC = () => {
  const [activeTab, setActiveTab] = useState("privacy");
  const [data, setData] = useState<PageData>({ title: "", description: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPageContent = async () => {
      setLoading(true);
      try {
        const response = await axios.get<{ data: PageData }>(`/admin/page-content/${activeTab}`);
        setData(response.data.data);
      } catch (err) {
        toast.error("Error", { description: "Failed to load page content." });
      } finally {
        setLoading(false);
      }
    };
    fetchPageContent();
  }, [activeTab]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`/admin/page-content/${activeTab}`, data);
      toast.success("Success", { description: "Page content updated successfully." });
    } catch (err) {
      toast.error("Error", { description: "Failed to update page content." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Globe className="size-8 text-primary" />
            Manage Pages
          </h1>
          <p className="text-white/60">Update static page content like Privacy Policy and Terms.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving || loading}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="privacy" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-white/5 border border-white/10 p-1 mb-4">
          <TabsTrigger value="privacy" className="data-[state=active]:bg-primary">Privacy Policy</TabsTrigger>
          <TabsTrigger value="terms" className="data-[state=active]:bg-primary">Terms of Use</TabsTrigger>
        </TabsList>

        <Card className="bg-white/5 border-white/10 border backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              Editing: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </CardTitle>
            <CardDescription className="text-white/40">
              Changes will be reflected immediately on the public {activeTab} page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="size-10 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Page Title</label>
                  <Input 
                    value={data.title} 
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Short Description</label>
                  <Input 
                    value={data.description} 
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Content (HTML Supported)</label>
                  <Textarea 
                    value={data.content} 
                    onChange={(e) => setData({ ...data, content: e.target.value })}
                    className="min-h-[400px] bg-white/5 border-white/10 text-white font-mono text-sm leading-relaxed"
                    placeholder="<h2>Heading</h2><p>Paragraph content...</p>"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default ManagePages;
