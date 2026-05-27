import { useEffect, useState } from "react";
import { getAllCategories } from "@/api/category-api";
import { ItemSchema, type ItemFormValues } from "@/schemas/item.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Category } from "@/type/category.type";
import type { Item } from "@/type/item.type";

type ItemFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: Item | null;
  onSubmit: (
    values: ItemFormValues,
    imageFile: File | null,
  ) => Promise<{ success: boolean; message?: string }>;
};

const defaultValues: ItemFormValues = {
  name: "",
  price: 0,
  category_id: 0,
  stock: 0,
};

export default function ItemFormSheet({
  open,
  onOpenChange,
  item,
  onSubmit,
}: ItemFormSheetProps) {
  const [values, setValues] = useState<ItemFormValues>(defaultValues);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  const isEdit = Boolean(item);

  useEffect(() => {
    if (open) {
      getAllCategories().then(setCategories);
      setValues(
        item
          ? {
              name: item.name,
              price: item.price,
              category_id: item.category_id,
              stock: item.stock,
            }
          : defaultValues,
      );
      setImageFile(null);
      setPreviewUrl(item?.image_url ?? null);
      setErrors({});
    }
  }, [open, item]);

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock" || name === "category_id"
          ? Number(value)
          : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = ItemSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    if (!isEdit && !imageFile) {
      setErrors({ image: ["Product image is required"] });
      return;
    }

    setSubmitting(true);
    const result = await onSubmit(parsed.data, imageFile);
    setSubmitting(false);

    if (!result.success) {
      setErrors({ form: [result.message ?? "Something went wrong"] });
      return;
    }

    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit product" : "Add product"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update product details. Upload a new image only if you want to replace it."
              : "Add a new product with image stored in your Supabase bucket."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 px-4 pb-8">
          <div className="space-y-2">
            <label htmlFor="item-name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="item-name"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Premium Dog Food 5kg"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name[0]}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="item-price" className="text-sm font-medium">
                Price ($)
              </label>
              <Input
                id="item-price"
                name="price"
                type="number"
                min="0"
                step="10"
                value={values.price || 0}
                onChange={handleChange}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="item-stock" className="text-sm font-medium">
                Stock
              </label>
              <Input
                id="item-stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={values.stock || 0}
                onChange={handleChange}
              />
              {errors.stock && (
                <p className="text-sm text-destructive">{errors.stock[0]}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="item-category" className="text-sm font-medium">
              Category
            </label>
            <select
              id="item-category"
              name="category_id"
              value={values.category_id || ""}
              onChange={handleChange}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-sm text-destructive">
                {errors.category_id[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="item-image" className="text-sm font-medium">
              Image {!isEdit && <span className="text-destructive">*</span>}
            </label>
            <Input
              id="item-image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
            {errors.image && (
              <p className="text-sm text-destructive">{errors.image[0]}</p>
            )}
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-2 h-32 w-32 rounded-lg border object-cover"
              />
            )}
          </div>

          {errors.form && (
            <p className="text-sm text-destructive">{errors.form[0]}</p>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting
                ? "Saving..."
                : isEdit
                  ? "Save changes"
                  : "Create product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
