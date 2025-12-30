import { useState, useEffect } from 'react';
import type { WritingData, WritingCategory, WritingItem } from '@/data/types';
import { dataClient } from '@/data';
import { Button, Input, Toggle, Badge } from '@/components/ui-kit';
import { 
  Plus, Trash2, GripVertical, ChevronDown, ChevronUp, 
  Eye, ExternalLink, Star, StarOff 
} from 'lucide-react';

export function AdminWriting() {
  const [writingData, setWritingData] = useState<WritingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<WritingCategory | null>(null);
  const [editingItem, setEditingItem] = useState<{ item: WritingItem; categoryId: string } | null>(null);
  const [newCategory, setNewCategory] = useState(false);
  const [newItem, setNewItem] = useState<string | null>(null); // categoryId

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await dataClient.getWritingData();
    setWritingData(data);
    setIsLoading(false);
  };

  const handleSaveCategory = async (category: Partial<WritingCategory> & { id?: string }) => {
    if (category.id) {
      await dataClient.adminUpdateWritingCategory(category.id, {
        slug: category.slug,
        name: category.name,
        enabled: category.enabled,
        order: category.order ?? 0,
      });
    } else {
      await dataClient.adminCreateWritingCategory({
        slug: category.slug ?? '',
        name: category.name ?? '',
        enabled: category.enabled ?? true,
        order: writingData?.categories.length ?? 0,
      });
    }
    await loadData();
    setEditingCategory(null);
    setNewCategory(false);
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Delete this category and all its items?')) {
      await dataClient.adminDeleteWritingCategory(id);
      await loadData();
    }
  };

  const handleSaveItem = async (item: Partial<WritingItem> & { id?: string }, categoryId: string) => {
    if (item.id) {
      await dataClient.adminUpdateWritingItem(item.id, {
        categoryId,
        slug: item.slug,
        title: item.title,
        externalUrl: item.externalUrl,
        platform: item.platform,
        featured: item.featured,
        enabled: item.enabled,
        whyThisMatters: item.whyThisMatters,
        order: item.order ?? 0,
      });
    } else {
      const category = writingData?.categories.find(c => c.id === categoryId);
      await dataClient.adminCreateWritingItem(categoryId, {
        categoryId,
        slug: item.slug ?? '',
        title: item.title ?? '',
        externalUrl: item.externalUrl ?? '',
        platform: item.platform,
        featured: item.featured ?? false,
        enabled: item.enabled ?? true,
        whyThisMatters: item.whyThisMatters,
        order: category?.items.length ?? 0,
      });
    }
    await loadData();
    setEditingItem(null);
    setNewItem(null);
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Delete this item?')) {
      await dataClient.adminDeleteWritingItem(id);
      await loadData();
    }
  };

  const handleMoveCategory = async (categoryId: string, direction: 'up' | 'down') => {
    if (!writingData) return;
    const sorted = [...writingData.categories].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(c => c.id === categoryId);
    if (direction === 'up' && idx > 0) {
      await dataClient.adminUpdateWritingCategory(sorted[idx].id, { order: sorted[idx - 1].order });
      await dataClient.adminUpdateWritingCategory(sorted[idx - 1].id, { order: sorted[idx].order });
    } else if (direction === 'down' && idx < sorted.length - 1) {
      await dataClient.adminUpdateWritingCategory(sorted[idx].id, { order: sorted[idx + 1].order });
      await dataClient.adminUpdateWritingCategory(sorted[idx + 1].id, { order: sorted[idx].order });
    }
    await loadData();
  };

  const handlePreview = () => {
    window.open('/writing', '_blank');
  };

  if (isLoading) {
    return <p className="text-muted-foreground animate-pulse">Loading...</p>;
  }

  const sortedCategories = [...(writingData?.categories ?? [])].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Writing</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePreview}>
            <Eye size={14} className="mr-2" /> Preview
          </Button>
          <Button size="sm" onClick={() => setNewCategory(true)}>
            <Plus size={14} className="mr-2" /> Add Category
          </Button>
        </div>
      </div>

      {/* Page Settings */}
      <div className="p-4 border border-border rounded-lg">
        <h3 className="font-medium mb-3">Page Settings</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-sm text-muted-foreground">Page Title</label>
            <Input 
              defaultValue={writingData?.settings?.pageTitle ?? 'Selected Writing'} 
              placeholder="Page title"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Intro Line</label>
            <Input 
              defaultValue={writingData?.settings?.pageIntro ?? ''} 
              placeholder="Brief intro"
            />
          </div>
        </div>
      </div>

      {/* New Category Form */}
      {newCategory && (
        <CategoryForm 
          onSave={handleSaveCategory} 
          onCancel={() => setNewCategory(false)} 
        />
      )}

      {/* Categories */}
      {sortedCategories.map((category, idx) => (
        <div key={category.id} className="border border-border rounded-lg">
          {/* Category Header */}
          <div className="flex items-center gap-2 p-4 border-b border-border bg-muted/30">
            <GripVertical size={16} className="text-muted-foreground" />
            <div className="flex-1">
              {editingCategory?.id === category.id ? (
                <CategoryForm 
                  category={category}
                  onSave={handleSaveCategory} 
                  onCancel={() => setEditingCategory(null)} 
                />
              ) : (
                <div className="flex items-center gap-3">
                  <span className="font-medium">{category.name}</span>
                  <Badge variant={category.enabled ? 'default' : 'secondary'}>
                    {category.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {category.items.length} items
                  </span>
                </div>
              )}
            </div>
            {editingCategory?.id !== category.id && (
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleMoveCategory(category.id, 'up')}
                  disabled={idx === 0}
                >
                  <ChevronUp size={14} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleMoveCategory(category.id, 'down')}
                  disabled={idx === sortedCategories.length - 1}
                >
                  <ChevronDown size={14} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditingCategory(category)}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="p-4 space-y-2">
            {category.items
              .sort((a, b) => a.order - b.order)
              .map(item => (
                <div key={item.id}>
                  {editingItem?.item.id === item.id ? (
                    <ItemForm 
                      item={item}
                      onSave={(data) => handleSaveItem(data, category.id)} 
                      onCancel={() => setEditingItem(null)} 
                    />
                  ) : (
                    <div className="flex items-center gap-2 py-2 px-3 rounded hover:bg-muted/50">
                      <GripVertical size={14} className="text-muted-foreground" />
                      <div className="flex-1 flex items-center gap-2">
                        <span className={item.enabled ? '' : 'text-muted-foreground'}>{item.title}</span>
                        {item.featured && <Star size={12} className="text-yellow-500 fill-yellow-500" />}
                        {item.platform && (
                          <span className="text-xs text-muted-foreground">({item.platform})</span>
                        )}
                        {!item.enabled && <Badge variant="secondary">Disabled</Badge>}
                      </div>
                      <a 
                        href={item.externalUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink size={14} />
                      </a>
                      <Button variant="ghost" size="sm" onClick={() => setEditingItem({ item, categoryId: category.id })}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              ))}

            {newItem === category.id ? (
              <ItemForm 
                onSave={(data) => handleSaveItem(data, category.id)} 
                onCancel={() => setNewItem(null)} 
              />
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setNewItem(category.id)}>
                <Plus size={14} className="mr-2" /> Add Item
              </Button>
            )}
          </div>
        </div>
      ))}

      {sortedCategories.length === 0 && !newCategory && (
        <p className="text-muted-foreground text-center py-8">
          No categories yet. Add one to get started.
        </p>
      )}
    </div>
  );
}

function CategoryForm({ 
  category, 
  onSave, 
  onCancel 
}: { 
  category?: WritingCategory; 
  onSave: (data: Partial<WritingCategory> & { id?: string }) => void; 
  onCancel: () => void;
}) {
  const [name, setName] = useState(category?.name ?? '');
  const [slug, setSlug] = useState(category?.slug ?? '');
  const [enabled, setEnabled] = useState(category?.enabled ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: category?.id, name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), enabled, order: category?.order });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
      <Input 
        value={name} 
        onChange={e => setName(e.target.value)} 
        placeholder="Category name" 
        required 
      />
      <Input 
        value={slug} 
        onChange={e => setSlug(e.target.value)} 
        placeholder="slug" 
        className="w-32"
      />
      <Toggle checked={enabled} onChange={setEnabled} label={enabled ? 'Enabled' : 'Disabled'} />
      <Button type="submit" size="sm">Save</Button>
      <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
    </form>
  );
}

function ItemForm({ 
  item, 
  onSave, 
  onCancel 
}: { 
  item?: WritingItem; 
  onSave: (data: Partial<WritingItem> & { id?: string }) => void; 
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(item?.title ?? '');
  const [externalUrl, setExternalUrl] = useState(item?.externalUrl ?? '');
  const [platform, setPlatform] = useState(item?.platform ?? '');
  const [featured, setFeatured] = useState(item?.featured ?? false);
  const [enabled, setEnabled] = useState(item?.enabled ?? true);
  const [whyThisMatters, setWhyThisMatters] = useState(item?.whyThisMatters ?? '');
  const [showWhy, setShowWhy] = useState(!!item?.whyThisMatters);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = item?.slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    onSave({ 
      id: item?.id, 
      title, 
      slug,
      externalUrl, 
      platform: platform || undefined, 
      featured, 
      enabled, 
      whyThisMatters: whyThisMatters || undefined,
      order: item?.order 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-muted/50 rounded-lg space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="Title" 
          required 
        />
        <Input 
          value={externalUrl} 
          onChange={e => setExternalUrl(e.target.value)} 
          placeholder="External URL" 
          type="url"
          required 
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Input 
          value={platform} 
          onChange={e => setPlatform(e.target.value)} 
          placeholder="Platform (optional)" 
          className="w-40"
        />
        <button
          type="button"
          onClick={() => setFeatured(!featured)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          {featured ? <Star size={14} className="text-yellow-500 fill-yellow-500" /> : <StarOff size={14} />}
          Featured
        </button>
        <Toggle checked={enabled} onChange={setEnabled} label={enabled ? 'Enabled' : 'Disabled'} />
        <button
          type="button"
          onClick={() => setShowWhy(!showWhy)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          {showWhy ? 'Hide why this matters' : '+ Why this matters'}
        </button>
      </div>
      {showWhy && (
        <Input 
          value={whyThisMatters} 
          onChange={e => setWhyThisMatters(e.target.value)} 
          placeholder="Why this matters (one line)" 
        />
      )}
      <div className="flex gap-2">
        <Button type="submit" size="sm">Save</Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
