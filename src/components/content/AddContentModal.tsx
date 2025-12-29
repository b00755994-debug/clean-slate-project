import { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { ImagePlus, X, Loader2, ChevronDown, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ContentData {
  id?: string;
  title: string;
  content: string;
  image_url: string | null;
  category: string;
}

interface AddContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ContentData) => void;
  editingContent?: ContentData | null;
}

const categories = [
  { value: 'general', label: 'Général' },
  { value: 'announcement', label: 'Annonce' },
  { value: 'product', label: 'Produit' },
  { value: 'culture', label: 'Culture' },
  { value: 'event', label: 'Événement' },
  { value: 'stats', label: 'Chiffres' },
];

export function AddContentModal({ open, onOpenChange, onSubmit, editingContent }: AddContentModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['general']);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingContent) {
      setTitle(editingContent.title);
      setContent(editingContent.content);
      setImageUrl(editingContent.image_url);
      // Parse comma-separated categories or use single category
      const cats = editingContent.category ? editingContent.category.split(',').filter(Boolean) : ['general'];
      setSelectedCategories(cats.length > 0 ? cats : ['general']);
    } else {
      resetForm();
    }
  }, [editingContent, open]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setImageUrl(null);
    setSelectedCategories(['general']);
  };

  const toggleCategory = (value: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(value)) {
        // Don't allow removing the last category
        if (prev.length === 1) return prev;
        return prev.filter(c => c !== value);
      }
      return [...prev, value];
    });
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file.type.startsWith('image/')) {
      toast.error('Le fichier doit être une image');
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5 Mo');
      return null;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('vetted-content-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('vetted-content-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erreur lors de l\'upload de l\'image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadImage(file);
      if (url) setImageUrl(url);
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const url = await uploadImage(file);
      if (url) setImageUrl(url);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleRemoveImage = () => {
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit({
        id: editingContent?.id,
        title,
        content,
        image_url: imageUrl,
        category: selectedCategories.join(','), // Store as comma-separated
      });
      resetForm();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingContent ? 'Modifier le contenu' : 'Ajouter un contenu validé'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre du contenu"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Catégories</Label>
              <Popover open={categoryPopoverOpen} onOpenChange={setCategoryPopoverOpen}>
                <PopoverTrigger asChild>
                  <button 
                    type="button"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <span className="truncate">
                      {selectedCategories.length > 0 
                        ? selectedCategories.map(c => categories.find(cat => cat.value === c)?.label).join(', ')
                        : 'Sélectionner des catégories'}
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0 bg-popover" align="start">
                  <Command>
                    <CommandGroup>
                      {categories.map(cat => (
                        <CommandItem
                          key={cat.value}
                          onSelect={() => toggleCategory(cat.value)}
                          className="cursor-pointer"
                        >
                          <div className={cn(
                            "mr-2 h-4 w-4 rounded-sm border border-input flex items-center justify-center",
                            selectedCategories.includes(cat.value) && "bg-primary border-primary"
                          )}>
                            {selectedCategories.includes(cat.value) && (
                              <Check className="h-3 w-3 text-primary-foreground" />
                            )}
                          </div>
                          {cat.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenu (texte, chiffres, liens...)</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Texte à partager, chiffres clés, liens utiles..."
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Image (optionnel)</Label>
              {imageUrl ? (
                <div className="relative rounded-lg overflow-hidden border">
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="w-full h-32 object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${isDragging 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                    }
                  `}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Upload en cours...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <ImagePlus className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Glissez une image ou cliquez pour sélectionner
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        PNG, JPG, GIF jusqu'à 5 Mo
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading ? 'Enregistrement...' : editingContent ? 'Modifier' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
