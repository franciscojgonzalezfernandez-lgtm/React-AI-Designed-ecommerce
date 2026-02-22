"use client";

/**
 * Product detail page component.
 *
 * Shows product images, basic info (title, price, stock), size selector,
 * quantity controls and an Add to cart button. Data is loaded via the
 * `useProduct` hook (see `src/hooks/useProduct.ts`) which performs the
 * API request. Keep this component purely presentational — business logic
 * (API calls, cart mutations) should live in hooks or stores.
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import { Link } from "react-router";
import { CustomPhotoGallery } from "@/shop/components/CustomPhotoGallery";
import { useProduct } from "@/hooks/useProduct";
import type { size } from "@/interfaces/Product";

export const ProductPage = () => {
  /**
   * Load product data.
   *
   * Note: `useProduct` encapsulates the API call and returns the product
   * resource (or undefined while loading / on error). Typical shape:
   * { id, title, price, description, images[], stock, sizes[] }
   * If you need loading/error states here, extend the hook to return them.
   */
  const { data } = useProduct();
  /* const [selectedColor, setSelectedColor] = useState(0); */
  const [selectedSize, setSelectedSize] = useState<size | null>(null);
  const [quantity, setQuantity] = useState(1);

  /**
   * Adjusts the selected quantity by `delta` while keeping it within safe
   * bounds. Prevents quantities below 1 or above 99.
   *
   * Edge cases: rapid clicks are clamped. If the product has limited
   * stock, the Add to cart button further prevents invalid quantities.
   */
  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };
  if (!data) return;

  return (
    <div className="min-h-screen bg-white">
      {/* Back button */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to products
        </Link>
      </div>

      {/* Product detail */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image gallery */}
          <div className="space-y-4">
            {data.title && data.images && (
              <CustomPhotoGallery
                productName={data.title}
                images={data.images}
                /*
                 * CustomPhotoGallery: simple gallery component that expects
                 * a product name and an array of image URLs/objects. Images
                 * are provided by the product API via `data.images`.
                 */
              />
            )}
          </div>

          {/* Product info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-balance mb-3">
                {data.title}
              </h1>
              <p className="text-3xl font-semibold">{data.price} CHF</p>
            </div>

            {/* Stock indicator */}
            <div>
              {data.stock === 0 ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  <span className="text-sm font-medium text-gray-600">
                    Out of stock
                  </span>
                </div>
              ) : data.stock && data.stock <= 5 ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-sm font-medium text-orange-700">
                    Only {data.stock} left
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-green-700">
                    {data.stock} in stock
                  </span>
                </div>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {data.description}
            </p>

            {/* Color selector TO DO*/}
            {/* <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Color</label>
                <span className="text-sm text-muted-foreground">
                  {productData.colors[selectedColor].name}
                </span>
              </div>
              <div className="flex gap-3">
                {productData.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(index)}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${
                      selectedColor === index
                        ? "border-black scale-110"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: color.value }}
                    aria-label={color.name}
                  >
                    {color.value === "#FFFFFF" && (
                      <span className="sr-only">White</span>
                    )}
                  </button>
                ))}
              </div>
            </div> */}

            {/* Size selector */}
            {data.sizes && (
              <div className="space-y-4">
                <label className="text-sm font-medium">Size</label>
                <div className="grid grid-cols-6 gap-2">
                  {data.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-sm font-medium border rounded-lg transition-colors ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "bg-white text-foreground border-gray-300 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity selector */}
            <div className="space-y-4">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 99}
                    className="p-3 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Add to cart button */}
            {data.stock && data.price && (
              <Button
                size="lg"
                className="w-full bg-black hover:bg-gray-800 text-white h-14 text-base disabled:bg-gray-300 disabled:cursor-not-allowed"
                /*
                 * Button disabled rules (preventing invalid add-to-cart):
                 * - no stock available
                 * - requested quantity exceeds available stock
                 * - no size selected (when product has sizes)
                 *
                 * The displayed label multiplies price by quantity.
                 */
                disabled={
                  data.stock === 0 || quantity > data.stock || !selectedSize
                }
              >
                {data.stock === 0
                  ? "Out of stock"
                  : `Add to cart — $${data.price * quantity}`}
              </Button>
            )}

            {/* Product details */}
            <div className="pt-8 border-t border-gray-200 space-y-4">
              <h3 className="font-medium">Product Details</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 100% premium cotton</li>
                <li>• Machine washable</li>
                <li>• Classic fit</li>
                <li>• Imported</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
