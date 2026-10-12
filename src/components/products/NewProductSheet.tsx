import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Plus } from "lucide-react";
import { createProduct } from "@/services/productServices";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button, buttonVariants } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const NEW_CATEGORY = "__new__";

const newProductSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters"),
  category: z.string().trim().min(1, "Choose or enter a category"),
  price: z
    .number({ message: "Enter a price" })
    .positive("Price must be greater than 0"),
  isAvailable: z.boolean(),
});

type NewProductFormValues = z.infer<typeof newProductSchema>;

type NewProductSheetProps = {
  categories: string[];
};

export function NewProductSheet({ categories }: NewProductSheetProps) {
  const [open, setOpen] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<NewProductFormValues>({
    resolver: zodResolver(newProductSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: undefined,
      isAvailable: true,
    },
  });

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const resetAll = () => {
    form.reset();
    setIsNewCategory(false);
    setImageFile(null);
    setImageError(null);
    setImagePreview(null);
    mutation.reset();
  };

  const mutation = useMutation({
    mutationFn: (values: NewProductFormValues) => {
      if (!imageFile) throw new Error("Choose a product image");
      return createProduct(
        {
          name: values.name,
          description: values.description,
          category: values.category,
          price: values.price,
          is_available: values.isAvailable,
        },
        imageFile,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      resetAll();
      setOpen(false);
    },
  });

  const handleImageChange = (file: File | undefined) => {
    setImageError(null);
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Use a JPG, PNG or WebP image");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("The image must be 5 MB or smaller");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Show the image error together with the other field errors
  const onInvalid = () => {
    if (!imageFile) setImageError("Choose a product image");
  };

  const onSubmit = (values: NewProductFormValues) => {
    if (!imageFile) {
      setImageError("Choose a product image");
      return;
    }
    mutation.mutate(values);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetAll();
      }}
    >
      <SheetTrigger className={buttonVariants({ size: "sm" })}>
        <Plus />
        New product
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>New product</SheetTitle>
          <SheetDescription>
            The product will be visible in the store as soon as it's saved.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="px-4 pb-6"
          noValidate
        >
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-name">Name</FieldLabel>
                  <Input
                    id="product-name"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-description">
                    Description
                  </FieldLabel>
                  <textarea
                    id="product-description"
                    rows={4}
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="category"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-category">Category</FieldLabel>
                  {isNewCategory ? (
                    <div className="flex gap-2">
                      <Input
                        id="product-category"
                        placeholder="New category name"
                        autoFocus
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsNewCategory(false);
                          field.onChange("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        if (value === NEW_CATEGORY) {
                          setIsNewCategory(true);
                          field.onChange("");
                        } else if (value) {
                          field.onChange(value);
                        }
                      }}
                    >
                      <SelectTrigger
                        id="product-category"
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                        <SelectItem value={NEW_CATEGORY}>
                          + New category
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="price"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-price">Price (€)</FieldLabel>
                  <Input
                    id="product-price"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    value={field.value ?? ""}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value === ""
                          ? undefined
                          : event.target.valueAsNumber,
                      )
                    }
                    onBlur={field.onBlur}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field data-invalid={!!imageError}>
              <FieldLabel htmlFor="product-image">Image</FieldLabel>
              <label
                htmlFor="product-image"
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed p-3 text-sm text-muted-foreground transition-colors hover:bg-muted/50"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-16 w-16 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-muted">
                    <ImagePlus className="h-6 w-6" />
                  </span>
                )}
                <span>
                  {imageFile ? imageFile.name : "Choose an image"}
                  <span className="block text-xs">
                    JPG, PNG or WebP, up to 5 MB
                  </span>
                </span>
              </label>
              <input
                id="product-image"
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                className="sr-only"
                onChange={(event) => handleImageChange(event.target.files?.[0])}
              />
              {imageError && (
                <p className="text-sm text-destructive">{imageError}</p>
              )}
            </Field>

            <Controller
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <Field orientation="horizontal">
                  <Switch
                    id="product-available"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FieldLabel htmlFor="product-available">
                    Available for sale
                  </FieldLabel>
                </Field>
              )}
            />

            {mutation.isError && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {mutation.error.message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Saving..." : "Create product"}
            </Button>
          </FieldGroup>
        </form>
      </SheetContent>
    </Sheet>
  );
}
